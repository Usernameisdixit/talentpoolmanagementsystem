package com.tpms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tbl_activity_allocation")
public class ActivityAllocation {
	
    @Id
    @Column(name="intActivityAllocateId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityAllocateId;

    @Column(name="intResourceId")
    private Long resourceId;
    
    @Column(name="intActivityId")
    private Long activityId;
    
    @Column(name="dtmAllocationDate")
    private LocalDateTime allocationDate;
    
    @Column(name="intCreatedBy")
    private Integer createdBy;
	
	@Column(name="intUpdatedBy")
	private Integer updatedBy;
	
	@Column(name="bitDeletedFlag")
	private Boolean deletedFlag;
  
}

