CREATE TABLE `carts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`items` text NOT NULL,
	`couponCode` varchar(50),
	`totalAmount` decimal(10,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
