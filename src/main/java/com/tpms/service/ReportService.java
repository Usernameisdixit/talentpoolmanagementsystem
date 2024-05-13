package com.tpms.service;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.tpms.dto.PageResponse;
import com.tpms.entity.Activity;
import com.tpms.entity.ResourcePool;

public interface ReportService {

	List<Map<String, Object>> getAttendanceData(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue);

	List<Activity> getAttendanceDataOnDateRang(String fromDate, String toDate);

	JSONArray getAttendanceDataSummary(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue);
	
	List<Map<String, Object>> getActivitynewDataReport(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue);
	
	List<Activity> getActivityDataOnDateRang(String fromDate, String toDate);

	List<Map<String, Object>> getActivitynewReport(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue);

	List<Activity> getActivityOnDateRangForAssement(String fromDate, String toDate);

	List<Map<String, Object>> getAssesmentData(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue);
	
	public JSONObject getDetails(String resourceCode) throws JSONException;

	PageResponse<ResourcePool> getAllEmployeResourceReport(int pageNumber, int pageSize);
	

}
