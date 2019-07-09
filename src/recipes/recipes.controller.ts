import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipesService } from './recipes.service';
import { ShowCategoryDTO } from '../models/recipes/show-category.dto';

@UseGuards(AuthGuard())
@Controller('api/recipes')
export class RecipesController {
  constructor(
    private readonly recipeService: RecipesService,
  ) {}

  @Get('categories')
  async findAllCategories(): Promise<ShowCategoryDTO[]> {
    return await this.recipeService.findAllCategories();
  }
}
