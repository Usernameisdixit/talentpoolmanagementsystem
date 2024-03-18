package com.tpms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.ResourcePool;

public interface ResourcePoolRepository extends JpaRepository<ResourcePool, Integer> {
	
	List<ResourcePool> findAll();

	Optional<ResourcePool> findById(Integer resourceId);

	List<ResourcePool> findByPlatform(String platform);

	@Query("FROM ResourcePool r JOIN FETCH r.activityAlloc a JOIN FETCH a.details d WHERE r.deletedFlag=0 AND a.deletedFlag=false AND d.deletedFlag=false")
	List<ResourcePool> findAllActiveRecords();
	
	
	@Query("SELECT r.deletedFlag FROM ResourcePool r WHERE r.resourceId = :id")
	Byte getDeletedFlagByRoleId(@Param("id") Integer id);

	@Modifying
	@Transactional
	@Query("UPDATE ResourcePool r SET r.deletedFlag = 1 WHERE r.resourceId = :id")
	void updateBitDeletedFlagById(@Param("id") Integer id);

	@Modifying
	@Transactional
	@Query("UPDATE ResourcePool r SET r.deletedFlag = 0 WHERE r.resourceId = :id")
	void updateBitDeletedFlagByFalse(Integer id);

	
}
