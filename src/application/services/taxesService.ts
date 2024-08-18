import {
  CreateTaxDTO,
  FindTaxFilter,
  FindTaxOptions,
  FindTaxQuery,
  UpdateTaxDTO,
} from '../../domain/dtos/tax';
import messageBroker from '../../infrastructure/providers/messageBroker';
import TaxesRepository from '../../infrastructure/repositories/taxesRepository';
import CreateTaxUseCase from '../use-cases/taxes/createTax';
import DeleteTaxes from '../use-cases/taxes/deleteManyTaxes';
import DeleteTax from '../use-cases/taxes/deleteTax';
import FindTaxes from '../use-cases/taxes/findTaxes';
import GetTax from '../use-cases/taxes/getTax';

import UpdateTax from '../use-cases/taxes/updateTax';

export class TaxesService {
  private readonly taxesRepository = new TaxesRepository();

  getTaxes(params: FindTaxQuery) {
    return new FindTaxes(this.taxesRepository).execute(params);
  }

  getTax(params: { id: string } & FindTaxOptions) {
    return new GetTax(this.taxesRepository).execute(params);
  }

  createTax(params: CreateTaxDTO) {
    return new CreateTaxUseCase(
      {
        taxesRepo: this.taxesRepository,
      },
      {
        messageBroker: messageBroker,
      }
    ).execute(params);
  }

  updateTax(params: { id: string } & UpdateTaxDTO) {
    return new UpdateTax(
      { taxesRepo: this.taxesRepository },
      { messageBroker: messageBroker }
    ).execute(params);
  }

  deleteTax(params: { id: string }) {
    return new DeleteTax(this.taxesRepository, {
      messageBroker: messageBroker,
    }).execute(params);
  }

  deleteManyTaxes(params: FindTaxFilter) {
    return new DeleteTaxes(this.taxesRepository, {
      messageBroker: messageBroker,
    }).execute(params);
  }
}

export default new TaxesService();
