CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('rain','pest','disease','weather','market-price') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userMessage` text NOT NULL,
	`assistantResponse` text NOT NULL,
	`language` enum('en','hi','gu') NOT NULL DEFAULT 'en',
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `farmers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mobile` varchar(20),
	`location` varchar(255),
	`state` varchar(100),
	`district` varchar(100),
	`languagePreference` enum('en','hi','gu') NOT NULL DEFAULT 'en',
	`cropTypes` text,
	`farmSize` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `farmers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendedCrops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cropName` varchar(100) NOT NULL,
	`season` varchar(50) NOT NULL,
	`reason` text,
	`suitability` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recommendedCrops_id` PRIMARY KEY(`id`)
);
