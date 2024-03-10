package com.tpms.entity;




import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "activity_allocation_details")
public class ActivityAllocationDetails {

	@Id

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer activityAllocateDetId;

	
	
	 @ManyToOne
	 @JoinColumn(name = "activityAllocateId")
	 private ActivityAllocation activityAllocation;
	    
	@ManyToOne
    @JoinColumn(name = "activityId")
	private Activity activity;	
	    
	//private Integer activityId;

	
	private Byte activityFor;

	
	private String fromHours;

	
	private String toHours;

	
	private String activityDetails;


	private Integer createdBy;

	
	private Integer updatedBy;


	private Boolean deletedFlag;






	

}

