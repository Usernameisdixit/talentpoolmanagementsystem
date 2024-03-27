package com.tpms.repository;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.ActivityAllocationDetails;


public interface ActivityAllocationDetailsRepository extends JpaRepository<ActivityAllocationDetails, Integer> {

	@Query(value = "SELECT ad.intActivityAllocateDetId, ad.intActivityAllocateId, ad.intActivityId, ad.intActivityFor, ad.vchFromHours, ad.vchToHours, ad.txtActivityDetails, ad.intCreatedBy, ad.dtmCreatedOn, ad.intUpdatedBy, ad.dtmUpdatedOn, ad.bitDeletedFlag, aa.intResourceId "
			+ "FROM tbl_activity_allocation_details ad "
			+ "JOIN tbl_activity_allocation aa ON ad.intActivityAllocateId = aa.intActivityAllocateId WHERE ad.intActivityAllocateDetId = :activityAllocateDetId", nativeQuery = true)
    Map<String, Object> findAllDetails(@Param("activityAllocateDetId") Integer activityAllocateDetId);

	List<ActivityAllocationDetails> findByActivityAllocation(ActivityAllocation activityAllocation);
	
	
	@Query(value = "SELECT distinct act_det.activityId, act.activityName "
	        + "FROM activity_allocation_details act_det "
	        + "JOIN activity_allocation act_alloc ON act_det.activityAllocateId = act_alloc.activityAllocateId "
	        + "JOIN activity act ON act_det.activityId = act.activityId "
	        + "WHERE act_alloc.activityFromDate BETWEEN :fromDate AND :toDate", nativeQuery = true)
	List<Object[]> getActivitiesBetweenDates(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate);

 
	

}