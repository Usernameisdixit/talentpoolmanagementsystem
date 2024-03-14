package com.tpms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tpms.entity.ResourcePool;

public interface ResourcePoolRepository extends JpaRepository<ResourcePool, Integer> {
	
	List<ResourcePool> findAll();

	Optional<ResourcePool> findById(Integer resourceId);

	List<ResourcePool> findByPlatform(String platform);

	@Query("FROM ResourcePool r JOIN FETCH r.activityAlloc a JOIN FETCH a.details d WHERE r.deletedFlag=0 AND a.deletedFlag=false AND d.deletedFlag=false")
	List<ResourcePool> findAllActiveRecords();
	
	

	
}
