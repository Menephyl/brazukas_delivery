CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discountType` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
	`discountValue` decimal(10,2) NOT NULL,
	`minOrderValue` decimal(10,2) DEFAULT '0',
	`maxUses` int,
	`usedCount` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
