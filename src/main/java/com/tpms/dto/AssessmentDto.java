package com.tpms.dto;


import java.time.LocalDate;
import java.util.Date;

import lombok.Data;
@Data
public class AssessmentDto {
    private Long intActivityAllocateDetId;
    private Integer intActivityId;
    private Long intActivityAllocateId;
    
    private Integer asesmentId;
    private String activityName;
    private String activityRefNo;
    private String activityDescription;
    private String activityResponsPerson1;
    private Long activityAllocateId;
    private Integer resourceId;
    private Long platformId;
    private Date assessmentDate;
    private Double marks;
    private Double totalMarks;
    private String remarks;
    private String hour;
    private Date activityFromDate;
	private Date activityToDate;
    
    
    
   

   
}

