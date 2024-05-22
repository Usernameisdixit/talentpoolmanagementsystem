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
import java.util.Objects;

import javax.sql.DataSource;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.tpms.entity.Attendance;
import com.tpms.entity.Platform;
import com.tpms.repository.ActivityRepository;
import com.tpms.repository.AttendanceRepository;
import com.tpms.repository.PlatformRepository;
import com.tpms.repository.ResourcePoolRepository;
import com.tpms.service.AttendanceService;

@Service
public class AttendanceServiceImpl implements AttendanceService {

	private static final String ACTIVITY_ALLOCATE_DET_ID = "activityAllocateDetId";

	private static final String ACTIVITY_ALLOCATE_ID = "activityAllocateId";

	private static final String ACTIVITY_FOR = "activityFor";

	private static final String ACTIVITY_NAME = "activityName";

	private static final String DESIGNATION = "designation";

	private static final String FIRST_HALF = "firstHalf";

	private static final String FROM_HOURS = "fromHours";

	private static final String IS_PRESENT = "isPresent";

	private static final String PLATFORM = "platform";

	private static final String RESOURCE_CODE = "resourceCode";

	private static final String RESOURCE_ID = "resourceId";

	private static final String RESOURCE_NAME = "resourceName";

	private static final String TO_HOURS = "toHours";

	private static final String YYYY_MM_DD = "yyyy-MM-dd";

	private final JdbcTemplate jdbcTemplate;

	private final PlatformRepository platformRepository;

	private final AttendanceRepository attendanceRepository;
	
	private final ResourcePoolRepository resourcePoolRepository;
	
	private final ActivityRepository activityRepository;
	
	public AttendanceServiceImpl(JdbcTemplate jdbcTemplate,PlatformRepository platformRepository,
			AttendanceRepository attendanceRepository,ResourcePoolRepository resourcePoolRepository,
			ActivityRepository activityRepository) {
		this.jdbcTemplate=jdbcTemplate;
		this.platformRepository=platformRepository;
		this.attendanceRepository=attendanceRepository;
		this.resourcePoolRepository=resourcePoolRepository;
		this.activityRepository=activityRepository;
		
	}
	

	@Override
	public List<Platform> getAllPlatform() {
		return platformRepository.findByDeletedFlagFalse();
	}


	@Override
	public List<String> getAllNames(String search) {
		String searchLowerCase = search.toLowerCase();
		return resourcePoolRepository.findAll().stream()
                .map(x -> x.getResourceName()+"("+x.getResourceCode()+")")
                .filter(resourceName -> resourceName.toLowerCase().contains(searchLowerCase))
                .distinct()
                .toList();
	}

	@Override
	public List<Map<String,Object>> getActvitiesByDate(String selectedDate) {
		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedDate = null;
		
		try {
			Date date = inputFormat.parse(selectedDate);
			formattedDate = outputFormat.format(date);
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		return activityRepository.getActvitiesByDate(formattedDate);
	}

	@Override
	public JSONArray attendDetailsByActivity(Integer selectedActivity, String selectedDate) {
		JSONArray data = new JSONArray();

		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		SimpleDateFormat dateFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedDate = null;
		Date finalDate = null;
		try {
			Date date = inputFormat.parse(selectedDate);
			formattedDate = outputFormat.format(date);
			finalDate = dateFormat.parse(formattedDate);
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?,?,?)}";
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
		List<Attendance> atteldanceListPresentNew = attendanceRepository.findByAttendanceDateAndActivity(finalDate,
				selectedActivity);
		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement attendanceQuerey = con.prepareCall(sqls);) {
				if (atteldanceListPresentNew.isEmpty()) {
					attendanceQuerey.setString(1, "ACTIVITY_ATTENDANCE1_ACTIVITY");
				} else {
					attendanceQuerey.setString(1, "ACTIVITY_ATTENDANCE2_ACTIVITY");
				}
				attendanceQuerey.setString(2, null);
				attendanceQuerey.setString(3, formattedDate);
				attendanceQuerey.setString(4, null);
				attendanceQuerey.setString(5, null);
				attendanceQuerey.setString(6, null);
				attendanceQuerey.setInt(7, selectedActivity);

				try (ResultSet rs = attendanceQuerey.executeQuery();) {
					if (rs != null) {
						Map<String, Object> attendance = null;
						while (rs.next()) {
							attendance = new HashMap<>();
							attendance.put(ACTIVITY_FOR, rs.getString(ACTIVITY_FOR));
							attendance.put(RESOURCE_ID, rs.getString(RESOURCE_ID));
							attendance.put(RESOURCE_NAME, rs.getString(RESOURCE_NAME));
							attendance.put(FROM_HOURS, rs.getString(FROM_HOURS));
							attendance.put(TO_HOURS, rs.getString(TO_HOURS));
							attendance.put(ACTIVITY_NAME, rs.getString(ACTIVITY_NAME));
							attendance.put(ACTIVITY_ALLOCATE_DET_ID, rs.getString(ACTIVITY_ALLOCATE_DET_ID));
							attendance.put(PLATFORM, rs.getString(PLATFORM));
							attendance.put(ACTIVITY_ALLOCATE_ID, rs.getString(ACTIVITY_ALLOCATE_ID));
							attendance.put(IS_PRESENT, rs.getString(IS_PRESENT));
							attendance.put(DESIGNATION, rs.getString(DESIGNATION));
							attendance.put(RESOURCE_CODE, rs.getString(RESOURCE_CODE));
							attendanceDetails.add(attendance);
						}
					}

				}
				Integer resourceId = 0;
				JSONObject resource = new JSONObject();
				JSONArray firstHalfArray = new JSONArray();
				for (Map<String, Object> mapObject : attendanceDetails) {
					Integer mapResourceId = Integer.valueOf((String) mapObject.get(RESOURCE_ID));
					Integer intActivityFor = Integer.valueOf((String) mapObject.get(ACTIVITY_FOR));
					if (resourceId == 0) {
						resourceId = mapResourceId;
					} else if (!Objects.equals(resourceId, mapResourceId)) {
						resource.put(FIRST_HALF, firstHalfArray);
						data.put(resource);
						resourceId = mapResourceId;
						resource = new JSONObject();
						firstHalfArray = new JSONArray();
					}
					if (resource.length() == 0) {
						resource.put(RESOURCE_NAME, mapObject.get(RESOURCE_NAME));
						resource.put(RESOURCE_ID, mapResourceId);
						resource.put("domain", mapObject.get(PLATFORM));
						resource.put(ACTIVITY_ALLOCATE_ID, mapObject.get(ACTIVITY_ALLOCATE_ID));
						resource.put(DESIGNATION, mapObject.get(DESIGNATION));
						resource.put(RESOURCE_CODE, mapObject.get(RESOURCE_CODE));
						resource.put("check", atteldanceListPresentNew.isEmpty() ? "s" : "u");
					}
					JSONObject detailObject = new JSONObject();
					detailObject.put(FROM_HOURS, mapObject.get(FROM_HOURS));
					detailObject.put(TO_HOURS, mapObject.get(TO_HOURS));
					detailObject.put(ACTIVITY_NAME, mapObject.get(ACTIVITY_NAME));
					detailObject.put(ACTIVITY_ALLOCATE_DET_ID, mapObject.get(ACTIVITY_ALLOCATE_DET_ID));
					detailObject.put(IS_PRESENT, mapObject.get(IS_PRESENT));
					detailObject.put(ACTIVITY_FOR, mapObject.get(ACTIVITY_FOR));
					if (intActivityFor == 1 || intActivityFor == 2 || intActivityFor == 3) 
						firstHalfArray.put(detailObject);
				}
				if(resource.length()!=0) {
				resource.put(FIRST_HALF, firstHalfArray);
				data.put(resource);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return data;
	}

	@Override
	public String saveAttendanceByActivity(JSONArray allData, String date) {
		boolean flag = false;
		String result = null;
		for (int i = 0; i < allData.length(); i++) {
			try {
				JSONObject resourceObject = allData.getJSONObject(i);
				JSONArray firstHalfArray = resourceObject.getJSONArray(FIRST_HALF);

				SimpleDateFormat inputFormat = new SimpleDateFormat("MM/dd/yyyy");
				SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
				SimpleDateFormat dateFormat = new SimpleDateFormat(YYYY_MM_DD);
				String formattedDate = null;
				Date finaldate = null;
				Date dateRequired = inputFormat.parse(date);
				formattedDate = outputFormat.format(dateRequired);
				finaldate = dateFormat.parse(formattedDate);
				if (firstHalfArray.length() != 0) {
					for (int j = 0; j < firstHalfArray.length(); j++) {
						JSONObject firstHalfObject = firstHalfArray.getJSONObject(j);
						Integer intActivityAllocateDetId = firstHalfObject.getInt(ACTIVITY_ALLOCATE_DET_ID);
						List<Attendance> findByActivityAllocateDetId = attendanceRepository
								.findByActivityAllocateDetIdAndAtendanceDate(intActivityAllocateDetId, finaldate);
						Attendance attendance = null;
						if (!findByActivityAllocateDetId.isEmpty()) {
							attendance = findByActivityAllocateDetId.get(0);
						} else {
							attendance = new Attendance();
							attendance.setResourceId(resourceObject.getInt(RESOURCE_ID));
							attendance.setActivityAllocateId(resourceObject.getInt(ACTIVITY_ALLOCATE_ID));
							attendance.setActivityAllocateDetId(firstHalfObject.getInt(ACTIVITY_ALLOCATE_DET_ID));
							attendance.setCreatedBy(1);
							attendance.setUpdatedBy(1);
							attendance.setAtendanceDate(finaldate);
							attendance.setAtendanceFor(firstHalfObject.getInt(ACTIVITY_FOR));
						}
						if (firstHalfObject.getInt(IS_PRESENT) == 1) {
							flag = true;
						} else {
							flag = false;
						}
						attendance.setIsPresent(flag);
						attendanceRepository.save(attendance);
					}
				}
				result = "success";
			} catch (Exception e) {
				result = "fail";
				e.printStackTrace();
			}
		}
		return result;
	}

}
