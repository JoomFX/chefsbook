import { Controller, UseGuards, Get, Post, Body, ValidationPipe, Req, Query, Param, Delete, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipesService } from './recipes.service';
import { ShowCategoryDTO } from '../models/recipes/show-category.dto';
import { CreateUpdateRecipeDTO } from '../models/recipes/create-update-recipe.dto';
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
    @Query('filtered') filtered,
  ): Promise<RecipesDTO> {
    return await this.recipeService.findAll(page, search, category, filtered);
  }

  @Get('categories')
  async findAllCategories(): Promise<ShowCategoryDTO[]> {
    return await this.recipeService.findAllCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ShowRecipeDTO> {
    return await this.recipeService.findOne(id);
  }

  @Post()
  async create(
    @Body() recipe: CreateUpdateRecipeDTO,
    @Req() request,
    ): Promise<ShowRecipeDTO> {
    return await this.recipeService.create(recipe, request.user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() recipe: CreateUpdateRecipeDTO,
    @Req() request,
    ): Promise<ShowRecipeDTO> {
    return await this.recipeService.update(id, recipe, request.user);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() request,
    ): Promise<ShowRecipeDTO> {
    return await this.recipeService.delete(id, request.user);
  }
}
