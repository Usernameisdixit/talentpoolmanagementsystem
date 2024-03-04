package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tpms.entity.Platform;

public interface PlatformRepository extends JpaRepository<Platform, Integer> {
	
	 @Query(value = "SELECT * FROM tbl_mst_platforms", nativeQuery = true)
	    List<Platform> getAllPlatform();
}
