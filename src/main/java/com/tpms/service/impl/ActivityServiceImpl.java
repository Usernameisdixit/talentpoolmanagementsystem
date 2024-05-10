package com.tpms.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.tpms.dto.PageResponse;
import com.tpms.dto.ResourcePoolProjection;
import com.tpms.entity.Activity;
import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.ActivityAllocationDetails;
import com.tpms.entity.Attendance;
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
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
    
    public Activity SaveActivity(Activity activity)
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
        //activityRepository.updateDeletedFlag(activityId, deletedFlag);
    	Activity activity = activityRepository.findById(activityId).orElseThrow();
        activity.setDeletedFlag(deletedFlag);
        activityRepository.save(activity);
    }


    
    
	public List<Platform> fetchPlatforms() {
		return platformRepo.findByDeletedFlagFalse();
	}

	
	public List<ResourcePool> getFilteredResources(String activityDate, Integer platformId) {
		List<ResourcePool> resources = null;
		List<ResourcePool> filteredResources = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date parsedDate = sdf.parse(activityDate);
			resources = new ArrayList<>(); // resourceRepo.findAllActiveRecords(parsedDate,platformId);
//			resources.forEach(resource->resource.getActivityAlloc().forEach(alloc->{
//				if(alloc.getActivityDate()==null || !parsedDate.equals(alloc.getActivityDate()))
//					resource.getActivityAlloc().remove(alloc);
//			}));
//			Stream<ResourcePool> resourceStream = resources.stream();
//			filteredResources = resourceStream.map(resource->
//				new ResourcePool(
//						resource.getActivityAlloc().stream()
//						.filter(alloc->parsedDate.equals(alloc.getActivityDate())).toList()
//						//.collect(Collectors.toList())
//				)
//			);
//			for (ResourcePool resource : resources) {
//				for (ActivityAllocation allocation : resource.getActivityAlloc()) {
//					if(parsedDate.equals(allocation.getActivityDate()))
//						resource.getActivityAlloc().
//				}
//			}
			for(int i=0; i<resources.size(); i++) {
				List<ActivityAllocation> activityAlloc = new ArrayList(); // resources.get(i).getActivityAlloc();
				int j = 0;
				while(j<activityAlloc.size()) {
					if(!parsedDate.equals(activityAlloc.get(j).getActivityFromDate()) || activityAlloc.get(j).getDeletedFlag())
						activityAlloc.remove(j);
					else
						j++;
				}
//				resources.get(i).setActivityAlloc(activityAlloc);
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
				response.put("category", "fullDayActivity");
				response.put("data", fullDayActivity);
			}
			
			if (fullDayActivity==0) {
				activityCountByDate = activityAllocRepo.countExistingActivityByDateRange(
						allocData.getActivity().getActivityId(), allocData.getActivityFromDate(),
						allocData.getActivityToDate(), allocData.getFromHours(), allocData.getToHours());
				response.put("category", "activityByDate");
				response.put("data", activityCountByDate);
			}
			
			if(fullDayActivity == 0 && activityCountByDate == 0) {
				activityCountBySession = activityAllocRepo.countExistingActivityBySession(allocData.getActivity().getActivityId(),
						allocData.getActivityFromDate(), allocData.getActivityToDate(), allocData.getActivityFor());
				response.put("category", "activityBySession");
				response.put("data", activityCountBySession);
			}
			
			if (fullDayActivity == 0 && activityCountByDate==0 && activityCountBySession==0 && !allocData.getActivity().getIsProject()) {
				existingResourceList = activityAllocRepo.checkExistingResourcesByDateRange(resourceIdList, allocData.getActivityFromDate(), allocData.getActivityToDate(),
						allocData.getFromHours(), allocData.getToHours());
				response.put("category", "resource");
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


	@Override
	public Integer platformIdByName(String platformName) {
		Integer id=platformRepo.findPlatformIdByPlatform(platformName);
		return id;
	}


	@Override
	public List<String> getAllDistinctDateRange(String year, String month) {
		return activityAllocRepo.getAllDistinctDateRange(year,month);
	}
	
	public String getDate(String str) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate date = LocalDate.parse(str, formatter);
        DateTimeFormatter targetFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = date.format(targetFormatter);
		return formattedDate;
	}


	@Override
	public List<ActivityAllocation> fetchDataByDateRange(String activityFromDate, String activityToDate) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			if(!"null".equals(activityFromDate) && !"null".equals(activityToDate))
				return activityAllocRepo.fetchDataByDateRange(sdf.parse(activityFromDate),sdf.parse(activityToDate));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return new ArrayList<>();
	}
	
	@Override
	public List<String> getAllActivityAuto(String value) {
		String searchLowerCase = value.toLowerCase();
		List<String> allUniName=activityRepository.findAll().stream()
                .map(x -> x.getActivityName())
                .filter(activityName -> activityName.toLowerCase().contains(searchLowerCase))
                .distinct()
                .collect(Collectors.toList());
		return allUniName;
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



}
