/*
  Warnings:

  - You are about to alter the column `discountValue` on the `ProductDiscount` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "ProductDiscount" ALTER COLUMN "discountValue" SET DATA TYPE DECIMAL(65,30);
