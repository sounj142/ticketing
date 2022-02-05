import { model, Schema } from 'mongoose';

export interface PaymentAttrs {
  userId: string;
  orderId: string;
  stripeId: string;
  price: number;
}

export interface Payment extends PaymentAttrs {
  createdDate: Date;
}

const paymentSchema = new Schema<Payment>(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    stripeId: { type: String, required: true },
    price: { type: Number, required: true },
    createdDate: { type: Schema.Types.Date, required: false },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.version = ret.__v;
        delete ret._id;
        delete ret.__v;
        delete ret.createdDate;
      },
    },
  }
);

paymentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdDate = new Date();
  }
  next();
});

export const PaymentModel = model<Payment>('Payment', paymentSchema);
