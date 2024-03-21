package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.Activity;

import jakarta.transaction.Transactional;

public interface ActivityRepository extends JpaRepository<Activity, Integer> {

	
	@Modifying
    @Transactional
    @Query("UPDATE Activity a SET a.deletedFlag = :deletedFlag WHERE a.activityId = :activityId")
    void updateDeletedFlag(@Param("activityId") Integer activityId, @Param("deletedFlag") boolean deletedFlag);
	
	@Query(value="SELECT distinct a.* FROM activity a " +
	           "INNER JOIN activity_allocation_details aloDetails ON a.activityId = aloDetails.activityId " +
	           "INNER JOIN activity_allocation allocation ON allocation.activityAllocateId = aloDetails.activityAllocateId " +
	           "WHERE allocation.activityDate = :selectedDate",nativeQuery = true)
	List<Activity> getActvitiesByDate(String selectedDate);
	
}