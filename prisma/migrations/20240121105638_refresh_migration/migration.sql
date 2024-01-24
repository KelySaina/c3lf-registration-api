/*
  Warnings:

  - Added the required column `imgUrl` to the `Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Members` ADD COLUMN `imgUrl` VARCHAR(191) NOT NULL;
