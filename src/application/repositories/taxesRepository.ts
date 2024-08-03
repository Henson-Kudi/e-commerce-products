import { Prisma } from '@prisma/client';
import { Tax } from '../../domain/entities';
import { FindTaxOptions } from '../../domain/dtos/tax';

export default interface ITaxesRepository {
  getTaxes(filter: Prisma.TaxFindManyArgs): Promise<Tax[]>;
  getTaxById(id: string, options?: FindTaxOptions): Promise<Tax | null>;
  getTaxBySlug(slug: string, options?: FindTaxOptions): Promise<Tax | null>;
  getFirstTax(filter: Prisma.TaxFindFirstArgs): Promise<Tax | null>;
  countTaxes(filter: Prisma.TaxCountArgs): Promise<number>;

  createTax(data: Prisma.TaxCreateArgs): Promise<Tax>;
  upsertTax(data: Prisma.TaxUpsertArgs): Promise<Tax>;

  updateTax(data: Prisma.TaxUpdateArgs): Promise<Tax>;

  deleteTax(filter: Prisma.TaxDeleteArgs): Promise<Tax>;
  deleteTaxes(filter: Prisma.TaxDeleteManyArgs): Promise<Prisma.BatchPayload>;
}
