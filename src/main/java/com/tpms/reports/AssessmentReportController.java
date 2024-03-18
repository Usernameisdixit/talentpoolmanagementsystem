package com.tpms.reports;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import com.tpms.repository.AssessmentRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@CrossOrigin
public class AssessmentReportController {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReport(@RequestParam("year") int year,
                                                 @RequestParam("month") int month,
                                                 @RequestParam("platform") String platform,
                                                 @RequestParam("selectedDate") String selectedDate,
                                                 @RequestParam("reportType") String type) {
    	
    	  LocalDate date = LocalDate.parse(selectedDate); 
    	
        List<Object[]> assessmentDetails = assessmentRepository.findReportDetails(year,month,date,platform);

       
        byte[] reportBytes;
        if ("pdf".equalsIgnoreCase(type)) {
            reportBytes = generatePDFReport(assessmentDetails);
            return getResponseEntityForPDF(reportBytes);
        } else if ("excel".equalsIgnoreCase(type)) {
            reportBytes = generateExcelReport(assessmentDetails);
            return getResponseEntityForExcel(reportBytes);
        } else {
            return null;
        }
    }

    private byte[] generateExcelReport(List<Object[]> assessments) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Assessment Report");
            
          
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Resource Name", "Platform Name", "Activity Name", "Total Marks", "Marks", "Remarks"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            
            
            int rowNum = 1;
            for (Object[] assessmentData : assessments) {
                Row row = sheet.createRow(rowNum++);
                int colNum = 0;
                for (Object field : assessmentData) {
                    Cell cell = row.createCell(colNum++);
                    if (field instanceof String) {
                        cell.setCellValue((String) field);
                    } else if (field instanceof Double) {
                        cell.setCellValue((Double) field);
                    }
                }
            }
            
            workbook.write(outputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return outputStream.toByteArray();
    }


    private ResponseEntity<byte[]> getResponseEntityForExcel(byte[] excelBytes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "report.xlsx");
        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }

    
    private byte[] generatePDFReport(List<Object[]> assessments) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();
            
            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15, BaseColor.BLACK);
            Paragraph titleParagraph = new Paragraph("Assessment Report", titleFont);
            titleParagraph.setAlignment(Element.ALIGN_CENTER);
            titleParagraph.setSpacingAfter(20f);
            document.add(titleParagraph);
            
            PdfPTable table = new PdfPTable(7); 
            table.setWidthPercentage(100);
            addTableHeader(table);
            
            int index = 1;
            
            
            for (Object[] assessmentData : assessments) {
                addRow(table, index++, assessmentData);
            }
            
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return outputStream.toByteArray();
    }


    private void addTableHeader(PdfPTable table) {
        String[] headers = {"Sl.No", "Resource Name", "Platform Name", "Activity Name", "Total Marks", "Marks", "Remarks"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell();        
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setPadding(8);
            cell.setPhrase(new Phrase(header));
            table.addCell(cell);
        }
    }

    
    

    
    private void addRow(PdfPTable table, int serialNumber, Object[] assessmentData) {
       
        PdfPCell serialNumberCell = new PdfPCell(new Phrase(String.valueOf(serialNumber)));
        serialNumberCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(serialNumberCell);
        
       
        for (Object data : assessmentData) {
            table.addCell(String.valueOf(data));
            table.setWidthPercentage(100);
        }
    }




    private ResponseEntity<byte[]> getResponseEntityForPDF(byte[] pdfBytes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "report.pdf");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
