import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1562071722198 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `measures` (`id` varchar(36) NOT NULL, `measure` varchar(255) NOT NULL, `gramsPerMeasure` int NOT NULL, `productCode` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipes` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `foodGroup` varchar(255) NOT NULL, `authorId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `nutritions` (`id` varchar(36) NOT NULL, `PROCNT` text NOT NULL, `FAT` text NOT NULL, `CHOCDF` text NOT NULL, `ENERC_KCAL` text NOT NULL, `SUGAR` text NOT NULL, `FIBTG` text NOT NULL, `CA` text NOT NULL, `FE` text NOT NULL, `P` text NOT NULL, `K` text NOT NULL, `NA` text NOT NULL, `VITA_IU` text NOT NULL, `TOCPHA` text NOT NULL, `VITD` text NOT NULL, `VITC` text NOT NULL, `VITB12` text NOT NULL, `FOLAC` text NOT NULL, `CHOLE` text NOT NULL, `FATRN` text NOT NULL, `FASAT` text NOT NULL, `FAMS` text NOT NULL, `FAPU` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `products` (`code` int NOT NULL, `description` varchar(255) NOT NULL, `foodGroup` varchar(255) NOT NULL, `nutritionId` varchar(36) NULL, UNIQUE INDEX `REL_029502bbd9a8edca9ebb9ae652` (`nutritionId`), PRIMARY KEY (`code`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `ingredients` (`id` varchar(36) NOT NULL, `quantity` int NOT NULL DEFAULT 0, `unit` varchar(255) NOT NULL, `productCode` int NULL, `recipeId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `measures` ADD CONSTRAINT `FK_db5edcd1328fb776774cc41420e` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_afd4f74f8df44df574253a7f37b` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_029502bbd9a8edca9ebb9ae652d` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ingredients` ADD CONSTRAINT `FK_62805edc6999810ca7df35cc5ad` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ingredients` ADD CONSTRAINT `FK_f20a9542c7a02105fa40a08d95b` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ingredients` DROP FOREIGN KEY `FK_f20a9542c7a02105fa40a08d95b`");
        await queryRunner.query("ALTER TABLE `ingredients` DROP FOREIGN KEY `FK_62805edc6999810ca7df35cc5ad`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_029502bbd9a8edca9ebb9ae652d`");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_afd4f74f8df44df574253a7f37b`");
        await queryRunner.query("ALTER TABLE `measures` DROP FOREIGN KEY `FK_db5edcd1328fb776774cc41420e`");
        await queryRunner.query("DROP TABLE `ingredients`");
        await queryRunner.query("DROP INDEX `REL_029502bbd9a8edca9ebb9ae652` ON `products`");
        await queryRunner.query("DROP TABLE `products`");
        await queryRunner.query("DROP TABLE `nutritions`");
        await queryRunner.query("DROP TABLE `recipes`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `measures`");
    }

}
