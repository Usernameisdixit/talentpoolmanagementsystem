package com.tpms.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tpms.dto.AssessmentDto;
import com.tpms.entity.Assessment;
import com.tpms.repository.AssessmentRepository;

import java.time.LocalDate;
import java.util.Iterator;
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
    	if(assessmentDto.getAsesmentId()!=0) {
    		assessment.setAsesmentId(assessmentDto.getAsesmentId());
    	}
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


    public ResponseEntity<?> updateAssessment(List<AssessmentDto> updatedData)  {
    	
    	 try {
             for(AssessmentDto assessmentDto:updatedData)
             {
             	Assessment assessmentDetails = convertToEntity(assessmentDto);
             	 assessmentRepository.save(assessmentDetails);
             	 
             }
             return ResponseEntity.ok().body("{\"message\": \"Assessments Updated successfully\"}");
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                  .body("{\"message\": \"Error occurred while updating assessments\"}");
         }
    }


	


	
   
}
