package com.tpms.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tpms.dto.ResourcePoolProjection;
import com.tpms.entity.Activity;
import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ActivityRepository;
import com.tpms.service.ActivityService;
import com.tpms.service.impl.ActivityServiceImpl;

@CrossOrigin("*")
@RestController
public class ActivityController {

	@Autowired
	ActivityService activityService;

	@Autowired
	ActivityServiceImpl activityServiceImpl;
	
	@Autowired
	ActivityRepository activityRepository;

	@GetMapping("/get/activity")
	public List<Activity> getAllActivities() {
		return activityServiceImpl.getAllActivities();

	}

	@PostMapping("/save/activity")
	public Activity SaveActivity(@RequestBody Activity activity) {
		activity.setDeletedFlag(false);
		return activityServiceImpl.SaveActivity(activity);

	}

	@GetMapping("/get/activity/{activityId}")
	public Activity getActivityById(@PathVariable Integer activityId) {
		return activityServiceImpl.getActivityById(activityId);

	}

	@DeleteMapping("/delete/activity/{activityId}")
	public void deleteActivity(@PathVariable Integer activityId) {
		activityServiceImpl.deleteActivity(activityId);

	}

	@PutMapping("/update/activity")
	public Activity updateActivity(@RequestBody Activity activity) {
		return activityServiceImpl.updateActivity(activity);
	}

	@PutMapping("/update-deleted-flag/{activityId}")
	public void updateDeletedFlag(@PathVariable Integer activityId, @RequestParam Boolean deletedFlag) {
		activityServiceImpl.updateDeletedFlag(activityId, deletedFlag);
	}

	@PostMapping("activityReportData")
	public String getActivityReportData(@RequestBody Map<String, String> params) {
		String fromDate = params.get("fromDate");
		String toDate = params.get("toDate");
		String platform = params.get("platform");
		String resourceValue = params.get("resourceValue");
		if (resourceValue.equals("")) {
			resourceValue = "0";
		}
		if (resourceValue.equals("") || platform.equals("-1")) {
			platform = "0";
		}
		JSONArray attendanceReportData = activityServiceImpl.getActivityReportData(platform, fromDate, toDate,
				resourceValue);
//    System.err.println("Report Data " + attendanceReportData);
		return attendanceReportData.toString();
	}

	@GetMapping("platforms")
	List<Platform> getPlatforms() {
		return activityService.fetchPlatforms();
	}

	@GetMapping("activities")
	List<Activity> getActivities(String platform) {
		return activityService.findAll();
	}

	@PostMapping("saveAllocation")
	ActivityAllocation saveAllocation(@RequestBody ActivityAllocation data) {
		return activityService.saveAllocation(data);
	}

	@GetMapping("allocationDetails")
	ResponseEntity<Map<String, Object>> getAllocationDetailsByResource(@RequestParam("id") Integer resourceId,
			@RequestParam("date") Date activityDate) {
		Map<String, Object> response = new HashMap<>();
		try {
			String result = activityService.getAllocationDetailsByResource(resourceId, activityDate);
			if (result == "success") {
				response.put("status", 200);
				response.put("success", "Attendance Save Succesfully");
			} else {
				response.put("Error", "Error");
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.put("Error", "Error");
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * @return Details of single resource without related entity data
	 */
	@GetMapping("resource")
	ResourcePoolProjection getResource(@RequestParam("id") Integer resourceId) {
		return activityService.getResource(resourceId);
	}

	/**
	 * @return List of resources along with activity allocation data
	 */
	@GetMapping("resources")
	List<ResourcePool> getResources(String activityDate, Integer platformId) {
		return activityService.getFilteredResources(activityDate, platformId);
	}

	/**
	 * @return List of resources without related entity data
	 */
	@GetMapping("resources/exclude-related")
	List<ResourcePoolProjection> getResourcesWithoutRelatedEntities() {
		return activityService.findAllWithoutRelatedEntity();
	}

	@PostMapping("saveBulkAllocation")
	List<Map<String,String>> saveBulkAllocation(@RequestBody String data) {
		JSONArray markedResources = null;
		ActivityAllocation allocData = null;
		try {
			JSONObject json = new JSONObject(data);
			markedResources = json.getJSONArray("markedResources");
			allocData = (new ObjectMapper()).readValue(json.getString("allocData"), ActivityAllocation.class);
		} catch (JSONException | JsonProcessingException e) {
			e.printStackTrace();
		}
		return activityService.saveBulkAllocation(markedResources, allocData);
	}

	@GetMapping("/platformsIdByName")
	public Integer getPlatformIdByName(@RequestParam("platformName") String platformName) {
		Integer platFormId = activityService.platformIdByName(platformName);
		return platFormId;
	}

	@GetMapping("getDistinctDate")
	public List<String> getAllDistinctDateRange(@RequestParam("year") String year,
			@RequestParam("month") String month) {
		List<String> getAllDaterange = activityService.getAllDistinctDateRange(year, month);
		return getAllDaterange;
	}
	
	@GetMapping("fetchDataByDateRange")
	public List<ActivityAllocation> fetchDataByDateRange(@RequestParam String activityFromDate, @RequestParam String activityToDate) {
		return activityService.fetchDataByDateRange(activityFromDate,activityToDate);
	}

	 @PostMapping("/getAttendanceData")
	    public ResponseEntity<?> receiveDataFromFrontend(@RequestBody String atendanceDate) {
		 List<Map<String,String>> assessmentDetails = activityRepository.getActivityAttendanceSummary(atendanceDate);
	        return ResponseEntity.ok(assessmentDetails);
	    }
	
	 //DashboardPart
	 @GetMapping("activityByFromToDate")
		//public List<Activity> activityById(@RequestParam String selectedDate)
		public ResponseEntity<?> activityByFromToDate(@RequestParam String activityFromDate,@RequestParam String activityToDate){
		 //System.out.println(activityFromDate+"-----------------"+activityToDate);
		 List<Map<String,String>> activitydata = activityRepository.getactivitydata(activityFromDate,activityToDate);
		 //System.out.println(activitydata);
		 return ResponseEntity.ok(activitydata);
		}
	

	// Dashboard part [ActivtiesPlanned]
	 @GetMapping("totalActivitiesPlanned")
		public ResponseEntity<?> gettotalActivitiesPlanned(@RequestParam String activityFromDate, @RequestParam String activityToDate) {
			Integer resources = activityRepository.findAllActivityFromtodate(activityFromDate, activityToDate);
	//		System.out.println(resources);
			return ResponseEntity.ok(resources);
		}
	
}
