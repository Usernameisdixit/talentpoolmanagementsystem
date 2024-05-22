package com.tpms.entity;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Data
@Entity
@Table(name="resource_pool")
public class ResourcePool {

	public ResourcePool() {}

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
