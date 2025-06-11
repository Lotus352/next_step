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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 22:13:01
