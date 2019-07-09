import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './../data/entities/category.entity';
import { Recipe } from './../data/entities/recipe.entity';
import { ShowCategoryDTO } from '../models/recipes/show-category.dto';
import { User } from 'src/data/entities/user.entity';
import { CreateRecipeDTO } from 'src/models/recipes/create-recipe.dto';
import { ShowRecipeDTO } from 'src/models/recipes/show-recipe.dto';
import { Ingredient } from './../data/entities/ingredient.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(recipe: CreateRecipeDTO, user: User): Promise<ShowRecipeDTO> {

    const newRecipe: Recipe = this.recipeRepository.create(recipe);
    newRecipe.author = Promise.resolve(user);

    newRecipe.ingredients = await Promise.all(recipe.products.map(async (item: any) => {
      const newIngredient: Ingredient = this.ingredientRepository.create();

      newIngredient.product = item.product;
      newIngredient.quantity = item.amount;
      newIngredient.unit = item.measure;

      const savedIngredient = await this.ingredientRepository.save(newIngredient);

      return savedIngredient;
    }));

    const savedRecipe = await this.recipeRepository.save(newRecipe);

    console.log(savedRecipe);
    console.log(this.convertToShowRecipeDTO(savedRecipe));

    return this.convertToShowRecipeDTO(savedRecipe);
  }

  async findAllCategories(): Promise<ShowCategoryDTO[]> {
    const foundCategories: Category[] = await this.categoryRepository.find();
    return foundCategories;
  }

  private async convertToShowRecipeDTO(recipe: Recipe): Promise<ShowRecipeDTO> {
    const covertedRecipe: ShowRecipeDTO = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      products: recipe.ingredients,
      subrecipes: recipe.subrecipes,
      nutrition: recipe.nutrition,
      user: (await recipe.author).username,
      userID: (await recipe.author).id,
      created: recipe.created,
    };

    return covertedRecipe;
  }
}
