package com.tpms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpms.dto.PlatformDto;
import com.tpms.entity.Platform;
import com.tpms.exception.ResourceNotFoundException;
import com.tpms.repository.PlatformRepository;
import com.tpms.service.PlatformService;

@Service
public class PlatformServiceImpl implements PlatformService {
	
	@Autowired
	private PlatformRepository platformRepository;

	@Override
	public Platform savePlatform(PlatformDto platform) {
		Platform u1 = new Platform();
		u1.setPlatform(platform.getPlatform());
		u1.setPlatformCode(platform.getPlatformCode());
		u1.setCreatedBy(1);
		if(platform.getPlatformId() != 0) {
			u1.setPlatformId(platform.getPlatformId());
			u1.setUpdatedBy(1);
		}
		u1.setDeletedFlag((byte) 0);
		return platformRepository.save(u1);
	}

	@Override
	public List<Platform> getPlatformDetails() {
		return platformRepository.findAll();
	}

	@Override
	public PlatformDto getPlatformById(Integer platformId) {
		PlatformDto platform=new PlatformDto();
		Platform platform1= platformRepository.findById(platformId).orElseThrow(() -> new ResourceNotFoundException("Platform Not found with id = " + platformId));
		platform.setPlatform(platform1.getPlatform());
		platform.setPlatformCode(platform1.getPlatformCode());
		platform.setPlatformId(platform1.getPlatformId());
		platform.setDeletedFlag(false);
		return platform;
	}

	@Override
	public void deletePlatformById(Integer intPlatformId, Boolean deletedFlag) {
		try {
			platformRepository.deletePlatform(intPlatformId,deletedFlag);
		}catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public String getStatusOfDuplicacyCheck(String value, String colName) {
		Integer count=0;
		String result="not Exist";
		
        switch(colName) {
		   case "platform": {
			   count=platformRepository.countByPlatform(value);
			 
			   break;
		   }
		   case "platformCode":{
			   count=platformRepository.countByPlatformCode(value);
			 
			   break;
		   }
		  
		   default:{break;}
        }
        	
		if(count>=1)
			result="Exist";
		
		return result;
	}

	
}
