import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  chatId: number;
  name: string;
}

const userSchema: Schema = new Schema({
  chatId: { type: Number, required: true },
  name: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);
