import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import {
  DatabaseConnectionError,
  validateRequest,
  authentication,
  NotFoundError,
  BadRequestError,
  OrderStatus,
  PaymentError,
} from '@hoangrepo/common';
import { OrderModel } from '../models/order';
import { PaymentAttrs, PaymentModel } from '../models/payment';
import { Stripe } from 'stripe';
import { natsInfo } from '../nats-info';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = express.Router();

router.post(
  '/api/payments',
  authentication,
  [
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
    body('token').not().isEmpty().withMessage('Token is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token }: { orderId: string; token: string } = req.body;
    const currentUser = req.currentUser!;

    // find order the user is trying to pay for
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order does not exist');
    }

    // make sure the order belongs to this current user
    if (order.userId !== currentUser.id) {
      throw new BadRequestError('Order does not belong to current user');
    }

    // make sure the order status is valid to pay
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled');
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError(
        "Order has been charged, you can't charge an order twice"
      );
    }

    // do payment with Stripe API
    let charge: Stripe.Response<Stripe.Charge>;
    try {
      charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
        description: `Payment for order ${order.id}`,
      });
    } catch (err) {
      console.warn(err);
      throw new PaymentError();
    }

    // create 'payment' record to record sucessful payment
    const payment = new PaymentModel<PaymentAttrs>({
      userId: currentUser.id,
      orderId: order.id,
      stripeId: charge.id,
      price: order.price,
    });
    try {
      await payment.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    // publish event
    await new PaymentCreatedPublisher(natsInfo.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export default router;
