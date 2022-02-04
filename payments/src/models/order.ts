import { OrderStatus } from '@hoangrepo/common';
import { model, Schema } from 'mongoose';

export interface Order {
  _id: string;
  userId: string;
  status: OrderStatus;
  price: number;
}

const orderSchema = new Schema<Order>(
  {
    userId: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    price: { type: Number, required: true },
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

export const OrderModel = model<Order>('Order', orderSchema);

export function findByEvent(event: { id: string; version: number }) {
  return OrderModel.findOne({
    _id: event.id,
    __v: event.version - 1,
  });
}
