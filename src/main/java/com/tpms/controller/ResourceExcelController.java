package com.tpms.controller;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.dto.PageResponse;
import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ExcelUploadHistoryRepository;
import com.tpms.repository.PlatformRepository;
import com.tpms.repository.ResourcePoolRepository;
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
	private ResourcePoolServiceImpl resourcepoolserviceimpl;

	@Autowired
	private ResourcePoolRepository resourcePoolRepository;

	@Autowired
	private ExcelUploadHistoryRepository excelUploadHistoryRepository;

	@Value("${file.directory}")
	private String fileDirectory;

	@PostMapping("/upload")
	public ResponseEntity<?> UploadExcel(@RequestParam("file") MultipartFile file,
			@RequestParam("allocationDate") LocalDate allocationDate) throws IOException {
		byte[] fileContent = file.getBytes();

		createDirectoryIfNotExists(fileDirectory);
		String renamedFileName = renameFile(fileContent,
				file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')), allocationDate);

		processExcelData(file);

		if (ExcelUtils.CheckExcelFormat(file)) {
			this.excelempservice.save(file, allocationDate);
			this.resourcepoolserviceimpl.save(file, allocationDate);
			this.excelempservice.insertFile(renamedFileName, allocationDate);
			return ResponseEntity.ok().build();
		}

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please Upload Excel File Only");
	}
	
	@PostMapping("/uploadCheck")
	public String UploadCheckExcel(@RequestParam("file") MultipartFile file
			) throws IOException {
		
		byte[] fileContent = file.getBytes();

		if (ExcelUtils.CheckExcelFormat(file)) { 
	 String Emp =ExcelUtils.CheckExcelinproperorder(file.getInputStream()); 
			System.out.println(Emp);
			if(Emp.equalsIgnoreCase("2")) {
		return "2";	
		  }}
		  
		return "1";
	}
	
	

	private void createDirectoryIfNotExists(String directoryPath) throws IOException {
		Path path = Paths.get(directoryPath);
		if (!Files.exists(path)) {
			Files.createDirectories(path);
		}

	}

	public String renameFile(byte[] fileContent, String fileExtension, LocalDate allocationDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy");
		String formattedDate = allocationDate.format(formatter);

		String uniqueFileName = "Resource_File_" + formattedDate + fileExtension;

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
				int columnIndex = 4;

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

			return;
		}

		Platform platform = new Platform();
		platform.setPlatform(technologyName);
		platform.setPlatformCode(platformCode);
		platform.setCreatedBy(1);
		platform.setDeletedFlag((byte) 0);

		platformRepository.save(platform);
	}

	@GetMapping("/emp/getResourceList")
	public ResponseEntity<?> gettbl_resource_pool(@RequestParam(defaultValue = "1") Integer pageNumber){
			
		if(pageNumber==0) {
			List<ResourcePool> resourceList=resourcepoolserviceimpl.getAllResources();
			resourceList=resourceList.stream().sorted((a,b)->a.getResourceName().compareTo(b.getResourceName())).collect(Collectors.toList());
		return ResponseEntity.ok(resourceList);
		}
	PageResponse<ResourcePool> resourceList=resourcepoolserviceimpl.getAllEmploye(pageNumber,10);
	 
	return ResponseEntity.ok(resourceList);
	}
	
	

	@GetMapping("/emp/getResourceDetailsWithFileName")
	public List<Object[]> getResourceDetailsWithFileNameC() {
		return this.resourcepoolserviceimpl.getResourceDetailsWithFileNameS();

	}

	// Get Particular Resource From Talent Resource Pool
	@GetMapping("/emp/talent/{id}")
	public ResourcePool getTalentById(@PathVariable Integer id) {
		System.out.println(id);
		return resourcepoolserviceimpl.getTalentById(id);
		// return new ResponseEntity<>(msg, HttpStatus.OK);
	}

	// For Updating Talent Pool Resource
	@PostMapping("/emp/updatetalent")
	public ResponseEntity<String> updateEmployee(@RequestBody ResourcePool emp) {

		String msg = resourcepoolserviceimpl.addorUpdateEmployee(emp);
		return new ResponseEntity<>(msg, HttpStatus.OK);
	}

	// For Deleting Talent Pool Resource
	@DeleteMapping("/emp/talent/{id}")
	public ResponseEntity<String> deleteEmployee(@PathVariable Integer id) {

		String msg = resourcepoolserviceimpl.delete(id);
		return new ResponseEntity<>(msg, HttpStatus.OK);
	}

	// For De-Actiavte The Given Resource From Resource Pool
	@PostMapping("/emp/delete/talent/{id}")
	public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable(name = "id") Integer id) {

		Byte result = resourcepoolserviceimpl.getDeletedFlagByRoleId(id);
		if (result == 1) {
			resourcepoolserviceimpl.updateBitDeletedFlagByFalse(id);
		} else {
			resourcepoolserviceimpl.updateBitDeletedFlagById(id);
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

	@GetMapping("/emp/download/{fileName}")
	public ResponseEntity<byte[]> downloadExcel(@PathVariable String fileName) throws IOException { // Construct the
																									// file path

		String filePath = fileDirectory + fileName;

		File file = new File(filePath);
		if (!file.exists()) {

			return ResponseEntity.notFound().build();
		}

		byte[] excelBytes;
		try (InputStream inputStream = new FileInputStream(file)) {
			excelBytes = inputStream.readAllBytes();
		}

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.setContentDispositionFormData("attachment", fileName);

		// Return the byte array as a ResponseEntity
		return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
	}

	@GetMapping("/downloadTemplate")
	public ResponseEntity<InputStreamResource> downloadExcelTemplate() {
		try {

			Workbook workbook = new XSSFWorkbook();
			Sheet sheet = workbook.createSheet("ResourceData");

			Font boldFont = workbook.createFont();
			boldFont.setBold(true);
			boldFont.setFontName("Arial");
			boldFont.setFontHeightInPoints((short) 12);
			CellStyle boldStyle = workbook.createCellStyle();
			boldStyle.setFont(boldFont);

			Row headerRow = sheet.createRow(0);
			String[] headers = { "SL No", "Employee Code", "Employee Name", "Designation", "Technology", "Email",
					"PhoneNo", "Location", "Engagement Plan", "Exp" };
			for (int i = 0; i < headers.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(headers[i]);
				cell.setCellStyle(boldStyle);
			}

			for (int i = 0; i < headers.length; i++) {
				sheet.autoSizeColumn(i);
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			workbook.write(outputStream);
			byte[] templateBytes = outputStream.toByteArray();

			ByteArrayInputStream inputStream = new ByteArrayInputStream(templateBytes);
			InputStreamResource resource = new InputStreamResource(inputStream);

			HttpHeaders headersResponse = new HttpHeaders();
			headersResponse.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headersResponse.setContentDispositionFormData("attachment", "template.xlsx");

			return ResponseEntity.ok().headers(headersResponse).body(resource);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(500).build();
		}
	}


	// Duration count
	@GetMapping("/emp/durations")
	public ResponseEntity<?> getDurationDetails(@RequestParam("code") String resourceCode) throws JSONException {
		JSONObject details = excelempservice.getDetails(resourceCode);
		System.out.println(details);
		return ResponseEntity.ok(details.toString());

	}

	// Dashboard part [Resource]
	@PostMapping("/getActiveResources")
	public ResponseEntity<?> getActiveResources(@RequestBody String allocationDate) {
		Integer resources = resourcePoolRepository.findAllActiveResource(allocationDate);
		return ResponseEntity.ok(resources);
	}

	@GetMapping("/getAllAllocationDate")
	public ResponseEntity<?> getAllAllocationDate() {
		List<Date> allocateDate = excelUploadHistoryRepository.findLatestDate();
		//allocateDate=allocateDate.stream().sorted().collect(Collectors.toList());
		return ResponseEntity.ok(allocateDate);
	}

}
