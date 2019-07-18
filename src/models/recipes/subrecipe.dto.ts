import { Recipe } from '../../data/entities/recipe.entity';
import { ShowRecipeDTO } from './show-recipe.dto';

export class SubrecipeDTO {
  recipe: ShowRecipeDTO;
  quantity: number;
}
