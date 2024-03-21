package com.tpms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpms.entity.ResourcePoolHistory;
import com.tpms.repository.ResourcePoolHistoryRepository;
import com.tpms.service.ResourcePoolReportService;

@Service
public class ResourcePoolReportServiceimpl implements ResourcePoolReportService {

	@Autowired
	private ResourcePoolHistoryRepository resourcePoolHistoryRepo;
	
	@Override
	public List<ResourcePoolHistory> getAllResourcePoolList() {
		  
		return resourcePoolHistoryRepo.findAll();
	}

}
