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

import com.tpms.entity.Attendance;
import com.tpms.entity.Platform;
import com.tpms.repository.AttendanceRepository;
import com.tpms.repository.PlatformRepository;
import com.tpms.service.AttendanceService;

@Service
public class AttendanceServiceImpl implements AttendanceService {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private PlatformRepository platformRepository;

	@Autowired
	private AttendanceRepository attendanceRepository;


	@Override
	public JSONArray getAllDetails(String platformName, String selectedDate) {
		JSONArray data = new JSONArray();
		
		 SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
	     SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
	     SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	     String formattedDate=null;
		 Date finalDate=null;
		try {
			Date date = inputFormat.parse(selectedDate);
             formattedDate = outputFormat.format(date);
             finalDate = dateFormat.parse(formattedDate);
            // Print the result
            System.out.println("Original Date: " + selectedDate);
            System.out.println("Formatted Date: " + formattedDate);
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?)}";
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
//		List<Attendance> atteldanceListPresent=attendanceRepository.findByAttendanceDate(finaldate);
		List<Attendance> atteldanceListPresentNew = attendanceRepository.findByAttendanceDateAndPlatform(finalDate,
				platformName);
		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement attendanceQuerey = con.prepareCall(sqls);) {
				if (atteldanceListPresentNew.size() == 0) {
					attendanceQuerey.setString(1, "ACTIVITY_ATTENDANCE1");
				} else {
					attendanceQuerey.setString(1, "ACTIVITY_ATTENDANCE2");
				}
				attendanceQuerey.setString(2, platformName);
				attendanceQuerey.setString(3, formattedDate);
				attendanceQuerey.setString(4, null);
				attendanceQuerey.setString(5, null);

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
							attendance.put("isPresent", rs.getString("isPresent"));
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
							resource.put("check", atteldanceListPresentNew.size() == 0 ? "s" : "u");
						}
						JSONObject detailObject = new JSONObject();
						detailObject.put("activityDetails", mapObject.get("activityDetails"));
						detailObject.put("fromHours", mapObject.get("fromHours"));
						detailObject.put("toHours", mapObject.get("toHours"));
						detailObject.put("activityName", mapObject.get("activityName"));
						detailObject.put("activityAllocateDetId", mapObject.get("activityAllocateDetId"));
						detailObject.put("isPresent", mapObject.get("isPresent"));
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

	@Override
	public List<Platform> getAllPlatform() {
		return platformRepository.getAllPlatform();
	}

	@Override
	public String saveAttendance(JSONArray allData, String date) {
		boolean flag=false;
		boolean flag2=false;
		String result=null;
		for (int i = 0; i < allData.length(); i++) {
			try {
				JSONObject resourceObject = allData.getJSONObject(i);
				JSONArray firstHalfArray = resourceObject.getJSONArray("firstHalf");
				JSONArray secondHalfArray = resourceObject.getJSONArray("secondHalf");
				
				 SimpleDateFormat inputFormat = new SimpleDateFormat("MM/dd/yyyy");
			     SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
			     SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			     String formattedDate=null;
				 Date finaldate=null;
				 Date dateRequired = inputFormat.parse(date);
	             formattedDate = outputFormat.format(dateRequired);
	             finaldate = dateFormat.parse(formattedDate);
				System.err.println("Final Date" + finaldate);
				if (firstHalfArray.length() != 0) {
					for (int j = 0; j < firstHalfArray.length(); j++) {
						JSONObject firstHalfObject = firstHalfArray.getJSONObject(j);
						Integer intActivityAllocateDetId = firstHalfObject.getInt("activityAllocateDetId");
//						List<Attendance> findByActivityAllocateDetId = attendanceRepository
//								.findByActivityAllocateDetId(intActivityAllocateDetId);
						List<Attendance> findByActivityAllocateDetId = attendanceRepository
								.findByActivityAllocateDetIdAndAtendanceDate(intActivityAllocateDetId, finaldate);
						Attendance attendance = null;
						if (findByActivityAllocateDetId.size() != 0) {
							attendance = findByActivityAllocateDetId.get(0);
						} else {
							attendance = new Attendance();
							attendance.setResourceId(resourceObject.getInt("resourceId"));
							attendance.setActivityAllocateId(resourceObject.getInt("activityAllocateId"));
							attendance.setActivityAllocateDetId(firstHalfObject.getInt("activityAllocateDetId"));
							attendance.setCreatedBy(1);
							attendance.setUpdatedBy(1);
							attendance.setAtendanceDate(finaldate);
							attendance.setAtendanceFor(firstHalfObject.getInt("activityFor"));
						}
						if(firstHalfObject.getInt("isPresent")==1) {
							flag=true;
						}else {
							flag=false;
						}
						attendance.setIsPresent(flag);
						attendanceRepository.save(attendance);
					}
				}
				if (secondHalfArray.length() != 0) {
					for (int k = 0; k < secondHalfArray.length(); k++) {
						JSONObject secondHalfObject = secondHalfArray.getJSONObject(k);
						Integer intActivityAllocateDetId = secondHalfObject.getInt("activityAllocateDetId");
						List<Attendance> findByActivityAllocateDetId = attendanceRepository
								.findByActivityAllocateDetIdAndAtendanceDate(intActivityAllocateDetId, finaldate);
						Attendance attendance = null;
						if (findByActivityAllocateDetId.size() != 0) {
							attendance = findByActivityAllocateDetId.get(0);
						} else {
							attendance = new Attendance();
							attendance.setResourceId(resourceObject.getInt("resourceId"));
							attendance.setActivityAllocateId(resourceObject.getInt("activityAllocateId"));
							attendance.setActivityAllocateDetId(secondHalfObject.getInt("activityAllocateDetId"));
							attendance.setCreatedBy(1);
							attendance.setUpdatedBy(1);
							attendance.setAtendanceDate(finaldate);
							attendance.setAtendanceFor(secondHalfObject.getInt("activityFor"));
						}
						if(secondHalfObject.getInt("isPresent")==1) {
							flag2=true;
						}else {
							flag2=false;
						}
						attendance.setIsPresent(flag2);
						attendanceRepository.save(attendance);
					}
				}
				result="success";
			} catch (Exception e) {
				result="fail";
				e.printStackTrace();
			}
		}
		return result;
	}

	@Override
	public JSONArray getAttendanceReportData(String platform, String selectedDate, String year, String month) {
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
				attendanceQuerey.setString(1, "ATTENDANCE_REPORT");
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
							attendance.put("isPresent", rs.getString("isPresent"));
							attendance.put("attendanceStatus", rs.getString("attendanceStatus"));
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
						detailObject.put("isPresent", mapObject.get("isPresent"));
						detailObject.put("activityFor", mapObject.get("activityFor"));
						detailObject.put("attendanceStatus", mapObject.get("attendanceStatus"));
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

}
