package com.tpms.entity;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;



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
	

	@OneToMany(mappedBy = "activityAllocation", cascade = CascadeType.ALL)
	 @JsonIgnoreProperties("activityAllocation")
	private List<ActivityAllocationDetails> details;


	public Long getActivityAllocateId() {
		return activityAllocateId;
	}


	public void setActivityAllocateId(Long activityAllocateId) {
		this.activityAllocateId = activityAllocateId;
	}


	public Integer getResourceId() {
		return resourceId;
	}


	public void setResourceId(Integer resourceId) {
		this.resourceId = resourceId;
	}


	public Integer getPlatformId() {
		return platformId;
	}


	public void setPlatformId(Integer platformId) {
		this.platformId = platformId;
	}


	public Date getActivityDate() {
		return activityDate;
	}


	public void setActivityDate(Date activityDate) {
		this.activityDate = activityDate;
	}


	public Integer getCreatedBy() {
		return createdBy;
	}


	public void setCreatedBy(Integer createdBy) {
		this.createdBy = createdBy;
	}


	public Integer getUpdatedBy() {
		return updatedBy;
	}


	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}


	public Boolean getDeletedFlag() {
		return deletedFlag;
	}


	public void setDeletedFlag(Boolean deletedFlag) {
		this.deletedFlag = deletedFlag;
	}


	public List<ActivityAllocationDetails> getDetails() {
		return details;
	}


	public void setDetails(List<ActivityAllocationDetails> details) {
//		details.forEach	(
//				row -> {row.setActivityAllocation(this);
//				});
		this.details=details;
	}
	
	
  
}

