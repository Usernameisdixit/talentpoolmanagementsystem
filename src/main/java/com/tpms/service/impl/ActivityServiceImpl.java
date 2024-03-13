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
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Limit;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

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


	public JSONArray getActivityReportData(String platform, String selectedDate, String year, String month) {
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
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?)}";
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
		
		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement attendanceQuerey = con.prepareCall(sqls);) {
				attendanceQuerey.setString(1, "ACTIVITY_REPORT");
				attendanceQuerey.setString(2, platform);
				attendanceQuerey.setString(3, formattedDate);
				attendanceQuerey.setString(4, year);
				attendanceQuerey.setString(5, month);

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
							attendanceDetails.add(attendance);
						}
					}

				}
				try {
					Integer resourceId = 0;
					JSONObject resource = new JSONObject();
					JSONArray firstHalfArray = new JSONArray();
					JSONArray secondHalfArray = new JSONArray();
					for (Map<String, Object> mapObject : attendanceDetails) {
						Integer mapResourceId = Integer.valueOf((String) mapObject.get("resourceId"));
						Integer intActivityFor = Integer.valueOf((String) mapObject.get("activityFor"));
						if (resourceId == 0) {
							resourceId = mapResourceId;
						} else if (resourceId != mapResourceId) {
							resource.put("firstHalf", firstHalfArray);
							resource.put("secondHalf", secondHalfArray);
							data.put(resource);
							resourceId = mapResourceId;
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
		return platformRepo.findAll();
	}

	
	public List<ResourcePool> getResources() {
		return resourceRepo.findAll();
	}


	public List<Activity> findAll() {
		return activityRepo.findAll();
	}

	
	public ActivityAllocation saveAllocation(ActivityAllocation data) {
		return activityAllocRepo.save(data);
	}


	public ActivityAllocation getAllocationDetailsByResource(Integer resourceId) {
		return activityAllocRepo.findByResourceId(resourceId, Limit.of(1));
	}


}
