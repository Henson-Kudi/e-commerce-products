import {
  CreateBrandDTO,
  FindBrandFilter,
  FindBrandOptions,
  FindBrandQuery,
  UpdateBrandDTO,
} from '../../domain/dtos/brand';
import MessageBroker from '../../infrastructure/providers/messageBroker';
import BrandsRepository from '../../infrastructure/repositories/brandsRepository';
import CreateBrandUseCase from '../use-cases/brands/createBrand';
import DeleteBrands from '../use-cases/brands/deleteManyBrands';
import DeleteBrand from '../use-cases/brands/deleteBrand';
import FindBrands from '../use-cases/brands/findBrands';
import GetBrand from '../use-cases/brands/getBrand';
import UpdateBrand from '../use-cases/brands/updateBrand';

export class BrandsService {
  private readonly brandsRepository = new BrandsRepository();
  private readonly messageBroker = new MessageBroker();

  getBrands(params: FindBrandQuery) {
    return new FindBrands(this.brandsRepository).execute(params);
  }

  getBrand(params: { id: string } & FindBrandOptions) {
    return new GetBrand(this.brandsRepository).execute(params);
  }

  createBrand(params: CreateBrandDTO) {
    return new CreateBrandUseCase(
      {
        brandsRepo: this.brandsRepository,
      },
      {
        messageBroker: this.messageBroker,
      }
    ).execute(params);
  }

  updateBrand(params: { id: string } & UpdateBrandDTO) {
    return new UpdateBrand(
      { brandsRepo: this.brandsRepository },
      { messageBroker: this.messageBroker }
    ).execute(params);
  }

  deleteBrand(params: { id: string }) {
    return new DeleteBrand(this.brandsRepository, {
      messageBroker: this.messageBroker,
    }).execute(params);
  }

  deleteManyBrands(params: FindBrandFilter) {
    return new DeleteBrands(this.brandsRepository, {
      messageBroker: this.messageBroker,
    }).execute(params);
  }
}

export default new BrandsService();
