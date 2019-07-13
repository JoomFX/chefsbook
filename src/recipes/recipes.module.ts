import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Category } from './../data/entities/category.entity';
import { Recipe } from './../data/entities/recipe.entity';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Ingredient } from './../data/entities/ingredient.entity';
import { Nutrition } from './../data/entities/nutrition.entity';
import { Subrecipe } from '../data/entities/subrecipe.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Recipe, Category, Ingredient, Subrecipe, Nutrition])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
