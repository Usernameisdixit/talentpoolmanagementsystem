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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.tpms.dto.ResourcePoolProjection;
import com.tpms.entity.Activity;
import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.ActivityAllocationDetails;
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ActivityAllocationDetailsRepository;
import com.tpms.repository.ActivityAllocationRepository;
import com.tpms.repository.ActivityRepository;
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
	private JdbcTemplate jdbcTemplate;
    
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


	public JSONArray getActivityReportData(String platform, String fromDate, String toDate, String resourceValue) {
		JSONArray data = new JSONArray();
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?,?,?)}";
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
		String fromParseDate=getDate(fromDate);
		String toParseDate=getDate(toDate);
		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement attendanceQuerey = con.prepareCall(sqls);) {
				attendanceQuerey.setString(1, "ACTIVITY_REPORT");
				attendanceQuerey.setString(2, platform);
				attendanceQuerey.setString(3, fromParseDate);
				attendanceQuerey.setString(4, toParseDate);
				attendanceQuerey.setString(5, null);
				attendanceQuerey.setString(6,resourceValue);
				attendanceQuerey.setInt(7,0);

				try (ResultSet rs = attendanceQuerey.executeQuery();) {
					if (rs != null) {
						Map<String, Object> attendance = null;
						while (rs.next()) {
							attendance = new HashMap<>();
							attendance.put("activityFor", rs.getString("activityFor"));
							attendance.put("resourceId", rs.getString("resourceId"));
							attendance.put("resourceName", rs.getString("resourceName"));
							attendance.put("activityDetails", rs.getString("activityDetails"));
							attendance.put("fromHours", rs.getString("fromHours"));
							attendance.put("toHours", rs.getString("toHours"));
							attendance.put("activityName", rs.getString("activityName"));
							attendance.put("activityAllocateDetId", rs.getString("activityAllocateDetId"));
							attendance.put("platform", rs.getString("platform"));
							attendance.put("activityAllocateId", rs.getString("activityAllocateId"));
							attendance.put("activityAllocateDetId", rs.getString("activityAllocateDetId"));
							attendance.put("activityDate", rs.getString("activityDate"));
							attendance.put("resourceCode", rs.getString("resourceCode"));
							attendanceDetails.add(attendance);
						}
					}

				}
				try {
					Integer resourceId = 0;
					String activityDate="";
					JSONObject resource = new JSONObject();
					JSONArray firstHalfArray = new JSONArray();
					JSONArray secondHalfArray = new JSONArray();
					for (Map<String, Object> mapObject : attendanceDetails) {
						Integer mapResourceId = Integer.valueOf((String) mapObject.get("resourceId"));
						Integer intActivityFor = Integer.valueOf((String) mapObject.get("activityFor"));
						String checkDate =  (String) mapObject.get("activityDate");
						if (resourceId == 0) {
							resourceId = mapResourceId;
							activityDate=checkDate;
						} else if (resourceId != mapResourceId || !(checkDate.equalsIgnoreCase(activityDate))) {
							resource.put("firstHalf", firstHalfArray);
							resource.put("secondHalf", secondHalfArray);
							data.put(resource);
							resourceId = mapResourceId;
							activityDate=checkDate;
							resource = new JSONObject();
							firstHalfArray = new JSONArray();
							secondHalfArray = new JSONArray();
						}
						if (resource.length() == 0) {
							resource.put("resourceName", mapObject.get("resourceName"));
							resource.put("resourceId", mapResourceId);
							resource.put("domain", mapObject.get("platform"));
							resource.put("activityAllocateId", mapObject.get("activityAllocateId"));
							resource.put("activityDate", mapObject.get("activityDate"));
							resource.put("resourceCode", mapObject.get("resourceCode"));
						}
						JSONObject detailObject = new JSONObject();
						detailObject.put("activityDetails", mapObject.get("activityDetails"));
						detailObject.put("fromHours", mapObject.get("fromHours"));
						detailObject.put("toHours", mapObject.get("toHours"));
						detailObject.put("activityName", mapObject.get("activityName"));
						detailObject.put("activityAllocateDetId", mapObject.get("activityAllocateDetId"));
						detailObject.put("activityFor", mapObject.get("activityFor"));
						if (intActivityFor == 1) {
							firstHalfArray.put(detailObject);
						} else if (intActivityFor == 2) {
							secondHalfArray.put(detailObject);
						}
					}
					resource.put("firstHalf", firstHalfArray);
					resource.put("secondHalf", secondHalfArray);
					data.put(resource);
				} catch (Exception e) {
					e.printStackTrace();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		}

		return data;
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
	public List<Map<String,String>> saveBulkAllocation(JSONArray markedResources, ActivityAllocation allocData) {
		
		List<Integer> resourceIdList = new ArrayList<>();
		
		List<ActivityAllocationDetails> updatedList = new ArrayList<>();
		try {
			for (int i = 0; i < markedResources.length(); i++) {
				JSONObject resource = markedResources.getJSONObject(i);
				ActivityAllocationDetails newDetail = new ActivityAllocationDetails();
				newDetail.setActivityAllocateDetId(resource.optInt("activityAllocateDetId")==0 ? null:resource.getInt("activityAllocateDetId"));
				newDetail.setResourceId(resource.getInt("resourceId"));
				newDetail.setPlatformId(resource.getInt("platformId"));
				newDetail.setActivityAllocation(allocData);
				updatedList.add(newDetail);
				resourceIdList.add(resource.getInt("resourceId"));
			}
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date fromDate = null;
		Date toDate= null;
		try {
			fromDate = sdf.parse(sdf.format(allocData.getActivityFromDate()));
			toDate = sdf.parse(sdf.format(allocData.getActivityToDate()));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		List<Map<String,String>> existingResourceList = new ArrayList<>();
		if(allocData.getActivityAllocateId() == null)
			existingResourceList = activityAllocRepo.checkExistingResourcesByDateRange(resourceIdList,fromDate,toDate,allocData.getFromHours(),allocData.getToHours());

		if(existingResourceList.isEmpty()) {
			List<ActivityAllocationDetails> allDetails = activityAllocRepo.findByActivityAllocateId(allocData.getActivityAllocateId());
			List<Integer> allocateDetIdList = updatedList.stream().map(e->e.getActivityAllocateDetId()).toList();
			List<ActivityAllocationDetails> removalList = allDetails.stream()
					.filter(e->!allocateDetIdList.contains(e.getActivityAllocateDetId()))
					.toList();
			allocData.setDetails(updatedList);
			activityAllocRepo.save(allocData);
			detailsRepo.deleteAll(removalList);
			return new ArrayList<>();
		}
		
		return existingResourceList;
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
			if(activityFromDate!=null && activityToDate!=null)
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

}
