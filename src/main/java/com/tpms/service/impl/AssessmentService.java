package com.tpms.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tpms.dto.AssessmentDto;
import com.tpms.entity.Assessment;
import com.tpms.repository.AssessmentRepository;

import java.time.LocalDate;
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
    	assessment.setAsesmentDate(assessmentDto.getAssessmentDate());
    	
    	assessment.setActivityFromDate(assessmentDto.getActivityFromDate());
    	
    	assessment.setActivityToDate(assessmentDto.getActivityToDate());
    	
        assessment.setDoubleActivityMark(assessmentDto.getTotalMarks());
        assessment.setDoubleSecuredMark(assessmentDto.getMarks());
        assessment.setAsesmentHours(assessmentDto.getHour());
        assessment.setRemark(assessmentDto.getRemarks());
        assessment.setDeletedFlag((byte) (0));
        return assessment;
    }


    public void updateAssessment(Integer id, AssessmentDto assessmentDto)  {
        Assessment assessment = assessmentRepository.findByAsesmentId(id);

        // Update specific fields of assessment entity with data from DTO
        if (assessmentDto.getMarks() != null) {
            assessment.setDoubleSecuredMark(assessmentDto.getMarks());
        }
        if (assessmentDto.getTotalMarks() != null) {
            assessment.setDoubleActivityMark(assessmentDto.getTotalMarks());
        }
        if (assessmentDto.getRemarks() != null) {
            assessment.setRemark(assessmentDto.getRemarks());
        }
        if (assessmentDto.getHour() != null) {
            assessment.setAsesmentHours(assessmentDto.getHour());
        }

       
        assessmentRepository.save(assessment);
    }


	
   
}
