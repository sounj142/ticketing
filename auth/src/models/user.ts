import { model, Schema } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.

export interface UserAttrs {
  email: string;
  passwordHash: string;
}

export interface User extends UserAttrs {
  createdDate: Date;
  updatedDate?: Date;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>(
  {
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdDate: { type: Date, required: false },
    updatedDate: { type: Date, required: false },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdDate;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.createdDate) {
    this.createdDate = new Date(new Date().toUTCString());
  } else {
    this.updatedDate = new Date(new Date().toUTCString());
  }
  next();
});

export const UserModel = model<User>('User', userSchema);
