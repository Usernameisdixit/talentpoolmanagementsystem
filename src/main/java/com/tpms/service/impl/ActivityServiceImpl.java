package com.tpms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpms.entity.Activity;
import com.tpms.repository.ActivityRepository;
import com.tpms.service.ActivityService;

@Service
public class ActivityServiceImpl {
	
	@Autowired
    private ActivityRepository activityRepository;
	
    
    public Activity SaveActivity(Activity activity)
    {
    	return activityRepository.save(activity);
    }
    
    
    public List<Activity> getAllActivities()
    {
    	 return activityRepository.findAll();
    }
    
    
    public Activity getActivityById(Integer intactivityid)
    {
    	
    	return activityRepository.findById(intactivityid).orElseThrow();
    }
    
    
    public void deleteActivity(Integer intactivityid)
    {
         activityRepository.deleteById(intactivityid);
    }

    
    public Activity updateActivity(Activity activity)
    {
    	activityRepository.findById(activity.getActivityId());
    	return activityRepository.save(activity);
    }
    
    public void updateDeletedFlag(Integer activityId, boolean deletedFlag) {
        //activityRepository.updateDeletedFlag(activityId, deletedFlag);
    	Activity activity = activityRepository.findById(activityId).orElseThrow();
        activity.setDeletedFlag(deletedFlag);
        activityRepository.save(activity);
    }
    
    
	

}
