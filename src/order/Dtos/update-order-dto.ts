import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from 'src/schemas/order.schemas';
export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
