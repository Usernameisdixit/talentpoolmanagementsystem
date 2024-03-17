package com.tpms.controller;

import java.io.File;

import java.io.FileOutputStream;
import java.io.IOException;

import java.io.OutputStream;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
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
	    
	    
		@GetMapping("/emp/uploadedData")
		public List<ResourcePool> gettbl_resource_pool(){
			return this.tbl_resource_pool_Service.getAllEmploye();
			
		}
		 
	   
		//Get Particular Resource From Talent Resource Pool
		@GetMapping("/emp/talent/{id}")
		public ResourcePool getTalentById(@PathVariable Integer id){ 
			System.out.println(id);
			return tbl_resource_pool_Service.getTalentById(id);
			//return new ResponseEntity<>(msg, HttpStatus.OK);
		}
		
		
		//For Updating Talent Pool Resource
		@PutMapping("/emp/talent")
		public ResponseEntity<String> updateEmployee (@RequestBody ResourcePool emp){ 
			
			String msg =tbl_resource_pool_Service.addorUpdateEmployee(emp);
			return new ResponseEntity<>(msg, HttpStatus.OK);
		}
	    
		//For Deleting Talent Pool Resource
		@DeleteMapping("/emp/talent/{id}")
		public ResponseEntity<String> deleteEmployee (@PathVariable Integer id){ 
		
			String msg=tbl_resource_pool_Service.delete(id);
			return new ResponseEntity<>(msg, HttpStatus.OK);
		}
	    
		//For De-Actiavte The Given Resource From Resource Pool
		@PostMapping("/emp/delete/talent/{id}")
		public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable(name = "id") Integer id) {

			Byte result = tbl_resource_pool_Service.getDeletedFlagByRoleId(id);
			if (result == 1) {
				tbl_resource_pool_Service.updateBitDeletedFlagByFalse(id);
			} else {
				tbl_resource_pool_Service.updateBitDeletedFlagById(id);
			}

			Map<String, Object> response = new HashMap<>();
			response.put("status", 200);
			response.put("deleted", "Data Deleted Succesfully");
			if (result == 1) {
				response.put("deletedFlag", false);
			} else {
				response.put("deletedFlag", true);
			}

			return ResponseEntity.ok().body(response);
		}
	
		
		
		
		
		
	    
}
