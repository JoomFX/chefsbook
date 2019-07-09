import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Product } from './../data/entities/product.entity';
import { FoodGroup } from './../data/entities/food-group.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Product, FoodGroup])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
