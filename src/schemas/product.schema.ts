import { Document, Schema, Types, model } from 'mongoose';
import { UserDocument } from './users.schema';
export interface ProductDocument extends Document {
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  createdBy: UserDocument;
}
export const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, Unique: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
export const Product = model<ProductDocument>('Product', ProductSchema);
