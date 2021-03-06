import { OrderStatus } from '@hoangrepo/common';
import { model, Schema } from 'mongoose';
import { OrderModel } from './order';

// 1. Create an interface representing a document in MongoDB.
export interface Ticket {
  _id: string;
  title: string;
  price: number;
  userId: string;
}

// 2. Create a Schema corresponding to the document interface.
const ticketSchema = new Schema<Ticket>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
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

export const TicketModel = model<Ticket>('Ticket', ticketSchema);

// Find an order where the ticket is this ticket above and the order status is not cancelled
// if we found an order, that means the tickets is reserved
export async function isReservedTicket(ticketId: string) {
  const order = await OrderModel.findOne({
    ticketId,
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

export function findByEvent(event: { id: string; version: number }) {
  return TicketModel.findOne({
    _id: event.id,
    __v: event.version - 1,
  });
}
