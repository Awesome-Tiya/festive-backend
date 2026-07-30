/*
  Warnings:

  - Added the required column `fest1Id` to the `DailyFestival` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fest2Id` to the `DailyFestival` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyFestival" ADD COLUMN     "fest1Id" TEXT NOT NULL,
ADD COLUMN     "fest2Id" TEXT NOT NULL;
