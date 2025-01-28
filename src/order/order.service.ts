import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createOrderDto } from './Dtos/create-order-dto';
import { OrderDocument } from 'src/schemas/order.schemas';
import { ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly OrderModel: Model<OrderDocument>,
    @InjectModel('Product')
    private readonly ProductModel: Model<ProductDocument>,
  ) {}

  async createOrder(data: createOrderDto) {
    const { userId, products, status } = data;

    const productDetails = await this.getProductDetails(products);

    const totalPrice = this.calculateTotalPrice(productDetails);

    const order = new this.OrderModel({
      userId,
      products: productDetails.map(({ product, quantity }) => ({
        product,
        quantity,
      })),
      status,
      totalPrice,
    });
    console.log('order:', order.totalprice);

    return await order.save();
  }
  private async getProductDetails(
    products: { productId: string; quantity: number }[],
  ) {
    return Promise.all(
      products.map(async ({ productId, quantity }) => {
        const product = await this.ProductModel.findById(productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        return {
          product: product._id,
          quantity,
          price: product.price,
        };
      }),
    );
  }

  private calculateTotalPrice(
    productDetails: { price: number; quantity: number }[],
  ) {
    return productDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }
}
