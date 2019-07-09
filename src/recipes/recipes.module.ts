import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Category } from './../data/entities/category.entity';
import { Recipe } from './../data/entities/recipe.entity';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';


@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Recipe, Category])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
