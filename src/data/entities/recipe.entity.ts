import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';

import { User } from './user.entity';
import { Nutrition } from './nutrition.entity';
import { Subrecipe } from './subrecipe.entity';
import { Ingredient } from './ingredient.entity';
import { Category } from './category.entity';

/**
 * Recipe entity
 */
@Entity('recipes')
export class Recipe {
  /**
   * Id of the recipe
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Title
   */
  @Column('nvarchar')
  title: string;
  /**
   * Notes
   */
  @Column('longtext', {default: ''})
  description: string;
  /**
   * Created on
   */
  @CreateDateColumn()
  created: Date;
  /**
   * Is the recipe deleted
   */
  @Column({ default: false })
  isDeleted: boolean;
  /**
   * Author of the recipe
   */
  @ManyToOne(type => User, user => user.recipes)
  author: Promise<User>;
  /**
   * Category of the recipe
   */
  @ManyToOne(type => Category, category => category.recipes, { eager: true })
  category: Category;
  /**
   * Ingredients in the recipe
   */
  @OneToMany(type => Ingredient, ingredient => ingredient.recipe, { eager: true })
  ingredients: Ingredient[];
  /**
   * Subrecipes in the recipe
   */
  @OneToMany(type => Subrecipe, subrecipe => subrecipe.recipe, { eager: true })
  subrecipes: Subrecipe[];
  /**
   * Does the recipe have subrecipes
   */
  @Column({ default: false })
  hasSubrecipes: boolean;
  /**
   * Nutrient data for the recipe
   */
  @OneToOne(type => Nutrition, nutrition => nutrition.recipe, { eager: true, onDelete: 'CASCADE', cascade: true  })
  @JoinColumn()
  nutrition: Nutrition;
}
