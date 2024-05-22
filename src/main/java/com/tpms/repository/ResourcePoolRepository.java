package com.tpms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.dto.ResourcePoolProjection;
import com.tpms.entity.ResourcePool;

import jakarta.transaction.Transactional;

public interface ResourcePoolRepository extends JpaRepository<ResourcePool, Integer> {
	
	List<ResourcePool> findAll();

	Optional<ResourcePool> findById(Integer resourceId);

	List<ResourcePool> findByPlatform(String platform);
	
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
	
	@Query("FROM ResourcePool r WHERE r.resourceId=:id AND r.deletedFlag=0")
	ResourcePoolProjection findByIdWithoutRelatedEntity(Integer id);
	
	@Query("FROM ResourcePool r WHERE r.deletedFlag=0")
	List<ResourcePoolProjection> findAllWithoutRelatedEntity();

    Page<ResourcePool> findByDeletedFlagFalse(Pageable pageable);
	 
	 @Query(value="select COUNT(*) from resource_pool_history where allocationDate= :allocationDate and deletedFlag=0 ",nativeQuery = true)
	 Integer findAllActiveResource(String allocationDate);
	 

	 @Query(value = "SELECT DISTINCT designation FROM resource_pool", nativeQuery = true)
	List<String> findDesignationData();

	 @Query(value = "SELECT DISTINCT location FROM resource_pool", nativeQuery = true)
	List<String> findLocationData();

	@Query("SELECT r FROM ResourcePool r WHERE r.designation = :designation OR r.location = :location OR r.platform = :platform")
	List<ResourcePool> getFilterData(String designation, String location, String platform);

	@Query(value = """
			SELECT * FROM resource_pool
			WHERE deletedFlag = 0
			AND (designation = IF(:designation = '', designation,  :designation))
			AND (platform = IF(:platform = '', platform,:platform))
			AND (location = IF(:location = '', location, :location));
			""", nativeQuery = true)
	Page<ResourcePool> getsearchFilterData(String designation, String location, String platform, Pageable pageable);
	 
	 
	 

}
