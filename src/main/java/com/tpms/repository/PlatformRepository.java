package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tpms.entity.Platform;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, Integer> {
	
	 @Query(value = "SELECT * FROM platforms", nativeQuery = true)
	    List<Platform> getAllPlatform();
}
