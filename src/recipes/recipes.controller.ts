import { Controller, UseGuards, Get, Post, Body, ValidationPipe, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipesService } from './recipes.service';
import { ShowCategoryDTO } from '../models/recipes/show-category.dto';
import { CreateRecipeDTO } from '../models/recipes/create-recipe.dto';
import { ShowRecipeDTO } from '../models/recipes/show-recipe.dto';

@UseGuards(AuthGuard())
@Controller('api/recipes')
export class RecipesController {
  constructor(
    private readonly recipeService: RecipesService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) recipe: CreateRecipeDTO,
    @Req() request,
    ): Promise<ShowRecipeDTO> {
    return await this.recipeService.create(recipe, request.user);
  }

  @Get('categories')
  async findAllCategories(): Promise<ShowCategoryDTO[]> {
    return await this.recipeService.findAllCategories();
  }
}
