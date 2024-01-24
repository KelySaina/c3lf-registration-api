-- CreateTable
CREATE TABLE `Members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `matricule` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `paid` BOOLEAN NOT NULL,
    `year` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Members_matricule_key`(`matricule`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
