import { Injectable, BadRequestException } from '@nestjs/common';
import { UserDocument } from 'src/schemas/users.schema';
import { CreateDto } from './Dtos-create/create-dtos';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async login(data: CreateDto) {
    const { email } = data;
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Email Not Found');
    }
    const passwordCompare = await bcrypt.compare(data.password, user.password);
    if (!passwordCompare) {
      throw new BadRequestException('wrong password');
    }
    const paylod = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accesstoken = this.jwtService.sign(paylod, {
      secret: this.configService.get<string>('ACCESSTOKEN'),
      expiresIn: this.configService.get<string>('EXPIRESIN'),
    });
    return { message: 'Logged Successfully', accesstoken };
  }
}
