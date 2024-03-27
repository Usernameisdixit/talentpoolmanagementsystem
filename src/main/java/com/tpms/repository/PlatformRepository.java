package com.tpms.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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

	
}
