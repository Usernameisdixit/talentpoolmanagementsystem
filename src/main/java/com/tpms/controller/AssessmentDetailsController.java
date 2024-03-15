package com.tpms.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.tpms.dto.ActivityWithResourceDTO;
import com.tpms.dto.AssessmentDto;

import com.tpms.entity.ActivityAllocationDetails;

import com.tpms.entity.Platform;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ActivityAllocationDetailsRepository;
import com.tpms.repository.ActivityAllocationRepository;
import com.tpms.repository.AssessmentRepository;
import com.tpms.repository.PlatformRepository;
import com.tpms.repository.ResourcePoolRepository;
import com.tpms.service.impl.AssessmentService;

@RestController
@CrossOrigin
public class AssessmentDetailsController {

    @Autowired
    private PlatformRepository platformRepository;

    @Autowired
    private ActivityAllocationRepository activityallocationRepository;

    @Autowired
    private ActivityAllocationDetailsRepository activityAllocationDetailsRepository;

    @Autowired
    private ResourcePoolRepository resourcePoolRepository;
    
    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private AssessmentRepository assessmentRepository;

    @GetMapping("/getPlatforms")
    public List<Platform> getPlatforms() {
        return platformRepository.findAll();
    }

    @GetMapping("/api/assessment-details")
    public ResponseEntity<?> getActivityDetails(
            @RequestParam Long platformId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String toDate) {
        try {
            Date from = new SimpleDateFormat("yyyy-MM-dd").parse(fromDate);
            Date toDt = new SimpleDateFormat("yyyy-MM-dd").parse(toDate);

            List<ActivityAllocationDetails> activityAllocationDetails = activityallocationRepository
                    .findByPlatformIdAndActivityDateBetween(platformId, from,toDt)
                    .stream()
                    .map(activityAllocation -> activityAllocationDetailsRepository.findByActivityAllocation(activityAllocation))
                    .flatMap(List::stream)
                    .collect(Collectors.toList());

            // Create a map to associate resource names with ActivityAllocationDetails
            Map<ActivityAllocationDetails, Pair<String,String>> activityDetailsWithResourceInfo = new HashMap<>();
            for (ActivityAllocationDetails detail : activityAllocationDetails) {
                Integer resourceId = detail.getActivityAllocation().getResourceId();
                String resourceName = fetchResourceName(resourceId);
                String resourceCode = fetchResourceCode(resourceId);
                activityDetailsWithResourceInfo.put(detail, Pair.of(resourceName, resourceCode));
            }

           
//            Set<String> uniqueActivityNames = activityAllocationDetails.stream()
//                    .map(detail -> detail.getActivity().getActivityName())
//                    .collect(Collectors.toSet());

          
        
            List<ActivityWithResourceDTO> response = new ArrayList<>();
            for (ActivityAllocationDetails detail : activityAllocationDetails) {
                Pair<String, String> resourceInfo = activityDetailsWithResourceInfo.get(detail);
                response.add(new ActivityWithResourceDTO(detail, resourceInfo.getFirst(), resourceInfo.getSecond()));
            }

            return ResponseEntity.ok(response);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please provide dates in yyyy-MM-dd format.");
        }
    }

    private String fetchResourceCode(Integer resourceId) {
    	 Optional<ResourcePool> optionalResource = resourcePoolRepository.findById(resourceId);
         return optionalResource.map(ResourcePool::getResourceCode).orElse(null);
	}

	
    private String fetchResourceName(Integer resourceId) {
        Optional<ResourcePool> optionalResource = resourcePoolRepository.findById(resourceId);
        return optionalResource.map(ResourcePool::getResourceName).orElse(null);
    }
    
    @PostMapping("/assessments")
    public ResponseEntity<?> submitAssessments(@RequestBody List<AssessmentDto> assessments) {
        return assessmentService.submitAssessments(assessments);
    }
    
    @GetMapping("/viewAssesmentDetails")
    public ResponseEntity<List<Object[]>> viewAssesmentDeatisl(Model model) {
        List<Object[]> assessmentDetails = assessmentRepository.findAllWithDetails();
        return ResponseEntity.ok().body(assessmentDetails);
        
    }
    
}
