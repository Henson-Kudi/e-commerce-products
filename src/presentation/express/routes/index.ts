// You can modify this file the way you like but make sure to export the router as default so that it initialised in index.ts
import { Router } from 'express';
import getProducts from './handlers/products/getProducts';
import createProduct from './handlers/products/createProduct';
import getProduct from './handlers/products/getProduct';
import updateProduct from './handlers/products/updateProduct';
import deleteProduct from './handlers/products/deleteProduct';
import deleteProducts from './handlers/products/deleteproducts';
import getBrands from './handlers/brands/getBrands';
import getBrand from './handlers/brands/getBrand';
import updateBrand from './handlers/brands/updateBrand';
import deleteBrand from './handlers/brands/deleteBrand';
import deleteBrands from './handlers/brands/deleteBrands';
import createBrand from './handlers/brands/createBrand';
import getCategories from './handlers/categories/getCategories';
import createCategory from './handlers/categories/createCategory';
import deleteCategory from './handlers/categories/deleteCategory';
import getCategory from './handlers/categories/getCategory';
import updateCategory from './handlers/categories/updateCategory';
import deleteCategories from './handlers/categories/deleteCategories';
import getTaxes from './handlers/taxes/getTaxes';
import createTax from './handlers/taxes/createTax';
import deleteTax from './handlers/taxes/deletetax';
import deleteTaxes from './handlers/taxes/deleteTaxes';
import updateTax from './handlers/taxes/updateTax';
import getTax from './handlers/taxes/getTax';

const router = Router();

// Remember to remove this middleware. This is to similuate an authenticated request
router.use((req, res, next) => {
  req.headers.userId = '388953e6-2eae-47f3-bc69-5267c9b7b627';
  next();
});
// Define your routes here

// PRODUCT ROUTES
router
  .route('/products')
  .get(getProducts)
  .post(createProduct)
  .delete(deleteProducts);
router
  .route('/products/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

// BRANDS ROUTES
router.route('/brands').get(getBrands).post(createBrand).delete(deleteBrands);
router.route('/brands/:id').get(getBrand).put(updateBrand).delete(deleteBrand);

// CATEGORIES ROUTES
router
  .route('/categories')
  .get(getCategories)
  .post(createCategory)
  .delete(deleteCategories);
router
  .route('/categories/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

// TAXES ROUTES
router.route('/taxes').get(getTaxes).post(createTax).delete(deleteTaxes);
router.route('/taxes/:id').get(getTax).put(updateTax).delete(deleteTax);

export default router;
