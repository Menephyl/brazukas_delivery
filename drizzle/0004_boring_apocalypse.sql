CREATE TABLE `loyaltyProgram` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`points` int NOT NULL DEFAULT 0,
	`cashback` decimal(10,2) NOT NULL DEFAULT '0',
	`tier` varchar(20) NOT NULL DEFAULT 'bronze',
	`totalSpent` decimal(12,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyaltyProgram_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyaltyProgram_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(20) NOT NULL,
	`points` int NOT NULL,
	`cashback` decimal(10,2) DEFAULT '0',
	`description` text,
	`orderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyaltyTransactions_id` PRIMARY KEY(`id`)
);
