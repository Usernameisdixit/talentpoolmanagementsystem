package com.tpms.entity;

import java.time.LocalDate;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="resource_pool_history")
public class ResourcePoolHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer resourceHistoryId;

	
	private String resourceName;

	
	private String designation;

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
}
