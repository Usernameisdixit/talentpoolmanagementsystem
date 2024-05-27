package com.tpms.controller;

import java.text.ParseException;

import java.text.SimpleDateFormat;

import java.time.format.DateTimeParseException;
import java.util.Date;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



import com.tpms.dto.AssessmentDto;
import com.tpms.entity.Assessment;
import com.tpms.entity.Platform;
import com.tpms.repository.ActivityAllocationDetailsRepository;
import com.tpms.repository.ActivityAllocationRepository;
import com.tpms.repository.AssessmentRepository;
import com.tpms.repository.PlatformRepository;

import com.tpms.service.impl.AssessmentService;

@RestController
@CrossOrigin
public class AssessmentDetailsController {
	
	//sonar line issue->Defined a constant instead of duplicating literal "yyyy-MM-dd"

    private static final String DATE_FORMAT = "yyyy-MM-dd";

	
	// implemented logger to remove system  message dependency
     Logger logger 
    = LoggerFactory.getLogger(AssessmentDetailsController.class); 

    @Autowired
    private PlatformRepository platformRepository;

    @Autowired
    private ActivityAllocationRepository activityallocationRepository;

    @Autowired
    private ActivityAllocationDetailsRepository activityAllocationDetailsRepository;
    
    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
   

    @GetMapping("/getPlatforms")
    public List<Platform> getPlatforms() {
        return platformRepository.findAll();
    }
    
    @GetMapping("/getFromToDate")
    public List<Map<String, Date>> getFromToDate() {
    	
    	// sonar lint issue and now consuming resource once
        return assessmentRepository.getFromToDate();
    }

    @GetMapping("/getActivityDetails")
    public ResponseEntity<?> getActivityDetails(
            @RequestParam Integer activityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String toDate) {
        try {
            Date from = new SimpleDateFormat(DATE_FORMAT).parse(fromDate);
            Date toDt = new SimpleDateFormat(DATE_FORMAT).parse(toDate);

            List<Object[]> activityAllocationDetails = activityallocationRepository
                    .getActivityDetails(activityId, from, toDt);
                  
            return ResponseEntity.ok(activityAllocationDetails);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please provide dates in yyyy-MM-dd format.");
        }
    }

    @GetMapping("/api/assessment-details")
    public ResponseEntity<?> getAssessmentDetails(
            @RequestParam Integer activityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String toDate) {
        try {
            Date from = new SimpleDateFormat(DATE_FORMAT).parse(fromDate);
            Date toDt = new SimpleDateFormat(DATE_FORMAT).parse(toDate);

            List<Object[]> activityAllocationDetails = activityallocationRepository
                    .getAssessmentDetails(activityId, from, toDt);
                  
            return ResponseEntity.ok(activityAllocationDetails);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please provide dates in yyyy-MM-dd format.");
        }
    }


 
    
    @PostMapping("/assessments")
    public ResponseEntity<?> submitAssessments(@RequestBody List<AssessmentDto> assessments) {
        return assessmentService.submitAssessments(assessments);
    }
    
    @GetMapping("/viewAssesmentDetails")
    public ResponseEntity<List<Object[]>> viewAssesmentDetails(Model model) {
        List<Object[]> assessmentDetails = assessmentRepository.findAllWithDetails();
        return ResponseEntity.ok().body(assessmentDetails);
        
    }
   
    
    @GetMapping("/viewAssesmentDetailsDateWise")
    public ResponseEntity<List<Object[]>> viewAssesmentDetailsDateWise(@RequestParam("asesmentDate") String asesmentDate,Model model) {
       
    	 Date asesDate;
    	 List<Object[]> assessmentDetails =null;
		try {
			asesDate = new SimpleDateFormat(DATE_FORMAT).parse(asesmentDate);
			assessmentDetails = assessmentRepository.findAllWithDetailsByYearAndMonth(asesDate);
		} catch (ParseException e) {
		
			e.printStackTrace();
		}
       
        return ResponseEntity.ok().body(assessmentDetails);
    }
    
    @GetMapping("/editAssessment/{id}")
    public List<Object[]> getAssessmentById(@PathVariable Integer id) {
        return assessmentRepository.findDetailsByAssessmentId(id);
    }

    @PutMapping("/updateAssessment")
    public ResponseEntity<?> updateAssessment(@RequestBody List<AssessmentDto> updatedData) {
        logger.info("Updated Data: {}", updatedData);
         // assessmentService.updateAssessment(updatedData);
          return assessmentService.updateAssessment(updatedData);  
      
    }
    
    @GetMapping("/getActivities")
    public ResponseEntity<List<Object[]>> getActDetails(@RequestParam("fromDate") String fromDate, @RequestParam("toDate") String toDate) {  
        List<Object[]> activities = null; 

        try {
        SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss 'GMT'Z (zzzz)", Locale.ENGLISH);
            Date from = formatter.parse(fromDate);
            Date toDt = formatter.parse(toDate);
            activities = activityAllocationDetailsRepository.getActivitiesBetweenDates(from, toDt);
        } catch (ParseException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null); 
        }

        return ResponseEntity.ok().body(activities);
    }
    
    @GetMapping("/assessmentDates")
    public List<Date> getAssessmentDates() {
        return assessmentRepository.findAllAsessmentDate();
    }

  

    @GetMapping("/checkAssessments")
    public boolean checkAssessments(@RequestParam("activityId") Integer activityId,
            @RequestParam("fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date fromDate,
            @RequestParam("toDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date toDate) {
    	
    	 boolean assessmentExists = false;
        try {
       
           assessmentExists = assessmentRepository.existsByActivityIdAndDateRange(activityId, fromDate, toDate);
           
           
        } catch (DateTimeParseException e) {
        	e.printStackTrace();
        	
        }
        return assessmentExists;
    }

    
  //server side pagination controller
    @GetMapping("/viewAssesmentDetailsDateWisePagination")
    public ResponseEntity<Page<Assessment>> getAssessmentsByDate(
            @RequestParam(name = "assessmentDate", required = false) String assessmentDate,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize)
         
    
    {

        logger.info("Received request for assessments by date!");

        if (assessmentDate == null) {
            // Handle missing date parameter
            return ResponseEntity.badRequest().body(null);
        }

        Date date;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
            date = sdf.parse(assessmentDate);
        } catch (ParseException e) {
            // Handle invalid date format
            return ResponseEntity.badRequest().body(null);
        }

        logger.info("Fetching assessments for date: {}, Page: {}, PageSize: {}", date, page, pageSize);

        Pageable pageable = PageRequest.of(page, pageSize);
        Page<Assessment> assessmentsPage = assessmentRepository.findByAssessmentDate(date, pageable);
        logger.info("Assessment data fetched for Page: {}, Total Elements: {}", page, assessmentsPage.getTotalElements());

        if (assessmentsPage.isEmpty()) {
            // Handle empty page response
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(assessmentsPage);
    }
    
    
    
}
