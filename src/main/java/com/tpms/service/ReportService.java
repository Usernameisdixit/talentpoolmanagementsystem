package com.tpms.service;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;

import com.tpms.entity.Activity;

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
	

}
