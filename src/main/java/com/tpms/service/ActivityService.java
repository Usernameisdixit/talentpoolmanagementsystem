package com.tpms.service;

import java.util.List;

import com.tpms.entity.Activity;

public interface ActivityService {
	
	public Activity SaveActivity(Activity activity);
	
	public List<Activity> getAllActivities();
	
    public Activity getActivityById(Integer intactivityid);
    
    public void deleteActivity(Integer intactivityid);
    
    public Activity updateActivity(Activity activity);
    
    public void updateDeletedFlag(Integer activityId, boolean deletedFlag);




}
