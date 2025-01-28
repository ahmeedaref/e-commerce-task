import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from 'src/schemas/order.schemas';
import { User, UserSchema } from 'src/schemas/users.schema';
import { ProductSchema, Product } from '../schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthValidate } from 'src/gaurds/validate-token';
import { CheckAdmin } from 'src/gaurds/check-Admin';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.modelName, schema: OrderSchema },
      { name: Product.modelName, schema: ProductSchema },
      { name: User.modelName, schema: UserSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    UsersService,
    JwtService,
    AuthValidate,
    CheckAdmin,
    { provide: 'role', useValue: 'Admin' },
  ],
  exports: ['role'],
})
export class OrderModule {}
