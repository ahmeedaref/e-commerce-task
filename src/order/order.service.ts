import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createOrderDto } from './Dtos/create-order-dto';
import { OrderDocument, OrderStatus } from 'src/schemas/order.schemas';
import { ProductDocument } from 'src/schemas/product.schema';
import { UpdateOrderStatusDto } from './Dtos/update-order-dto';
import { UpdateOrder } from './Dtos/update-order-dto';

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

  async findAllOrders({
    page,
    limit,
    status,
    sort,
  }: {
    page: number;
    limit: number;
    status?: OrderStatus;
    sort: 'asc' | 'desc';
  }): Promise<OrderDocument[]> {
    const query = this.OrderModel.find();
    if (status) {
      query.where('status').equals(status);
    }

    const orders = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .populate('products.product')
      .exec();
    return orders;
  }

  async findOne_order(id: string): Promise<OrderDocument> {
    const order = await this.OrderModel.findById(id)
      .populate('products.product')
      .exec();
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return order;
  }
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusDto,
  ): Promise<OrderDocument> {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (data.status) {
      if (
        order.status === OrderStatus.DELIVERED &&
        data.status !== order.status
      ) {
        throw new BadRequestException(
          'Cannot move from DELIVERED to another status',
        );
      }

      order.status = data.status;

      return order.save();
    }
  }
  async UpdateOrder(id: string, data: UpdateOrder) {
    const { userId, products, status } = data;
    const productDetails = await this.getProductDetails(products);
    const totalprice = this.calculateTotalPrice(productDetails);
    const order = await this.OrderModel.findByIdAndUpdate(id, {
      userId,
      products: productDetails.map(({ product, quantity }) => ({
        product,
        quantity,
      })),
      status,
      totalprice,
    })
      .populate('products.product')
      .exec();
    if (!order) {
      throw new NotFoundException('Order Not found');
    }
    return order.save();
  }

  async deleteOrder(id: string) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'it can not Delete an order that Delivered or Cancelled',
      );
    }
    await this.OrderModel.findByIdAndDelete(id);
    return 'deleted Order';
  }
}
