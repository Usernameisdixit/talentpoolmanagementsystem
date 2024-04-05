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

}
