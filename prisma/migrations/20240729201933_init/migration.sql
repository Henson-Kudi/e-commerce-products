/*
  Warnings:

  - Changed the type of `status` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stockStatus` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL,
DROP COLUMN "stockStatus",
ADD COLUMN     "stockStatus" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "StockStatus";
