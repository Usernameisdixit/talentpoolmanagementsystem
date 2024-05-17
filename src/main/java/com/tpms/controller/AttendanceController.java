package com.tpms.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.entity.Platform;
import com.tpms.service.AttendanceService;

@RestController
@CrossOrigin("*")

public class AttendanceController {
	
	private static final String ERROR = "Error";
	
	private final AttendanceService attendanceService;
	
	public AttendanceController(AttendanceService attendanceService) {
		this.attendanceService=attendanceService;
	}

	@GetMapping("attDataByActivity")
	public String attendDetailsByActivity(@RequestParam Integer selectedActivity, @RequestParam String selectedDate) {
		JSONArray allDetails = attendanceService.attendDetailsByActivity(selectedActivity, selectedDate);
		return allDetails.toString();
	}
	
	
	@GetMapping("getplatform")
	public ResponseEntity<List<Platform>> getPlatform() {
		List<Platform> platformDetails = attendanceService.getAllPlatform();
		return new ResponseEntity<>(platformDetails, HttpStatus.OK);
	}

	@PostMapping("saveAttendanceByActivity")
	public ResponseEntity<Map<String, Object>> saveAttendanceByActivity(@RequestBody String data,
			@RequestParam(name = "selectedDate") String selectedDate) {
		Map<String, Object> response = new HashMap<>();
		try {
			JSONArray allData = new JSONArray(data);
			String result=attendanceService.saveAttendanceByActivity(allData, selectedDate);
			if("success".equals(result)) {
			response.put("status", 200);
			response.put("success", "Attendance Save Succesfully");
			}else {
				response.put(ERROR, ERROR);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			response.put(ERROR, ERROR);
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	@GetMapping("allResourceName")
	public List<String> allResName(@RequestParam String value){
		return attendanceService.getAllNames(value);
		
	}
	
	@GetMapping("activityByDate")
	public List<Map<String,Object>> activityById(@RequestParam String selectedDate) {
		return attendanceService.getActvitiesByDate(selectedDate);
	}

}
