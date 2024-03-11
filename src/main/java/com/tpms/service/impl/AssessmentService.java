package com.tpms.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tpms.dto.AssessmentDto;
import com.tpms.entity.Assessment;
import com.tpms.repository.AssessmentRepository;

import java.util.List;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    public ResponseEntity<?> submitAssessments(List<AssessmentDto> assessments) {
        try {
            for(AssessmentDto assessmentDto:assessments)
            {
            	Assessment assessmentDetails = convertToEntity(assessmentDto);
            	 assessmentRepository.save(assessmentDetails);
            	 
            }
            return ResponseEntity.ok().body("{\"message\": \"Assessments submitted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"message\": \"Error occurred while submitting assessments\"}");
        }
		
    }
    
    
    private Assessment convertToEntity(AssessmentDto assessmentDto) {
    	Assessment assessment = new Assessment();
        assessment.setActivityId(assessmentDto.getIntActivityId());
    	assessment.setResourceId(assessmentDto.getResourceId());
    	assessment.setAsesmentDate(assessmentDto.getActivityDate());
        assessment.setDoubleActivityMark(assessmentDto.getMarks());
        assessment.setDoubleSecuredMark(assessmentDto.getTotalMarks());
        assessment.setAsesmentHours(assessmentDto.getHour());
        assessment.setRemark(assessmentDto.getRemarks());
        assessment.setDeletedFlag((byte) (0));
        return assessment;
    }
   
}
