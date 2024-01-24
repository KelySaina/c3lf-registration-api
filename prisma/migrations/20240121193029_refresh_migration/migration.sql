/*
  Warnings:

  - Added the required column `age` to the `Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Members` ADD COLUMN `age` INTEGER NOT NULL;
