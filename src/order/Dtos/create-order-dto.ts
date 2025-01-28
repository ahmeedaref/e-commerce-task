import {
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';
class productOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;
  @IsNumber()
  price: Number;
}
export class createOrderDto {
  @IsMongoId()
  userId: string;
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => productOrderDto)
  products: productOrderDto[];
  @IsString()
  status?: string;
}
