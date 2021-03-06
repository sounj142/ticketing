import { model, Schema } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

export interface Ticket extends TicketAttrs {
  createdDate: Date;
  updatedDate?: Date;
}

// 2. Create a Schema corresponding to the document interface.
const ticketSchema = new Schema<Ticket>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    userId: { type: String, required: true },
    orderId: { type: String, required: false },
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

ticketSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdDate = new Date();
  } else {
    this.updatedDate = new Date();
    this.increment();
  }
  next();
});

export const TicketModel = model<Ticket>('Ticket', ticketSchema);
