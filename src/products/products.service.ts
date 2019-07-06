import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './../data/entities/product.entity';
import { IMeasure } from '../common/interfaces/measure';
import { INutrition } from '../common/interfaces/nutrition';
import { ShowProductDTO } from '../models/products/show-product.dto';
import { ProductsDTO } from './../models/products/products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, search: string, foodGroup: string): Promise<ProductsDTO> {
    const productsPerPage = 10;
    let foundProducts: Product[];
    let count: number;

    if (!foodGroup) {
      foundProducts = await this.productRepository.find({
        where: [{
          code: Like(`%${search}%`),
        }, {
          description: Like(`%${search}%`),
        }],
        take: productsPerPage,
        skip: productsPerPage * (page - 1),
      });

      count = await this.productRepository.count({
        where: [{
          code: Like(`%${search}%`),
        }, {
          description: Like(`%${search}%`),
        }],
      });

    } else if (foodGroup) {
      foundProducts = await this.productRepository.find({
        where: [{
          code: Like(`%${search}%`),
          foodGroup,
        }, {
          description: Like(`%${search}%`),
          foodGroup,
        }],
        take: productsPerPage,
        skip: productsPerPage * (page - 1),
      });

      count = await this.productRepository.count({
        where: [{
          code: Like(`%${search}%`),
          foodGroup,
        }, {
          description: Like(`%${search}%`),
          foodGroup,
        }],
      });
    }

    const products = foundProducts.map((product: Product) => this.convertToShowProductDTO(product));

    const returnDTO: ProductsDTO = {
      products,
      count,
    };

    return returnDTO;
  }

  private convertToShowProductDTO(product: Product): ShowProductDTO {

    const measures: IMeasure[] = product.measures.map((msr) => {
      const measureToReturn: IMeasure = {
        measure: msr.measure,
        gramsPerMeasure: msr.gramsPerMeasure,
      };

      return measureToReturn;
    });

    const nutrition: INutrition = {
      PROCNT: product.nutrition.PROCNT,
      FAT: product.nutrition.FAT,
      CHOCDF: product.nutrition.CHOCDF,
      ENERC_KCAL: product.nutrition.ENERC_KCAL,
      SUGAR: product.nutrition.SUGAR,
      FIBTG: product.nutrition.FIBTG,
      CA: product.nutrition.CA,
      FE: product.nutrition.FE,
      P: product.nutrition.P,
      K: product.nutrition.K,
      NA: product.nutrition.NA,
      VITA_IU: product.nutrition.VITA_IU,
      TOCPHA: product.nutrition.TOCPHA,
      VITD: product.nutrition.VITD,
      VITC: product.nutrition.VITC,
      VITB12: product.nutrition.VITB12,
      FOLAC: product.nutrition.FOLAC,
      CHOLE: product.nutrition.CHOLE,
      FATRN: product.nutrition.FATRN,
      FASAT: product.nutrition.FASAT,
      FAMS: product.nutrition.FAMS,
      FAPU: product.nutrition.FAPU,
    };

    const covertedProduct: ShowProductDTO = {
      code: product.code,
      description: product.description,
      foodGroup: product.foodGroup,
      measures,
      nutrition,
    };

    return covertedProduct;
  }
}
