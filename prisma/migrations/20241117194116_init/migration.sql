/*
  Warnings:

  - You are about to drop the column `discountEndDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountStartDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountedPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountRate` on the `ProductDiscout` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `ProductDiscout` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `ProductDiscout` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `ProductDiscout` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `ProductDiscout` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `ProductDiscout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `ProductDiscout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discountEndDate",
DROP COLUMN "discountStartDate",
DROP COLUMN "discountedPrice";

-- AlterTable
ALTER TABLE "ProductDiscout" DROP COLUMN "discountRate",
DROP COLUMN "usageCount",
DROP COLUMN "usageLimit",
DROP COLUMN "validFrom",
DROP COLUMN "validTo",
ADD COLUMN     "autoApply" BOOLEAN DEFAULT false,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
