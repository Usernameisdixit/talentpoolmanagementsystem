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
	 

	@Query(value = "SELECT DISTINCT " +
            "    a.activityAllocateId, " +
            "    r.resourceId, " +
            "    r.resourceCode, " +
            "    r.resourceName, " +
            "    p.platform, " +
            "    r.designation, " +
            "    r.experience, " +
            "    act.activityName, " +
            "    asmt.doubleActivityMark AS assessmentDoubleActivityMark, " +
            "    asmt.doubleSecuredMark AS assessmentDoubleSecuredMark, " +
            "    asmt.asesmentHours AS assessmentHours, " +
            "    asmt.asesmentDate AS assessmentDate, " +
            "    asmt.remark AS assessmentRemark " +
            "FROM " +
            "    activity_allocation a " +
            "INNER JOIN " +
            "    activity_allocation_details aa ON a.activityAllocateId = aa.activityAllocateId " +
            "INNER JOIN " +
            "    resource_pool r ON r.resourceId = a.resourceId " +
            "INNER JOIN " +
            "    activity act ON act.activityId = aa.activityId " +
            "INNER JOIN " +
            "    assessment asmt ON asmt.activityId = act.activityId AND asmt.resourceId = r.resourceId " +
            "LEFT JOIN " +
            "    platforms p ON p.platformId = a.platformId " +
            "WHERE " +
            "    aa.activityId = :activityId " +
            "    AND a.activityFromDate >= :fromDate " +
            "    AND a.activityToDate <= :toDate", nativeQuery = true)
		List<Object[]> getAssessmentDetails(Integer activityId, Date fromDate, Date toDate);
		
		
	
	@Query(value = "SELECT DISTINCT a.activityAllocateId, r.resourceId, r.resourceCode, r.resourceName,  p.platform ,r.designation, r.experience, act.activityName " +
            "FROM activity_allocation a " +
            "INNER JOIN activity_allocation_details aa ON a.activityAllocateId = aa.activityAllocateId " +
            "INNER JOIN resource_pool r ON r.resourceId = a.resourceId " +
            "INNER JOIN activity act ON act.activityId = aa.activityId " +
            "LEFT JOIN platforms p ON p.platformId = a.platformId " +
            "WHERE a.activityId = :activityId " +
            "AND a.activityFromDate >= :fromDate AND a.activityToDate <= :toDate", nativeQuery = true)
List<Object[]> getActivityDetails(Integer activityId, Date fromDate, Date toDate);


	
	@Query("SELECT alloc FROM ActivityAllocation alloc JOIN FETCH alloc.details det WHERE alloc.details.resourceId=:id AND alloc.activityFromDate=:activityDate AND alloc.deletedFlag=false and det.deletedFlag=false")
	ActivityAllocation findByResourceId(Integer id, Date activityDate);

	 @Query(value = "SELECT DISTINCT CONCAT(DATE_FORMAT(activityFromDate, '%d-%m-%Y'), ' to ', DATE_FORMAT(activityToDate, '%d-%m-%Y')) AS dates " +
             "FROM activity_allocation " +
             "WHERE MONTH(activityFromDate) = :month AND YEAR(activityFromDate) = :year", nativeQuery = true)
	List<String> getAllDistinctDateRange(String year, String month);


	@Query("SELECT alloc.details FROM ActivityAllocation alloc WHERE alloc.activityFromDate=:activityFromDate AND alloc.activityToDate=:activityToDate AND alloc.deletedFlag=false")
	List<ActivityAllocationDetails> fetchDataByDateRange(Date activityFromDate, Date activityToDate);

}
