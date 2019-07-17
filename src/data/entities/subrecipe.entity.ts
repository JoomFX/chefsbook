import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Recipe } from './recipe.entity';

/**
 * Subrecipe entity
 */
@Entity('subrecipes')
export class Subrecipe {
  /**
   * Id of the subrecipe
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Recipe
   */
  @ManyToOne(type => Recipe, recipe => recipe.derivedRecipes)
  linkedRecipe: Promise<Recipe>;
  /**
   * Quantity of the subrecipe
   */
  @Column({ default: 0 })
  quantity: number;
  /**
   * Is the subrecipe deleted
   */
  @Column({ default: false })
  isDeleted: boolean;
  /**
   * Recipes using the subrecipe
   */
  @ManyToOne(type => Recipe, recipe => recipe.subrecipes)
  recipe: Promise<Recipe>;
}
