import { Controller, UseGuards, Get, Post, Body, ValidationPipe, Req, Query, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipesService } from './recipes.service';
import { ShowCategoryDTO } from '../models/recipes/show-category.dto';
import { CreateRecipeDTO } from '../models/recipes/create-recipe.dto';
import { RecipesDTO } from '../models/recipes/recipes.dto';
import { ShowRecipeDTO } from '../models/recipes/show-recipe.dto';

@UseGuards(AuthGuard())
@Controller('api/recipes')
export class RecipesController {
  constructor(
    private readonly recipeService: RecipesService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page,
    @Query('search') search,
    @Query('category') category,
  ): Promise<RecipesDTO> {
    return await this.recipeService.findAll(page, search, category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ShowRecipeDTO> {
    return await this.recipeService.findOne(id);
  }

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
