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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.tpms.entity.Activity;
import com.tpms.repository.ActivityRepository;
import com.tpms.service.ReportService;

@Service
public class ReportServiceImpl implements ReportService {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private ActivityRepository activityRepository;

	@Override
	public List<Map<String, Object>> getAttendanceData(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue) {
		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals("undefined")) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals("undefined")) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?,?,?)}";
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();

		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement attendanceQuerey = con.prepareCall(sqls);) {
				attendanceQuerey.setString(1, "ATTENDANCE_REPORT_DATA");
				attendanceQuerey.setString(2, formattedFromDate);
				attendanceQuerey.setString(3, formattedToDate);
				attendanceQuerey.setString(4, activityId);
				attendanceQuerey.setString(5, reportType);
				attendanceQuerey.setString(6, resourceValue);
				attendanceQuerey.setInt(7, 0);

				try (ResultSet rs = attendanceQuerey.executeQuery();) {
					if (rs != null) {
						Map<String, Object> attendance = null;
						while (rs.next()) {
							attendance = new HashMap<>();
							attendance.put("resourceCode", rs.getString("resourceCode"));
							attendance.put("resourceName", rs.getString("resourceName"));
							attendance.put("fromHours", rs.getString("fromHours"));
							attendance.put("toHours", rs.getString("toHours"));
							attendance.put("activityName", rs.getString("activityName"));
							attendance.put("platform", rs.getString("platform"));
							attendance.put("attendanceStatus", rs.getString("attendanceStatus"));
							attendance.put("atendanceDate", rs.getString("atendanceDate"));
							attendance.put("activityFor", rs.getString("activityFor"));
							attendance.put("designation", rs.getString("designation"));
							attendanceDetails.add(attendance);
						}
					}

				}
				System.err.println(attendanceDetails);
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
		return attendanceDetails;
	}

	@Override
	public List<Activity> getAttendanceDataOnDateRang(String fromDate, String toDate) {
		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals("undefined")) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals("undefined")) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		return  activityRepository.getActvitiesByDateRange(formattedFromDate,formattedToDate);
	}

	@Override
	public JSONArray getAttendanceDataSummary(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue) {
		JSONArray data = new JSONArray();
		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals("undefined")) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals("undefined")) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?,?,?)}";
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();

		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement attendanceQuerey = con.prepareCall(sqls);) {
				attendanceQuerey.setString(1, "ATTENDANCE_REPORT_DATA");
				attendanceQuerey.setString(2, formattedFromDate);
				attendanceQuerey.setString(3, formattedToDate);
				attendanceQuerey.setString(4, activityId);
				attendanceQuerey.setString(5, reportType);
				attendanceQuerey.setString(6, resourceValue);
				attendanceQuerey.setInt(7, 0);

				try (ResultSet rs = attendanceQuerey.executeQuery();) {
					if (rs != null) {
						Map<String, Object> attendance = null;
						while (rs.next()) {
							attendance = new HashMap<>();
							attendance.put("resourceCode", rs.getString("resourceCode"));
							attendance.put("resourceName", rs.getString("resourceName"));
							attendance.put("fromHours", rs.getString("fromHours"));
							attendance.put("toHours", rs.getString("toHours"));
							attendance.put("activityName", rs.getString("activityName"));
							attendance.put("platform", rs.getString("platform"));
							attendance.put("attendanceStatus", rs.getString("attendanceStatus"));
							attendance.put("atendanceDate", rs.getString("atendanceDate"));
							attendance.put("activityFor", rs.getString("activityFor"));
							attendance.put("designation", rs.getString("designation"));
							attendance.put("resourceId", rs.getString("resourceId"));
							attendanceDetails.add(attendance);
						}
					}

				}
				Integer resourceId = 0;
				String activityDate="";
				JSONObject resource = new JSONObject();
				JSONArray activityAttenDetailsArray = new JSONArray();
				for (Map<String, Object> mapObject : attendanceDetails) {
					Integer mapResourceId = Integer.valueOf((String) mapObject.get("resourceId"));
					String checkDate =  (String) mapObject.get("atendanceDate");
					if (resourceId == 0) {
						resourceId = mapResourceId;
						activityDate=checkDate;
					} else if (resourceId != mapResourceId || !(checkDate.equalsIgnoreCase(activityDate))) {
						resource.put("activityAttenDetails", activityAttenDetailsArray);
						data.put(resource);
						resourceId = mapResourceId;
						activityDate=checkDate;
						resource = new JSONObject();
						activityAttenDetailsArray = new JSONArray();
					}
					if (resource.length() == 0) {
						resource.put("resourceName", mapObject.get("resourceName"));
						resource.put("domain", mapObject.get("platform"));
						resource.put("atendanceDate", mapObject.get("atendanceDate"));
						resource.put("resourceCode", mapObject.get("resourceCode"));
						resource.put("platform", mapObject.get("platform"));
						resource.put("designation", mapObject.get("designation"));
					}
					JSONObject detailObject = new JSONObject();
					detailObject.put("activityName", mapObject.get("activityName"));
					detailObject.put("isPresent", mapObject.get("isPresent"));
					detailObject.put("attendanceStatus", mapObject.get("attendanceStatus"));
					activityAttenDetailsArray.put(detailObject);
					
				}
				resource.put("activityAttenDetailsArray", activityAttenDetailsArray);
				data.put(resource);
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
		return data;
	}

}
