package com.tpms.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
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

import com.fasterxml.jackson.databind.ObjectMapper;
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
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private ActivityRepository activityRepository;
	
	@Autowired
	private ResourcePoolRepository tbl_resource_pool_Repository;


	@Autowired
	private ResourcePoolHistoryRepository tbl_resource_pool_Repository_history;
	
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
					detailObject.put("activityFor", mapObject.get("activityFor"));
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
		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedFromDate = null;
		String formattedToDate = null;
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
		try {
			if (fromDate != null && !fromDate.equals("undefined")) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals("undefined")) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
       
		List<Object[]> activitydata = activityRepository.getactivitypdfdata(formattedFromDate,formattedToDate,activityId);		
			Map<String, Object> attendance = null;
			for(Object ob[]:activitydata)
			{
				attendance = new HashMap<>();
				attendance.put("resourceCode", ob[10].toString());
				attendance.put("resourceName", ob[1].toString());
				attendance.put("fromHours", ob[4].toString());
				attendance.put("toHours", ob[5].toString());
				attendance.put("activityName", ob[6].toString());
				attendance.put("platform", ob[8].toString());
			    attendance.put("atendanceDate", ob[13].toString().concat(" To ").concat(ob[14].toString()));
				attendance.put("activityFor", ob[3].toString());
				attendance.put("designation", ob[9].toString());
				attendance.put("resourceId",ob[0].toString());
				attendanceDetails.add(attendance);
			}	
		
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		return attendanceDetails;
		
	}
	
	
	@Override
	public List<Activity> getActivityDataOnDateRang(String fromDate, String toDate) {
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
		return  activityRepository.getActvitiesReportByDateRange(formattedFromDate,formattedToDate);
	}
	
	@Override
	public List<Map<String, Object>> getActivitynewReport(String reportType, String fromDate, String toDate, String activityId,
			String resourceValue) {
		JSONArray data = new JSONArray();
		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		List<Map<String, Object>> attendanceDetails = new ArrayList<>();
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
			
			List<Object[]> activitydata = activityRepository.getactivitydataaccordingtoresource(formattedFromDate,formattedToDate,resourceValue);
			
			System.out.println(activitydata);
			
			Map<String, Object> attendance = null;
			for(Object ob[]:activitydata)
			{
			attendance = new HashMap<>();
			attendance.put("resourceCode", ob[4].toString());
			attendance.put("resourceName", ob[3].toString());
			attendance.put("fromHours", ob[7].toString());
			attendance.put("toHours", ob[9].toString());
			attendance.put("activityName", ob[10].toString());
			attendance.put("platform", ob[6].toString());
		    attendance.put("atendanceDate", ob[0].toString().concat(" To ").concat(ob[1].toString()));
			attendance.put("activityFor", ob[8].toString());
			attendance.put("designation", ob[5].toString());
			attendance.put("resourceId",ob[11].toString());
			attendanceDetails.add(attendance);
			}	
			} catch (ParseException e1) {

			e1.printStackTrace();
		}
		
		return attendanceDetails;
	    
	}

	@Override
	public List<Activity> getActivityOnDateRangForAssement(String fromDate, String toDate) {
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
		return  activityRepository.getActvitiesByDateRangeForAssement(formattedFromDate,formattedToDate);
	}

	@Override
	public List<Map<String, Object>> getAssesmentData(String reportType, String fromDate, String toDate,
			String activityId, String resourceValue) {
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
		String sqls = "{call TPMS_ATTENDANCE(?,?,?,?,?,?,?)}";
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
							assement.put("resourceName", rs.getString("resourceName"));
							assement.put("resourceCode", rs.getString("resourceCode"));
							assement.put("activityName", rs.getString("activityName"));
							assement.put("doubleActivityMark", rs.getString("doubleActivityMark"));
							assement.put("platform", rs.getString("platform"));
							assement.put("asesmentDate", rs.getString("asesmentDate"));
							assement.put("activityFromDate", rs.getString("activityFromDate"));
							assement.put("activityToDate", rs.getString("activityToDate"));
							assement.put("doubleSecuredMark", rs.getString("doubleSecuredMark")!=null?rs.getString("doubleSecuredMark"):"--");
							assement.put("designation", rs.getString("designation"));
							assement.put("remark", rs.getString("remark")!=null?rs.getString("remark"):"--");
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
			List<ResourcePool> tbl_resource_pool = new ArrayList<>();
			Pageable pageable=PageRequest.of(pageNumber-1, pageSize,Sort.by("resourceName"));
			Page<ResourcePool> page=tbl_resource_pool_Repository.findAllByDeletedUndeletedFlag(pageable);
			
			tbl_resource_pool =page.getContent(); 
//			List<ResourcePool> sortedList=tbl_resource_pool.stream().sorted((a,b)->a.getResourceName()
//					.compareTo(b.getResourceName())).collect(Collectors.toList());
			PageResponse<ResourcePool> pageResponse=new PageResponse<ResourcePool>();
			pageResponse.setContent(tbl_resource_pool);
			pageResponse.setPageSize(page.getSize());
			pageResponse.setTotalElements(page.getTotalElements());
			pageResponse.setTotalPages(page.getTotalPages());
			pageResponse.setLast(page.isLast());

			List<ResourcePoolHistoryDto> tbl_resource_pooldto = new ArrayList<>();
			List<Object[]> tbl_resource_poolfindMinMax = tbl_resource_pool_Repository_history.MinMaxAllocationDate();

			for (Object[] ob : tbl_resource_poolfindMinMax) {
				ResourcePoolHistoryDto rgdt = new ResourcePoolHistoryDto();
				rgdt.setResourceCode(ob[0].toString());
				rgdt.setResourceName(ob[1].toString());
				String Dur = DateUtils.monthDayDifference(ob[2].toString(), ob[3].toString());
				rgdt.setDuration(Dur);
				tbl_resource_pooldto.add(rgdt);
			}

			for (ResourcePool resource : tbl_resource_pool) {
				for (ResourcePoolHistoryDto resourcedto : tbl_resource_pooldto) {
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
			List<JSONObject> Activity = new ArrayList<>();
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
	        	Activity.add(allocationPeriod);
	        }
	        
	        
	        for(int i=0;i<resoHistList.size();i++) {
	        	//for (int j=0;j<resoHistList.get(i).length;j++  )
	     
	         resourceAllocation.put("resource_Code",resoHistList.get(i)[0]); 
	        resourceAllocation.put("periodsArray",Activity); 
		}
	        
	        return resourceAllocation;
		}		
		
	
	
}
