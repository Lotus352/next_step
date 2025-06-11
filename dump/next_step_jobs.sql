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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 22:13:00
