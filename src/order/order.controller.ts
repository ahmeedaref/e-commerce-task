import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDto } from './Dtos/create-order-dto';
import { OrderStatus } from 'src/schemas/order.schemas';
import { UpdateOrderDto } from './Dtos/update-order-dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post()
  async createOrder(@Body(ValidationPipe) body: createOrderDto) {
    const order = this.orderService.createOrder(body);
    return order;
  }
  @Get()
  async findAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: OrderStatus,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ) {
    return this.orderService.findAllOrders({ page, limit, status, sort });
  }
  @Get('/:id')
  async findOneOrder(@Param('id') id: string) {
    const order = this.orderService.findOne_order(id);
    return order;
  }
  @Put('/:id')
  async UpdateOder(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    const order = await this.orderService.updateOrder(id, body);
    return order;
  }
  @Delete('/:id')
  async DeleteOrder(@Param('id') id: string) {
    const order = this.orderService.deleteOrder(id);
    return order;
  }
}
