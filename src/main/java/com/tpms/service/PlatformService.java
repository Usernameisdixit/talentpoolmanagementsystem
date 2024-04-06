package com.tpms.service;

import java.util.List;

import com.tpms.dto.PlatformDto;
import com.tpms.entity.Platform;

public interface PlatformService {
	
	Platform savePlatform(PlatformDto platform);
	
	List<Platform> getPlatformDetails();
	
	PlatformDto getPlatformById(Integer platformId);

	void deletePlatformById(Integer intPlatformId, Boolean deletedFlag);

	String getStatusOfDuplicacyCheck(String value, String colName);

}
