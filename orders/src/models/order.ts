import { getUtcNow, OrderStatus } from '@hoangrepo/common';
import { model, Schema } from 'mongoose';
import { Ticket } from './ticket';

// 1. Create an interface representing a document in MongoDB.
export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date; // cân nhắc chuyển expiresAt sang Expiration service! Cân nhắc chuyển thành createAt?
  ticketId: string;
  ticket: Ticket;
}

export interface Order extends OrderAttrs {
  createdDate: Date;
  updatedDate?: Date;
}

// 2. Create a Schema corresponding to the document interface.
const orderSchema = new Schema<Order>(
  {
    userId: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    expiresAt: { type: Schema.Types.Date, required: false },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    ticketId: { type: String, required: true },
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
  if (!this.createdDate) {
    this.createdDate = getUtcNow();
  } else {
    this.updatedDate = getUtcNow();
    this.increment();
  }
  next();
});

export const OrderModel = model<Order>('Order', orderSchema);

export function getExpiresAt(): Date {
  const now = getUtcNow();
  now.setSeconds(
    now.getSeconds() + Number(process.env.EXPIRATION_WINDOW_SECONDS)
  );
  return now;
}
