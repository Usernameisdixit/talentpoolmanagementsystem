package com.tpms.utils;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.ResourcePoolHistory;




public class ExcelUtils {

	
	//Check File is of Excel Type or not
public static boolean CheckExcelFormat(MultipartFile file) {
	
	String contentType=file.getContentType();
	if(contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
		return true;
	}else {
		return false;
	}
}

//Convert Excel to List of Employee
@SuppressWarnings("resource")
public static List<ResourcePoolHistory> convertExceltoListofEmployee(InputStream is, LocalDate allocationDate){
	
	List<ResourcePoolHistory> Emplist=new ArrayList<>();
	
	try {
		
		XSSFWorkbook workbook =new XSSFWorkbook(is);
		//workbook.getSheetAt("data");
		XSSFSheet sheet=workbook.getSheetAt(0);
		
		int rowNumber=0;
		
		Iterator<Row> iterator=sheet.iterator();
		while(iterator.hasNext()) {
			
			Row row= iterator.next();
			if(rowNumber==0) {
				rowNumber++;
				continue;
			}
			
		Iterator<Cell> cells=	row.iterator();
		
		int cid=0;
		
		ResourcePoolHistory  tbl_resource_pool_history =new ResourcePoolHistory();
		
	//	ExcelUploadEmployee ExcelEmp=new ExcelUploadEmployee();
		
		while (cells.hasNext())
		{
			Cell cell =cells.next();
			
			System.out.println(cell);
			
			switch(cid) {
			case 0: 
			//	ExcelEmp.setId((int)cell.getNumericCellValue());
				tbl_resource_pool_history.setResourceCode(cell.getStringCellValue());
			break;
			case 1: 
				//ExcelEmp.setEmp_name(cell.getStringCellValue());
				tbl_resource_pool_history.setResourceName(cell.getStringCellValue());
			break;
			case 2: 
				//ExcelEmp.setEmp_name(cell.getStringCellValue());
				tbl_resource_pool_history.setDesignation(cell.getStringCellValue());
			break;
			case 3: 
				//ExcelEmp.setEmp_email(cell.getStringCellValue());
				tbl_resource_pool_history.setPlatform(cell.getStringCellValue());
			break;
			case 4:
				//ExcelEmp.setEmp_phone(cell.getStringCellValue().toString());
				tbl_resource_pool_history.setEmail(cell.getStringCellValue());
			break;
			case 5: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setPhoneNo(cell.getStringCellValue());
			break;
			case 6: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setLocation(cell.getStringCellValue());
			break;
			case 7: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setEngagementPlan(cell.getStringCellValue());
			break;
			case 8: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setExperience(cell.getStringCellValue());
			
				
			break;
			default:
				break;
			}
			cid++;
			tbl_resource_pool_history.setDeletedFlag((byte) 0);
			tbl_resource_pool_history.setAllocationDate(allocationDate);
			
		}
		
		Emplist.add(tbl_resource_pool_history);
		
		}
		
		
	} catch (Exception e) {
		e.printStackTrace();
	}
	return Emplist;
}
	
}
