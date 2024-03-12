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
	
	@Query(value = "select r.*, exists(select resourceId from activity_allocation where resourceId=r.resourceId) as isAllocatedActivity from resource_pool r where r.deletedFlag=0", nativeQuery = true)
	List<ResourcePool> findAllWithAlloc();

	
}
