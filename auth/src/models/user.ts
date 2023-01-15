import mongoose from 'mongoose';

// interface describes the properties that are required to create a new User
interface UserInterface {
  email: string;
  password: string;
}

// interface describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(user: UserInterface): UserDoc;
}

// interface describes the properties that a User document actual has
export interface UserDoc extends mongoose.Document, UserInterface {}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
},
{
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    },
  },
});
userSchema.statics.build = (user: UserInterface) => new User(user);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
