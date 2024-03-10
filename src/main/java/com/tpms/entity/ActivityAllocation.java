package com.tpms.entity;

import java.time.LocalDateTime;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "activity_allocation")
public class ActivityAllocation {
	
    @Id
   
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityAllocateId;

  
    private Integer resourceId;
    
    private Integer platformId;
    
    
 
    private Date activityDate;
    
  
    private Integer createdBy;
	
	
	private Integer updatedBy;
	

	private Boolean deletedFlag;
  
}

