import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductQueryDto } from '../models/products/product-query.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: ProductQueryDto) {
    const route: string = `localhost:3000/api/products`;

    return this.productsService.getProducts(query, route);
  }
}
