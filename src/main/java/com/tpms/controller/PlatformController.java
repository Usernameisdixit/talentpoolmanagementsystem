package com.tpms.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.dto.PlatformDto;
import com.tpms.entity.Platform;
import com.tpms.service.PlatformService;

/**
 * 
 * @author lovenish.arora
 *
 */


@RestController
@CrossOrigin("*")

public class PlatformController {
	
	@Autowired
	private PlatformService platformService;
	
	@PostMapping("/addPlatform")
	public ResponseEntity<Platform> savePlatform(@RequestBody PlatformDto platform){
		Platform platformDetail=null;
		try {
		  platformDetail=platformService.savePlatform(platform);
		  
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} 
		
		return ResponseEntity.ok().body(platformDetail);
	}
	
	@GetMapping("/platformList")
	public ResponseEntity<List<Platform>> getPlatform(){
		
		List<Platform> platformList = platformService.getPlatformDetails();
		return ResponseEntity.ok().body(platformList);
	}
	
	@GetMapping("/getPlatformById/{id}")
	public ResponseEntity<PlatformDto> getStudentById(@PathVariable(name = "id") Integer platformId){
		PlatformDto platform=platformService.getPlatformById(platformId);
		return ResponseEntity.ok().body(platform);
	}
	
	@DeleteMapping("/deletePlatform/{platformId}/{deletedFlag}")
	public ResponseEntity<Map<String,Object>> deleteStudent(@PathVariable Integer platformId,@PathVariable Boolean deletedFlag){

		platformService.deletePlatformById(platformId,deletedFlag);
		Map<String, Object> response = new HashMap<>();
		response.put("Status" , 200);
		response.put("Deleted", "This Platform data is deleted.");
		return ResponseEntity.ok().body(response);
	}
	
	@GetMapping("/duplicateCheckForPlatform/{value}/{colName}")
	public ResponseEntity<String> checkDuplicatePlatform(@PathVariable(name="value") String value,
			@PathVariable(name="colName") String colName){
		
		String result=platformService.getStatusOfDuplicacyCheck(value,colName);
		
		return ResponseEntity.ok().body("{\"status\": \"" + result + "\"}");
	}
	

}
