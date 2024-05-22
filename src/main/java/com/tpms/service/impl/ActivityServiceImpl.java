package com.tpms.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.tpms.dto.PageResponse;
import com.tpms.dto.ResourcePoolProjection;
import com.tpms.entity.Activity;
import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.ActivityAllocationDetails;
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ActivityAllocationDetailsRepository;
import com.tpms.repository.ActivityAllocationRepository;
import com.tpms.repository.ActivityRepository;
import com.tpms.repository.AttendanceRepository;
import com.tpms.repository.PlatformRepository;
import com.tpms.repository.ResourcePoolRepository;
import com.tpms.service.ActivityService;

@Service
public class ActivityServiceImpl implements ActivityService {
	
	private static final String CATEGORY = "category";

	private static final String YYYY_MM_DD = "yyyy-MM-dd";

	@Autowired
    private ActivityRepository activityRepository;
	
	@Autowired
	PlatformRepository platformRepo;
	
	@Autowired
	ResourcePoolRepository resourceRepo;
	
	@Autowired
	ActivityAllocationRepository activityAllocRepo;
	
	@Autowired
	ActivityAllocationDetailsRepository detailsRepo;
	
	@Autowired
	AttendanceRepository attendanceRepo;
	
    
    public Activity saveActivity(Activity activity)
    {
    	return activityRepository.save(activity);
    }
    
    
    public PageResponse<Activity> getAllActivities(Integer pageNumber,Integer pageSize)
    {
    	Pageable pageable=PageRequest.of(pageNumber-1, pageSize,Sort.by("activityName"));
    	Page<Activity> page=activityRepository.findAll(pageable);
    	List<Activity> activityDetails=page.getContent();
    	PageResponse<Activity> pageResponse=new PageResponse<>();
    	pageResponse.setContent(activityDetails);
    	pageResponse.setPageSize(page.getSize());
    	pageResponse.setTotalElements(page.getTotalElements());
    	
    	
    	 return pageResponse;
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
    	Activity activity = activityRepository.findById(activityId).orElseThrow();
        activity.setDeletedFlag(deletedFlag);
        activityRepository.save(activity);
    }


    
    
	public List<Platform> fetchPlatforms() {
		return platformRepo.findByDeletedFlagFalse();
	}

	
	public List<ResourcePool> getFilteredResources(String activityDate, Integer platformId) {
		List<ResourcePool> resources = null;
		SimpleDateFormat sdf = new SimpleDateFormat(YYYY_MM_DD);
		try {
			Date parsedDate = sdf.parse(activityDate);
			resources = new ArrayList<>(); 
			for(int i=0; i<resources.size(); i++) {
				List<ActivityAllocation> activityAlloc = new ArrayList<>();
				int j = 0;
				while(j<activityAlloc.size()) {
					
					if(!parsedDate.equals(activityAlloc.get(j).getActivityFromDate()) || Boolean.TRUE.equals(activityAlloc.get(j).getDeletedFlag()))
					{
						activityAlloc.remove(j);
					}
					else
						j++;
				}
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return resources;
	}


	public List<Activity> findAllActive() {
		return activityRepository.findByDeletedFlagFalse();
	}

	
	public ActivityAllocation saveAllocation(ActivityAllocation data) {
		return activityAllocRepo.save(data);
	}


	public String getAllocationDetailsByResource(Integer resourceId, Date activityDate) {
		String result = null;
		try {
			activityAllocRepo.findByResourceId(resourceId,activityDate);
			result = "success";
		}catch(Exception e){
			result = "fail";
			e.printStackTrace();
		}
		return result;
	}


	@Override
	public ResourcePoolProjection getResource(Integer resourceId) {
		return resourceRepo.findByIdWithoutRelatedEntity(resourceId);
	}


	@Override
	public List<ResourcePoolProjection> findAllWithoutRelatedEntity() {
		return resourceRepo.findAllWithoutRelatedEntity();
	}


	@Override
	public Map<String, Object> saveBulkAllocation(JSONArray markedResources, ActivityAllocation allocData) {
		Map<String, Object> response = new HashMap<>();
		List<Integer> resourceIdList = new ArrayList<>();

		List<ActivityAllocationDetails> updatedList = new ArrayList<>();
		try {
			extractedForLoop(markedResources, allocData, resourceIdList, updatedList);

		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		List<Map<String, String>> existingResourceList = new ArrayList<>();
		Byte fullDayActivity = 0;
		Integer activityCountByDate = 0;
		Integer activityCountBySession = 0;
		
		if(allocData.getActivityAllocateId() == null) {
			
			if(allocData.getActivityFor()==3) {
				fullDayActivity = activityAllocRepo.isFullDayActivityPresent(allocData.getActivityFromDate(),
						allocData.getActivityToDate());
				response.put(CATEGORY, "fullDayActivity");
				response.put("data", fullDayActivity);
			}
			
			if (fullDayActivity==0) {
				activityCountByDate = activityAllocRepo.countExistingActivityByDateRange(
						allocData.getActivity().getActivityId(), allocData.getActivityFromDate(),
						allocData.getActivityToDate(), allocData.getFromHours(), allocData.getToHours());
				response.put(CATEGORY, "activityByDate");
				response.put("data", activityCountByDate);
			}
			
			if(fullDayActivity == 0 && activityCountByDate == 0) {
				activityCountBySession = activityAllocRepo.countExistingActivityBySession(allocData.getActivity().getActivityId(),
						allocData.getActivityFromDate(), allocData.getActivityToDate(), allocData.getActivityFor());
				response.put(CATEGORY, "activityBySession");
				response.put("data", activityCountBySession);
			}
			
			if (fullDayActivity == 0 && activityCountByDate==0 && activityCountBySession==0 && Boolean.TRUE.equals(!allocData.getActivity().getIsProject())) {
				existingResourceList = activityAllocRepo.checkExistingResourcesByDateRange(resourceIdList, allocData.getActivityFromDate(), allocData.getActivityToDate(),
						allocData.getFromHours(), allocData.getToHours());
				response.put(CATEGORY, "resource");
				response.put("data", existingResourceList);
			}
		}

		if (fullDayActivity == 0 && existingResourceList.isEmpty() && activityCountByDate == 0 && activityCountBySession == 0) {
			List<ActivityAllocationDetails> allDetails = activityAllocRepo
					.findByActivityAllocateId(allocData.getActivityAllocateId());
			List<Integer> allocateDetIdList = updatedList.stream().map(e -> e.getActivityAllocateDetId()).toList();
			List<ActivityAllocationDetails> removalList = allDetails.stream()
					.filter(e -> !allocateDetIdList.contains(e.getActivityAllocateDetId())).toList();
			allocData.setDetails(updatedList);
			activityAllocRepo.save(allocData);
			detailsRepo.deleteAll(removalList);
			return new HashMap<>();
		}

		return response;
	}


	private void extractedForLoop(JSONArray markedResources, ActivityAllocation allocData, List<Integer> resourceIdList,
			List<ActivityAllocationDetails> updatedList) throws JSONException {
		for (int i = 0; i < markedResources.length(); i++) {
			JSONObject resource = markedResources.getJSONObject(i);
			ActivityAllocationDetails newDetail = new ActivityAllocationDetails();
			newDetail.setActivityAllocateDetId(resource.optInt("activityAllocateDetId") == 0 ? null
					: resource.getInt("activityAllocateDetId"));
			newDetail.setResourceId(resource.getInt("resourceId"));
			newDetail.setPlatformId(resource.getInt("platformId"));
			newDetail.setActivityAllocation(allocData);
			updatedList.add(newDetail);
			resourceIdList.add(resource.getInt("resourceId"));
		}
	}


	@Override
	public Integer platformIdByName(String platformName) {
		return platformRepo.findPlatformIdByPlatform(platformName);
	}


	@Override
	public List<String> getAllDistinctDateRange(String year, String month) {
		return activityAllocRepo.getAllDistinctDateRange(year,month);
	}
	
	public String getDate(String str) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate date = LocalDate.parse(str, formatter);
        DateTimeFormatter targetFormatter = DateTimeFormatter.ofPattern(YYYY_MM_DD);
        return date.format(targetFormatter);
	}


	@Override
	public List<ActivityAllocation> fetchDataByDateRange(String activityFromDate, String activityToDate) {
		SimpleDateFormat sdf = new SimpleDateFormat(YYYY_MM_DD);
		try {
			if(!"null".equals(activityFromDate) && !"null".equals(activityToDate))
				return activityAllocRepo.findByActivityFromDateAndActivityToDateAndDeletedFlagFalse(sdf.parse(activityFromDate),sdf.parse(activityToDate));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return new ArrayList<>();
	}
	
	@Override
	public List<String> getAllActivityAuto(String value) {
		String searchLowerCase = value.toLowerCase();
		return activityRepository.findAll().stream()
                .map(x -> x.getActivityName())
                .filter(activityName -> activityName.toLowerCase().contains(searchLowerCase))
                .distinct().toList();
	}


	@Override
	public Activity getDataByActivityName(String activityName) {
		 return activityRepository.findByActivityNameAndDeletedFlagFalse(activityName);
	}


	public Activity findByResponsPerson1AndActivityName(String responsPerson1, String activityName) {
		return activityRepository.findByResponsPerson1AndActivityName(responsPerson1,activityName);
	}


	@Override
	public Integer activityExist(Integer activityId) {
		return activityRepository.checkForExistActivity(activityId);
	}
	
	@Override
	public int deleteAllocation(Long id) {
		int res = -1;
		try {
			Integer count = attendanceRepo.countByActivityAllocateId(id);
			if(count==0) {
				activityAllocRepo.deleteById(id);
				res = 1;
			}
			else
				res = 0;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}


	public List<Activity> getAllActivityDetails() {
		
		return activityRepository.findAll();
	}


	@Override
	public PageResponse<Activity> searchActivity(Integer activityId, String activityPerson, Integer pageNumber, int pageSize) {
		
		Pageable pageable=PageRequest.of(pageNumber-1, pageSize);
    	Page<Activity> page=activityRepository.findByActivityNameAndActivityPerson(activityId,activityPerson,pageable);
    	List<Activity> activityDetails=page.getContent();
    	PageResponse<Activity> pageResponse=new PageResponse<>();
    	pageResponse.setContent(activityDetails);
    	pageResponse.setPageSize(page.getSize());
    	pageResponse.setTotalElements(page.getTotalElements());
		
		return pageResponse;
	}


	@Override
	public List<Activity> getActivityList() {
		
		return activityRepository.findAll();
	}


	@Override
	public Integer getCount(String activityName) {
		
		return activityRepository.countByActivityId(activityName);
	}



}
