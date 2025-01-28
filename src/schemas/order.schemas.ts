import { Schema, Document, model, Types } from 'mongoose';
import { UserDocument } from './users.schema';
import { ProductDocument } from './product.schema';

export interface OrderDocument extends Document {
  userId: UserDocument;
  products: {
    product: ProductDocument['_id'];
    quantity: number;
    price: number;
  }[];
  status: String;
  totalprice: number;
  createdAt: Date;
  UpdateAt: Date;
}
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
const ProductSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number },
  },
  { _id: false }, // prevents generating a _id for subdocuments
);
export const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [ProductSchema], required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    totalprice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
OrderSchema.pre('save', async function (next) {
  const order = this as OrderDocument;

  
  await order.populate('products.product');


  order.totalprice = order.products.reduce((sum, item: any) => {
    const productPrice = item.product.price; 
    return sum + productPrice * item.quantity;
  }, 0);

  next();
});

export const Order = model<OrderDocument>('Order', OrderSchema);
