import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './../data/entities/category.entity';
import { Recipe } from './../data/entities/recipe.entity';
import { ShowCategoryDTO } from '../models/recipes/show-category.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAllCategories(): Promise<ShowCategoryDTO[]> {
    const foundCategories: Category[] = await this.categoryRepository.find();
    return foundCategories;
  }
}
