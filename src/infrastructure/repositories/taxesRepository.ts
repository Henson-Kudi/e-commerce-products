import { Prisma } from '@prisma/client';
import { Tax } from '../../domain/entities';
import database from '../database';
import { FindTaxOptions } from '../../domain/dtos/tax';
import ITaxesRepository from '../../application/repositories/taxesRepository';

export default class TaxesRepository implements ITaxesRepository {
  createTax(data: Prisma.TaxCreateArgs): Promise<Tax> {
    return database.tax.create(data);
  }
  upsertTax(data: Prisma.TaxUpsertArgs): Promise<Tax> {
    return database.tax.upsert(data);
  }

  getTaxes(filter: Prisma.TaxFindManyArgs): Promise<Tax[]> {
    return database.tax.findMany(filter);
  }
  getTaxById(id: string, options?: FindTaxOptions): Promise<Tax | null> {
    return database.tax.findUnique({
      where: { id },
      include: {
        products: options?.withProducts,
      },
    });
  }
  getTaxBySlug(slug: string, options?: FindTaxOptions): Promise<Tax | null> {
    return database.tax.findUnique({
      where: { slug },
      include: { products: options?.withProducts },
    });
  }
  getFirstTax(filter: Prisma.TaxFindFirstArgs): Promise<Tax | null> {
    return database.tax.findFirst(filter);
  }

  countTaxes(filter: Prisma.TaxCountArgs): Promise<number> {
    return database.tax.count(filter);
  }

  updateTax(data: Prisma.TaxUpdateArgs): Promise<Tax> {
    return database.tax.update(data);
  }

  deleteTax(filter: Prisma.TaxDeleteArgs): Promise<Tax> {
    return database.tax.delete(filter);
  }
  deleteTaxes(filter: Prisma.TaxDeleteManyArgs): Promise<Prisma.BatchPayload> {
    return database.tax.deleteMany(filter);
  }
}
