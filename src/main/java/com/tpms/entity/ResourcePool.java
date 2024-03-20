package com.tpms.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="resource_pool")
public class ResourcePool {

	public ResourcePool() {}
	
	public ResourcePool(List<ActivityAllocation> activityAlloc) {
		this.activityAlloc = activityAlloc;
	}



	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer resourceId;


	private String resourceName;

	
	private String resourceCode;

	
	private String platform;

	private String location;


	private String engagementPlan;


	private String experience;

	private LocalDate allocationDate;

	
	private String phoneNo;

	
	private String email;

	
	private Integer createdBy;

	
	private Integer updatedBy;

	
	private Byte deletedFlag;
	

	
	@OneToMany
	@JoinColumn(name = "resourceId", referencedColumnName = "resourceId")
	private List<ActivityAllocation> activityAlloc;
}
