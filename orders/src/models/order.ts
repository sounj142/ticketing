import mongoose, { Schema } from 'mongoose';
import { OrderStatus } from '@hoangorg/common';
import { TicketDoc } from './ticket';

// interface describes the properties that are required to create a new Order
interface OrderInterface {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticketId: string;
  ticket: TicketDoc;
}

// interface describes the properties that a Order document actual has
export interface OrderDoc extends mongoose.Document, OrderInterface {}

// interface describes the properties that a Order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(order: OrderInterface): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    expiresAt: { type: Schema.Types.Date, required: false },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    ticketId: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.version = ret.__v;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    //this.createdDate = new Date();
  } else {
    //this.updatedDate = new Date();
    this.increment();
  }
  next();
});

orderSchema.statics.build = (order: OrderInterface) => new Order(order);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export default Order;

// Find an order where the ticket is this ticket above and the order status is not cancelled
// if we found an order, that means the tickets is reserved
export async function isReservedTicket(ticketId: string) {
  const order = await Order.findOne({
    ticketId: ticketId,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created,
      ],
    },
  });
  return !!order;
}

export function getExpiresDate(): Date {
  const now = new Date();
  now.setSeconds(
    now.getSeconds() + Number(process.env.EXPIRATION_WINDOW_SECONDS)
  );
  return now;
}
