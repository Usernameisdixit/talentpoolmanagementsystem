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

	@Query(value = "SELECT ad.intActivityAllocateDetId, ad.intActivityAllocateId, aa.intActivityId, aa.intActivityFor, aa.vchFromHours, aa.vchToHours, ad.intCreatedBy, ad.dtmCreatedOn, ad.intUpdatedBy, ad.dtmUpdatedOn, ad.bitDeletedFlag, ad.intResourceId "
			+ "FROM tbl_activity_allocation_details ad "
			+ "JOIN tbl_activity_allocation aa ON ad.intActivityAllocateId = aa.intActivityAllocateId WHERE ad.intActivityAllocateDetId = :activityAllocateDetId", nativeQuery = true)
    Map<String, Object> findAllDetails(@Param("activityAllocateDetId") Integer activityAllocateDetId);

	List<ActivityAllocationDetails> findByActivityAllocation(ActivityAllocation activityAllocation);
	
	

	
	@Query(value = "SELECT DISTINCT  act_alloc.activityId, act.activityName " +
            "FROM activity_allocation_details act_det " +
            "JOIN activity_allocation act_alloc ON act_det.activityAllocateId = act_alloc.activityAllocateId " +
            "JOIN activity act ON act_alloc.activityId = act.activityId " +
            "WHERE act_alloc.activityFromDate >= STR_TO_DATE(:fromDate, '%Y-%m-%d') " +
            "AND act_alloc.activityToDate <= STR_TO_DATE(:toDate, '%Y-%m-%d')", nativeQuery = true)

	List<Object[]> getActivitiesBetweenDates(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate);
	
	@Query(value="select alo.fromHours,alo.toHours,act.activityName,det.resourceId,res.resourceName,res.designation,res.platform,res.resourceCode,res.email "
			+"from activity_allocation_details det "
			+ "inner join activity_allocation alo on alo.activityAllocateId=det.activityAllocateId "
			+ "inner join activity act on act.activityId=alo.activityId "
			+ "inner join resource_pool res on res.resourceId=det.resourceId "
			+ "where activityFromDate =:formattedFromDate "
			+"and activityToDate =:formattedToDate "
			+"order by res.resourceName",nativeQuery=true)
	List<Map<String, Object>> getallocationDataForMail(String formattedFromDate, String formattedToDate);

 
	

}