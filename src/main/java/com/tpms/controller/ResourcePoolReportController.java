package com.tpms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.entity.ResourcePoolHistory;
import com.tpms.service.ResourcePoolReportService;

@RestController
@CrossOrigin("*")
public class ResourcePoolReportController {
	
	@Autowired
	private ResourcePoolReportService resourcePoolReportService;
	
	@GetMapping("/getAllResource")
	public ResponseEntity<List<ResourcePoolHistory>> getResourceHistory(){
		
		
		List<ResourcePoolHistory> resourceList=resourcePoolReportService.getAllResourcePoolList();
		
		return ResponseEntity.ok().body(null);
	}
	
	

}
