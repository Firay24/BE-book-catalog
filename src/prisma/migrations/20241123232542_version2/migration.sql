/*
  Warnings:

  - Added the required column `Days` to the `BorrowRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BorrowRequest" ADD COLUMN     "Days" INTEGER NOT NULL;
