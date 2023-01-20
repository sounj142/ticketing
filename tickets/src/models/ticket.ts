import mongoose from 'mongoose';

// interface describes the properties that are required to create a new Ticket
interface TicketInterface {
  title: string;
  price: number;
  userId: string;
}

// interface describes the properties that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticket: TicketInterface): TicketDoc;
}

// interface describes the properties that a Ticket document actual has
export interface TicketDoc extends mongoose.Document, TicketInterface {}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
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
ticketSchema.statics.build = (ticket: TicketInterface) => new Ticket(ticket);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;
