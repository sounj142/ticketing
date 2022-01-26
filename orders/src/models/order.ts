import { model, Schema } from 'mongoose';

export enum OrderStatus {
  Expired = 'expired',
  Paid = 'paid',
  Pending = 'pending',
  Canceled = 'canceled',
}

// 1. Create an interface representing a document in MongoDB.
export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticketId: string;
}

export interface Order extends OrderAttrs {
  createdDate: Date;
  updatedDate?: Date;
}

// 2. Create a Schema corresponding to the document interface.
const orderSchema = new Schema<Order>(
  {
    userId: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    ticketId: { type: String, required: true },
    createdDate: { type: Date, required: false },
    updatedDate: { type: Date, required: false },
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

orderSchema.pre('save', async function (next) {
  if (!this.createdDate) {
    this.createdDate = new Date(new Date().toUTCString());
  } else {
    this.updatedDate = new Date(new Date().toUTCString());
    this.increment();
  }
  next();
});

export const OrderModel = model<Order>('Order', orderSchema);

export function getExpiresAt(): Date {
  const now = new Date();
  now.setSeconds(now.getSeconds() + Number(process.env.ORDER_EXPIRE_SECONDS));
  return new Date(now.toUTCString());
}
