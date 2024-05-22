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
import com.tpms.dto.PageResponse;
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
	public ResponseEntity<?> getAllActivities(
			@RequestParam(defaultValue = "1") Integer pageNumber) {
		if(pageNumber==0) {
			List<Activity> activityDetails=activityService.getActivityList();
			activityDetails=activityDetails.stream().sorted((a,b)->a.getActivityName().compareTo(b.getActivityName())).toList();
			return ResponseEntity.ok().body(activityDetails);
		}
	    PageResponse<Activity> actvityDetails=activityServiceImpl.getAllActivities(pageNumber,10);
	
	return ResponseEntity.ok(actvityDetails);

	}

	@PostMapping("/save/activity")
	public Activity saveActivity(@RequestBody Activity activity) {
		Activity listByRespAct = activityService.findByResponsPerson1AndActivityName(activity.getResponsPerson1(),
				activity.getActivityName());
		Activity activeActivity = activityService.getDataByActivityName(activity.getActivityName());
		Integer count=activityService.getCount(activity.getActivityName());
		
		if (listByRespAct != null) {
			if (Boolean.TRUE.equals(listByRespAct.getDeletedFlag())) {
				listByRespAct.setDeletedFlag(false);
				activityServiceImpl.saveActivity(listByRespAct);
				activeActivity.setDeletedFlag(true);
				
				activityServiceImpl.saveActivity(activeActivity);
			}
			return activityServiceImpl.saveActivity(listByRespAct);
		}else if(activeActivity!=null && count==0) {
			activity.setActivityId(activeActivity.getActivityId());
			activity.setDeletedFlag(false);
			return activityServiceImpl.saveActivity(activity);
		}else {
			if (activeActivity != null) {
				activeActivity.setDeletedFlag(true);
				activityServiceImpl.saveActivity(activeActivity);
			}
			activity.setDeletedFlag(false);
			return activityServiceImpl.saveActivity(activity);

		}
		
		
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


	@GetMapping("platforms")
	List<Platform> getPlatforms() {
		return activityService.fetchPlatforms();
	}

	@GetMapping("activities")
	List<Activity> getActivities(String platform) {
		return activityService.findAllActive();
	}

	@PostMapping("saveAllocation")
	ActivityAllocation saveAllocation(@RequestBody ActivityAllocation data) {
		return activityService.saveAllocation(data);
	}

	@GetMapping("allocationDetails")
	ResponseEntity<Map<String, Object>> getAllocationDetailsByResource(@RequestParam("id") Integer resourceId,
			@RequestParam("date") Date activityDate) {
		Map<String, Object> response = new HashMap<>();
		String key = "Error";
		try {
			String result = activityService.getAllocationDetailsByResource(resourceId, activityDate);
			if (result.equals("success")) {
				response.put("status", 200);
				response.put("success", "Attendance Save Succesfully");
			} else {
				response.put(key, key);
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.put(key, key);
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
	Map<String, Object> saveBulkAllocation(@RequestBody String data) {
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
		return activityService.platformIdByName(platformName);
	}

	@GetMapping("getDistinctDate")
	public List<String> getAllDistinctDateRange(@RequestParam("year") String year,
			@RequestParam("month") String month) {
		return activityService.getAllDistinctDateRange(year, month);
	}
	
	@GetMapping("fetchDataByDateRange")
	public List<ActivityAllocation> fetchDataByDateRange(@RequestParam String activityFromDate, @RequestParam String activityToDate) {
		return activityService.fetchDataByDateRange(activityFromDate,activityToDate);
	}

	 @PostMapping("/getAttendanceData")
	    public ResponseEntity<List<Map<String,String>> > receiveDataFromFrontend(@RequestBody String atendanceDate) {
		 List<Map<String,String>> assessmentDetails = activityRepository.getActivityAttendanceSummary(atendanceDate);
	        return ResponseEntity.ok(assessmentDetails);
	    }
	
	 //DashboardPart
	 @GetMapping("activityByFromToDate")
		public ResponseEntity<List<Map<String,String>> > activityByFromToDate(@RequestParam String activityFromDate,@RequestParam String activityToDate){
		 List<Map<String,String>> activitydata = activityRepository.getactivitydata(activityFromDate,activityToDate);
		 return ResponseEntity.ok(activitydata);
		}
	
		// Dashboard part [ActivtiesPlanned]
		@GetMapping("totalActivitiesPlanned")
		public ResponseEntity<Integer> gettotalActivitiesPlanned(@RequestParam String activityFromDate,
				@RequestParam String activityToDate) {
			Integer resources = activityRepository.findAllActivityFromtodate(activityFromDate, activityToDate);
			return ResponseEntity.ok(resources);
		}

		@GetMapping("getActivityForAuto")
		public List<String> getAllActivityAuto(@RequestParam String value) {
			return activityService.getAllActivityAuto(value);

		}

		@GetMapping("dataActivityName")
		public Activity getDataByActivityName(@RequestParam String activityName) {
			return activityService.getDataByActivityName(activityName);
		}
		
		@GetMapping("activityCheck")
		public Integer activityExist(@RequestParam Integer activityId) {
			return activityService.activityExist(activityId);
		}
		
		@GetMapping("deleteAllocation")
		public int deleteAllocation(@RequestParam Long id) {
			return activityService.deleteAllocation(id);
		}
		
		@GetMapping("searchActivity")
		public ResponseEntity<PageResponse<Activity>> searchActivity(@RequestParam("activityId") Integer activityId,
				@RequestParam("activityPerson") String activityPerson,
				@RequestParam(defaultValue = "1") Integer pageNumber){
			
			if(activityId==0 && activityPerson.equals("")) {
				 PageResponse<Activity> actvityDetails=activityServiceImpl.getAllActivities(pageNumber,10);
			   return ResponseEntity.ok().body(actvityDetails);
			}else {
				 PageResponse<Activity> searchDataDetails=activityService.searchActivity(activityId,activityPerson,pageNumber,10);
				  List<Activity> getActivityDetails=searchDataDetails.getContent();
				  List<Activity> sortedFormOfActivity= getActivityDetails.stream().sorted((a,b)->a.getActivityName().compareTo(b.getActivityName())).toList();
				  searchDataDetails.setContent(sortedFormOfActivity);
			  return ResponseEntity.ok().body(searchDataDetails);
			}
		}
}
