import IReturnValue from '../../../domain/valueObjects/returnValue';
import IProductsRepository from '../../repositories/productsRepository';
import IUseCase from '../protocols';

export default class GenerateProductSku
    implements
    IUseCase<
        {
            name: string
            brandName?: string
        },
        Promise<IReturnValue<{ sku: string }>>
    > {
    constructor(private readonly repo: IProductsRepository) { }

    async execute(
        params: {
            name: string;
            brandName?: string
        }
    ): Promise<IReturnValue<{ sku: string }>> {
        const lastProduct = await this.repo.getLastProduct();
        const brandInitials = params.brandName ? params.brandName.trim().split(' ').map(word => word[0].toUpperCase()).join('') : '';

        const productInitials = params.name.trim().split(' ').map(word => word[0].toUpperCase()).join('');

        const sku = `SKU-${productInitials}${brandInitials}-${(lastProduct?.serialNumber ? lastProduct.serialNumber + 1 : 1).toString().padStart(6, '0')}`;

        return {
            success: true,
            data: {
                sku
            },
        };
    }
}
