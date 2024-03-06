package com.tpms.controller;

import java.io.File;

import java.io.FileOutputStream;
import java.io.IOException;

import java.io.OutputStream;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;


import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.PostMapping;


import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.Platform;
import com.tpms.repository.PlatformRepository;
import com.tpms.service.impl.ExcelUploadEmployeeServiceImpl;
import com.tpms.service.impl.ResourcePoolServiceImpl;
import com.tpms.utils.ExcelUtils;






@RestController
@CrossOrigin("*")
public class ResourceExcelController {
	
	 @Autowired
	 private PlatformRepository platformRepository;

	@Autowired
	private ExcelUploadEmployeeServiceImpl excelempservice;
	
	@Autowired
	private ResourcePoolServiceImpl tbl_resource_pool_Service;
	
	@Value("${file.directory}")
	private String fileDirectory;
	
	
	@PostMapping("/upload")
	public ResponseEntity<?> UploadExcel (@RequestParam("file") MultipartFile file,@RequestParam("allocationDate") LocalDate allocationDate) throws IOException{
		byte[] fileContent = file.getBytes();
		
		String renamedFileName = renameFile(fileContent,file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')));
		 
		 processExcelData(file); 
		 
		 
		
		if(ExcelUtils.CheckExcelFormat(file)) {
			this.excelempservice.save(file,allocationDate);
			this.tbl_resource_pool_Service.save(file,allocationDate);
			this.excelempservice.insertFile(renamedFileName, allocationDate);
			return ResponseEntity.ok().build();
		}
		
		return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please Upload Excel File Only");
	}
	
	
	public String renameFile(byte[] fileContent, String fileExtension) {

       
        SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMyyyy");
        String formattedDate = dateFormat.format(new Date());
        
        String uniqueFileName = "Resource_File_Dt" + formattedDate + fileExtension;

        try (OutputStream outputStream = new FileOutputStream(fileDirectory + File.separator + uniqueFileName)) {

            outputStream.write(fileContent);

            return uniqueFileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    
    }
	   private void processExcelData(MultipartFile file) throws IOException {
	        Workbook workbook = new XSSFWorkbook(file.getInputStream());
	        Sheet sheet = workbook.getSheetAt(0);

	        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
	            Row row = sheet.getRow(rowIndex);
	            if (row != null) {
	                int columnIndex = 2;
	            
	                    Cell cell = row.getCell(columnIndex);
	                    if (cell != null && cell.getCellTypeEnum() == CellType.STRING) {
	                        String technologyName = cell.getStringCellValue();
	                        savePlatformData(technologyName);
	                    }
	                
	            }
	         
	        }
	    }

	  

	    private void savePlatformData(String technologyName) {
	    	
	    	 String platformCode = technologyName.substring(0, 2);
	        if (platformRepository.findByPlatform(technologyName) != null) {
	            System.out.println("Duplicate technology: " + technologyName);
	            return;
	        }

	        Platform platform = new Platform(); 
	        platform.setPlatform(technologyName);
	        platform.setPlatformCode(platformCode);
	        platform.setCreatedBy(1);
	        platform.setDeletedFlag((byte) 0);
	        
	        platformRepository.save(platform);
	    } 
}
