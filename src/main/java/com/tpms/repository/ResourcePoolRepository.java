package com.tpms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



import com.tpms.entity.ResourcePool;

public interface ResourcePoolRepository extends JpaRepository<ResourcePool, Integer> {
	
	List<ResourcePool> findAll();

	Optional<ResourcePool> findById(Integer resourceId);
}
