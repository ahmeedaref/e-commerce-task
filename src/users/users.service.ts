import { Injectable, BadRequestException } from '@nestjs/common';
import { UserDocument } from 'src/schemas/users.schema';
import { CreateDto } from './Dtos-create/create-dtos';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
  ) {}

  async register(dataDto: CreateDto) {
    try {
      const { email } = dataDto;
      const user = await this.UserModel.findOne({ email });
      if (user) {
        throw new BadRequestException('Email is exists');
      }
      const passwordHash = await bcrypt.hash(dataDto.password, 10);
      dataDto.password = passwordHash;
      const User = new this.UserModel(dataDto);
      return await User.save();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
