import mongoose from 'mongoose';
import { OrderStatus } from '@hoangorg/common';

// interface describes the properties that are required to create a new Ticket
interface TicketInterface {
  title: string;
  price: number;
  userId: string;
}

// interface describes the properties that a Ticket document actual has
export interface TicketDoc extends mongoose.Document, TicketInterface {}

// interface describes the properties that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticket: TicketInterface & { _id: string }): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    price: { type: Number, require: true },
    userId: { type: String, require: true },
    orderId: String,
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

ticketSchema.statics.build = (ticket: TicketInterface & { _id: string }) =>
  new Ticket(ticket);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;

export function findByEvent(event: { id: string; version: number }) {
  return Ticket.findOne({
    _id: event.id,
    __v: event.version - 1,
  });
}
