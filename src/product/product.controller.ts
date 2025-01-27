import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { productDto } from './dtos/create-product-dto';
import { UpdateproductDto } from './dtos/update-product-dto';
import { ProductService } from './product.service';
import { CheckAdmin } from 'src/gaurds/check-Admin';
import { AuthValidate } from 'src/gaurds/validate-token';
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @UseGuards( CheckAdmin)
  @Post()
  async createProduct(@Body() body: productDto) {
    const product = this.productService.create(body);
    return product;
  }
  @UseGuards(AuthValidate)
  @Get()
  async findAllProducts() {
    return this.productService.find_products();
  }
  @UseGuards(AuthValidate)
  @Get('/:id')
  async findOne_product(@Param('id') id: string) {
    const product = this.productService.findOne_product(id);
    return product;
  }
  @UseGuards(CheckAdmin)
  @Delete('/:id')
  async delete_product(@Param('id') id: string) {
    const product = this.productService.deleteProduct(id);
    return product;
  }
  @UseGuards(CheckAdmin)
  @Patch('/:id')
  async update_product(
    @Param('id') id: string,
    @Body() body: Partial<UpdateproductDto>,
  ) {
    const product = this.productService.update_product(id, body);
    return product;
  }
}
