package com.tpms.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.tpms.entity.Platform;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, Integer> {
	
	Platform findByPlatform(String platform);
}
