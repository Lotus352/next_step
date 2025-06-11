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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 22:13:00
