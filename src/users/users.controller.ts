import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from './Dtos-create/create-dtos';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('register')
  async register(@Body() body: CreateDto) {
    const user = await this.userService.register(body);
    return user;
  }
}
