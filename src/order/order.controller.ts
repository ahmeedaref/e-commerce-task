import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDto } from './Dtos/create-order-dto';
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post()
  async createOrder(@Body(ValidationPipe) body: createOrderDto) {
    const order = this.orderService.createOrder(body);
    return order;
  }
}
