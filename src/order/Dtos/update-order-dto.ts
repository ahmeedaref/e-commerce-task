import { IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';

import { OrderStatus } from 'src/schemas/order.schemas';

class productOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;
  @IsNumber()
  price: Number;
}
export class UpdateOrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
export class UpdateOrder {
  @IsMongoId()
  userId: string;
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => productOrderDto)
  products: productOrderDto[];
  @IsString()
  status?: string;
}
