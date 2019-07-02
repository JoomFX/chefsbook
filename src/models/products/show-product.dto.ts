import { IMeasure } from '../../common/interfaces/measure';
import { INutrition } from '../../common/interfaces/nutrition';

export class ShowProductDTO {
  code: number;
  description: string;
  foodGroup: string;
  measures: IMeasure[];
  nutrition: INutrition;
}
