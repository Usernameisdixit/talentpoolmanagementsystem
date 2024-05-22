package com.tpms.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;

import com.tpms.dto.PageResponse;
import com.tpms.dto.ResourcePoolProjection;
import com.tpms.entity.Activity;
import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;

public interface ActivityService {
	
	public Activity saveActivity(Activity activity);
	
	public PageResponse<Activity> getAllActivities(Integer pageNumber,Integer pageSize);
	
    public Activity getActivityById(Integer intactivityid);
    
    public void deleteActivity(Integer intactivityid);
    
    public Activity updateActivity(Activity activity);
    
    public void updateDeletedFlag(Integer activityId, boolean deletedFlag);


    public List<Platform> fetchPlatforms();

	public List<ResourcePool> getFilteredResources(String activityDate, Integer platformId);
	
	public List<Activity> findAllActive();

	public ActivityAllocation saveAllocation(ActivityAllocation data);

	public String getAllocationDetailsByResource(Integer id, Date activityDate);

	public ResourcePoolProjection getResource(Integer resourceId);

	public List<ResourcePoolProjection> findAllWithoutRelatedEntity();

	public Map<String, Object> saveBulkAllocation(JSONArray markedResources, ActivityAllocation allocData);

	public Integer platformIdByName(String platformName);

	public List<String> getAllDistinctDateRange(String year, String month);

	public List<ActivityAllocation> fetchDataByDateRange(String activityFromDate, String activityToDate);
	
	public List<String> getAllActivityAuto(String value);

	public Activity getDataByActivityName(String activityName);

	public Activity findByResponsPerson1AndActivityName(String responsPerson1, String activityName);

	public Integer activityExist(Integer activityId);
	
	/**
	 * @return 1 if records are deleted, 0 if no records are deleted, -1 if there's an error
	 */
	public int deleteAllocation(Long id);

	public PageResponse<Activity> searchActivity(Integer activityId, String activityPerson, Integer pageNumber, int pageSize);

	public List<Activity> getActivityList();

	public Integer getCount(String activityName);

}
