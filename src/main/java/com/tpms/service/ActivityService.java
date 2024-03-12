package com.tpms.service;

import java.util.List;

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

	public List<ResourcePool> getResources();
	
	public List<Activity> findAll();

	public ActivityAllocation saveAllocation(ActivityAllocation data);

	public ActivityAllocation getAllocationDetailsByResource(Integer id);

}
