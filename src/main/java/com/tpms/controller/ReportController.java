package com.tpms.controller;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tpms.dto.PageResponse;
import com.tpms.entity.Activity;
import com.tpms.entity.ResourcePool;
import com.tpms.service.ReportService;

@RestController
@CrossOrigin("*")
public class ReportController {
	
	private static final String RESOURCE_VALUE = "resourceValue";
	private static final String ACTIVITY_ID = "activityId";
	private static final String TO_DATE = "toDate";
	private static final String FROM_DATE = "fromDate";
	private static final String REPORT_TYPE = "reportType";
	@Autowired
	private ReportService reportService;
	
	
	@GetMapping("getActivityOnFromTo")
	public List<Activity> getActivityInDateRange(@RequestParam String fromDate,@RequestParam String toDate) {
	    return reportService.getAttendanceDataOnDateRang(fromDate,toDate);
	}
	
	@GetMapping("getActivityForAssesment")
	public List<Activity> getActivityInDateRangeForAssement(@RequestParam String fromDate,@RequestParam String toDate) {
	    return reportService.getActivityOnDateRangForAssement(fromDate,toDate);
	}
	
	
	@PostMapping("attedanceDataReport")
	public String getAttendanceDataReprt(@RequestBody Map<String, String> params) {
	    String reportType = params.get(REPORT_TYPE);
	    String fromDate = params.get(FROM_DATE);
	    String toDate = params.get(TO_DATE);
	    String activityId = params.get(ACTIVITY_ID);
	    String resourceValue = params.get(RESOURCE_VALUE);
	    
	    JSONArray allDetails = reportService.getAttendanceDataSummary(reportType, fromDate,toDate,activityId,resourceValue);
    	return allDetails.toString();
    	
	}
	
	
	/*Methode of Activity New Data Report*/
	
	@GetMapping("getActivityReportOnFromTo")
	public List<Activity> getActivityInDateRangeforActivityReort(@RequestParam String fromDate,@RequestParam String toDate) {
	    return reportService.getActivityDataOnDateRang(fromDate,toDate);
	}
	
	@PostMapping("activitynewDataReport")
	public String getActivitynewDataReport(@RequestBody Map<String, String> params) throws JsonProcessingException {
	    String reportType = params.get(REPORT_TYPE);
	    String fromDate = params.get(FROM_DATE);
	    String toDate = params.get(TO_DATE);
	    String activityId = params.get(ACTIVITY_ID);
	    String resourceValue = params.get(RESOURCE_VALUE);
	    ObjectMapper objectMapper = new ObjectMapper();
	    if(reportType.equals("activity")) {
	    List<Map<String, Object>> attendanceReportData = reportService.getActivitynewDataReport(reportType, fromDate,toDate,activityId,resourceValue);
	    return objectMapper.writeValueAsString(attendanceReportData);
	    }
	    else {
	    	List<Map<String, Object>> allDetails = reportService.getActivitynewReport(reportType, fromDate,toDate,activityId,resourceValue);
	    	return objectMapper.writeValueAsString(allDetails);
	    }
	}
	
	@PostMapping("assesmentReportData")
	public String getAssesmentReportData(@RequestBody Map<String, String> params) throws JsonProcessingException {
	    String reportType = params.get(REPORT_TYPE);
	    String fromDate = params.get(FROM_DATE);
	    String toDate = params.get(TO_DATE);
	    String activityId = params.get(ACTIVITY_ID);
	    String resourceValue = params.get(RESOURCE_VALUE);
	    
	   
    	
	    ObjectMapper objectMapper = new ObjectMapper();
	    List<Map<String, Object>> assesmentReportData = reportService.getAssesmentData(reportType, fromDate,toDate,activityId,resourceValue);
	    return objectMapper.writeValueAsString(assesmentReportData);
	    

	}
	
	
	//Resource Report Controller Methode
	
	@GetMapping("/emp/getResourceReportList")
	public PageResponse<ResourcePool> getTblResourcePool(@RequestParam(defaultValue = "1") Integer pageNumber){
			
	return reportService.getAllEmployeResourceReport(pageNumber,10);
	}
	
	// For getting ACtivities of Particular Resource
		@GetMapping("/emp/ractive")
		public ResponseEntity<?> getDurationDetails(@RequestParam("code") String resourceCode) throws JSONException {
			JSONObject details = reportService.getDetails(resourceCode);
			return ResponseEntity.ok(details.toString());

		}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
	
}
