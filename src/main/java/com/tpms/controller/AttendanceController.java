package com.tpms.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.entity.Platform;
import com.tpms.service.AttendanceService;

@RestController
@CrossOrigin("*")

public class AttendanceController {
	
	@Autowired
	private AttendanceService attendanceService;

	@GetMapping("attendance")
	public String getDetailsByPlatformId(@RequestParam String platformName, @RequestParam String selectedDate) {
		JSONArray allDetails = attendanceService.getAllDetails(platformName, selectedDate);
		return allDetails.toString();
	}

	@GetMapping("getplatform")
	public ResponseEntity<List<Platform>> getPlatform() {
		List<Platform> platformDetails = attendanceService.getAllPlatform();
		return new ResponseEntity<>(platformDetails, HttpStatus.OK);
	}

	@PostMapping("submitAttendance")
	public ResponseEntity<Map<String, Object>> saveAttendance(@RequestBody String data,
			@RequestParam(name = "selectedDate") String selectedDate) {
		Map<String, Object> response = new HashMap<>();
		try {
			JSONArray allData = new JSONArray(data);
			String result=attendanceService.saveAttendance(allData, selectedDate);
//			System.err.println("suraj "+result);
			if(result=="success") {
			response.put("status", 200);
			response.put("success", "Attendance Save Succesfully");
			}else {
				response.put("Error", "Error");
			}
		} catch (JSONException e) {
			e.printStackTrace();
			response.put("Error", "Error");
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
   
	
	@PostMapping("pdfData")
	public String getAttendanceReportData(@RequestBody Map<String, String> params) {
	    String year = params.get("year");
	    String month = params.get("month");
	    String platform = params.get("platform");
	    String selectedDate = params.get("selectedDate");
	    JSONArray attendanceReportData = attendanceService.getAttendanceReportData(platform, selectedDate,year,month);
//	    System.err.println("Report Data " + attendanceReportData);
	    return attendanceReportData.toString();
	}

}
