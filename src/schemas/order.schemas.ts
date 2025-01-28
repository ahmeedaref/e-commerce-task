import { Schema, Document, model, Types } from 'mongoose';
import { UserDocument } from './users.schema';
import { ProductDocument } from './product.schema';

export interface OrderDocument extends Document {
  userId: UserDocument;
  products: { product: ProductDocument; quantity: number }[];
  status: string;
  totalprice: number;
  createdAt: Date;
  UpdateAt: Date;
}

export const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['PENDING,', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    totalprice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);
OrderSchema.pre<OrderDocument>('save', async function (next) {
  const ProductModel = model<ProductDocument>('Product');

  const products = await Promise.all(
    this.products.map(async (item) => {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        throw new Error(`Product Not found`);
      }
      return {
        price: product.price,
        quantity: item.quantity,
      };
    }),
  );

  this.totalprice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  next();
});
export const Order = model<OrderDocument>('Order', OrderSchema);
