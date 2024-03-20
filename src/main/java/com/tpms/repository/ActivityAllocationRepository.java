package com.tpms.repository;


import java.util.Date;
import java.util.List;
import java.util.Map;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.ActivityAllocation;




public interface ActivityAllocationRepository extends JpaRepository<ActivityAllocation, Long> {

	
	@Query(value = "SELECT ad.intActivityAllocateDetId, ad.intActivityAllocateId, ad.intActivityId, ad.intActivityFor, ad.vchFromHours, ad.vchToHours, ad.txtActivityDetails, ad.intCreatedBy, ad.dtmCreatedOn, ad.intUpdatedBy, ad.dtmUpdatedOn, ad.bitDeletedFlag, aa.intResourceId "
			+ "FROM tbl_activity_allocation_details ad "
			+ "JOIN tbl_activity_allocation aa ON ad.intActivityAllocateId = aa.intActivityAllocateId WHERE ad.intActivityAllocateDetId = :activityAllocateDetId", nativeQuery = true)
	Map<String, Object> findAllDetails(@Param("activityAllocateDetId") Integer activityAllocateDetId);
	 

	List<ActivityAllocation> findByPlatformIdAndActivityDateBetweenAndDeletedFlagIsFalse(Long platformId, Date fromDate, Date toDate);

	
	@Query("SELECT alloc FROM ActivityAllocation alloc JOIN FETCH alloc.details det WHERE alloc.resourceId=:id AND alloc.activityDate=:activityDate AND alloc.deletedFlag=false and det.deletedFlag=false")
	ActivityAllocation findByResourceId(Integer id, Date activityDate);



}