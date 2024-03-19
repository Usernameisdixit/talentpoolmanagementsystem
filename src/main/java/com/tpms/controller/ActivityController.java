package com.tpms.controller;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.entity.Activity;
import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
import com.tpms.service.ActivityService;
import com.tpms.service.impl.ActivityServiceImpl;

@CrossOrigin("*")
@RestController
public class ActivityController {
	
	
	
	@Autowired
	ActivityService activityService;
	
	@Autowired
	ActivityServiceImpl activityServiceImpl;
	
	
	@GetMapping("/get/activity")
	public List<Activity> getAllActivities()
	{
		return activityServiceImpl.getAllActivities();
	
		
	}
	
	
	@PostMapping("/save/activity")
	public Activity SaveActivity(@RequestBody Activity activity)
	{
		activity.setDeletedFlag(false);
		return activityServiceImpl.SaveActivity(activity);
		
	}
	
	
	@GetMapping("/get/activity/{activityId}")
	public Activity getActivityById(@PathVariable Integer activityId)
	{
		return activityServiceImpl.getActivityById(activityId);	
	
	}
	
	
	@DeleteMapping("/delete/activity/{activityId}")
	public void deleteActivity(@PathVariable Integer activityId)
	{
		activityServiceImpl.deleteActivity(activityId);
		
	}
	
	
	@PutMapping("/update/activity")
	public Activity updateActivity(@RequestBody Activity activity)
	{
		return activityServiceImpl.updateActivity(activity);
	}
	
	
	@PutMapping("/update-deleted-flag/{activityId}")
	public void updateDeletedFlag(@PathVariable Integer activityId, @RequestParam Boolean deletedFlag) {
	    activityServiceImpl.updateDeletedFlag(activityId, deletedFlag);
	}
	
	@PostMapping("activityReportData")
	public String getActivityReportData(@RequestBody Map<String, String> params) {
    String year = params.get("year");
    String month = params.get("month");
    String platform = params.get("platform");
    String selectedDate = params.get("selectedDate");
    JSONArray attendanceReportData = activityServiceImpl.getActivityReportData(platform, selectedDate,year,month);
//    System.err.println("Report Data " + attendanceReportData);
    return attendanceReportData.toString();
}

	@GetMapping("platforms")
	List<Platform> getPlatforms() {
		return activityService.fetchPlatforms();
	}
	
	@GetMapping("resources")
	List<ResourcePool> getResources(String activityDate, Integer platformId) {
		return activityService.getFilteredResources(activityDate,platformId);
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
	ActivityAllocation getAllocationDetailsByResource(@RequestParam("id") Integer resourceId) {
		return activityService.getAllocationDetailsByResource(resourceId);
	}
	
	

}
