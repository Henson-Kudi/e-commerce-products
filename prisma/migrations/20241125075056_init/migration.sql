/*
  Warnings:

  - You are about to drop the column `disCountName` on the `ProductDiscount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductDiscount" DROP COLUMN "disCountName",
ADD COLUMN     "discountName" TEXT NOT NULL DEFAULT 'No name';
