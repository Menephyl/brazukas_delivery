CREATE TABLE `merchant_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`merchantId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`image` varchar(500),
	`category` varchar(100),
	`isAvailable` boolean DEFAULT true,
	`preparationTime` int DEFAULT 15,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `merchant_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merchants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`address` text,
	`cnpj` varchar(20),
	`bankAccount` text,
	`logo` varchar(500),
	`description` text,
	`category` varchar(100),
	`deliveryRadius` int DEFAULT 5,
	`deliveryFee` int DEFAULT 0,
	`minOrderValue` int DEFAULT 0,
	`rating` varchar(10) DEFAULT '0',
	`reviewCount` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `merchants_id` PRIMARY KEY(`id`),
	CONSTRAINT `merchants_email_unique` UNIQUE(`email`),
	CONSTRAINT `merchants_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
ALTER TABLE `merchant_products` ADD CONSTRAINT `merchant_products_merchantId_merchants_id_fk` FOREIGN KEY (`merchantId`) REFERENCES `merchants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `merchants` ADD CONSTRAINT `merchants_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;