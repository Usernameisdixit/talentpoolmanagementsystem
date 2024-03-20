package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tpms.dto.ResourcePoolHistoryDto;
import com.tpms.entity.ResourcePoolHistory;

public interface ResourcePoolHistoryRepository extends JpaRepository<ResourcePoolHistory, Integer> {

	/*@Query(value = "select distinct resourceCode, resourceName,  min(allocationDate), max(allocationDate) from ResourcePoolHistory  group by resourceCode, resourceName order by resourceName")
	public List<ResourcePoolHistoryDto> MinMaxAllocationDate();*/
	
	@Query(value = "select distinct resourceCode, resourceName,  min(allocationDate), max(allocationDate) from resource_pool_history  group by resourceCode, resourceName order by resourceName", nativeQuery = true)
	public List<Object[]> MinMaxAllocationDate();
	
	
}
