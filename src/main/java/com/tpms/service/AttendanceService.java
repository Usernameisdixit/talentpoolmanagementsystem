package com.tpms.service;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import com.tpms.entity.Activity;
import com.tpms.entity.Platform;

public interface AttendanceService {
	

	public List<Platform> getAllPlatform();


	public List<String> getAllNames(String value);

	public List<Map<String,Object>> getActvitiesByDate(String selectedDate);

	public JSONArray attendDetailsByActivity(Integer selectedActivity, String selectedDate);

	public String saveAttendanceByActivity(JSONArray allData, String selectedDate);

}
