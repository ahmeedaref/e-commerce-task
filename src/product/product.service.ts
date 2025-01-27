import { Injectable, BadRequestException } from '@nestjs/common';
import { productDto } from './dtos/create-product-dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from 'src/schemas/product.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/users.schema';
import { UpdateproductDto } from './dtos/update-product-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productmodule: Model<ProductDocument>,
    @InjectModel('User') private usermodel: Model<UserDocument>,
  ) {}

  async create(data: productDto) {
    const user = await this.usermodel.findById(data.createdBy);
    if (!user) {
      throw new BadRequestException('User not found ');
    }
    const { name } = data;
    const product = await this.productmodule.findOne({ name });
    if (product) {
      throw new BadRequestException('product name is already exsits');
    }
    const prod = new this.productmodule(data);
    await prod.save();
    return this.productmodule.findById(prod._id).populate('createdBy').exec();
  }
  async find_products(): Promise<ProductDocument[]> {
    const product = await this.productmodule.find();
    return this.productmodule.find().populate('createdBy').exec();
  }
  async findOne_product(id: string) {
    const product = await this.productmodule.findById(id);
    if (!product) {
      throw new BadRequestException('product not found');
    }
    return this.productmodule.findById(id).populate('createdBy').exec();
  }
  async deleteProduct(id: string) {
    const product = await this.productmodule.findByIdAndDelete(id);
    if (!product) {
      throw new BadRequestException('product not found');
    }
    return { message: 'deleted product ' };
  }
  async update_product(id: string, data: Partial<UpdateproductDto>) {
    const product = await this.productmodule.findByIdAndUpdate(
      { _id: id },
      data,
      { next: true },
    );
    if (!product) {
      throw new BadRequestException('product not found');
    }

    return (await this.productmodule.findById(id)).populate('createdBy');
  }
}
