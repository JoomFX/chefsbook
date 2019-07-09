import { IMeasure } from '../../common/interfaces/measure';
import { INutrition } from '../../common/interfaces/nutrition';
import { IFoodGroup } from './../../common/interfaces/foodgroup';

export class ShowProductDTO {
  code: number;
  description: string;
  foodGroup: IFoodGroup;
  measures: IMeasure[];
  nutrition: INutrition;
}
