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
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `company_id` (`company_id`),
  KEY `users_ibfk_2_idx` (`experience_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`experience_id`) REFERENCES `experience_levels` (`experience_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','admin@nextstep.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Michael Johnson','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(2,'employer1','hr@google.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Sarah Wilson','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',1,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(3,'employer2','careers@microsoft.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','James Smith','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',2,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(4,'employer3','recruiting@samsung.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Ji-hoon Kim','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',3,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(5,'employer4','hiring@tesla.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Elon Musk','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',9,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(6,'candidate1','john.doe@email.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','John Doe','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(7,'candidate2','jane.smith@email.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Jane Smith','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(8,'candidate3','robert.brown@email.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Robert Brown','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(9,'candidate4','emily.wilson@email.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Emily Wilson','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'ACTIVE',NULL,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland'),(10,'banned1','banned@test.com','$2a$12$DfUWeUarVHtUs/LdTPJWyuBPL6ZjNRymFYOx/VZAapa0DFPV2H1GC','Banned User','https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif',NULL,'BANNED',NULL,0,'2025-02-28 21:41:32','2025-05-22 15:53:55',1,'0867166915','Scotland');
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

-- Dump completed on 2025-06-11 22:13:01
