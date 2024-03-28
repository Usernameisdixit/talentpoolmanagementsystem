package com.tpms.service;

import java.util.Date;
import java.util.List;

import org.json.JSONArray;

import com.tpms.dto.ResourcePoolProjection;
import com.tpms.entity.Activity;
import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;

public interface ActivityService {
	
	public Activity SaveActivity(Activity activity);
	
	public List<Activity> getAllActivities();
	
    public Activity getActivityById(Integer intactivityid);
    
    public void deleteActivity(Integer intactivityid);
    
    public Activity updateActivity(Activity activity);
    
    public void updateDeletedFlag(Integer activityId, boolean deletedFlag);


    public List<Platform> fetchPlatforms();

	public List<ResourcePool> getFilteredResources(String activityDate, Integer platformId);
	
	public List<Activity> findAll();

	public ActivityAllocation saveAllocation(ActivityAllocation data);

	public String getAllocationDetailsByResource(Integer id, Date activityDate);

	public ResourcePoolProjection getResource(Integer resourceId);

	public List<ResourcePoolProjection> findAllWithoutRelatedEntity();

	public void saveBulkAllocation(JSONArray markedResources, ActivityAllocation allocData);

	public Integer platformIdByName(String platformName);

	public List<String> getAllDistinctDateRange(String year, String month);

}
