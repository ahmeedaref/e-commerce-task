import { Document, Schema, model } from 'mongoose';
export interface UserDocument extends Document {
  email: string;
  password: string;
  role: string;
}

export const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'User'], default: 'User' },
});

export const User = model<UserDocument>('User', UserSchema);
