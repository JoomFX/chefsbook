import { Nutrition } from '../../data/entities/nutrition.entity';
import { Ingredient } from '../../data/entities/ingredient.entity';
import { Category } from '../../data/entities/category.entity';
import { IsString, Length } from 'class-validator';
import { Subrecipe } from '../../data/entities/subrecipe.entity';

export class CreateUpdateRecipeDTO {
  @IsString()
  id?: string;

  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(3, 1000)
  description: string;

  category: Category;
  products: Ingredient[];
  recipes: Subrecipe[];
  nutrition: Nutrition;
}
