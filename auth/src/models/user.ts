import { getUtcNow } from '@hoangrepo/common';
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
    createdDate: { type: Schema.Types.Date, required: false },
    updatedDate: { type: Schema.Types.Date, required: false },
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
    this.createdDate = getUtcNow();
  } else {
    this.updatedDate = getUtcNow();
  }
  next();
});

export const UserModel = model<User>('User', userSchema);
