-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 172.27.29.135    Database: tpms
-- ------------------------------------------------------
-- Server version	5.7.41-log

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
-- Table structure for table `activity`
--
-- use tpms
DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `activityId` int(11) NOT NULL AUTO_INCREMENT,
  `activityName` varchar(96) DEFAULT NULL,
  `description` varchar(248) DEFAULT NULL,
  `responsPerson1` varchar(96) DEFAULT NULL,
  `responsPerson2` varchar(96) DEFAULT NULL,
  `isAsesmentEnable` bit(1) DEFAULT b'0',
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  `isProject` bit(1) DEFAULT b'0',
  PRIMARY KEY (`activityId`),
  KEY `fk_activity_createdBy` (`createdBy`),
  KEY `fk_activity_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_activity_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_activity_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1,'Java 17','for java upskilling','Saroj Sir','',_binary '',NULL,'2024-05-30 14:27:37',NULL,NULL,_binary '\0',_binary '\0'),(2,'TPMS','Internal project','Bishnu Sir','',_binary '',NULL,'2024-05-30 14:28:25',NULL,NULL,_binary '\0',_binary '');
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_allocation`
--

DROP TABLE IF EXISTS `activity_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_allocation` (
  `activityAllocateId` int(11) NOT NULL AUTO_INCREMENT,
  `activityFromDate` date NOT NULL,
  `activityToDate` date NOT NULL,
  `activityId` int(4) DEFAULT NULL,
  `activityFor` int(4) DEFAULT NULL,
  `fromHours` varchar(8) DEFAULT NULL,
  `toHours` varchar(8) DEFAULT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`activityAllocateId`),
  KEY `fk_activity_allocation_activityId` (`activityId`),
  KEY `fk_activity_allocation_createdBy` (`createdBy`),
  KEY `fk_activity_allocation_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_activity_allocation_activityId` FOREIGN KEY (`activityId`) REFERENCES `activity` (`activityId`),
  CONSTRAINT `fk_activity_allocation_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_activity_allocation_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_allocation`
--

LOCK TABLES `activity_allocation` WRITE;
/*!40000 ALTER TABLE `activity_allocation` DISABLE KEYS */;
INSERT INTO `activity_allocation` VALUES (1,'2024-05-27','2024-05-31',1,1,'09:00','11:00',NULL,'2024-05-30 15:38:48',NULL,NULL,_binary '\0'),(2,'2024-05-27','2024-05-31',2,1,'09:00','13:00',NULL,'2024-05-30 15:42:52',NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `activity_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_allocation_details`
--

DROP TABLE IF EXISTS `activity_allocation_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_allocation_details` (
  `activityAllocateDetId` int(11) NOT NULL AUTO_INCREMENT,
  `activityAllocateId` int(4) DEFAULT NULL,
  `resourceId` int(4) DEFAULT NULL,
  `platformId` int(4) DEFAULT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`activityAllocateDetId`),
  KEY `fk_activity_allocation_details_activityAllocateId` (`activityAllocateId`),
  KEY `fk_activity_allocation_details_resourceId_idx` (`resourceId`),
  KEY `fk_activity_allocation_details_platformId` (`platformId`),
  KEY `fk_activity_allocation_details_createdBy` (`createdBy`),
  KEY `fk_activity_allocation_details_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_activity_allocation_details_activityAllocateId` FOREIGN KEY (`activityAllocateId`) REFERENCES `activity_allocation` (`activityAllocateId`),
  CONSTRAINT `fk_activity_allocation_details_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_activity_allocation_details_platformId` FOREIGN KEY (`platformId`) REFERENCES `platforms` (`platformId`),
  CONSTRAINT `fk_activity_allocation_details_resourceId` FOREIGN KEY (`resourceId`) REFERENCES `resource_pool` (`resourceId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_activity_allocation_details_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_allocation_details`
--

LOCK TABLES `activity_allocation_details` WRITE;
/*!40000 ALTER TABLE `activity_allocation_details` DISABLE KEYS */;
INSERT INTO `activity_allocation_details` VALUES (1,1,3,2,NULL,'2024-05-30 15:38:48',NULL,NULL,_binary '\0'),(2,1,4,2,NULL,'2024-05-30 15:38:48',NULL,NULL,_binary '\0'),(3,1,5,2,NULL,'2024-05-30 15:38:48',NULL,NULL,_binary '\0'),(4,1,6,2,NULL,'2024-05-30 15:38:48',NULL,NULL,_binary '\0'),(5,2,3,2,NULL,'2024-05-30 15:42:52',NULL,NULL,_binary '\0'),(6,2,4,2,NULL,'2024-05-30 15:42:52',NULL,NULL,_binary '\0'),(7,2,5,2,NULL,'2024-05-30 15:42:52',NULL,NULL,_binary '\0'),(8,2,6,2,NULL,'2024-05-30 15:42:52',NULL,NULL,_binary '\0'),(9,2,7,3,NULL,'2024-05-30 15:42:52',NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `activity_allocation_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment`
--

DROP TABLE IF EXISTS `assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment` (
  `asesmentId` int(11) NOT NULL AUTO_INCREMENT,
  `resourceId` int(4) DEFAULT NULL,
  `activityFromDate` date DEFAULT NULL,
  `activityToDate` date DEFAULT NULL,
  `asesmentDate` date DEFAULT NULL,
  `activityId` int(4) DEFAULT NULL,
  `doubleActivityMark` double(5,2) DEFAULT NULL,
  `doubleSecuredMark` double(5,2) DEFAULT NULL,
  `asesmentHours` double(5,2) DEFAULT NULL,
  `remark` varchar(248) DEFAULT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`asesmentId`),
  KEY `fk_assessment_details_resourceId` (`resourceId`),
  KEY `fk_assessment_details_activityId` (`activityId`),
  KEY `fk_assessment_details_createdBy` (`createdBy`),
  KEY `fk_Assessment_details_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_Assessment_details_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_assessment_details_activityId` FOREIGN KEY (`activityId`) REFERENCES `activity` (`activityId`),
  CONSTRAINT `fk_assessment_details_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_assessment_details_resourceId` FOREIGN KEY (`resourceId`) REFERENCES `resource_pool` (`resourceId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment`
--

LOCK TABLES `assessment` WRITE;
/*!40000 ALTER TABLE `assessment` DISABLE KEYS */;
INSERT INTO `assessment` VALUES (1,4,'2024-05-27','2024-05-31','2024-05-31',1,10.00,6.00,2.00,'ok',NULL,'2024-05-30 16:12:24',NULL,NULL,_binary '\0'),(2,3,'2024-05-27','2024-05-31','2024-05-31',1,10.00,6.00,2.00,'ok',NULL,'2024-05-30 16:12:24',NULL,NULL,_binary '\0'),(3,5,'2024-05-27','2024-05-31','2024-05-31',1,10.00,7.50,2.00,'ok',NULL,'2024-05-30 16:12:24',NULL,NULL,_binary '\0'),(4,6,'2024-05-27','2024-05-31','2024-05-31',1,10.00,6.50,2.00,'ok',NULL,'2024-05-30 16:12:24',NULL,NULL,_binary '\0'),(5,4,'2024-05-27','2024-05-31','2024-05-31',2,25.00,12.00,2.00,NULL,NULL,'2024-05-30 16:14:10',NULL,NULL,_binary '\0'),(6,3,'2024-05-27','2024-05-31','2024-05-31',2,25.00,14.50,2.00,NULL,NULL,'2024-05-30 16:14:10',NULL,NULL,_binary '\0'),(7,5,'2024-05-27','2024-05-31','2024-05-31',2,25.00,16.00,2.00,NULL,NULL,'2024-05-30 16:14:10',NULL,NULL,_binary '\0'),(8,7,'2024-05-27','2024-05-31','2024-05-31',2,25.00,18.50,2.00,NULL,NULL,'2024-05-30 16:14:10',NULL,NULL,_binary '\0'),(9,6,'2024-05-27','2024-05-31','2024-05-31',2,25.00,21.00,2.00,NULL,NULL,'2024-05-30 16:14:10',NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `atendanceId` int(11) NOT NULL AUTO_INCREMENT,
  `resourceId` int(4) DEFAULT NULL,
  `activityAllocateId` int(4) DEFAULT NULL,
  `activityAllocateDetId` int(4) DEFAULT NULL,
  `atendanceDate` datetime DEFAULT NULL,
  `atendanceFor` int(4) DEFAULT NULL,
  `isPresent` bit(1) DEFAULT b'0',
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`atendanceId`),
  KEY `fk_attendance_resourceId` (`resourceId`),
  KEY `fk_Attendance_ActivityAllocateId` (`activityAllocateId`),
  KEY `fk_attendance_activityAllocateDetId` (`activityAllocateDetId`),
  KEY `fk_Attendance_createdBy` (`createdBy`),
  KEY `fk_ttendance_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_Attendance_ActivityAllocateId` FOREIGN KEY (`activityAllocateId`) REFERENCES `activity_allocation` (`activityAllocateId`),
  CONSTRAINT `fk_Attendance_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_attendance_activityAllocateDetId` FOREIGN KEY (`activityAllocateDetId`) REFERENCES `activity_allocation_details` (`activityAllocateDetId`),
  CONSTRAINT `fk_attendance_resourceId` FOREIGN KEY (`resourceId`) REFERENCES `resource_pool` (`resourceId`),
  CONSTRAINT `fk_ttendance_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,4,1,2,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 15:52:07',1,NULL,NULL),(2,3,1,1,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 15:52:07',1,NULL,NULL),(3,5,1,3,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 15:52:07',1,NULL,NULL),(4,6,1,4,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 15:52:07',1,NULL,NULL),(5,4,1,2,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 15:52:20',1,NULL,NULL),(6,3,1,1,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 15:52:20',1,NULL,NULL),(7,5,1,3,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 15:52:20',1,NULL,NULL),(8,6,1,4,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 15:52:20',1,NULL,NULL),(9,4,1,2,'2024-05-29 00:00:00',1,_binary '',1,'2024-05-30 16:05:54',1,NULL,NULL),(10,3,1,1,'2024-05-29 00:00:00',1,_binary '',1,'2024-05-30 16:05:54',1,NULL,NULL),(11,5,1,3,'2024-05-29 00:00:00',1,_binary '',1,'2024-05-30 16:05:54',1,NULL,NULL),(12,6,1,4,'2024-05-29 00:00:00',1,_binary '\0',1,'2024-05-30 16:05:54',1,NULL,NULL),(13,4,1,2,'2024-05-30 00:00:00',1,_binary '',1,'2024-05-30 16:06:08',1,NULL,NULL),(14,3,1,1,'2024-05-30 00:00:00',1,_binary '\0',1,'2024-05-30 16:06:08',1,NULL,NULL),(15,5,1,3,'2024-05-30 00:00:00',1,_binary '',1,'2024-05-30 16:06:08',1,NULL,NULL),(16,6,1,4,'2024-05-30 00:00:00',1,_binary '',1,'2024-05-30 16:06:08',1,NULL,NULL),(17,4,2,6,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 16:06:33',1,NULL,NULL),(18,3,2,5,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 16:06:33',1,NULL,NULL),(19,5,2,7,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 16:06:33',1,NULL,NULL),(20,7,2,9,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 16:06:33',1,NULL,NULL),(21,6,2,8,'2024-05-27 00:00:00',1,_binary '',1,'2024-05-30 16:06:33',1,NULL,NULL),(22,4,2,6,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 16:06:46',1,NULL,NULL),(23,3,2,5,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 16:06:46',1,NULL,NULL),(24,5,2,7,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 16:06:46',1,NULL,NULL),(25,7,2,9,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 16:06:46',1,NULL,NULL),(26,6,2,8,'2024-05-28 00:00:00',1,_binary '',1,'2024-05-30 16:06:46',1,NULL,NULL),(27,4,2,6,'2024-05-29 00:00:00',1,_binary '',1,'2024-05-30 16:07:26',1,NULL,NULL),(28,3,2,5,'2024-05-29 00:00:00',1,_binary '',1,'2024-05-30 16:07:26',1,NULL,NULL),(29,5,2,7,'2024-05-29 00:00:00',1,_binary '',1,'2024-05-30 16:07:26',1,NULL,NULL),(30,7,2,9,'2024-05-29 00:00:00',1,_binary '',1,'2024-05-30 16:07:26',1,NULL,NULL),(31,6,2,8,'2024-05-29 00:00:00',1,_binary '\0',1,'2024-05-30 16:07:26',1,NULL,NULL),(32,4,2,6,'2024-05-30 00:00:00',1,_binary '',1,'2024-05-30 16:07:46',1,NULL,NULL),(33,3,2,5,'2024-05-30 00:00:00',1,_binary '\0',1,'2024-05-30 16:07:46',1,NULL,NULL),(34,5,2,7,'2024-05-30 00:00:00',1,_binary '',1,'2024-05-30 16:07:46',1,NULL,NULL),(35,7,2,9,'2024-05-30 00:00:00',1,_binary '',1,'2024-05-30 16:07:46',1,NULL,NULL),(36,6,2,8,'2024-05-30 00:00:00',1,_binary '',1,'2024-05-30 16:07:46',1,NULL,NULL);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `communication_content_type`
--

DROP TABLE IF EXISTS `communication_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `communication_content_type` (
  `commTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `commType` varchar(45) DEFAULT NULL,
  `contents` text,
  `subject` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`commTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communication_content_type`
--

LOCK TABLES `communication_content_type` WRITE;
/*!40000 ALTER TABLE `communication_content_type` DISABLE KEYS */;
INSERT INTO `communication_content_type` VALUES (4,'Allocation','<p>Dear All,</p><p>As per departmental protocol, all&nbsp;talent&nbsp;pool&nbsp;resources stationed at Bhubaneswar must present from&nbsp;<strong>dateinput</strong>&nbsp;onwards physically at the 4th floor, OCAC Tower, for an up-skilling/engagement program. Attendance is mandatory for all resources, and failure will be marked as an absence.</p><p>Additionally, it\'s important to inform you that if you are absent for three consecutive days without prior notice, this information will be shared with the HR department.</p><p>*<strong>Those who are not located in Bhubaneswar city, please connect with your mentor.</strong></p><p><strong>PFA For Weekly engagement planner&nbsp;</strong>','Weekly Engagement planner for talent pool resources'),(5,'Attendance','Dear Sir/Madam,<br> Please find an attachment for the attendance details report of the talent pool resources for the period fromdate to todate.','Attendance Details For Talent Pool Resources'),(6,'Assesment',NULL,NULL);
/*!40000 ALTER TABLE `communication_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `excel_upload_history`
--

DROP TABLE IF EXISTS `excel_upload_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `excel_upload_history` (
  `excelFileId` int(11) NOT NULL AUTO_INCREMENT,
  `fileName` varchar(96) DEFAULT NULL,
  `allocationDate` date NOT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`excelFileId`),
  KEY `fk_excel_upload_history_createdBy` (`createdBy`),
  KEY `fk_excel_upload_history_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_excel_upload_history_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_excel_upload_history_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `excel_upload_history`
--

LOCK TABLES `excel_upload_history` WRITE;
/*!40000 ALTER TABLE `excel_upload_history` DISABLE KEYS */;
INSERT INTO `excel_upload_history` VALUES (1,'Resource_File_27052024.xlsx','2024-05-27',1,'2024-05-30 15:38:18',NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `excel_upload_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platforms`
--

DROP TABLE IF EXISTS `platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platforms` (
  `platformId` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(24) NOT NULL,
  `platformCode` varchar(16) DEFAULT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`platformId`),
  KEY `fk_platforms_createdBy` (`createdBy`),
  KEY `fk_platforms_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_platforms_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_platforms_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platforms`
--

LOCK TABLES `platforms` WRITE;
/*!40000 ALTER TABLE `platforms` DISABLE KEYS */;
INSERT INTO `platforms` VALUES (1,'PHP','PH',1,'2024-05-30 12:11:20',NULL,NULL,_binary '\0'),(2,'JAVA','JA',1,'2024-05-30 12:11:20',NULL,NULL,_binary '\0'),(3,'Database Testing','Da',1,'2024-05-30 12:11:20',NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `platforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_pool`
--

DROP TABLE IF EXISTS `resource_pool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_pool` (
  `resourceId` int(11) NOT NULL AUTO_INCREMENT,
  `resourceName` varchar(104) DEFAULT NULL,
  `resourceCode` varchar(16) DEFAULT NULL,
  `designation` varchar(96) NOT NULL,
  `platform` varchar(48) DEFAULT NULL,
  `location` varchar(64) NOT NULL,
  `engagementPlan` varchar(96) DEFAULT NULL,
  `experience` varchar(8) DEFAULT NULL,
  `allocationDate` date NOT NULL,
  `phoneNo` varchar(16) DEFAULT NULL,
  `email` varchar(96) DEFAULT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`resourceId`),
  KEY `fk_resource_pool_createdBy` (`createdBy`),
  KEY `fk_resource_pool_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_resource_pool_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_resource_pool_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_pool`
--

LOCK TABLES `resource_pool` WRITE;
/*!40000 ALTER TABLE `resource_pool` DISABLE KEYS */;
INSERT INTO `resource_pool` VALUES (1,'Debesh Patnaik','01-3126','Software Engineer','PHP','Bhubaneswar','UP Skilling Program','1.3','2024-05-27','1234567890','debas@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(2,'Manish Kumar','01-3516','Programmer Analyst','PHP','Bhubaneswar','Standard Orientation Program','3.7','2024-05-27','1234567891','manis@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(3,'Mohammad Uvesh','15-3515','Programmer Analyst','JAVA','Delhi','Standard Orientation Program','4.11','2024-05-27','1234567892','uvvesh@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(4,'Lovenish','15-3328','Programmer','JAVA','Delhi','UP Skilling Program','7.1','2024-05-27','1234567893','lovenish@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(5,'Ratiranjan Jadav','01-2659','Software Engineer','JAVA','Bhubaneswar','UP Skilling Program','2.2','2024-05-27','1234567894','ratiranjan@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(6,'Suraj Kumar Khuntia','01-2811','Software Engineer','JAVA','Bhubaneswar','UP Skilling Program','1.11','2024-05-27','1234567895','suraj@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(7,'Rohit Kumar Sha','01-3426','Junior Software Engineer','Database Testing','Bhubaneswar','UP Skilling Program','0.5','2024-05-27','1234567896','rohit@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `resource_pool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_pool_history`
--

DROP TABLE IF EXISTS `resource_pool_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_pool_history` (
  `resourceHistoryId` int(11) NOT NULL AUTO_INCREMENT,
  `resourceName` varchar(104) DEFAULT NULL,
  `resourceCode` varchar(16) DEFAULT NULL,
  `designation` varchar(96) NOT NULL,
  `platform` varchar(48) DEFAULT NULL,
  `location` varchar(64) NOT NULL,
  `engagementPlan` varchar(96) DEFAULT NULL,
  `experience` varchar(8) DEFAULT NULL,
  `allocationDate` date NOT NULL,
  `phoneNo` varchar(16) DEFAULT NULL,
  `email` varchar(96) DEFAULT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`resourceHistoryId`),
  KEY `fk_Resource_pool_history_createdBy` (`createdBy`),
  KEY `fk_Resource_pool_history_updatedBy` (`updatedBy`),
  CONSTRAINT `fk_Resource_pool_history_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_Resource_pool_history_updatedBy` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_pool_history`
--

LOCK TABLES `resource_pool_history` WRITE;
/*!40000 ALTER TABLE `resource_pool_history` DISABLE KEYS */;
INSERT INTO `resource_pool_history` VALUES (1,'Debesh Patnaik','01-3126','Software Engineer','PHP','Bhubaneswar','UP Skilling Program','1.3','2024-05-27','1234567890','debas@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(2,'Manish Kumar','01-3516','Programmer Analyst','PHP','Bhubaneswar','Standard Orientation Program','3.7','2024-05-27','1234567891','manis@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(3,'Mohammad Uvesh','15-3515','Programmer Analyst','JAVA','Delhi','Standard Orientation Program','4.11','2024-05-27','1234567892','uvvesh@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(4,'Lovenish','15-3328','Programmer','JAVA','Delhi','UP Skilling Program','7.1','2024-05-27','1234567893','lovenish@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(5,'Ratiranjan Jadav','01-2659','Software Engineer','JAVA','Bhubaneswar','UP Skilling Program','2.2','2024-05-27','1234567894','ratiranjan@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(6,'Suraj Kumar Khuntia','01-2811','Software Engineer','JAVA','Bhubaneswar','UP Skilling Program','1.11','2024-05-27','1234567895','suraj@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0'),(7,'Rohit Kumar Sha','01-3426','Junior Software Engineer','Database Testing','Bhubaneswar','UP Skilling Program','0.5','2024-05-27','1234567896','rohit@gmail.com',NULL,'2024-05-30 15:38:18',NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `resource_pool_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `roleId` int(11) NOT NULL AUTO_INCREMENT,
  `roleName` varchar(16) DEFAULT NULL,
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Admin',1,'2024-03-05 16:19:55',1,'2024-03-20 10:21:19',_binary '\0'),(2,'RCM',1,'2024-03-05 16:19:55',NULL,'2024-03-22 11:53:59',_binary '\0'),(3,'L&K',1,'2024-03-05 16:19:55',NULL,'2024-03-22 11:53:59',_binary '\0'),(4,'User',1,'2024-03-21 09:50:44',NULL,'2024-03-21 09:51:12',_binary '\0');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userFullName` varchar(64) DEFAULT NULL,
  `userName` varchar(16) DEFAULT NULL,
  `password` varchar(104) DEFAULT NULL,
  `roleId` int(4) DEFAULT NULL,
  `phoneNo` varchar(16) DEFAULT NULL,
  `email` varchar(96) DEFAULT NULL,
  `isFirstLogin` bit(1) DEFAULT b'0',
  `createdBy` int(4) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` int(4) DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deletedFlag` bit(1) DEFAULT b'0',
  `signature` varchar(1005) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `fk_user_roleId` (`roleId`),
  CONSTRAINT `fk_user_roleId` FOREIGN KEY (`roleId`) REFERENCES `role` (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Manoj Singh','manoj','$2a$12$77eAVtQguUU6p0OWangJXOyx/yt6W1oWbamyi1zjZt1A8QobMfRm6',1,'9987666112','manojsingh@gmail.com',_binary '\0',1,'2024-03-22 11:56:13',NULL,'2024-05-17 11:14:22',_binary '\0','<p>With Regards,</p><p><strong>Manoj Ku Singh| Consultant&nbsp;</strong>(L&amp;K)</p><p>CSM Technologies Pvt. Ltd.&nbsp;<strong>(A CMMI ML5 Company)</strong></p><p><strong>A:</strong>&nbsp;Level-6, OCAC Tower, Bhubaneswar<strong>-</strong>13, Odisha, India</p><p><strong>Extn : </strong>5395&nbsp;<strong>M:</strong>&nbsp;+91&nbsp;9437943676,&nbsp;</p><p>Email id:&nbsp;<a href=\"mailto:Manoj.Singh@csm.co.in\">Manoj.Singh@csm.</a>tech</p><p><a href=\"http://www.csm.tech/\">www.csm.tech</a>&nbsp;<a href=\"https://www.facebook.com/CSMPL\">Facebook</a>&nbsp;|&nbsp;<a href=\"https://twitter.com/CSMTechnologies\">Twitter</a>&nbsp;|&nbsp;<a href=\"https://www.linkedin.com/in/csmtechnologies\">LinkedIn</a></p>'),(2,'Kiran','kiran@123','$2a$10$7UZJR0n/Tcpn7YhrUhdq/.1youX17/zm13jbXq.j5iTJdtNmcrE2u',2,'9987666113','kiran@gmail.com',_binary '',NULL,'2024-03-25 12:45:02',NULL,'2024-03-25 12:48:17',_binary '',NULL),(3,'Bilu Barber','bilei','$2a$10$TGVzPGXjlTx9sfvhULEibeEK5cPpSlvz89J7l5HzGwWNoGG0E25RO',3,'2323221323','chidananda.sutar@csm.tech',_binary '',1,'2024-04-24 17:00:23',NULL,'2024-05-13 15:30:16',_binary '\0',NULL),(4,'satyam Dixit','satyam','$2a$10$KrFjTFiVk3Y2KAdQ/eeq1ODjGJuLJ2MGeqMvq23u/C64zSbT42MKK',1,'9616714339','satyam@gmail.com',_binary '',1,'2024-05-08 13:12:29',NULL,'2024-05-08 13:17:50',_binary '',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-05 17:08:39
