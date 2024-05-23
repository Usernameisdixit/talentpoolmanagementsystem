package com.tpms.utils;

import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;

import org.apache.poi.ss.usermodel.DateUtil;
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
			Cell cell = cells.next();
			String cellValue = cellToString(cell);
			
			
			
			switch(cid) {
			case 1: 
			//	ExcelEmp.setId((int)cell.getNumericCellValue());
				tbl_resource_pool_history.setResourceCode(cellValue);
			break;
			case 2: 
				//ExcelEmp.setEmp_name(cell.getStringCellValue());
				tbl_resource_pool_history.setResourceName(cellValue);
			break;
			case 3: 
				//ExcelEmp.setEmp_name(cell.getStringCellValue());
				tbl_resource_pool_history.setDesignation(cellValue);
			break;
			case 4: 
				//ExcelEmp.setEmp_email(cell.getStringCellValue());
				tbl_resource_pool_history.setPlatform(cellValue);
			break;
			case 5:
				//ExcelEmp.setEmp_phone(cell.getStringCellValue().toString());
				tbl_resource_pool_history.setEmail(cellValue);
			break;
			case 6: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setPhoneNo(cellValue);
			break;
			case 7: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setLocation(cellValue);
			break;
			case 8: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setEngagementPlan(cellValue);
			break;
			case 9: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setExperience(cellValue);
			
				
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


//Convert Excel to List of Employee For Validation
@SuppressWarnings("resource")
public static List<ResourcePoolHistory> convertExceltoListofEmployeeForValidation(InputStream is/* , LocalDate allocationDate */){
	
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
			Cell cell = cells.next();
			String cellValue = cellToString(cell);
			
			
			
			switch(cid) {
			case 1: 
			//	ExcelEmp.setId((int)cell.getNumericCellValue());
				tbl_resource_pool_history.setResourceCode(cellValue);
			break;
			case 2: 
				//ExcelEmp.setEmp_name(cell.getStringCellValue());
				tbl_resource_pool_history.setResourceName(cellValue);
			break;
			case 3: 
				//ExcelEmp.setEmp_name(cell.getStringCellValue());
				tbl_resource_pool_history.setDesignation(cellValue);
			break;
			case 4: 
				//ExcelEmp.setEmp_email(cell.getStringCellValue());
				tbl_resource_pool_history.setPlatform(cellValue);
			break;
			case 5:
				//ExcelEmp.setEmp_phone(cell.getStringCellValue().toString());
				tbl_resource_pool_history.setEmail(cellValue);
			break;
			case 6: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setPhoneNo(cellValue);
			break;
			case 7: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setLocation(cellValue);
			break;
			case 8: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setEngagementPlan(cellValue);
			break;
			case 9: 
				//ExcelEmp.setEmp_location(cell.getStringCellValue())
				tbl_resource_pool_history.setExperience(cellValue);
			
				
			break;
			default:
				break;
			}
			cid++;
			tbl_resource_pool_history.setDeletedFlag((byte) 0);
			//tbl_resource_pool_history.setAllocationDate(allocationDate);
			
		}
		
		Emplist.add(tbl_resource_pool_history);
		
		}
		
		
	} catch (Exception e) {
		e.printStackTrace();
	}
	return Emplist;
}


@SuppressWarnings("resource")
public static String checkExcelinproperorder(InputStream is){
	
	String Ach="";
	
	List<String> ExcelColoums = new ArrayList<>();
	
	List<String> firsrowColoums = new ArrayList<>();
	Collections.addAll(firsrowColoums, "Sl No","Employee Code","Employee Name","Designation","Technology","Email","Phone","Location","Engagement Plan","Exp.");
	System.out.println(firsrowColoums);
	
	try {
		
		XSSFWorkbook workbook =new XSSFWorkbook(is);
		//workbook.getSheetAt("data");
		XSSFSheet sheet=workbook.getSheetAt(0);
		
		int rowNumber=0;
		
		Iterator<Row> iterator=sheet.iterator();
		while(iterator.hasNext()) {
			Row row= iterator.next();
			
		Iterator<Cell> cells=	row.iterator();
		
		int cid=0;
		
		while (cells.hasNext())
		{
			Cell cell = cells.next();
			String cellValue = cellToString(cell);
			ExcelColoums.add(cellValue);
			cid++;
		}
		
		break;
		
		}
		
		System.out.println(ExcelColoums);
		
		for(int i=0;i<ExcelColoums.size();i++) {
			for(int j=i;j<=i;j++) {
				
				if(ExcelColoums.get(i).equalsIgnoreCase(firsrowColoums.get(j))) {
					Ach="1";
				}else {
					Ach="2";
					break;
			
				}
					
			}
		}
		
		
		
		
	} catch (Exception e) {
		e.printStackTrace();
	}
	return Ach;
}


//Check For Phone Duplicacy Validation

@SuppressWarnings("resource")
public static String checkExcelphoneDuplicacy(MultipartFile file) throws IOException{
	String phone=null;
	List<ResourcePoolHistory> ExcelEmp = ExcelUtils.convertExceltoListofEmployeeForValidation(file.getInputStream());
	List<String> phoneno = new ArrayList<String>();
	try {
		

		for(int i=0;i<ExcelEmp.size();i++) {
			phone=ExcelEmp.get(i).getPhoneNo();
			if(!phoneno.contains(ExcelEmp.get(i).getPhoneNo())) {
			phoneno.add(ExcelEmp.get(i).getPhoneNo());
		
			}
			else {
			//phone="Uniquephno";	
				break;
			}
		}
		
	}

	 catch (IndexOutOfBoundsException e) {
		e.printStackTrace();
	}
	
	if(ExcelEmp.size()==phoneno.size()) {
	 return "Uniqueness";	
	}
	return phone;
}

//Check For Email Duplicacy Validation
@SuppressWarnings("resource")
public static String CheckExcelEmailDuplicacy(MultipartFile file)  throws IOException{
	String email=null;
	List<ResourcePoolHistory> ExcelEmp = ExcelUtils.convertExceltoListofEmployeeForValidation(file.getInputStream());
	List<String> emailid = new ArrayList<String>();
	try {
		
		for(int i=0;i<ExcelEmp.size();i++) {
			email=ExcelEmp.get(i).getEmail();
			if(!emailid.contains(email)) {
				emailid.add(ExcelEmp.get(i).getEmail());}
			else {
				break;
			}
		}
	}

	catch (IndexOutOfBoundsException e) {

		e.printStackTrace();
	}
	if(ExcelEmp.size()==emailid.size()) {
		 return "Uniqueness";	
		}
	
	return email;
}


//Check For Resource Code ID Duplicacy Validation
@SuppressWarnings("resource")
public static String checkExcelresourceidDuplicacy(MultipartFile file)  throws IOException{
	String resourcecode=null;
	List<ResourcePoolHistory> resourcepoolexcel = ExcelUtils.convertExceltoListofEmployeeForValidation(file.getInputStream());
	List<String> resourceCodelist = new ArrayList<>();
	try {
		
		for(int i=0;i<resourcepoolexcel.size();i++) {
			resourcecode=resourcepoolexcel.get(i).getResourceCode();
			if(!resourceCodelist.contains(resourcecode)) {
				resourceCodelist.add(resourcepoolexcel.get(i).getResourceCode());}
			else {
				break;
			}
		}
	}

	catch (IndexOutOfBoundsException e) {

		e.printStackTrace();
	}
	if(resourcepoolexcel.size()==resourceCodelist.size()) {
		 return "Uniqueness";	
		}
	
	return resourcecode;
}



private static String cellToString(Cell cell) {
    switch (cell.getCellType()) {
        case STRING:
            return cell.getStringCellValue();
        case NUMERIC:
            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toString();
            } else {
                double numericValue = cell.getNumericCellValue();
                if (String.valueOf(numericValue).contains("E")) {
                  
                    DecimalFormat df = new DecimalFormat("0");
                    return df.format(numericValue);
                } else {
                   
                    return String.valueOf(numericValue);
                }
            }
        case BOOLEAN:
            return String.valueOf(cell.getBooleanCellValue());
        case FORMULA:
            return cell.getCellFormula();
        case BLANK:
            return "NA"; 
        default:
            return "NA"; 
    }
}

}




