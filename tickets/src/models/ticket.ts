import mongoose from 'mongoose';

// interface describes the properties that are required to create a new Ticket
interface TicketInterface {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
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
    orderId: String,
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
ticketSchema.pre('save', async function (next) {
  if (this.isNew) {
    //this.createdDate = new Date();
  } else {
    //this.updatedDate = new Date();
    this.increment();
  }
  next();
});

ticketSchema.statics.build = (ticket: TicketInterface) => new Ticket(ticket);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;
