package com.tpms.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {


	@Query(value = "SELECT  r.resourceName, r.platform, ac.activityName, a.doubleActivityMark, a.doubleSecuredMark, a.remark FROM assessment a " +
	        "JOIN resource_pool r ON a.resourceId = r.resourceId " +
	        "JOIN activity ac ON a.activityId = ac.activityId", nativeQuery = true)
	List<Object[]> findAllWithDetails();
	
	@Query(value = "SELECT r.resourceName, r.platform, ac.activityName, a.doubleActivityMark, a.doubleSecuredMark, a.remark " +
		    "FROM assessment a " +
		    "JOIN resource_pool r ON a.resourceId = r.resourceId " +
		    "JOIN activity ac ON a.activityId = ac.activityId " +
		    "WHERE YEAR(a.asesmentDate) = :year AND MONTH(a.asesmentDate) = :month AND DATE(a.asesmentDate) = :date " +
		    "AND r.platform = :platform", nativeQuery = true)
		List<Object[]> findReportDetails(@Param("year") int year, @Param("month") int month, @Param("date") LocalDate date, @Param("platform") String platform);



}
