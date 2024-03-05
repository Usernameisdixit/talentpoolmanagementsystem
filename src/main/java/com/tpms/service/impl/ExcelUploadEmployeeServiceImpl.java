package com.tpms.service.impl;

import java.io.IOException;
import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.ExcelUploadHistory;
import com.tpms.entity.ResourcePoolHistory;
import com.tpms.repository.ExcelUploadHistoryRepository;
import com.tpms.repository.ResourcePoolHistoryRepository;
import com.tpms.utils.ExcelUtils;



@Service
public class ExcelUploadEmployeeServiceImpl {

	@Autowired
	private ResourcePoolHistoryRepository ExcelEmpRepo;
	
	
	@Autowired
	 private ExcelUploadHistoryRepository exceluploadrepo;
	
	
	public void save(MultipartFile file, LocalDate allocationDate) {
		
		try {
			List<ResourcePoolHistory> ExcelEmp=ExcelUtils.convertExceltoListofEmployee(file.getInputStream(),allocationDate);
			this.ExcelEmpRepo.saveAll(ExcelEmp);
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
	        history.setCreatedBy(2);
	        history.setDeletedFlag((byte) 0);
	        exceluploadrepo.save(history);
	    }
	}


	
	
	
	
	
	
	
	

}