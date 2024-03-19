package com.tpms.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
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


import com.tpms.dto.ActivityWithResourceDTO;
import com.tpms.dto.AssessmentDto;

import com.tpms.entity.ActivityAllocationDetails;
import com.tpms.entity.Assessment;
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
                    .findByPlatformIdAndActivityDateBetweenAndDeletedFlagIsFalse(platformId, from, toDt)
                    .stream()
                    .map(activityAllocation -> activityAllocationDetailsRepository.findByActivityAllocation(activityAllocation))
                    .flatMap(List::stream)
                    .collect(Collectors.toList());

            // Create a map to associate resource IDs with their corresponding activity details
            Map<Integer, List<ActivityAllocationDetails>> activityDetailsByResource = new HashMap<>();
            
            for (ActivityAllocationDetails detail : activityAllocationDetails) {
                Integer resourceId = detail.getActivityAllocation().getResourceId();
                if (!activityDetailsByResource.containsKey(resourceId)) {
                    activityDetailsByResource.put(resourceId, new ArrayList<>());
                }
                activityDetailsByResource.get(resourceId).add(detail);
            }

            List<ActivityWithResourceDTO> response = new ArrayList<>();
            for (Integer resourceId : activityDetailsByResource.keySet()) {
                Set<String> uniqueActivityNames = new HashSet<>();
                List<ActivityAllocationDetails> resourceActivityDetails = activityDetailsByResource.get(resourceId);
                for (ActivityAllocationDetails detail : resourceActivityDetails) {
                    String activityName = detail.getActivity().getActivityName();
                    if (!uniqueActivityNames.contains(activityName)) {
                        Pair<String, String> resourceInfo = Pair.of(fetchResourceName(resourceId), fetchResourceCode(resourceId));
                        response.add(new ActivityWithResourceDTO(detail, detail.getActivityAllocation(), resourceInfo.getFirst(), resourceInfo.getSecond()));
                        uniqueActivityNames.add(activityName);
                    }
                }
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
    
    @GetMapping("/editAssessment/{id}")
    public List<Object[]> getAssessmentById(@PathVariable Integer id) {
        return assessmentRepository.findDetailsByAssessmentId(id);
    }

    @PutMapping("/updateAssessment/{id}")
    public ResponseEntity<?> updateAssessment(@PathVariable Integer id, @RequestBody AssessmentDto assessmentDto) {
     
            assessmentService.updateAssessment(id, assessmentDto);
            return ResponseEntity.ok().build();
     
      
    }
    
}
