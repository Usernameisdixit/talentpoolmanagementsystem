package com.tpms.repository;

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
	
}