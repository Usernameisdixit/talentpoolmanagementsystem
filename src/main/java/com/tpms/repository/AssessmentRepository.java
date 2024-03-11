package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tpms.entity.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {


	@Query(value = "SELECT  r.resourceName, r.platform, ac.activityName, a.doubleActivityMark, a.doubleSecuredMark, a.remark FROM assessment a " +
	        "JOIN resource_pool r ON a.resourceId = r.resourceId " +
	        "JOIN activity ac ON a.activityId = ac.activityId", nativeQuery = true)
	List<Object[]> findAllWithDetails();



}
