import { model, Schema } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface Ticket {
  _id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
}

// 2. Create a Schema corresponding to the document interface.
const ticketSchema = new Schema<Ticket>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    version: { type: Number, required: true },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const TicketModel = model<Ticket>('Ticket', ticketSchema);
