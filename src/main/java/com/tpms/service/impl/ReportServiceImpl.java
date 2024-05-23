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
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.tpms.dto.PageResponse;
import com.tpms.dto.ResourcePoolHistoryDto;
import com.tpms.entity.Activity;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ActivityRepository;
import com.tpms.repository.ResourcePoolHistoryRepository;
import com.tpms.repository.ResourcePoolRepository;
import com.tpms.service.ReportService;
import com.tpms.utils.DateUtils;

@Service
public class ReportServiceImpl implements ReportService {
	
	private static final String REMARK = "remark";

	private static final String DOUBLE_SECURED_MARK = "doubleSecuredMark";

	private static final String RESOURCE_ID = "resourceId";

	private static final String DESIGNATION = "designation";

	private static final String ACTIVITY_FOR = "activityFor";

	private static final String ATENDANCE_DATE = "atendanceDate";

	private static final String ATTENDANCE_STATUS = "attendanceStatus";

	private static final String PLATFORM = "platform";

	private static final String ACTIVITY_NAME = "activityName";

	private static final String TO_HOURS = "toHours";

	private static final String FROM_HOURS = "fromHours";

	private static final String RESOURCE_NAME = "resourceName";

	private static final String RESOURCE_CODE = "resourceCode";

	private static final String CALL_TPMS_ATTENDANCE = "{call TPMS_ATTENDANCE(?,?,?,?,?,?,?)}";

	private static final String UNDEFINED = "undefined";

	private static final String YYYY_MM_DD = "yyyy-MM-dd";

	private static final String M_D_YYYY_H_MM_SS_A = "M/d/yyyy, h:mm:ss a";

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private ActivityRepository activityRepository;
	
	@Autowired
	private ResourcePoolRepository tblResourcePoolRepository;


	@Autowired
	private ResourcePoolHistoryRepository tblResourcePoolRepositoryHistory;
	
	@Override
	public List<Map<String, Object>> getAttendanceData(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue) {
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = CALL_TPMS_ATTENDANCE;
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
							attendance.put(RESOURCE_CODE, rs.getString(RESOURCE_CODE));
							attendance.put(RESOURCE_NAME, rs.getString(RESOURCE_NAME));
							attendance.put(FROM_HOURS, rs.getString(FROM_HOURS));
							attendance.put(TO_HOURS, rs.getString(TO_HOURS));
							attendance.put(ACTIVITY_NAME, rs.getString(ACTIVITY_NAME));
							attendance.put(PLATFORM, rs.getString(PLATFORM));
							attendance.put(ATTENDANCE_STATUS, rs.getString(ATTENDANCE_STATUS));
							attendance.put(ATENDANCE_DATE, rs.getString(ATENDANCE_DATE));
							attendance.put(ACTIVITY_FOR, rs.getString(ACTIVITY_FOR));
							attendance.put(DESIGNATION, rs.getString(DESIGNATION));
							attendanceDetails.add(attendance);
						}
					}

				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
		return attendanceDetails;
	}

	@Override
	public List<Activity> getAttendanceDataOnDateRang(String fromDate, String toDate) {
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
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
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = CALL_TPMS_ATTENDANCE;
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
							attendance.put(RESOURCE_CODE, rs.getString(RESOURCE_CODE));
							attendance.put(RESOURCE_NAME, rs.getString(RESOURCE_NAME));
							attendance.put(FROM_HOURS, rs.getString(FROM_HOURS));
							attendance.put(TO_HOURS, rs.getString(TO_HOURS));
							attendance.put(ACTIVITY_NAME, rs.getString(ACTIVITY_NAME));
							attendance.put(PLATFORM, rs.getString(PLATFORM));
							attendance.put(ATTENDANCE_STATUS, rs.getString(ATTENDANCE_STATUS));
							attendance.put(ATENDANCE_DATE, rs.getString(ATENDANCE_DATE));
							attendance.put(ACTIVITY_FOR, rs.getString(ACTIVITY_FOR));
							attendance.put(DESIGNATION, rs.getString(DESIGNATION));
							attendance.put(RESOURCE_ID, rs.getString(RESOURCE_ID));
							attendanceDetails.add(attendance);
						}
					}

				}
				Integer resourceId = 0;
				String activityDate="";
				JSONObject resource = new JSONObject();
				JSONArray activityAttenDetailsArray = new JSONArray();
				for (Map<String, Object> mapObject : attendanceDetails) {
					Integer mapResourceId = Integer.valueOf((String) mapObject.get(RESOURCE_ID));
					String checkDate =  (String) mapObject.get(ATENDANCE_DATE);
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
						resource.put(RESOURCE_NAME, mapObject.get(RESOURCE_NAME));
						resource.put("domain", mapObject.get(PLATFORM));
						resource.put(ATENDANCE_DATE, mapObject.get(ATENDANCE_DATE));
						resource.put(RESOURCE_CODE, mapObject.get(RESOURCE_CODE));
						resource.put(PLATFORM, mapObject.get(PLATFORM));
						resource.put(DESIGNATION, mapObject.get(DESIGNATION));
					}
					JSONObject detailObject = new JSONObject();
					detailObject.put(ACTIVITY_NAME, mapObject.get(ACTIVITY_NAME));
					detailObject.put("isPresent", mapObject.get("isPresent"));
					detailObject.put(ATTENDANCE_STATUS, mapObject.get(ATTENDANCE_STATUS));
					detailObject.put(ACTIVITY_FOR, mapObject.get(ACTIVITY_FOR));
					activityAttenDetailsArray.put(detailObject);
					
				}
				if(resource.length()!=0) {
				resource.put("activityAttenDetails", activityAttenDetailsArray);
				data.put(resource);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
		return data;
	}
	
	
	@Override
	public List<Map<String, Object>> getActivitynewDataReport(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue) {
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedFromDate = null;
		String formattedToDate = null;
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
       
		List<Object[]> activitydata = activityRepository.getactivitypdfdata(formattedFromDate,formattedToDate,activityId);		
			Map<String, Object> attendance = null;
			for(Object[] ob:activitydata)
			{
				attendance = new HashMap<>();
				attendance.put(RESOURCE_CODE, ob[10].toString());
				attendance.put(RESOURCE_NAME, ob[1].toString());
				attendance.put(FROM_HOURS, ob[4].toString());
				attendance.put(TO_HOURS, ob[5].toString());
				attendance.put(ACTIVITY_NAME, ob[6].toString());
				attendance.put(PLATFORM, ob[8].toString());
			    attendance.put(ATENDANCE_DATE, ob[13].toString().concat(" To ").concat(ob[14].toString()));
				attendance.put(ACTIVITY_FOR, ob[3].toString());
				attendance.put(DESIGNATION, ob[9].toString());
				attendance.put(RESOURCE_ID,ob[0].toString());
				attendanceDetails.add(attendance);
			}	
		
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		return attendanceDetails;
		
	}
	
	
	@Override
	public List<Activity> getActivityDataOnDateRang(String fromDate, String toDate) {
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		return  activityRepository.getActvitiesReportByDateRange(formattedFromDate,formattedToDate);
	}
	
	@Override
	public List<Map<String, Object>> getActivitynewReport(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue) {
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
			
			List<Object[]> activitydata = activityRepository.getactivitydataaccordingtoresource(formattedFromDate,formattedToDate,resourceValue);
			
			
			Map<String, Object> attendance = null;
			for(Object[] ob:activitydata)
			{
			attendance = new HashMap<>();
			attendance.put(RESOURCE_CODE, ob[4].toString());
			attendance.put(RESOURCE_NAME, ob[3].toString());
			attendance.put(FROM_HOURS, ob[7].toString());
			attendance.put(TO_HOURS, ob[9].toString());
			attendance.put(ACTIVITY_NAME, ob[10].toString());
			attendance.put(PLATFORM, ob[6].toString());
		    attendance.put(ATENDANCE_DATE, ob[0].toString().concat(" To ").concat(ob[1].toString()));
			attendance.put(ACTIVITY_FOR, ob[8].toString());
			attendance.put(DESIGNATION, ob[5].toString());
			attendance.put(RESOURCE_ID,ob[11].toString());
			attendanceDetails.add(attendance);
			}	
			} catch (ParseException e1) {

			e1.printStackTrace();
		}
		
		return attendanceDetails;
	    
	}

	@Override
	public List<Activity> getActivityOnDateRangForAssement(String fromDate, String toDate) {
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		return  activityRepository.getActvitiesByDateRangeForAssement(formattedFromDate,formattedToDate);
	}

	@Override
	public List<Map<String, Object>> getAssesmentData(String reportType, String fromDate, String toDate,
			String activityId, String resourceValue) {
		SimpleDateFormat inputFormat = new SimpleDateFormat(M_D_YYYY_H_MM_SS_A);
		SimpleDateFormat outputFormat = new SimpleDateFormat(YYYY_MM_DD);
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals(UNDEFINED)) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		String sqls = CALL_TPMS_ATTENDANCE;
		List<Map<String, Object>> assesmentDetails = new ArrayList<>();

		DataSource ds = jdbcTemplate.getDataSource();
		if (ds != null) {
			try (Connection con = ds.getConnection(); CallableStatement assesmentQuerey = con.prepareCall(sqls);) {
				assesmentQuerey.setString(1, "ASSESMENT_REPORT_DATA");
				assesmentQuerey.setString(2, formattedFromDate);
				assesmentQuerey.setString(3, formattedToDate);
				assesmentQuerey.setString(4, activityId);
				assesmentQuerey.setString(5, reportType);
				assesmentQuerey.setString(6, resourceValue);
				assesmentQuerey.setInt(7, 0);

				try (ResultSet rs = assesmentQuerey.executeQuery();) {
					if (rs != null) {
						Map<String, Object> assement = null;
						while (rs.next()) {
							assement = new HashMap<>();
							assement.put("asesmentId", rs.getString("asesmentId"));
							assement.put(RESOURCE_NAME, rs.getString(RESOURCE_NAME));
							assement.put(RESOURCE_CODE, rs.getString(RESOURCE_CODE));
							assement.put(ACTIVITY_NAME, rs.getString(ACTIVITY_NAME));
							assement.put("doubleActivityMark", rs.getString("doubleActivityMark"));
							assement.put(PLATFORM, rs.getString(PLATFORM));
							assement.put("asesmentDate", rs.getString("asesmentDate"));
							assement.put("activityFromDate", rs.getString("activityFromDate"));
							assement.put("activityToDate", rs.getString("activityToDate"));
							assement.put(DOUBLE_SECURED_MARK, rs.getString(DOUBLE_SECURED_MARK)!=null?rs.getString(DOUBLE_SECURED_MARK):"--");
							assement.put(DESIGNATION, rs.getString(DESIGNATION));
							assement.put(REMARK, rs.getString(REMARK)!=null?rs.getString(REMARK):"--");
							assesmentDetails.add(assement);
						}
					}

				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
		return assesmentDetails;
	}	
	
	
	//Resource Report Service
	
		@Override
		public PageResponse<ResourcePool> getAllEmployeResourceReport(int pageNumber, int pageSize) {
			List<ResourcePool> tblResourcePool = new ArrayList<>();
			Pageable pageable=PageRequest.of(pageNumber-1, pageSize,Sort.by(RESOURCE_NAME));
			Page<ResourcePool> page=tblResourcePoolRepository.findAll(pageable);
			
			tblResourcePool =page.getContent(); 

			PageResponse<ResourcePool> pageResponse=new PageResponse<>();
			pageResponse.setContent(tblResourcePool);
			pageResponse.setPageSize(page.getSize());
			pageResponse.setTotalElements(page.getTotalElements());
			pageResponse.setTotalPages(page.getTotalPages());
			pageResponse.setLast(page.isLast());

			List<ResourcePoolHistoryDto> tblResourcePoolDto = new ArrayList<>();
			List<Object[]> tblResourcePoolfindMinMax = tblResourcePoolRepositoryHistory.minMaxAllocationDate();

			for (Object[] ob : tblResourcePoolfindMinMax) {
				ResourcePoolHistoryDto rgdt = new ResourcePoolHistoryDto();
				rgdt.setResourceCode(ob[0].toString());
				rgdt.setResourceName(ob[1].toString());
				String dur = DateUtils.monthDayDifference(ob[2].toString(), ob[3].toString());
				rgdt.setDuration(dur);
				tblResourcePoolDto.add(rgdt);
			}

			for (ResourcePool resource : tblResourcePool) {
				for (ResourcePoolHistoryDto resourcedto : tblResourcePoolDto) {
					if (resource.getResourceCode().equalsIgnoreCase(resourcedto.getResourceCode())) {
						resource.setDuration(resourcedto.getDuration());
					}
				}
			}
			return pageResponse;
		}
		

		// For getting ACtivities of Particular Resource
		public JSONObject getDetails(String resourceCode)  throws JSONException {
			List<Object[]> resoHistList=activityRepository.getAllResourceByCode(resourceCode);
			List<JSONObject> activity = new ArrayList<>();
			String rcode = null;
			if (!resoHistList.isEmpty()) {
			    Object[] firstRow = resoHistList.get(0);
			    rcode = (String) firstRow[0];
			}
		
	        // Create JSON object containing resource name and allocation periods
	        JSONObject resourceAllocation = new JSONObject();
	    
	        for(int i=0;i<resoHistList.size();i++) {
	        	JSONObject allocationPeriod = new JSONObject();
	        	allocationPeriod.put("Activity",resoHistList.get(i)[1]);
	        	activity.add(allocationPeriod);
	        }
	        
	        for(int i=0;i<resoHistList.size();i++) {
	        	resourceAllocation.put("resource_Code",resoHistList.get(i)[0]); 
	        	resourceAllocation.put("periodsArray",activity); 
		    }
	        
	        return resourceAllocation;
		}		
		
	
	
}
