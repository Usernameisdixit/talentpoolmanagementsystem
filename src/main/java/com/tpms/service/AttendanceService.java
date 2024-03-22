package com.tpms.service;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.tpms.entity.Activity;
import com.tpms.entity.Platform;

public interface AttendanceService {
	
	public JSONArray  getAllDetails(String platformName, String selectedDate) ;

	public List<Platform> getAllPlatform();

	public String saveAttendance(JSONArray allData, String selectedDate);

	public JSONArray getAttendanceReportData(String platform, String selectedDate, String year, String month, String resourceValue);

	public JSONObject getAllDetailsNew(String selectedDate);

	public String saveAttendances(JSONObject allData, String selectedDate);

	public List<String> getAllNames(String value);

	public List<Activity> getActvitiesByDate(String selectedDate);

	public JSONArray attendDetailsByActivity(Integer selectedActivity, String selectedDate);

	public String saveAttendanceByActivity(JSONArray allData, String selectedDate);

}
