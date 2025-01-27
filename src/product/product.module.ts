import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, Product } from '../schemas/product.schema';
import { User, UserSchema } from 'src/schemas/users.schema';
import { AuthValidate } from 'src/gaurds/validate-token';
import { CheckAdmin } from 'src/gaurds/check-Admin';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.modelName, schema: ProductSchema },
      { name: User.modelName, schema: UserSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    UsersService,
    JwtService,
    AuthValidate,
    CheckAdmin,
    {
      provide: 'role',
      useValue: 'Admin',
    },
  ],
  exports: ['role'],
})
export class ProductModule {}
