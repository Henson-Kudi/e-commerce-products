/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Tax` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Tax` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Tax` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tax" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tax_name_key" ON "Tax"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tax_slug_key" ON "Tax"("slug");
