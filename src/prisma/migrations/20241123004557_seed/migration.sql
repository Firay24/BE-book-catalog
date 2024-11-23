/*
  Warnings:

  - You are about to drop the column `price` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Book` table. All the data in the column will be lost.
  - Added the required column `Price` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ReleaseYear` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "price",
DROP COLUMN "releaseYear",
ADD COLUMN     "Price" INTEGER NOT NULL,
ADD COLUMN     "ReleaseYear" INTEGER NOT NULL;
