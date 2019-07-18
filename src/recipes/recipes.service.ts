import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './../data/entities/category.entity';
import { Recipe } from './../data/entities/recipe.entity';
import { ShowCategoryDTO } from '../models/recipes/show-category.dto';
import { User } from '../data/entities/user.entity';
import { CreateUpdateRecipeDTO } from 'src/models/recipes/create-update-recipe.dto';
import { ShowRecipeDTO } from '../models/recipes/show-recipe.dto';
import { Ingredient } from './../data/entities/ingredient.entity';
import { Nutrition } from './../data/entities/nutrition.entity';
import { RecipesDTO } from '../models/recipes/recipes.dto';
import { INutrition } from '../common/interfaces/nutrition';
import { Subrecipe } from './../data/entities/subrecipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Subrecipe) private readonly subrecipeRepository: Repository<Subrecipe>,
    @InjectRepository(Nutrition) private readonly nutritionRepository: Repository<Nutrition>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(page: number = 1, search: string, category: string, filtered: string): Promise<RecipesDTO> {
    const recipesPerPage = 10;
    let foundRecipes: Recipe[];
    let count: number;

    if (!category && !filtered) {
      foundRecipes = await this.recipeRepository.find({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
        }],
        order: {
          created: 'DESC',
        },
        take: recipesPerPage,
        skip: recipesPerPage * (page - 1),
      });

      count = await this.recipeRepository.count({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
        }],
      });

    } else if (category && !filtered) {
      foundRecipes = await this.recipeRepository.find({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
          category,
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
          category,
        }],
        order: {
          created: 'DESC',
        },
        take: recipesPerPage,
        skip: recipesPerPage * (page - 1),
      });

      count = await this.recipeRepository.count({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
          category,
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
          category,
        }],
      });
    } else if (!category && filtered) {
      foundRecipes = await this.recipeRepository.find({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
          hasSubrecipes: false,
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
          hasSubrecipes: false,
        }],
        order: {
          created: 'DESC',
        },
        take: recipesPerPage,
        skip: recipesPerPage * (page - 1),
      });

      count = await this.recipeRepository.count({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
          hasSubrecipes: false,
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
          hasSubrecipes: false,
        }],
      });

    } else if (category && filtered) {
      foundRecipes = await this.recipeRepository.find({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
          category,
          hasSubrecipes: false,
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
          category,
          hasSubrecipes: false,
        }],
        order: {
          created: 'DESC',
        },
        take: recipesPerPage,
        skip: recipesPerPage * (page - 1),
      });

      count = await this.recipeRepository.count({
        where: [{
          isDeleted: false,
          title: Like(`%${search}%`),
          category,
          hasSubrecipes: false,
        }, {
          isDeleted: false,
          description: Like(`%${search}%`),
          category,
          hasSubrecipes: false,
        }],
      });
    }

    const recipes = await Promise.all(foundRecipes.map((recipe: Recipe) => this.convertToShowRecipeDTO(recipe)));

    const returnDTO: RecipesDTO = {
      recipes,
      count,
    };

    return returnDTO;
  }

  async findOne(id: string): Promise<ShowRecipeDTO> {
    const foundRecipe = await this.recipeRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!foundRecipe) {
      throw new BadRequestException('Recipe with this ID does not exist.');
    }

    const convertedRecipe = await this.convertToShowRecipeDTO(foundRecipe);

    return convertedRecipe;
  }

  async create(recipe: CreateUpdateRecipeDTO, user: User): Promise<ShowRecipeDTO> {
    const newRecipe: Recipe = await this.recipeRepository.create(recipe);
    newRecipe.author = Promise.resolve(user);
    newRecipe.hasSubrecipes = recipe.recipes.length > 0 ? true : false;

    // Holds the nutrition of both Ingredients and Subrecipes
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

    // Calculate Subrecipe Nutrition
    recipe.recipes.map(async (item: any) => {
      const quantity = item.amount;

      let nutrition: Nutrition = await this.nutritionRepository.create();
      nutrition = item.recipe.nutrition;

      for (const key in nutrition) {
        if (nutrition.hasOwnProperty(key)) {
          nutrition[key].value = Number((nutrition[key].value * quantity).toFixed(2));
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

    newRecipe.ingredients = await this.prepareRecipeIngredients(recipe);
    newRecipe.subrecipes = await this.prepareRecipeSubrecipes(recipe);

    newRecipe.nutrition = totalRecipeNutrition;

    const savedRecipe = await this.recipeRepository.save(newRecipe);

    return this.convertToShowRecipeDTO(savedRecipe);
  }

  async findAllCategories(): Promise<ShowCategoryDTO[]> {
    const foundCategories: Category[] = await this.categoryRepository.find();
    return foundCategories;
  }

  async update(id: string, recipe: CreateUpdateRecipeDTO, user: User): Promise<ShowRecipeDTO> {
    const recipeToUpdate = await this.recipeRepository.findOne({
      where: {
        id,
      },
    });

    if (!recipeToUpdate) {
      throw new BadRequestException('Recipe with this ID does not exist.');
    }

    const recipeAuthor = await recipeToUpdate.author;

    if (recipeAuthor.id === user.id) {
      recipeToUpdate.title = recipe.title;
      recipeToUpdate.description = recipe.description;
      recipeToUpdate.hasSubrecipes = recipe.recipes.length > 0 ? true : false;
      recipeToUpdate.category = recipe.category;

      recipeToUpdate.ingredients = await this.prepareRecipeIngredients(recipe);
      recipeToUpdate.subrecipes = await this.prepareRecipeSubrecipes(recipe);

      recipeToUpdate.nutrition = recipe.nutrition;
    } else {
      throw new BadRequestException('Only the recipe owner can update it.');
    }

    const updatedRecipe = await this.recipeRepository.save(recipeToUpdate);

    return this.convertToShowRecipeDTO(updatedRecipe);
  }

  async delete(id: string, user: User): Promise<ShowRecipeDTO> {
    const recipeToDelete = await this.recipeRepository.findOne({
      where: {
        id,
      },
    });

    if (!recipeToDelete) {
      throw new BadRequestException('Recipe with this ID does not exist.');
    }

    const recipeAuthor = await recipeToDelete.author;

    if (recipeAuthor.id === user.id) {
      recipeToDelete.isDeleted = true;
    } else {
      throw new BadRequestException('Only the post owner can delete it.');
    }

    const deletedRecipe = await this.recipeRepository.save(recipeToDelete);

    return this.convertToShowRecipeDTO(deletedRecipe);
  }

  private async convertToShowRecipeDTO(recipe: Recipe): Promise<ShowRecipeDTO> {

    const subrecipes = await Promise.all(recipe.subrecipes.map(async (subrecipe) => {
      const item = await this.subrecipeRepository.find({
        relations: ['linkedRecipe'],
        where: {
          isDeleted: false,
          id: subrecipe.id,
        },
      });

      const recipeReal: Recipe = await item[0].linkedRecipe;
      const quantity = item[0].quantity;

      const newRecipe = await this.convertToShowRecipeDTO(recipeReal);

      const subrecipeToReturn = {
        recipe: newRecipe,
        quantity,
      };

      return subrecipeToReturn;
    }));

    const nutrition: INutrition = {
      PROCNT: recipe.nutrition.PROCNT,
      FAT: recipe.nutrition.FAT,
      CHOCDF: recipe.nutrition.CHOCDF,
      ENERC_KCAL: recipe.nutrition.ENERC_KCAL,
      SUGAR: recipe.nutrition.SUGAR,
      FIBTG: recipe.nutrition.FIBTG,
      CA: recipe.nutrition.CA,
      FE: recipe.nutrition.FE,
      P: recipe.nutrition.P,
      K: recipe.nutrition.K,
      NA: recipe.nutrition.NA,
      VITA_IU: recipe.nutrition.VITA_IU,
      TOCPHA: recipe.nutrition.TOCPHA,
      VITD: recipe.nutrition.VITD,
      VITC: recipe.nutrition.VITC,
      VITB12: recipe.nutrition.VITB12,
      FOLAC: recipe.nutrition.FOLAC,
      CHOLE: recipe.nutrition.CHOLE,
      FATRN: recipe.nutrition.FATRN,
      FASAT: recipe.nutrition.FASAT,
      FAMS: recipe.nutrition.FAMS,
      FAPU: recipe.nutrition.FAPU,
    };

    const covertedRecipe: ShowRecipeDTO = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      products: recipe.ingredients,
      subrecipes,
      nutrition,
      user: (await recipe.author).username,
      userID: (await recipe.author).id,
      created: recipe.created,
    };

    return covertedRecipe;
  }

  private async prepareRecipeIngredients(recipe: CreateUpdateRecipeDTO): Promise<Ingredient[]> {
    const ingredients = await Promise.all(recipe.products.map(async (item: any) => {
      const newIngredient: Ingredient = this.ingredientRepository.create();

      newIngredient.product = item.product;
      newIngredient.quantity = item.amount;
      newIngredient.unit = item.measure;

      const savedIngredient = await this.ingredientRepository.save(newIngredient);

      return savedIngredient;
    }));

    return ingredients;
  }

  private async prepareRecipeSubrecipes(recipe: CreateUpdateRecipeDTO): Promise<Subrecipe[]> {
    const subrecipes = await Promise.all(recipe.recipes.map(async (item: any) => {
      const newSubrecipe: Subrecipe = this.subrecipeRepository.create();

      newSubrecipe.linkedRecipe = item.recipe;
      newSubrecipe.quantity = item.amount;

      const savedSubrecipe = await this.subrecipeRepository.save(newSubrecipe);

      return savedSubrecipe;
    }));

    return subrecipes;
  }

}
