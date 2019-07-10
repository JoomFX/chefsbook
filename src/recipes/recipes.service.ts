import { INutrient } from './../common/interfaces/nutrient';
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
import { Nutrition } from './../data/entities/nutrition.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Nutrition) private readonly nutritionRepository: Repository<Nutrition>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(recipe: CreateRecipeDTO, user: User): Promise<ShowRecipeDTO> {

    const newRecipe: Recipe = await this.recipeRepository.create(recipe);
    newRecipe.author = Promise.resolve(user);

    const ingredientNutrition: Nutrition[] = [];

    // Calculate Ingredient Nutrition
    recipe.products.map(async (item: any) => {
      const quantity = item.amount;
      const measure = item.measure;
      const gramsPerMeasure = item.product.measures.find((unit: any) => unit.measure === measure).gramsPerMeasure;

      const itemQuantityInGrams = quantity * gramsPerMeasure;
      const coefficient = itemQuantityInGrams / 100;

      let nutrition: Nutrition = await this.nutritionRepository.create();
      nutrition = item.product.nutrition;

      for (const key in nutrition) {
        if (nutrition.hasOwnProperty(key)) {
          nutrition[key].value = Number((nutrition[key].value * coefficient).toFixed(2));
        }
      }

      ingredientNutrition.push(nutrition);
    });

    // Calculate Total Nutrition for the Recipe
    await ingredientNutrition;

    let totalPROCNT = 0;
    let totalFAT = 0;
    let totalCHOCDF = 0;
    let totalENERC_KCAL = 0;
    let totalSUGAR = 0;
    let totalFIBTG = 0;
    let totalCA = 0;
    let totalFE = 0;
    let totalP = 0;
    let totalK = 0;
    let totalNA = 0;
    let totalVITA_IU = 0;
    let totalTOCPHA = 0;
    let totalVITD = 0;
    let totalVITC = 0;
    let totalVITB12 = 0;
    let totalFOLAC = 0;
    let totalCHOLE = 0;
    let totalFATRN = 0;
    let totalFASAT = 0;
    let totalFAMS = 0;
    let totalFAPU = 0;

    ingredientNutrition.map((item: Nutrition) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (key === 'PROCNT') {
            totalPROCNT += item[key].value;
          }
          if (key === 'FAT') {
            totalFAT += item[key].value;
          }
          if (key === 'CHOCDF') {
            totalCHOCDF += item[key].value;
          }
          if (key === 'ENERC_KCAL') {
            totalENERC_KCAL += item[key].value;
          }
          if (key === 'SUGAR') {
            totalSUGAR += item[key].value;
          }
          if (key === 'FIBTG') {
            totalFIBTG += item[key].value;
          }
          if (key === 'CA') {
            totalCA += item[key].value;
          }
          if (key === 'FE') {
            totalFE += item[key].value;
          }
          if (key === 'P') {
            totalP += item[key].value;
          }
          if (key === 'K') {
            totalK += item[key].value;
          }
          if (key === 'NA') {
            totalNA += item[key].value;
          }
          if (key === 'VITA_IU') {
            totalVITA_IU += item[key].value;
          }
          if (key === 'TOCPHA') {
            totalTOCPHA += item[key].value;
          }
          if (key === 'VITD') {
            totalVITD += item[key].value;
          }
          if (key === 'VITC') {
            totalVITC += item[key].value;
          }
          if (key === 'VITB12') {
            totalVITB12 += item[key].value;
          }
          if (key === 'FOLAC') {
            totalFOLAC += item[key].value;
          }
          if (key === 'CHOLE') {
            totalCHOLE += item[key].value;
          }
          if (key === 'FATRN') {
            totalFATRN += item[key].value;
          }
          if (key === 'FASAT') {
            totalFASAT += item[key].value;
          }
          if (key === 'FAMS') {
            totalFAMS += item[key].value;
          }
          if (key === 'FAPU') {
            totalFAPU += item[key].value;
          }
        }
      }
    });

    const totalRecipeNutrition: Nutrition = await this.nutritionRepository.create();
    totalRecipeNutrition.PROCNT = { description: 'Protein', unit: 'g', value: totalPROCNT }
    totalRecipeNutrition.FAT = { description: 'Total lipid (fat)', unit: 'g', value: totalFAT };
    totalRecipeNutrition.CHOCDF = { description: 'Carbohydrate, by difference', unit: 'g', value: totalCHOCDF };
    totalRecipeNutrition.ENERC_KCAL = { description: 'Energy', unit: 'kcal', value: totalENERC_KCAL };
    totalRecipeNutrition.SUGAR = { description: 'Sugars, total', unit: 'g', value: totalSUGAR };
    totalRecipeNutrition.FIBTG = { description: 'Fiber, total dietary', unit: 'g', value: totalFIBTG };
    totalRecipeNutrition.CA = { description: 'Calcium, Ca', unit: 'mg', value: totalCA };
    totalRecipeNutrition.FE = { description: 'Iron, Fe', unit: 'mg', value: totalFE };
    totalRecipeNutrition.P = { description: 'Phosphorus, P', unit: 'mg', value: totalP };
    totalRecipeNutrition.K = { description: 'Potassium, K', unit: 'mg', value: totalK };
    totalRecipeNutrition.NA = { description: 'Sodium, Na', unit: 'mg', value: totalNA };
    totalRecipeNutrition.VITA_IU = { description: 'Vitamin A, IU', unit: 'IU', value: totalVITA_IU };
    totalRecipeNutrition.TOCPHA = { description: 'Vitamin E (alpha-tocopherol)', unit: 'mg', value: totalTOCPHA };
    totalRecipeNutrition.VITD = { description: 'Vitamin D', unit: 'IU', value: totalVITD };
    totalRecipeNutrition.VITC = { description: 'Vitamin C, total ascorbic acid', unit: 'mg', value: totalVITC };
    totalRecipeNutrition.VITB12 = { description: 'Vitamin B-12', unit: 'µg', value: totalVITB12 };
    totalRecipeNutrition.FOLAC = { description: 'Folic acid', unit: 'µg', value: totalFOLAC };
    totalRecipeNutrition.CHOLE = { description: 'Cholesterol', unit: 'mg', value: totalCHOLE };
    totalRecipeNutrition.FATRN = { description: 'Fatty acids, total trans', unit: 'g', value: totalFATRN };
    totalRecipeNutrition.FASAT = { description: 'Fatty acids, total saturated', unit: 'g', value: totalFASAT };
    totalRecipeNutrition.FAMS = { description: 'Fatty acids, total monounsaturated', unit: 'g', value: totalFAMS };
    totalRecipeNutrition.FAPU = { description: 'Fatty acids, total polyunsaturated', unit: 'g', value: totalFAPU };

    newRecipe.ingredients = await Promise.all(recipe.products.map(async (item: any) => {
      const newIngredient: Ingredient = this.ingredientRepository.create();

      newIngredient.product = item.product;
      newIngredient.quantity = item.amount;
      newIngredient.unit = item.measure;

      const savedIngredient = await this.ingredientRepository.save(newIngredient);

      return savedIngredient;
    }));

    newRecipe.nutrition = totalRecipeNutrition;

    const savedRecipe = await this.recipeRepository.save(newRecipe);

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
