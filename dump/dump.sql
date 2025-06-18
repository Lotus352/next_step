-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: next_step
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `certifications`
--

DROP TABLE IF EXISTS `certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certifications` (
  `certification_id` bigint NOT NULL,
  `certification_name` varchar(255) NOT NULL,
  PRIMARY KEY (`certification_id`),
  UNIQUE KEY `certifications_name_UNIQUE` (`certification_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certifications`
--

LOCK TABLES `certifications` WRITE;
/*!40000 ALTER TABLE `certifications` DISABLE KEYS */;
INSERT INTO `certifications` VALUES (1,'TOEIC');
/*!40000 ALTER TABLE `certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `company_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `count_employees` varchar(255) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `company_url` text,
  `logo_url` text,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `founded` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `location_id` bigint NOT NULL,
  PRIMARY KEY (`company_id`),
  KEY `companies_ibfk_1_idx` (`location_id`),
  CONSTRAINT `companies_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Google','Tech giant specializing in Internet services','1000-2000',NULL,'https://google.com','https://logo.clearbit.com/google.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2014',NULL,1,1),(2,'Microsoft','Leading software and cloud services company','200',NULL,'https://microsoft.com','https://logo.clearbit.com/microsoft.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2014',NULL,1,2),(3,'Samsung','Global electronics manufacturer','200',NULL,'https://samsung.com','https://logo.clearbit.com/samsung.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2014',NULL,1,3),(4,'Toyota','Automobile manufacturing corporation','200',NULL,'https://toyota.com','https://logo.clearbit.com/toyota.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2013',NULL,1,4),(5,'Novartis','Multinational pharmaceutical company','200',NULL,'https://novartis.com','https://logo.clearbit.com/novartis.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2014',NULL,1,5),(6,'Amazon','E-commerce and cloud computing company','200',NULL,'https://amazon.com','https://logo.clearbit.com/amazon.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2013',NULL,1,6),(7,'Siemens','Industrial manufacturing conglomerate','200',NULL,'https://siemens.com','https://logo.clearbit.com/siemens.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2013',NULL,1,1),(8,'Unilever','Consumer goods multinational','200',NULL,'https://unilever.com','https://logo.clearbit.com/unilever.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2013',NULL,1,1),(9,'Tesla','Electric vehicle and clean energy company','200',NULL,'https://tesla.com','https://logo.clearbit.com/tesla.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2013',NULL,1,2),(10,'Sony','Electronics and entertainment conglomerate','200',NULL,'https://sony.com','https://logo.clearbit.com/sony.com',0,'2025-02-28 21:41:32','2025-03-13 03:10:28','2013',NULL,1,2);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_industries`
--

DROP TABLE IF EXISTS `company_industries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_industries` (
  `company_id` bigint NOT NULL,
  `industry_id` bigint NOT NULL,
  PRIMARY KEY (`company_id`,`industry_id`),
  KEY `industry_id` (`industry_id`),
  CONSTRAINT `company_industries_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE,
  CONSTRAINT `company_industries_ibfk_2` FOREIGN KEY (`industry_id`) REFERENCES `industries` (`industry_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_industries`
--

LOCK TABLES `company_industries` WRITE;
/*!40000 ALTER TABLE `company_industries` DISABLE KEYS */;
INSERT INTO `company_industries` VALUES (1,1),(2,1),(3,1),(10,1),(5,3),(4,4),(7,4),(9,4),(6,6),(8,6);
/*!40000 ALTER TABLE `company_industries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_reviews`
--

DROP TABLE IF EXISTS `company_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_reviews` (
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `company_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `rating` float NOT NULL,
  `review_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `company_id` (`company_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `company_reviews_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE,
  CONSTRAINT `company_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_reviews`
--

LOCK TABLES `company_reviews` WRITE;
/*!40000 ALTER TABLE `company_reviews` DISABLE KEYS */;
INSERT INTO `company_reviews` VALUES (1,1,6,5,'nice company sss','2025-02-28 21:41:32'),(3,1,8,4,'Challenging projects with global impact','2025-02-28 21:41:32'),(4,1,9,3,'Fast-paced but needs better work-life balance','2025-02-28 21:41:32'),(5,2,6,4,'Revolutionizing the automotive industry','2025-02-28 21:41:32'),(6,2,7,4,'Exciting cutting-edge technology work','2025-02-28 21:41:32'),(7,2,9,4,'Good benefits package and career growth','2025-02-28 21:41:32'),(9,2,8,3,'Amazing company culture and smart colleagues','2025-02-28 21:41:32'),(12,3,6,0,'xin chao','2025-05-22 15:48:28'),(13,9,6,3,'666','2025-05-22 16:00:07'),(14,1,2,2,'fairsssssccc','2025-06-07 20:47:25');
/*!40000 ALTER TABLE `company_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_specialities`
--

DROP TABLE IF EXISTS `company_specialities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_specialities` (
  `company_id` bigint NOT NULL,
  `speciality_name` varchar(255) NOT NULL,
  PRIMARY KEY (`company_id`,`speciality_name`),
  CONSTRAINT `company_specialities_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_specialities`
--

LOCK TABLES `company_specialities` WRITE;
/*!40000 ALTER TABLE `company_specialities` DISABLE KEYS */;
INSERT INTO `company_specialities` VALUES (1,'Mobile OS'),(1,'Search Algorithms'),(2,'Cloud Computing'),(2,'Enterprise Software'),(3,'Consumer Electronics'),(3,'Semiconductors'),(4,'Automation'),(4,'Hybrid Vehicles'),(5,'Pharmaceuticals'),(5,'Vaccine Research'),(6,'AWS Cloud'),(6,'E-commerce'),(7,'Industrial Automation'),(7,'Smart Infrastructure'),(8,'Consumer Packaged Goods'),(8,'Sustainable Products'),(9,'Electric Vehicles'),(9,'Solar Energy'),(10,'Entertainment Systems'),(10,'Gaming Consoles');
/*!40000 ALTER TABLE `company_specialities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience_levels`
--

DROP TABLE IF EXISTS `experience_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience_levels` (
  `experience_id` bigint NOT NULL AUTO_INCREMENT,
  `experience_name` varchar(100) NOT NULL,
  PRIMARY KEY (`experience_id`),
  UNIQUE KEY `experience_name` (`experience_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience_levels`
--

LOCK TABLES `experience_levels` WRITE;
/*!40000 ALTER TABLE `experience_levels` DISABLE KEYS */;
INSERT INTO `experience_levels` VALUES (1,'Intern'),(2,'Junior'),(5,'Lead'),(3,'Mid-Level'),(6,'Principal'),(4,'Senior');
/*!40000 ALTER TABLE `experience_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `industries`
--

DROP TABLE IF EXISTS `industries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `industries` (
  `industry_id` bigint NOT NULL AUTO_INCREMENT,
  `industry_name` varchar(255) NOT NULL,
  `icon` text,
  PRIMARY KEY (`industry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `industries`
--

LOCK TABLES `industries` WRITE;
/*!40000 ALTER TABLE `industries` DISABLE KEYS */;
INSERT INTO `industries` VALUES (1,'Technology','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNvZGUiPjxwb2x5bGluZSBwb2ludHM9IjE2IDE4IDIyIDEyIDE2IDYiLz48cG9seWxpbmUgcG9pbnRzPSI4IDYgMiAxMiA4IDE4Ii8+PC9zdmc+'),(2,'Business','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJyaWVmY2FzZSI+PHBhdGggZD0iTTE2IDIwVjRhMiAyIDAgMCAwLTItMmgtNGEyIDIgMCAwIDAtMiAydjE2Ii8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiB4PSIyIiB5PSI2IiByeD0iMiIvPjwvc3ZnPg=='),(3,'Healthcare','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXN0ZXRob3Njb3BlIj48cGF0aCBkPSJNMTEgMnYyIi8+PHBhdGggZD0iTTUgMnYyIi8+PHBhdGggZD0iTTUgM0g0YTIgMiAwIDAgMC0yIDJ2NGE2IDYgMCAwIDAgMTIgMFY1YTIgMiAwIDAgMC0yLTJoLTEiLz48cGF0aCBkPSJNOCAxNWE2IDYgMCAwIDAgMTIgMHYtMyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjIiLz48L3N2Zz4='),(4,'Education','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdyYWR1YXRpb24tY2FwIj48cGF0aCBkPSJNMjEuNDIgMTAuOTIyYTEgMSAwIDAgMC0uMDE5LTEuODM4TDEyLjgzIDUuMThhMiAyIDAgMCAwLTEuNjYgMEwyLjYgOS4wOGExIDEgMCAwIDAgMCAxLjgzMmw4LjU3IDMuOTA4YTIgMiAwIDAgMCAxLjY2IDB6Ii8+PHBhdGggZD0iTTIyIDEwdjYiLz48cGF0aCBkPSJNNiAxMi41VjE2YTYgMyAwIDAgMCAxMiAwdi0zLjUiLz48L3N2Zz4='),(5,'Finance','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxhbmRtYXJrIj48bGluZSB4MT0iMyIgeDI9IjIxIiB5MT0iMjIiIHkyPSIyMiIvPjxsaW5lIHgxPSI2IiB4Mj0iNiIgeTE9IjE4IiB5Mj0iMTEiLz48bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjE4IiB5Mj0iMTEiLz48bGluZSB4MT0iMTQiIHgyPSIxNCIgeTE9IjE4IiB5Mj0iMTEiLz48bGluZSB4MT0iMTgiIHgyPSIxOCIgeTE9IjE4IiB5Mj0iMTEiLz48cG9seWdvbiBwb2ludHM9IjEyIDIgMjAgNyA0IDciLz48L3N2Zz4='),(6,'Retail','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNob3BwaW5nLWJhZyI+PHBhdGggZD0iTTYgMiAzIDZ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjZsLTMtNFoiLz48cGF0aCBkPSJNMyA2aDE4Ii8+PHBhdGggZD0iTTE2IDEwYTQgNCAwIDAgMS04IDAiLz48L3N2Zz4='),(7,'Logistics','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRydWNrIj48cGF0aCBkPSJNMTQgMThWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnYxMWExIDEgMCAwIDAgMSAxaDIiLz48cGF0aCBkPSJNMTUgMThIOSIvPjxwYXRoIGQ9Ik0xOSAxOGgyYTEgMSAwIDAgMCAxLTF2LTMuNjVhMSAxIDAgMCAwLS4yMi0uNjI0bC0zLjQ4LTQuMzVBMSAxIDAgMCAwIDE3LjUyIDhIMTQiLz48Y2lyY2xlIGN4PSIxNyIgY3k9IjE4IiByPSIyIi8+PGNpcmNsZSBjeD0iNyIgY3k9IjE4IiByPSIyIi8+PC9zdmc+'),(8,'Manufacturing','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXdyZW5jaCI+PHBhdGggZD0iTTE0LjcgNi4zYTEgMSAwIDAgMCAwIDEuNGwxLjYgMS42YTEgMSAwIDAgMCAxLjQgMGwzLjc3LTMuNzdhNiA2IDAgMCAxLTcuOTQgNy45NGwtNi45MSA2LjkxYTIuMTIgMi4xMiAwIDAgMS0zLTNsNi45MS02LjkxYTYgNiAwIDAgMSA3Ljk0LTcuOTRsLTMuNzYgMy43NnoiLz48L3N2Zz4='),(9,'Design','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBlbi10b29sIj48cGF0aCBkPSJNMTUuNzA3IDIxLjI5M2ExIDEgMCAwIDEtMS40MTQgMGwtMS41ODYtMS41ODZhMSAxIDAgMCAxIDAtMS40MTRsNS41ODYtNS41ODZhMSAxIDAgMCAxIDEuNDE0IDBsMS41ODYgMS41ODZhMSAxIDAgMCAxIDAgMS40MTR6Ii8+PHBhdGggZD0ibTE4IDEzLTEuMzc1LTYuODc0YTEgMSAwIDAgMC0uNzQ2LS43NzZMMy4yMzUgMi4wMjhhMSAxIDAgMCAwLTEuMjA3IDEuMjA3TDUuMzUgMTUuODc5YTEgMSAwIDAgMCAuNzc2Ljc0NkwxMyAxOCIvPjxwYXRoIGQ9Im0yLjMgMi4zIDcuMjg2IDcuMjg2Ii8+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iMiIvPjwvc3ZnPg=='),(10,'Hospitality','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhvc3BpdGFsIj48cGF0aCBkPSJNMTIgNnY0Ii8+PHBhdGggZD0iTTE0IDE0aC00Ii8+PHBhdGggZD0iTTE0IDE4aC00Ii8+PHBhdGggZD0iTTE0IDhoLTQiLz48cGF0aCBkPSJNMTggMTJoMmEyIDIgMCAwIDEgMiAydjZhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJ2LTlhMiAyIDAgMCAxIDItMmgyIi8+PHBhdGggZD0iTTE4IDIyVjRhMiAyIDAgMCAwLTItMkg4YTIgMiAwIDAgMC0yIDJ2MTgiLz48L3N2Zz4='),(11,'Real Estate','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJ1aWxkaW5nIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHg9IjQiIHk9IjIiIHJ4PSIyIiByeT0iMiIvPjxwYXRoIGQ9Ik05IDIydi00aDZ2NCIvPjxwYXRoIGQ9Ik04IDZoLjAxIi8+PHBhdGggZD0iTTE2IDZoLjAxIi8+PHBhdGggZD0iTTEyIDZoLjAxIi8+PHBhdGggZD0iTTEyIDEwaC4wMSIvPjxwYXRoIGQ9Ik0xMiAxNGguMDEiLz48cGF0aCBkPSJNMTYgMTBoLjAxIi8+PHBhdGggZD0iTTE2IDE0aC4wMSIvPjxwYXRoIGQ9Ik04IDEwaC4wMSIvPjxwYXRoIGQ9Ik04IDE0aC4wMSIvPjwvc3ZnPg=='),(12,'Medical','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0LXB1bHNlIj48cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIi8+PHBhdGggZD0iTTMuMjIgMTJIOS41bC41LTEgMiA0LjUgMi03IDEuNSAzLjVoNS4yNyIvPjwvc3ZnPg==');
/*!40000 ALTER TABLE `industries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `application_id` bigint NOT NULL AUTO_INCREMENT,
  `job_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `resume_url` text NOT NULL,
  `cover_letter` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'PENDING',
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resume_content` text,
  `score` text,
  `score_mean` float DEFAULT '0',
  PRIMARY KEY (`application_id`),
  KEY `job_applications_ibfk_1` (`job_id`),
  KEY `job_applications_ibfk_2` (`user_id`),
  CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `job_applications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (57,1,6,'https://res.cloudinary.com/damlykdtx/raw/upload/v1750014006/cv_e3a8b632-cac5-4f7e-966e-9397e5b52aae.pdf','test','ACCEPTED','2025-06-15 19:00:24','{\"summary\":\"Web developer with experience in Java, Node.js, and database management, seeking to join a challenging work environment to apply and enhance programming skills.\",\"experienceLevel\":\"Internship\",\"skills\":[\"Java (Programming Languages)\",\"Node.js (Programming Languages)\",\"Java Spring (Frameworks)\",\".NET Framework (Frameworks)\",\"Express (Frameworks)\",\"ReactJS (Frameworks)\",\"HTML (Web Development)\",\"CSS (Web Development)\",\"MySQL (Databases)\",\"SQL Server (Databases)\",\"MongoDB (Databases)\",\"Github (Tools & Platforms)\",\"Swagger (Tools & Platforms)\",\"Postman (Tools & Platforms)\",\"Trello (Tools & Platforms)\",\"Jira (Tools & Platforms)\",\"Docker (Tools & Platforms)\"],\"certifications\":[{\"name\":\"TOEIC\",\"score\":630}],\"education\":[{\"degree\":\"Bachelor of Engineering in Information Systems\",\"school\":\"Danang University of Science and Technology\",\"graduationYear\":2025}],\"workExperience\":[{\"company\":\"FPT Software Da Nang\",\"role\":\"INTERN\",\"duration\":\"June 2023 - August 2023\",\"description\":\"Developed a coffee shop management project using Java Spring Boot, MoMo API, MySQL, and Thymeleaf.\"},{\"company\":\"VNPT Da Nang\",\"role\":\"INTERN\",\"duration\":\"November 2024 - February 2025\",\"description\":\"Developed an AI system for detecting chest X-ray abnormalities with FastAPI, ReactJS, PostgreSQL, and Detectron2.\"}],\"awards\":[],\"projects\":[{\"name\":\"E-Commerce Web Application\",\"description\":\"Facilitates online shopping and business management with backend in Java Spring Boot and frontend in ReactJS.\",\"technologies\":\"Java Spring Boot, ReactJS, MoMo API, MySQL\",\"role\":\"Developed backend APIs, integrated MoMo payments, and managed product/order logic\",\"url\":\"https://github.com/lotus0305/project-pbl6\"},{\"name\":\"Novel Recommendation\",\"description\":\"Manages and suggests novels to users with backend in Express and MongoDB, and Flask for recommendation API.\",\"technologies\":\"Express.js, Flask, MongoDB, ReactJS, and Deep Learning (Python)\",\"role\":\"Built backend APIs with Express.js and Flask, designed/trained deep learning model for novel recommendation and search\",\"url\":\"https://github.com/lotus0305/project-pbl7\"}]}','{\"score\":0.556,\"details\":{\"skill_score\":\"2/3\",\"cert_score\":\"1/1\",\"exp_score\":\"0/1\",\"exp_match\":0,\"exp_detail\":{\"cv_level\":\"Internship\",\"jd_required_levels\":[\"Lead\",\"Senior\"],\"match\":0},\"skills_detail\":[{\"cv_skill\":\"Java\",\"jd_skill\":\"Java\",\"match\":1,\"score\":1.0},{\"cv_skill\":\"Node.js\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.314},{\"cv_skill\":\"Java Spring\",\"jd_skill\":\"Spring Boot\",\"match\":1,\"score\":0.722},{\"cv_skill\":\".NET Framework\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.375},{\"cv_skill\":\"Express\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.364},{\"cv_skill\":\"ReactJS\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.109},{\"cv_skill\":\"HTML\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.44},{\"cv_skill\":\"CSS\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.288},{\"cv_skill\":\"MySQL\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.406},{\"cv_skill\":\"SQL Server\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.359},{\"cv_skill\":\"MongoDB\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.283},{\"cv_skill\":\"Github\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.326},{\"cv_skill\":\"Swagger\",\"jd_skill\":\"Spring Boot\",\"match\":0,\"score\":0.191},{\"cv_skill\":\"Postman\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.219},{\"cv_skill\":\"Trello\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.291},{\"cv_skill\":\"Jira\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.323},{\"cv_skill\":\"Docker\",\"jd_skill\":\"Spring Boot\",\"match\":0,\"score\":0.361}],\"certs_detail\":[{\"jd_cert\":\"TOEIC\",\"cv_cert\":\"TOEIC\",\"jd_score\":\"600.0\",\"cv_score\":\"630.0\",\"match\":1}]}}',1);
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_certifications`
--

DROP TABLE IF EXISTS `job_certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_certifications` (
  `certification_id` bigint NOT NULL,
  `job_id` bigint NOT NULL,
  `certification_score` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`certification_id`,`job_id`),
  KEY `key2_idx` (`job_id`),
  CONSTRAINT `key1` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`certification_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `key2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_certifications`
--

LOCK TABLES `job_certifications` WRITE;
/*!40000 ALTER TABLE `job_certifications` DISABLE KEYS */;
INSERT INTO `job_certifications` VALUES (1,1,'600');
/*!40000 ALTER TABLE `job_certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_experience_levels`
--

DROP TABLE IF EXISTS `job_experience_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_experience_levels` (
  `job_id` bigint NOT NULL,
  `experience_id` bigint NOT NULL,
  PRIMARY KEY (`job_id`,`experience_id`),
  KEY `experience_id` (`experience_id`),
  CONSTRAINT `job_experience_levels_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `job_experience_levels_ibfk_2` FOREIGN KEY (`experience_id`) REFERENCES `experience_levels` (`experience_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_experience_levels`
--

LOCK TABLES `job_experience_levels` WRITE;
/*!40000 ALTER TABLE `job_experience_levels` DISABLE KEYS */;
INSERT INTO `job_experience_levels` VALUES (5,1),(31,1),(10,2),(31,2),(3,3),(7,3),(1,4),(2,4),(3,4),(4,4),(8,4),(9,4),(1,5),(6,5),(30,5),(4,6),(8,6);
/*!40000 ALTER TABLE `job_experience_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_salaries`
--

DROP TABLE IF EXISTS `job_salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_salaries` (
  `salary_id` bigint NOT NULL AUTO_INCREMENT,
  `min_salary` double NOT NULL,
  `max_salary` double NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `pay_period` varchar(50) NOT NULL,
  PRIMARY KEY (`salary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_salaries`
--

LOCK TABLES `job_salaries` WRITE;
/*!40000 ALTER TABLE `job_salaries` DISABLE KEYS */;
INSERT INTO `job_salaries` VALUES (1,80000,120000,'USD','Yearly'),(2,5000,7000,'USD','Monthly'),(3,40000,60000,'EUR','Yearly'),(4,3000,4500,'GBP','Monthly'),(5,95000,130000,'USD','Yearly'),(6,45,65,'USD','Hourly'),(7,7000,9000,'SGD','Monthly'),(8,100000,150000,'CAD','Yearly'),(9,600000,800000,'INR','Yearly'),(10,50000,75000,'AUD','Yearly'),(11,33,3333,'USD','Yearly'),(12,4444,44444,'EUR','Monthly'),(13,444,444,'EUR','Monthly'),(14,33,3333,'EUR','Yearly'),(15,33,3333,'EUR','Yearly'),(16,33,3333,'EUR','Yearly'),(17,333,3335,'SGD','Monthly'),(18,333,3335,'SGD','Monthly'),(19,55555,55555,'USD','Yearly'),(21,33,333,'GBP','Yearly'),(22,4444,44444,'USD','Yearly');
/*!40000 ALTER TABLE `job_salaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_skills`
--

DROP TABLE IF EXISTS `job_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_skills` (
  `job_id` bigint NOT NULL,
  `skill_id` bigint NOT NULL,
  PRIMARY KEY (`job_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `job_skills_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `job_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_skills`
--

LOCK TABLES `job_skills` WRITE;
/*!40000 ALTER TABLE `job_skills` DISABLE KEYS */;
INSERT INTO `job_skills` VALUES (1,1),(7,1),(3,2),(8,2),(1,3),(2,3),(7,3),(9,3),(31,3),(5,4),(3,5),(8,5),(10,6),(4,7),(4,8),(6,8),(9,8),(4,9),(6,9),(2,10),(30,10),(3,11),(5,13),(1,14),(2,15),(6,15),(9,15);
/*!40000 ALTER TABLE `job_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `job_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `company_id` bigint NOT NULL,
  `salary_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `short_description` text,
  `detailed_description` longtext,
  `employment_type` varchar(50) DEFAULT NULL,
  `job_url` text,
  `remote_allowed` tinyint(1) DEFAULT '0',
  `expiry_date` timestamp NULL DEFAULT NULL,
  `status` varchar(50) DEFAULT 'OPEN',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `interview_process` int DEFAULT NULL,
  `location_id` bigint DEFAULT NULL,
  `benefits` text,
  PRIMARY KEY (`job_id`),
  UNIQUE KEY `salary_id` (`salary_id`),
  KEY `jobs_ibfk_4_idx` (`location_id`),
  KEY `jobs_ibfk_1` (`user_id`),
  KEY `jobs_ibfk_2` (`company_id`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `jobs_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE,
  CONSTRAINT `jobs_ibfk_3` FOREIGN KEY (`salary_id`) REFERENCES `job_salaries` (`salary_id`) ON DELETE SET NULL,
  CONSTRAINT `jobs_ibfk_4` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,2,1,1,'Senior Java Developer','Develop high-performance backend systems','5+ years experience with Spring Boot and microservices. Must have AWS experience.','FULL_TIME','https://careers.google.com/jobs/001',1,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-23 02:33:32',1,1,1,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(2,2,1,2,'Cloud Architect','Design Azure cloud solutions','Certified Azure Architect with 3+ years cloud migration experience.','CONTRACT','https://careers.microsoft.com/jobs/002',1,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-29 18:14:33',1,1,1,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(3,2,1,3,'ML Engineer','Build AI-powered mobile features','Strong Python and TensorFlow skills required. Experience with edge computing preferred.','FULL_TIME','https://careers.samsung.com/jobs/003',1,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-29 18:14:33',1,2,1,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(4,2,1,4,'Automation Engineer','Develop manufacturing robots','Expertise in industrial automation and CAD design. 5+ years experience.','FULL_TIME','https://www.tesla.com/careers/004',0,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-29 18:14:33',1,3,2,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(5,2,1,5,'Frontend Intern','Learn React development','6-month internship program for recent graduates. Basic JavaScript knowledge required.','INTERNSHIP','https://careers.google.com/jobs/005',1,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-23 02:33:46',1,1,3,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(6,2,1,6,'DevOps Lead','Manage Kubernetes clusters','5+ years experience with Terraform and CI/CD pipelines. AWS/GCP certification required.','FULL_TIME','https://careers.microsoft.com/jobs/006',1,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-29 18:14:33',1,1,4,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(7,2,1,7,'Embedded Systems Engineer','Develop IoT devices','Expertise in C/C++ and RTOS. Experience with ARM processors.','CONTRACT','https://careers.samsung.com/jobs/007',0,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-29 18:14:33',1,2,5,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(8,2,1,8,'Battery Engineer','Improve EV battery technology','PhD in Materials Science with 3+ years battery research experience.','FULL_TIME','https://www.tesla.com/careers/008',0,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-29 18:14:33',1,3,6,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(9,2,1,9,'Security Engineer','Protect cloud infrastructure','CISSP certified with 5+ years security experience. Kubernetes security knowledge required.','FULL_TIME','https://careers.google.com/jobs/009',1,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-23 02:33:46',1,3,7,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(10,2,1,10,'Technical Writer','Create API documentation','Strong technical writing skills with OpenAPI/Swagger experience.','PART_TIME','https://careers.microsoft.com/jobs/010',1,'2025-12-30 17:00:00','OPEN',0,'2025-02-28 21:41:32','2025-05-29 18:14:33',1,3,2,'Health Insurance|Paid Leave|Year-end Bonus|Training and Development'),(30,2,1,21,'333','333','333',NULL,'',0,NULL,'OPEN',0,'2025-06-09 15:16:21','2025-06-09 15:16:21',0,1,27,NULL),(31,3,2,22,'44','4444','44444',NULL,'4444',1,NULL,'OPEN',0,'2025-06-09 15:18:23','2025-06-09 15:18:23',0,1,28,NULL);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `location_id` bigint NOT NULL AUTO_INCREMENT,
  `country_name` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `house_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `location_id` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'United States','California','Los Angeles','Hollywood Blvd','123'),(2,'United States','New York','New York City','5th Avenue','789'),(3,'United Kingdom','England','London','Baker Street','221B'),(4,'Canada','Ontario','Toronto','Queen Street','456'),(5,'Australia','New South Wales','Sydney','George Street','678'),(6,'Japan',NULL,'Tokyo','Shibuya Dori','5-3'),(7,'Germany','Bavaria','Munich','Maximilianstraße','99'),(8,'France','Île-de-France','Paris','Champs-Élysées','250'),(9,'Italy','Lazio','Rome','Via del Corso','85'),(10,'Spain','Community of Madrid','Madrid','Gran Vía','110'),(27,'Andorra','Đà Nẵng','Llorts','Nguyễn Lương Bằng',NULL),(28,'Albania','Đà Nẵng','Petran','Nguyễn Lương Bằng',NULL);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `job_id` bigint DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(50) DEFAULT 'UNREAD',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,6,1,'Your application to Google has been received','UNREAD','2025-02-28 21:41:32',NULL),(2,7,NULL,'3 new jobs match your skills','UNREAD','2025-02-28 21:41:32',NULL),(3,8,4,'Interview scheduled for Friday 2pm','READ','2025-02-28 21:41:32',NULL),(4,9,7,'Application status updated to REJECTED','UNREAD','2025-02-28 21:41:32',NULL),(5,6,5,'Reminder: Technical assessment due tomorrow','READ','2025-02-28 21:41:32',NULL),(6,7,2,'Congratulations! Offer letter sent','UNREAD','2025-02-28 21:41:32',NULL),(7,8,NULL,'Complete your profile to get better matches','UNREAD','2025-02-28 21:41:32',NULL),(8,9,9,'Reference check completed','READ','2025-02-28 21:41:32',NULL),(9,6,10,'New message from recruiter','UNREAD','2025-02-28 21:41:32',NULL),(10,7,3,'Request for additional documents','READ','2025-02-28 21:41:32',NULL);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_logins`
--

DROP TABLE IF EXISTS `oauth_logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_logins` (
  `oauth_login_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `provider_user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`oauth_login_id`),
  UNIQUE KEY `provider` (`provider`,`provider_user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `oauth_logins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_logins`
--

LOCK TABLES `oauth_logins` WRITE;
/*!40000 ALTER TABLE `oauth_logins` DISABLE KEYS */;
INSERT INTO `oauth_logins` VALUES (1,6,'GOOGLE','google-oauth2|1234567890'),(2,7,'LINKEDIN','linkedin-oauth2|987654321'),(3,8,'GITHUB','github-oauth2|192837465'),(4,9,'MICROSOFT','microsoft-oauth2|564738291'),(5,10,'FACEBOOK','facebook-oauth2|1122334455');
/*!40000 ALTER TABLE `oauth_logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `permission_id` bigint NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`permission_id`),
  UNIQUE KEY `permission_name` (`permission_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'manage_users','Manage user accounts'),(2,'post_jobs','Create job postings'),(3,'apply_jobs','Apply to jobs');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1),(1,2),(2,2),(1,3),(3,3);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','System Administrator'),(2,'EMPLOYER','Company Representative'),(3,'CANDIDATE','Job Seeker');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skill_id` bigint NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(255) NOT NULL,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `skill_name` (`skill_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (3,'AWS'),(10,'Azure'),(7,'CAD Design'),(16,'CI/CD'),(9,'Docker'),(1,'Java'),(8,'Kubernetes'),(5,'Machine Learning'),(15,'Microservices'),(13,'Node.js'),(6,'Project Management'),(2,'Python'),(12,'PyTorch'),(4,'React'),(14,'Spring Boot'),(11,'TensorFlow');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_experience_levels`
--

DROP TABLE IF EXISTS `user_experience_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_experience_levels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `experience_id` bigint DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `idx_user_experience_user_id` (`user_id`),
  KEY `idx_user_experience_experience_id` (`experience_id`),
  CONSTRAINT `fk_user_experience_level` FOREIGN KEY (`experience_id`) REFERENCES `experience_levels` (`experience_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_experience_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_experience_levels`
--

LOCK TABLES `user_experience_levels` WRITE;
/*!40000 ALTER TABLE `user_experience_levels` DISABLE KEYS */;
INSERT INTO `user_experience_levels` VALUES (12,6,2,'Full Stack Developer','Digital Innovations Co.','Da Nang, Vietnam','2020-06-14 17:00:00','2022-02-27 17:00:00','Developed and maintained web applications using Java, Spring Framework, and Angular. Implemented RESTful APIs and worked closely with UI/UX designers to create responsive user interfaces.'),(13,6,2,'Software Engineer','Tech Solutions Inc.','Ho Chi Minh City, Vietnam','2022-02-28 17:00:00',NULL,'Lead development of microservices architecture using Spring Boot and React. Manage a team of 3 junior developers and collaborate with cross-functional teams to deliver high-quality software solutions.'),(15,25,1,'33333','333','333','2025-06-14 17:00:00',NULL,'33333');
/*!40000 ALTER TABLE `user_experience_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_job_favorites`
--

DROP TABLE IF EXISTS `user_job_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_job_favorites` (
  `user_id` bigint NOT NULL,
  `job_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`job_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `user_job_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_job_favorites_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_job_favorites`
--

LOCK TABLES `user_job_favorites` WRITE;
/*!40000 ALTER TABLE `user_job_favorites` DISABLE KEYS */;
INSERT INTO `user_job_favorites` VALUES (7,2),(2,3),(7,4),(2,6),(8,6),(9,7),(6,8),(8,9),(9,10);
/*!40000 ALTER TABLE `user_job_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(2,2),(3,2),(4,2),(5,2),(6,3),(7,3),(8,3),(9,3),(10,3),(25,3);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_skills`
--

DROP TABLE IF EXISTS `user_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_skills` (
  `user_id` bigint NOT NULL,
  `skill_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_skills`
--

LOCK TABLES `user_skills` WRITE;
/*!40000 ALTER TABLE `user_skills` DISABLE KEYS */;
INSERT INTO `user_skills` VALUES (6,1),(7,1),(6,2),(6,3),(6,4),(25,7),(6,8),(25,10),(6,11),(6,12),(6,13),(6,14),(6,15),(6,16);
/*!40000 ALTER TABLE `user_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'ACTIVE',
  `company_id` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `experience_id` bigint DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number_UNIQUE` (`phone_number`),
  KEY `company_id` (`company_id`),
  KEY `users_ibfk_2_idx` (`experience_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`experience_id`) REFERENCES `experience_levels` (`experience_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','admin@nextstep.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Michael Johnson','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166911','Scotland',''),(2,'employer1','hr@google.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Sarah Wilson','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',1,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166912','Scotland',NULL),(3,'employer2','careers@microsoft.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','James Smith','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',2,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166913','Scotland',NULL),(4,'employer3','recruiting@samsung.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Ji-hoon Kim','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',3,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166914','Scotland',NULL),(5,'employer4','hiring@tesla.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Elon Musk','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',9,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166915','Scotland',NULL),(6,'candidate1','john.doe@email.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','John Doe','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif','https://res.cloudinary.com/damlykdtx/raw/upload/v1747731744/cv_795ed19b-28c5-44f7-8f8d-8fd2e6f45ba5.pdf','ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166916','Scotland','The brain of fruit flies and humans may be vastly different in size and complexity, but at the circuit level they are not all that different 2'),(7,'candidate2','jane.smith@email.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Jane Smith','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166917','Scotland',NULL),(8,'candidate3','robert.brown@email.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Robert Brown','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166918','Scotland',NULL),(9,'candidate4','emily.wilson@email.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Emily Wilson','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166919','Scotland',NULL),(10,'banned1','banned@test.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Banned User','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'BANNED',NULL,0,'2025-02-28 21:41:32','2025-06-15 15:42:44',1,'0867166910','Scotland',NULL),(25,'hungvt123','tienhunggg0305@gmail.com','$2a$12$9jRqMOmSTh83Qe5rjyv.LeASREF3oqhRCR0swEuGjrxpQG5dkUMce','Hung Tien Vu','https://res.cloudinary.com/damlykdtx/raw/upload/v1749993801/file_e3e416f9-0652-4b32-97da-784e7d241642.png','https://res.cloudinary.com/damlykdtx/raw/upload/v1749993252/file_9b221462-4e56-452c-b08c-c217e1c914de.pdf','ACTIVE',NULL,0,'2025-06-15 12:53:23','2025-06-15 15:42:44',NULL,'0867166922',NULL,'hello');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16  7:57:14
