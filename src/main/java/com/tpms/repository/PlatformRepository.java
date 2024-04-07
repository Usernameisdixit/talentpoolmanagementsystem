package com.tpms.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tpms.entity.Platform;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, Integer> {
	
	Platform findByPlatform(String platform);
	
	 @Query(value = "SELECT * FROM platforms where deletedFlag=0", nativeQuery = true)
	    List<Platform> getAllPlatform();

	 /**
	  * @return List of active platforms
	  */
	 List<Platform> findByDeletedFlagFalse();

     @Query(value = "SELECT distinct platformId FROM platforms where deletedFlag=0 and platform=:platformName", nativeQuery = true)
	 Integer findPlatformIdByPlatform(String platformName);
		 
	@Transactional
	@Modifying
	@Query(value = "update platforms set deletedFlag=:deletedFlag where platformId=:platformId",nativeQuery = true)
	void deletePlatform(Integer platformId,Boolean deletedFlag);
	
	@Query(value = "select count(1) from platforms where platform=:platformName",nativeQuery = true)
	Integer getDuplicateProgramNameCount(String platformName);
	
	@Query(value = "select count(1) from platforms where platformCode=:platformCode",nativeQuery = true)
	Integer getDuplicateProgramCodeCount(String platformCode);

	
}
