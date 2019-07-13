import { Category } from './../../data/entities/category.entity';
import { Ingredient } from '../../data/entities/ingredient.entity';
import { Subrecipe } from '../../data/entities/subrecipe.entity';
import { INutrition } from '../../common/interfaces/nutrition';

export class ShowRecipeDTO {
  id: string;
  title: string;
  description: string;
  category: Category;
  products: Ingredient[];
  subrecipes: Subrecipe[];
  nutrition: INutrition;
  user: string;
  userID: string;
  created: Date;
}
