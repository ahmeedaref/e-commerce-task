import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    UsersModule,
    OrderModule,
    MongooseModule.forRoot(
      'mongodb+srv://ahmedaref127:ahmeed1902@backenddb.1rq3a.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
