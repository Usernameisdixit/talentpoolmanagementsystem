package com.tpms.controller;

import java.util.List;

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
import com.tpms.service.impl.ActivityServiceImpl;

@CrossOrigin(origins="http://localhost:4201")
@RestController
public class ActivityRestController {
	
	
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


	

}