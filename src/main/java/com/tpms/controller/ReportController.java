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
import com.tpms.service.impl.ResourcePoolServiceImpl;

@RestController
@CrossOrigin("*")
public class ReportController {
	
	@Autowired
	private ReportService reportService;
	
	@Autowired
	private ResourcePoolServiceImpl resourcepoolserviceimpl;
	
	@GetMapping("getActivityOnFromTo")
	public List<Activity> getActivityInDateRange(@RequestParam String fromDate,@RequestParam String toDate) {
	    List<Activity> activityListOnDateRange = reportService.getAttendanceDataOnDateRang(fromDate,toDate);
	    return activityListOnDateRange;
	}
	
	@GetMapping("getActivityForAssesment")
	public List<Activity> getActivityInDateRangeForAssement(@RequestParam String fromDate,@RequestParam String toDate) {
	    List<Activity> activityListOnDateRange = reportService.getActivityOnDateRangForAssement(fromDate,toDate);
	    System.err.println(activityListOnDateRange);
	    return activityListOnDateRange;
	}
	
	
	@PostMapping("attedanceDataReport")
	public String getAttendanceDataReprt(@RequestBody Map<String, String> params) throws JsonProcessingException {
	    String reportType = params.get("reportType");
	    String fromDate = params.get("fromDate");
	    String toDate = params.get("toDate");
	    String activityId = params.get("activityId");
	    String resourceValue = params.get("resourceValue");
	    
	    JSONArray allDetails = reportService.getAttendanceDataSummary(reportType, fromDate,toDate,activityId,resourceValue);
    	return allDetails.toString();
    	
//	    ObjectMapper objectMapper = new ObjectMapper();
//	    if(reportType.equals("44356")) {
//	    List<Map<String, Object>> attendanceReportData = reportService.getAttendanceData(reportType, fromDate,toDate,activityId,resourceValue);
//	    return objectMapper.writeValueAsString(attendanceReportData);
//	    }
//	    else {
//	    	JSONArray allDetails = reportService.getAttendanceDataSummary(reportType, fromDate,toDate,activityId,resourceValue);
//	    	return allDetails.toString();
//	    }
	}
	
	
	/*Methode of Activity New Data Report*/
	
	@GetMapping("getActivityReportOnFromTo")
	public List<Activity> getActivityInDateRangeforActivityReort(@RequestParam String fromDate,@RequestParam String toDate) {
	    List<Activity> activityListOnDateRange = reportService.getActivityDataOnDateRang(fromDate,toDate);
	    return activityListOnDateRange;
	}
	
	@PostMapping("activitynewDataReport")
	public String getActivitynewDataReport(@RequestBody Map<String, String> params) throws JsonProcessingException {
	    String reportType = params.get("reportType");
	    String fromDate = params.get("fromDate");
	    String toDate = params.get("toDate");
	    String activityId = params.get("activityId");
	    String resourceValue = params.get("resourceValue");
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
	    String reportType = params.get("reportType");
	    String fromDate = params.get("fromDate");
	    String toDate = params.get("toDate");
	    String activityId = params.get("activityId");
	    String resourceValue = params.get("resourceValue");
	    
	   
    	
	    ObjectMapper objectMapper = new ObjectMapper();
	    List<Map<String, Object>> assesmentReportData = reportService.getAssesmentData(reportType, fromDate,toDate,activityId,resourceValue);
	    System.err.println(assesmentReportData);
	    return objectMapper.writeValueAsString(assesmentReportData);
	    
//	    if(reportType.equals("activity")) {
//	    List<Map<String, Object>> assesmentReportData = reportService.getAssesmentData(reportType, fromDate,toDate,activityId,resourceValue);
//	    System.err.println(assesmentReportData);
//	    return objectMapper.writeValueAsString(assesmentReportData);
//	    }else {
//	    	  List<Map<String, Object>> assesmentReportData = reportService.getAssesmentData(reportType, fromDate,toDate,activityId,resourceValue);
//	  	    System.err.println(assesmentReportData);
//	  	    return objectMapper.writeValueAsString(assesmentReportData);
//	    }
//	    else {
//	    	JSONArray allDetails = reportService.getAttendanceDataSummary(reportType, fromDate,toDate,activityId,resourceValue);
//	    	return allDetails.toString();
//	    }
	}
	
	
	//Resource Report Controller Methode
	
	@GetMapping("/emp/getResourceReportList")
	public PageResponse<ResourcePool> gettbl_resource_pool(@RequestParam(defaultValue = "1") Integer pageNumber){
			
	PageResponse<ResourcePool> resourceList=reportService.getAllEmployeResourceReport(pageNumber,10);
	 
	return resourceList;
	}
	
	// For getting ACtivities of Particular Resource
		@GetMapping("/emp/ractive")
		public ResponseEntity<?> getDurationDetails(@RequestParam("code") String resourceCode) throws JSONException {
			JSONObject details = reportService.getDetails(resourceCode);
			System.out.println(details);
			return ResponseEntity.ok(details.toString());

		}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
	
}
