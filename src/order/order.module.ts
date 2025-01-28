import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from 'src/schemas/order.schemas';
import { User, UserSchema } from 'src/schemas/users.schema';
import { ProductSchema, Product } from '../schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.modelName, schema: OrderSchema },
      { name: Product.modelName, schema: ProductSchema },
      { name: User.modelName, schema: UserSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, UsersService],
})
export class OrderModule {}
