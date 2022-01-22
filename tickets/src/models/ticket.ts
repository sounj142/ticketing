import { model, Schema } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface Ticket extends TicketAttrs {
  createdDate: Date;
  updatedDate?: Date;
}

// 2. Create a Schema corresponding to the document interface.
const ticketSchema = new Schema<Ticket>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    createdDate: { type: Date, required: false },
    updatedDate: { type: Date, required: false },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdDate;
      },
    },
  }
);

ticketSchema.pre('save', async function (next) {
  if (!this.createdDate) {
    this.createdDate = new Date(new Date().toUTCString());
  } else {
    this.updatedDate = new Date(new Date().toUTCString());
  }
  next();
});

export const TicketModel = model<Ticket>('Ticket', ticketSchema);