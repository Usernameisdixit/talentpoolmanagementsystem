package com.tpms.repository;


import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.ActivityAllocationDetails;




public interface ActivityAllocationRepository extends JpaRepository<ActivityAllocation, Long> {

	
	@Query(value = "SELECT ad.intActivityAllocateDetId, ad.intActivityAllocateId, aa.intActivityId, aa.intActivityFor, aa.vchFromHours, aa.vchToHours, ad.intCreatedBy, ad.dtmCreatedOn, ad.intUpdatedBy, ad.dtmUpdatedOn, ad.bitDeletedFlag, aa.intResourceId "
			+ "FROM tbl_activity_allocation_details ad "
			+ "JOIN tbl_activity_allocation aa ON ad.intActivityAllocateId = aa.intActivityAllocateId WHERE ad.intActivityAllocateDetId = :activityAllocateDetId", nativeQuery = true)
	Map<String, Object> findAllDetails(@Param("activityAllocateDetId") Integer activityAllocateDetId);
	 

	@Query(value = "SELECT DISTINCT asmt.asesmentId, r.resourceId,  r.resourceCode,  r.resourceName, r.platform, r.designation, " +
			 "r.experience, act.activityName,  asmt.doubleActivityMark AS assessmentDoubleActivityMark,  asmt.doubleSecuredMark AS assessmentDoubleSecuredMark, " +
			 "asmt.asesmentHours AS assessmentHours, asmt.asesmentDate AS assessmentDate, asmt.remark AS assessmentRemark " +
			 "FROM assessment asmt " +
			 "INNER JOIN resource_pool r ON r.resourceId=asmt.resourceId " +
			 "INNER JOIN activity act ON act.activityId=asmt.activityId " +
			 "WHERE asmt.activityId = :activityId AND asmt.activityFromDate=:fromDate " +
			 "AND asmt.activityToDate= :toDate order by resourceName asc", nativeQuery = true)
		List<Object[]> getAssessmentDetails(Integer activityId, Date fromDate, Date toDate);
		
		
	
	@Query(value = "SELECT DISTINCT a.activityAllocateId, r.resourceId, r.resourceCode, r.resourceName,  p.platform ,r.designation, r.experience, act.activityName " +
            "FROM activity_allocation a " +
            "INNER JOIN activity_allocation_details aa ON a.activityAllocateId = aa.activityAllocateId " +
            "INNER JOIN resource_pool r ON r.resourceId = aa.resourceId " +
            "INNER JOIN activity act ON act.activityId = a.activityId " +
            "LEFT JOIN platforms p ON p.platformId = aa.platformId " +
            "WHERE a.activityId = :activityId " +
            "AND a.activityFromDate >= :fromDate AND a.activityToDate <= :toDate order by resourceName asc", nativeQuery = true)
List<Object[]> getActivityDetails(Integer activityId, Date fromDate, Date toDate);


	
	@Query("SELECT alloc FROM ActivityAllocation alloc JOIN FETCH alloc.details det WHERE det.resourceId=:id AND alloc.activityFromDate=:activityDate AND alloc.deletedFlag=false and det.deletedFlag=false")
	ActivityAllocation findByResourceId(Integer id, Date activityDate);

	 @Query(value = "SELECT DISTINCT CONCAT(DATE_FORMAT(activityFromDate, '%d-%m-%Y'), ' to ', DATE_FORMAT(activityToDate, '%d-%m-%Y')) AS dates " +
             "FROM activity_allocation " +
             "WHERE MONTH(activityFromDate) = :month AND YEAR(activityFromDate) = :year", nativeQuery = true)
	List<String> getAllDistinctDateRange(String year, String month);


	List<ActivityAllocation> findByActivityFromDateAndActivityToDateAndDeletedFlagFalse(Date activityFromDate, Date activityToDate);
	
	List<ActivityAllocationDetails> findByActivityAllocateId(Long activityAllocateId);
	
	@Query(value = """
			SELECT resource.resourceName,resource.resourceCode,resource.platform,act.activityName FROM activity_allocation alloc
			INNER JOIN activity_allocation_details det ON alloc.activityAllocateId=det.activityAllocateId
			INNER JOIN resource_pool resource ON det.resourceId=resource.resourceId
			LEFT JOIN activity act ON alloc.activityId=act.activityId
			WHERE :toDate>=alloc.activityFromDate
			AND :fromDate<=alloc.activityToDate
			AND TIME_FORMAT(:toTime, '%H:%i')>TIME_FORMAT(alloc.fromHours, '%H:%i')
			AND TIME_FORMAT(:fromTime, '%H:%i')<TIME_FORMAT(alloc.toHours, '%H:%i')
			AND resource.resourceId IN :resourceIdList AND act.isProject=false""",
		nativeQuery = true)
	List<Map<String,String>> checkExistingResourcesByDateRange(List<Integer> resourceIdList, Date fromDate, Date toDate, String fromTime, String toTime);


	@Query(value = """
			SELECT COUNT(*) FROM activity_allocation alloc
			LEFT JOIN activity act ON alloc.activityId=act.activityId
			WHERE :toDate>=alloc.activityFromDate
			AND :fromDate<=alloc.activityToDate
			AND TIME_FORMAT(:toTime, '%H:%i')>TIME_FORMAT(alloc.fromHours, '%H:%i')
			AND TIME_FORMAT(:fromTime, '%H:%i')<TIME_FORMAT(alloc.toHours, '%H:%i')
			AND alloc.activityId=:activityId AND act.isProject=0""",
		nativeQuery = true)
	Integer countExistingActivityByDateRange(Integer activityId, Date fromDate, Date toDate,
			String fromTime, String toTime);
	
	@Query(value = """
			SELECT COUNT(*) FROM activity_allocation alloc
			LEFT JOIN activity act ON alloc.activityId=act.activityId
			WHERE :toDate>=alloc.activityFromDate AND :fromDate<=alloc.activityToDate
			AND alloc.activityId=:activityId AND alloc.activityFor=:activityFor""",
		nativeQuery = true)
	Integer countExistingActivityBySession(Integer activityId, Date fromDate, Date toDate,
			Byte activityFor);

	@Query(value = """
			SELECT EXISTS (SELECT * FROM activity_allocation alloc
			WHERE :toDate>=alloc.activityFromDate AND :fromDate<=alloc.activityToDate
			AND alloc.activityFor=3)""",
		nativeQuery = true)
	Byte isFullDayActivityPresent(Date fromDate, Date toDate);

}
