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
		String sqls = "{call TPMS_ATTENDANCE(?,?,?)}";
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

				try (ResultSet rs = attendanceQuerey.executeQuery();) {
					if (rs != null) {
						Map<String, Object> attendance = null;
						while (rs.next()) {
							attendance = new HashMap<>();
							attendance.put("intActivityFor", rs.getString("intActivityFor"));
							attendance.put("intResourceId", rs.getString("intResourceId"));
							attendance.put("vchResourceName", rs.getString("vchResourceName"));
							attendance.put("txtActivityDetails", rs.getString("txtActivityDetails"));
							attendance.put("vchFromHours", rs.getString("vchFromHours"));
							attendance.put("vchToHours", rs.getString("vchToHours"));
							attendance.put("vchActivityName", rs.getString("vchActivityName"));
							attendance.put("intActivityAllocateDetId", rs.getString("intActivityAllocateDetId"));
							attendance.put("vchPlatform", rs.getString("vchPlatform"));
							attendance.put("intActivityAllocateId", rs.getString("intActivityAllocateId"));
							attendance.put("intActivityAllocateDetId", rs.getString("intActivityAllocateDetId"));
							attendance.put("chrPresent", rs.getString("chrPresent"));
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
						Integer mapResourceId = Integer.valueOf((String) mapObject.get("intResourceId"));
						Integer intActivityFor = Integer.valueOf((String) mapObject.get("intActivityFor"));
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
							resource.put("vchResourceName", mapObject.get("vchResourceName"));
							resource.put("intResourceId", mapResourceId);
							resource.put("domain", mapObject.get("vchPlatform"));
							resource.put("intActivityAllocateId", mapObject.get("intActivityAllocateId"));
							resource.put("check", atteldanceListPresentNew.size() == 0 ? "s" : "u");
						}
						JSONObject detailObject = new JSONObject();
						detailObject.put("txtActivityDetails", mapObject.get("txtActivityDetails"));
						detailObject.put("vchFromHours", mapObject.get("vchFromHours"));
						detailObject.put("vchToHours", mapObject.get("vchToHours"));
						detailObject.put("vchActivityName", mapObject.get("vchActivityName"));
						detailObject.put("intActivityAllocateDetId", mapObject.get("intActivityAllocateDetId"));
						detailObject.put("chrPresent", mapObject.get("chrPresent"));
						detailObject.put("intActivityFor", mapObject.get("intActivityFor"));
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
		return platformRepository.findAll();
	}

	@Override
	public void saveAttendance(JSONArray allData, String date) {
		boolean flag=false;
		boolean flag2=false;
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
						Integer intActivityAllocateDetId = firstHalfObject.getInt("intActivityAllocateDetId");
//						List<Attendance> findByActivityAllocateDetId = attendanceRepository
//								.findByActivityAllocateDetId(intActivityAllocateDetId);
						List<Attendance> findByActivityAllocateDetId = attendanceRepository
								.findByActivityAllocateDetIdAndDtmAtendanceDate(intActivityAllocateDetId, finaldate);
						Attendance attendance = null;
						if (findByActivityAllocateDetId.size() != 0) {
							attendance = findByActivityAllocateDetId.get(0);
						} else {
							attendance = new Attendance();
							attendance.setResourceId(resourceObject.getInt("intResourceId"));
							attendance.setActivityAllocateId(resourceObject.getInt("intActivityAllocateId"));
							attendance.setActivityAllocateDetId(firstHalfObject.getInt("intActivityAllocateDetId"));
							attendance.setCreatedBy(1);
							attendance.setUpdatedBy(1);
							attendance.setDtmAtendanceDate(finaldate);
							attendance.setIntAtendanceFor(firstHalfObject.getInt("intActivityFor"));
						}
						if(firstHalfObject.getInt("chrPresent")==1) {
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
						Integer intActivityAllocateDetId = secondHalfObject.getInt("intActivityAllocateDetId");
						List<Attendance> findByActivityAllocateDetId = attendanceRepository
								.findByActivityAllocateDetIdAndDtmAtendanceDate(intActivityAllocateDetId, finaldate);
						Attendance attendance = null;
						if (findByActivityAllocateDetId.size() != 0) {
							attendance = findByActivityAllocateDetId.get(0);
						} else {
							attendance = new Attendance();
							attendance.setResourceId(resourceObject.getInt("intResourceId"));
							attendance.setActivityAllocateId(resourceObject.getInt("intActivityAllocateId"));
							attendance.setActivityAllocateDetId(secondHalfObject.getInt("intActivityAllocateDetId"));
							attendance.setCreatedBy(1);
							attendance.setUpdatedBy(1);
							attendance.setDtmAtendanceDate(finaldate);
							attendance.setIntAtendanceFor(secondHalfObject.getInt("intActivityFor"));
						}
						if(secondHalfObject.getInt("chrPresent")==1) {
							flag2=true;
						}else {
							flag2=false;
						}
						attendanceRepository.save(attendance);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
