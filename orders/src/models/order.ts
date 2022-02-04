import { OrderStatus } from '@hoangrepo/common';
import { model, Schema } from 'mongoose';
import { Ticket } from './ticket';

export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  ticketId: string;
  ticket: Ticket;
  expiresAt: Date;
}

export interface Order extends OrderAttrs {
  createdDate: Date;
  updatedDate?: Date;
}

const orderSchema = new Schema<Order>(
  {
    userId: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    ticketId: { type: String, required: true },
    expiresAt: { type: Schema.Types.Date, required: true },
    createdDate: { type: Schema.Types.Date, required: false },
    updatedDate: { type: Schema.Types.Date, required: false },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.version = ret.__v;
        delete ret._id;
        delete ret.__v;
        delete ret.createdDate;
        delete ret.updatedDate;
      },
    },
  }
);

orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdDate = new Date();
  } else {
    this.updatedDate = new Date();
    this.increment();
  }
  next();
});

export const OrderModel = model<Order>('Order', orderSchema);

export function getExpiresDate(): Date {
  const now = new Date();
  now.setSeconds(
    now.getSeconds() + Number(process.env.EXPIRATION_WINDOW_SECONDS)
  );
  return now;
}
