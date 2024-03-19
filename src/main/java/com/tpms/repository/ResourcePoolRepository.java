package com.tpms.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.ResourcePool;

import jakarta.transaction.Transactional;

public interface ResourcePoolRepository extends JpaRepository<ResourcePool, Integer> {
	
	List<ResourcePool> findAll();

	Optional<ResourcePool> findById(Integer resourceId);

	List<ResourcePool> findByPlatform(String platform);

	@Query("SELECT r FROM ResourcePool r"
			+ " LEFT JOIN r.activityAlloc a ON a.activityDate=:activityDate AND (a is null or a.deletedFlag=false)"
			+ " LEFT JOIN a.details d ON (d is null or d.deletedFlag=false)"
			+ " LEFT JOIN Platform p ON r.platform=p.platform"
			+ " WHERE r.deletedFlag=0"
			+ " AND p.platformId=:platformId")
	List<ResourcePool> findAllActiveRecords(Date activityDate, Integer platformId);
	
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
