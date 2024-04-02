package com.tpms.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import java.util.Optional;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.dto.ResourcePoolHistoryDto;
import com.tpms.entity.ExcelUploadHistory;
import com.tpms.entity.ResourcePoolHistory;
import com.tpms.repository.ExcelUploadHistoryRepository;
import com.tpms.repository.ResourcePoolHistoryRepository;
import com.tpms.utils.ExcelUtils;

import io.jsonwebtoken.lang.Objects;
import jakarta.transaction.Transactional;



@Service
public class ExcelUploadEmployeeServiceImpl {

	@Autowired
	private ResourcePoolHistoryRepository ExcelEmpRepo;
	
	
	@Autowired
	 private ExcelUploadHistoryRepository exceluploadrepo;
	
	@Transactional
	public void save(MultipartFile file, LocalDate allocationDate) {
	    try {
	        List<ResourcePoolHistory> ExcelEmp = ExcelUtils.convertExceltoListofEmployee(file.getInputStream(), allocationDate);

	        ExcelEmp.removeIf(resources -> resources.getResourceCode() == null);

	        
	        List<ResourcePoolHistory> existingRecords = this.ExcelEmpRepo.findByAllocationDate(allocationDate);
	       if(!existingRecords.isEmpty())
	       {
	    	   ExcelEmpRepo.deleteByAllocationDate(allocationDate);
	    	   ExcelEmpRepo.saveAll(ExcelEmp);

	       }
	       else 
	       {
	    	   this.ExcelEmpRepo.saveAll(ExcelEmp);  
	       }
	            
	        
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}

	public List<ResourcePoolHistory> getAllEmploye(){
		return this.ExcelEmpRepo.findAll();
		
	}
	
	

	public void insertFile(String renamedFileName, LocalDate allocationDate) {
	    // Check if there's an existing record with the same allocation date
	    Optional<ExcelUploadHistory> existingRecord = exceluploadrepo.findByAllocationDate(allocationDate);

	    if (existingRecord.isPresent()) {
	        // Update the existing record with the new file name
	        ExcelUploadHistory history = existingRecord.get();
	        history.setFileName(renamedFileName);
	        exceluploadrepo.save(history);
	    } else {
	        // Insert a new record
	        ExcelUploadHistory history = new ExcelUploadHistory();
	        history.setFileName(renamedFileName);
	        history.setAllocationDate(allocationDate);
	        history.setCreatedBy(1);
	        history.setDeletedFlag((byte) 0);
	        exceluploadrepo.save(history);
	    }
	}

	public JSONObject getDetails(String resourceCode) throws JSONException {
		List<Object[]> resoHistList=ExcelEmpRepo.getAllResourceByCode(resourceCode);
		String resourceName = null;
		if (!resoHistList.isEmpty()) {
		    Object[] firstRow = resoHistList.get(0);
		    resourceName = (String) firstRow[0];
		}
		// Parse the data and collect allocation dates for the resource
        List<LocalDate> allocationDates = new ArrayList<>();
        for (Object[] row : resoHistList) {
            java.sql.Date allocationDateSQL = (java.sql.Date) row[2];
          // Convert to LocalDate
            LocalDate allocationDate = allocationDateSQL.toLocalDate(); 
            allocationDates.add(allocationDate);
        }
        
        // Determine the consecutive allocation periods
        List<JSONObject> allocationPeriods = new ArrayList<>();
        LocalDate startDate = null;
        LocalDate endDate = null;
        for (int i = 0; i < allocationDates.size(); i++) {
            LocalDate currentDate = allocationDates.get(i);
            
            if (startDate == null) {
                startDate = currentDate;
                endDate = startDate.plusWeeks(1);
            } else {
                // Check if the current date is within the same week as the end date
                if (currentDate.isBefore(endDate.plusWeeks(1).minusDays(1))) {
                    endDate = endDate.plusWeeks(1);
                } else {
                    // Print the allocation period
                    JSONObject allocationPeriod = new JSONObject();
                    allocationPeriod.put("start_date", startDate.toString());
                    allocationPeriod.put("end_date", endDate.minusDays(1).toString());
                    allocationPeriods.add(allocationPeriod);
                    startDate = currentDate;
                    endDate = startDate.plusWeeks(1);
                }
            }
        }
        
        if (startDate != null) {
            JSONObject allocationPeriod = new JSONObject();
            allocationPeriod.put("start_date", startDate.toString());
            allocationPeriod.put("end_date", endDate.minusDays(1).toString());
            allocationPeriods.add(allocationPeriod);
        }
        // Create JSON object containing resource name and allocation periods
        JSONObject resourceAllocation = new JSONObject();
        resourceAllocation.put("resource_name",resourceName); 
        resourceAllocation.put("resource_code",resourceCode); 
        JSONArray periodsArray = new JSONArray();
        for (JSONObject period : allocationPeriods) {
            periodsArray.put(period);
        }
        resourceAllocation.put("allocation_periods", periodsArray);
        
        return resourceAllocation;
	}


	
	
	
	
	
	
	
	

}