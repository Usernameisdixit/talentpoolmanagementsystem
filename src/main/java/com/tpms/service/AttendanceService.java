package com.tpms.service;

import java.util.List;

import org.json.JSONArray;

import com.tpms.entity.Platform;

public interface AttendanceService {
	
	public JSONArray  getAllDetails(String platformName, String selectedDate) ;

	public List<Platform> getAllPlatform();

	public String saveAttendance(JSONArray allData, String selectedDate);

	public JSONArray getAttendanceReportData(String platform, String selectedDate, String year, String month);

}
