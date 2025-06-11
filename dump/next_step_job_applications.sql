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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (50,1,1,'https://res.cloudinary.com/damlykdtx/raw/upload/v1747731744/cv_795ed19b-28c5-44f7-8f8d-8fd2e6f45ba5.pdf','8888888888','PENDING','2025-05-20 09:02:10','{\"summary\":\"Web developer with experience in Java, Node.js, and database management seeking to apply programming skills in a challenging work environment.\",\"experienceLevel\":\"Internship\",\"skills\":[\"Java (Programming Languages)\",\"Node.js (Programming Languages)\",\"MySQL (Databases)\",\"Java Spring Boot (Frameworks)\",\"MoMo API (Frameworks)\",\"Thymeleaf (Frameworks)\",\"FastAPI (Frameworks)\",\"ReactJS (Frameworks)\",\"PostgreSQL (Databases)\",\"Detectron2 (Tech Stack)\",\"Python (Tech Stack)\",\"HTML (Web Development)\",\"CSS (Web Development)\",\"GitHub (Tools & Platforms)\",\"Swagger (Tools & Platforms)\",\"Postman (Tools & Platforms)\",\"Trello (Tools & Platforms)\",\"Jira (Tools & Platforms)\",\"Docker (Tools & Platforms)\"],\"certifications\":[{\"name\":\"TOEIC\",\"score\":630}],\"education\":[{\"degree\":\"Bachelor of Engineering in Information Systems\",\"school\":\"Danang University of Science and Technology\",\"graduationYear\":2025}],\"workExperience\":[{\"company\":\"FPT Software Da Nang\",\"role\":\"INTERN\",\"duration\":\"(June 2023 - August 2023)\",\"description\":\"Developed a coffee shop management project using Java Spring Boot, MoMo API, MySQL, and Thymeleaf with a team of 3 members. Designed core features, built RESTful APIs, and managed database schemas.\"},{\"company\":\"VNPT Da Nang\",\"role\":\"INTERN\",\"duration\":\"(November 2024 - February 2025)\",\"description\":\"Developed an AI system for chest X-ray abnormalities detection using FastAPI, ReactJS, PostgreSQL, Detectron2, and Python with a team of 3 members. Built an object detection model and handled model inference and DICOM processing.\"}],\"awards\":[],\"projects\":[{\"name\":\"E-Commerce Web Application\",\"description\":\"Web-based application for online shopping and business management using Java Spring Boot, ReactJS, MoMo API, and MySQL. Developed backend APIs, integrated MoMo payments, and managed product/order logic.\",\"technologies\":[\"Java Spring Boot\",\"ReactJS\",\"MoMo API\",\"MySQL\"],\"role\":\"Developer\",\"url\":\"https://github.com/lotus0305/project-pbl6\"},{\"name\":\"Novel Recommendation\",\"description\":\"Web-based application for managing and suggesting novels using Express.js, Flask, MongoDB, ReactJS, and deep learning. Built backend APIs, trained deep learning model, and designed recommendation system.\",\"technologies\":[\"Express.js\",\"Flask\",\"MongoDB\",\"ReactJS\",\"Deep Learning (Python)\"],\"role\":\"Developer\",\"url\":\"https://github.com/lotus0305/project-pbl7\"}]}','{\"score\":0.67,\"details\":{\"skill_score\":\"2/3\",\"cert_score\":\"0/0\",\"exp_score\":\"0/1\",\"exp_match\":0,\"exp_detail\":{\"cv_level\":\"Internship\",\"jd_required_levels\":[\"Mid-Level\",\"Senior\"],\"match\":0},\"skills_detail\":[{\"cv_skill\":\"Java\",\"jd_skill\":\"Python\",\"match\":1,\"score\":0.63},{\"cv_skill\":\"Node.js\",\"jd_skill\":\"Python\",\"match\":0,\"score\":0.25},{\"cv_skill\":\"MySQL\",\"jd_skill\":\"Python\",\"match\":0,\"score\":0.37},{\"cv_skill\":\"Java Spring Boot\",\"jd_skill\":\"Machine Learning\",\"match\":0,\"score\":0.07},{\"cv_skill\":\"MoMo API\",\"jd_skill\":\"Machine Learning\",\"match\":0,\"score\":0.11},{\"cv_skill\":\"Thymeleaf\",\"jd_skill\":\"TensorFlow\",\"match\":0,\"score\":0.29},{\"cv_skill\":\"FastAPI\",\"jd_skill\":\"TensorFlow\",\"match\":0,\"score\":0.29},{\"cv_skill\":\"ReactJS\",\"jd_skill\":\"TensorFlow\",\"match\":0,\"score\":0.08},{\"cv_skill\":\"PostgreSQL\",\"jd_skill\":\"Machine Learning\",\"match\":0,\"score\":0.25},{\"cv_skill\":\"Detectron2\",\"jd_skill\":\"TensorFlow\",\"match\":0,\"score\":0.28},{\"cv_skill\":\"Python\",\"jd_skill\":\"Python\",\"match\":1,\"score\":1.0},{\"cv_skill\":\"HTML\",\"jd_skill\":\"Python\",\"match\":0,\"score\":0.42},{\"cv_skill\":\"CSS\",\"jd_skill\":\"Python\",\"match\":0,\"score\":0.21},{\"cv_skill\":\"GitHub\",\"jd_skill\":\"Python\",\"match\":0,\"score\":0.3},{\"cv_skill\":\"Swagger\",\"jd_skill\":\"Machine Learning\",\"match\":0,\"score\":0.16},{\"cv_skill\":\"Postman\",\"jd_skill\":\"Python\",\"match\":0,\"score\":0.18},{\"cv_skill\":\"Trello\",\"jd_skill\":\"Machine Learning\",\"match\":0,\"score\":0.3},{\"cv_skill\":\"Jira\",\"jd_skill\":\"Machine Learning\",\"match\":0,\"score\":0.16},{\"cv_skill\":\"Docker\",\"jd_skill\":\"TensorFlow\",\"match\":0,\"score\":0.26}],\"certs_detail\":[]}}',0.666667),(51,1,1,'https://res.cloudinary.com/damlykdtx/raw/upload/v1747731848/cv_241661ca-c468-4c55-b573-20fe79da50d8.pdf','2222','PENDING','2025-05-20 09:03:53','{\"summary\":\"Web developer with experience in Java, Node.js, and database management seeking challenging work environment to apply and enhance programming skills.\",\"experienceLevel\":\"Internship\",\"skills\":[\"Java (Programming Languages)\",\"Node.js (Programming Languages)\",\"Java Spring Boot (Frameworks)\",\"MoMo API (Frameworks)\",\"MySQL (Databases)\",\"Thymeleaf (Frameworks)\",\"FastAPI (Tech Stack)\",\"ReactJS (Tech Stack)\",\"PostgreSQL (Tech Stack)\",\"Detectron2 (Tech Stack)\",\"Python (Tech Stack)\",\"C# (Programming Languages)\",\"JavaScript (Programming Languages)\",\"TypeScript (Programming Languages)\",\"HTML (Web Development)\",\"CSS (Web Development)\",\"SQL Server (Databases)\",\"MongoDB (Databases)\",\"Github (Tools & Platforms)\",\"Swagger (Tools & Platforms)\",\"Postman (Tools & Platforms)\",\"Trello (Tools & Platforms)\",\"Jira (Tools & Platforms)\",\"Docker (Tools & Platforms)\"],\"certifications\":[{\"name\":\"TOEIC\",\"score\":630}],\"education\":[{\"degree\":\"Bachelor of Engineering in Information Systems\",\"school\":\"Danang University of Science and Technology\",\"graduationYear\":\"2025\"}],\"workExperience\":[{\"company\":\"FPT Software Da Nang\",\"role\":\"Intern\",\"duration\":\"June 2023 - August 2023\",\"description\":\"Developed a coffee shop management project using Java Spring Boot, MoMo API, MySQL, Thymeleaf. Designed and implemented core features, built RESTful APIs, managed database schemas with MySQL, and ensured data consistency and security.\"},{\"company\":\"VNPT Da Nang\",\"role\":\"Intern\",\"duration\":\"November 2024 - February 2025\",\"description\":\"Developed a Chest X-ray Abnormality Detection System using FastAPI, ReactJS, PostgreSQL, Detectron2, Python. Built an object detection model and backend for handling model inference and processing DICOM images.\"}],\"awards\":[],\"projects\":[{\"name\":\"E-Commerce Web Application\",\"description\":\"A web-based application for online shopping and business management using Java Spring Boot, ReactJS, MoMo API, MySQL.\",\"technologies\":\"Java Spring Boot, ReactJS, MoMo API, MySQL\",\"role\":\"Developed backend APIs, integrated MoMo payments, managed product/order logic.\",\"url\":\"https://github.com/lotus0305/project-pbl6\"},{\"name\":\"Novel Recommendation\",\"description\":\"A web-based application for managing and suggesting novels to users using Express.js, Flask, MongoDB, ReactJS, and deep learning.\",\"technologies\":\"Express.js, Flask, MongoDB, ReactJS, Deep Learning (Python)\",\"role\":\"Built backend APIs with Express.js and Flask, designed and trained deep learning model for novel recommendation and search.\",\"url\":\"https://github.com/lotus0305/project-pbl7\"}]}','{\"score\":1.17,\"details\":{\"skill_score\":\"4/3\",\"cert_score\":\"1/1\",\"exp_score\":\"0/1\",\"exp_match\":0,\"exp_detail\":{\"cv_level\":\"Internship\",\"jd_required_levels\":[\"Senior\",\"Lead\"],\"match\":0},\"skills_detail\":[{\"cv_skill\":\"Java\",\"jd_skill\":\"Java\",\"match\":1,\"score\":1.0},{\"cv_skill\":\"Node.js\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.31},{\"cv_skill\":\"Java Spring Boot\",\"jd_skill\":\"Spring Boot\",\"match\":1,\"score\":0.88},{\"cv_skill\":\"MoMo API\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.16},{\"cv_skill\":\"MySQL\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.41},{\"cv_skill\":\"Thymeleaf\",\"jd_skill\":\"Spring Boot\",\"match\":0,\"score\":0.18},{\"cv_skill\":\"FastAPI\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.26},{\"cv_skill\":\"ReactJS\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.11},{\"cv_skill\":\"PostgreSQL\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.23},{\"cv_skill\":\"Detectron2\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.25},{\"cv_skill\":\"Python\",\"jd_skill\":\"Java\",\"match\":1,\"score\":0.63},{\"cv_skill\":\"C#\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.27},{\"cv_skill\":\"JavaScript\",\"jd_skill\":\"Java\",\"match\":1,\"score\":0.68},{\"cv_skill\":\"TypeScript\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.38},{\"cv_skill\":\"HTML\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.44},{\"cv_skill\":\"CSS\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.29},{\"cv_skill\":\"SQL Server\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.36},{\"cv_skill\":\"MongoDB\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.28},{\"cv_skill\":\"Github\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.33},{\"cv_skill\":\"Swagger\",\"jd_skill\":\"Spring Boot\",\"match\":0,\"score\":0.19},{\"cv_skill\":\"Postman\",\"jd_skill\":\"AWS\",\"match\":0,\"score\":0.22},{\"cv_skill\":\"Trello\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.29},{\"cv_skill\":\"Jira\",\"jd_skill\":\"Java\",\"match\":0,\"score\":0.32},{\"cv_skill\":\"Docker\",\"jd_skill\":\"Spring Boot\",\"match\":0,\"score\":0.36}],\"certs_detail\":[{\"jd_cert\":\"TOEIC\",\"cv_cert\":\"TOEIC\",\"jd_score\":\"600.0\",\"cv_score\":\"630.0\",\"match\":1}]}}',1.66667);
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
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
