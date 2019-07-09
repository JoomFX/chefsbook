import { Nutrition } from './../../data/entities/nutrition.entity';
import { Recipe } from './../../data/entities/recipe.entity';
import { Ingredient } from './../../data/entities/ingredient.entity';
import { Category } from './../../data/entities/category.entity';
import { IsString, Length } from 'class-validator';

export class CreateRecipeDTO {
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(3, 1000)
  description: string;

  category: Category;
  products: Ingredient[];
  recipes: Recipe[];
  nutrition: Nutrition;
}
