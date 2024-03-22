package com.tpms.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
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
	ActivityRepository activityRepo;
	
	@Autowired
	ActivityAllocationRepository activityAllocRepo;
	
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


	public JSONArray getActivityReportData(String platform, String selectedDate, String year, String month, String resourceValue) {
		JSONArray data = new JSONArray();
		 SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
	     SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
	     SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	     String formattedDate=null;
		try {
			if(selectedDate!=null && !selectedDate.equals("undefined")) {
			Date date = inputFormat.parse(selectedDate);
           formattedDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?,?,?)}";
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
		
		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement attendanceQuerey = con.prepareCall(sqls);) {
				attendanceQuerey.setString(1, "ACTIVITY_REPORT");
				attendanceQuerey.setString(2, platform);
				attendanceQuerey.setString(3, formattedDate);
				attendanceQuerey.setString(4, year);
				attendanceQuerey.setString(5, month);
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
			resources = resourceRepo.findAllActiveRecords(parsedDate,platformId);
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
				List<ActivityAllocation> activityAlloc = resources.get(i).getActivityAlloc();
				int j = 0;
				while(j<activityAlloc.size()) {
					if(!parsedDate.equals(activityAlloc.get(j).getActivityDate()) || activityAlloc.get(j).getDeletedFlag())
						activityAlloc.remove(j);
					else
						j++;
				}
				resources.get(i).setActivityAlloc(activityAlloc);
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return resources;
	}


	public List<Activity> findAll() {
		return activityRepo.findAll();
	}

	
	public ActivityAllocation saveAllocation(ActivityAllocation data) {
		return activityAllocRepo.save(data);
	}


	public ActivityAllocation getAllocationDetailsByResource(Integer resourceId, Date activityDate) {
		return activityAllocRepo.findByResourceId(resourceId,activityDate);
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
	public void saveBulkAllocation(JSONArray markedResources, ActivityAllocation allocData) {
		int length = markedResources.length();
		List<ActivityAllocation> activityAllocList = new ArrayList<>();
		for (int i = 0; i < length; i++) {
			ActivityAllocation activityAllocation = new ActivityAllocation();
			try {
				activityAllocation.setResourceId(markedResources.getJSONObject(i).getInt("resourceId"));
				activityAllocation.setPlatformId(markedResources.getJSONObject(i).getInt("platformId"));
				activityAllocation.setActivityDate(allocData.getActivityDate());
				activityAllocation.setDetails(allocData.getDetails());
			} catch (JSONException e) {
				e.printStackTrace();
			}
			activityAllocList.add(activityAllocation);
		}
		activityAllocRepo.saveAll(activityAllocList);
	}

}
