import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { ProductsDTO } from '../models/products/products.dto';
import { ShowFoodGroupDTO } from './../models/products/show-food-group.dto';

@UseGuards(AuthGuard())
@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page,
    @Query('search') search,
    @Query('foodGroup') foodGroup,
  ): Promise<ProductsDTO> {
    return await this.productsService.findAll(page, search, foodGroup);
  }

  @Get('foodgroups')
  async findAllFG(): Promise<ShowFoodGroupDTO[]> {
    return await this.productsService.findAllFG();
  }
}
