package com.tpms.repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {


	@Query(value = "SELECT  distinct r.resourceName, r.platform, ac.activityName, a.doubleActivityMark, a.doubleSecuredMark, a.remark,a.asesmentId,a.activityFromDate,a.activityToDate,a.asesmentDate FROM assessment a " +
	        "JOIN resource_pool r ON a.resourceId = r.resourceId " +
	        "JOIN activity ac ON a.activityId = ac.activityId " + " WHERE a.deletedFlag = 0", nativeQuery = true)
	List<Object[]> findAllWithDetails();
	
	@Query(value = "SELECT r.resourceName, r.platform, ac.activityName, a.doubleActivityMark, a.doubleSecuredMark, a.remark " +
		    "FROM assessment a " +
		    "JOIN resource_pool r ON a.resourceId = r.resourceId " +
		    "JOIN activity ac ON a.activityId = ac.activityId " +
		    "WHERE YEAR(a.asesmentDate) = :year AND MONTH(a.asesmentDate) = :month AND DATE(a.asesmentDate) = :date " +
		    "AND r.platform = :platform", nativeQuery = true)
		List<Object[]> findReportDetails(@Param("year") int year, @Param("month") int month, @Param("date") LocalDate date, @Param("platform") String platform);

		@Query(value = "SELECT r.resourceName, r.platform, ac.activityName, a.doubleActivityMark, a.doubleSecuredMark, a.remark, a.asesmentId " +
	               "FROM assessment a " +
	               "JOIN resource_pool r ON a.resourceId = r.resourceId " +
	               "JOIN activity ac ON a.activityId = ac.activityId " +
	               "WHERE a.asesmentId = :assessmentId", nativeQuery = true)
	List<Object[]> findDetailsByAssessmentId(@Param("assessmentId") Integer assessmentId);

		Assessment findByAsesmentId(Integer id);
		
		  @Query(value = "SELECT r.resourceName, r.platform, ac.activityName, a.doubleActivityMark, " +
                  "a.doubleSecuredMark, a.remark, a.asesmentId, a.activityFromDate, " +
                  "a.activityToDate, a.asesmentDate " +
                  "FROM assessment a " +
                  "JOIN resource_pool r ON a.resourceId = r.resourceId " +
                  "JOIN activity ac ON a.activityId = ac.activityId " +
                  "WHERE a.deletedFlag = 0 " +
                  "AND a.asesmentDate = :asesmentDate " , nativeQuery = true)
		  List<Object[]> findAllWithDetailsByYearAndMonth(@Param("asesmentDate") Date asesmentDate);
		  
		  
		  
		  @Query(value = "SELECT distinct a.asesmentDate " +
                  "FROM assessment a " +
                  "WHERE a.deletedFlag = 0 " , nativeQuery = true)	  
		  List<Date> findAllAsessmentDate();

		  
		  
		  @Query("SELECT DISTINCT DATE(a.activityFromDate) AS maxFromDate, DATE(a.activityToDate) AS maxToDate " +
			       "FROM ActivityAllocation a " +
			       "WHERE a.deletedFlag = false " +
			       "ORDER BY maxFromDate DESC, maxToDate DESC")
			List<Map<String, Date>> getFromToDate();


		    @Query("SELECT COUNT(a) > 0 FROM Assessment a WHERE a.activityId = :activityId AND a.activityFromDate >= :fromDate AND a.activityToDate <= :toDate")
		    boolean existsByActivityIdAndDateRange(@Param("activityId") Integer activityId, @Param("fromDate") Date fromDate, @Param("toDate") Date toDate);


		    @Query("SELECT a FROM Assessment a WHERE DATE(a.asesmentDate) = DATE(:assessmentDate)")
		    Page<Assessment> findByAssessmentDate(@Param("assessmentDate") Date assessmentDate, Pageable pageable);
		    

}
