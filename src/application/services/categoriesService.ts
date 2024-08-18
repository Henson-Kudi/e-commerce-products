import {
  CreateCategoryDTO,
  FindCategoryFilter,
  FindCategoryOptions,
  FindCategoryQuery,
  UpdateCategoryDTO,
} from '../../domain/dtos/category';
import messageBroker from '../../infrastructure/providers/messageBroker';
import CategorysRepository from '../../infrastructure/repositories/categoriesRepository';
import CreateCategoryUseCase from '../use-cases/categories/createCategory';
import DeleteCategorys from '../use-cases/categories/deleteManyCategories';
import DeleteCategory from '../use-cases/categories/deleteCategory';
import FindCategorys from '../use-cases/categories/findCategories';
import GetCategory from '../use-cases/categories/getCategory';
import UpdateCategory from '../use-cases/categories/updateCategory';

export class CategorysService {
  private readonly categoriesRepository = new CategorysRepository();

  getCategories(params: FindCategoryQuery) {
    return new FindCategorys(this.categoriesRepository).execute(params);
  }

  getCategory(params: { id: string } & FindCategoryOptions) {
    return new GetCategory(this.categoriesRepository).execute(params);
  }

  createCategory(params: CreateCategoryDTO) {
    return new CreateCategoryUseCase(
      {
        categoriesRepo: this.categoriesRepository,
      },
      {
        messageBroker: messageBroker,
      }
    ).execute(params);
  }

  updateCategory(params: { id: string } & UpdateCategoryDTO) {
    return new UpdateCategory(
      { categoriesRepo: this.categoriesRepository },
      { messageBroker: messageBroker }
    ).execute(params);
  }

  deleteCategory(params: { id: string }) {
    return new DeleteCategory(this.categoriesRepository, {
      messageBroker: messageBroker,
    }).execute(params);
  }

  deleteManyCategories(params: FindCategoryFilter) {
    return new DeleteCategorys(this.categoriesRepository, {
      messageBroker: messageBroker,
    }).execute(params);
  }
}

export default new CategorysService();
