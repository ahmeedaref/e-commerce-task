import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/users.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.modelName, schema: UserSchema }]),
    ConfigModule.forRoot({}),
  ],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
