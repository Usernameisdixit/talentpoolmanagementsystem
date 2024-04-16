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
import jakarta.persistence.Transient;
import lombok.Data;

@Data
@Entity
@Table(name="resource_pool")
public class ResourcePool {

	public ResourcePool() {}
	
//	public ResourcePool(List<ActivityAllocation> activityAlloc) {
//		this.activityAlloc = activityAlloc;
//	}



	public ResourcePool(ResourcePoolHistory employee, LocalDate allocationDate2) {
		// TODO Auto-generated constructor stub
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer resourceId;


	private String resourceName;

	
	private String resourceCode;

	private String designation;
	
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
	
	@Transient
    private String duration;
	
//	@OneToMany
//	@JoinColumn(name = "activityId", referencedColumnName = "activityId")
//	private List<ActivityAllocation> activityAlloc;
}
