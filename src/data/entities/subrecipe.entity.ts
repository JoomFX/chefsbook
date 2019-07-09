import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Recipe } from './recipe.entity';

/**
 * Subrecipe entity
 */
@Entity('subrecipe')
export class Subrecipe {
  /**
   * Id of the subrecipe
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
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
