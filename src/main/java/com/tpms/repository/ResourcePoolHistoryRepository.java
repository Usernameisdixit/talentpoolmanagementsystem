package com.tpms.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.ResourcePoolHistory;

public interface ResourcePoolHistoryRepository extends JpaRepository<ResourcePoolHistory, Integer> {

	/*@Query(value = "select distinct resourceCode, resourceName,  min(allocationDate), max(allocationDate) from ResourcePoolHistory  group by resourceCode, resourceName order by resourceName")
	public List<ResourcePoolHistoryDto> MinMaxAllocationDate();*/
	
	@Query(value = "SELECT resourceCode, resourceName, " +
            "allocationDate AS minAllocationDate, " +
            "DATE_FORMAT(NOW(), '%Y-%m-%d') AS maxAllocationDate " +
            "FROM resource_pool ", nativeQuery = true)
		List<Object[]> MinMaxAllocationDate();

	List<ResourcePoolHistory> findByAllocationDate(LocalDate allocationDate);

	void deleteByAllocationDate(LocalDate allocationDate);

	 @Query(value = "SELECT r.resourceHistoryId, r.resourceName, r.resourceCode, r.designation, " +
	            "r.platform, r.location, r.engagementPlan, r.experience, r.allocationDate AS resourceAllocationDate, " +
	            "e.allocationDate AS excelAllocationDate, r.phoneNo, r.email, e.fileName " +
	            "FROM resource_pool_history r " +
	            "LEFT JOIN excel_upload_history e ON r.allocationDate = e.allocationDate " +
	            "WHERE r.deletedFlag =0 AND e.deletedFlag=0 ", nativeQuery = true)
	 		List<Object[]> getResourceDetailsWithFileNameR();
	
	 		@Query(value = "SELECT resourceName, resourceCode, allocationDate " +
	                "FROM resource_pool_history " +
	                "WHERE resourceCode = :resourceCode " +
	                "ORDER BY allocationDate", nativeQuery = true)
	 List<Object[]> getAllResourceByCode(@Param("resourceCode") String resourceCode);

			List<ResourcePoolHistory> findByResourceName(String resourceName);

	
	
}
