package com.tpms.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ResourcePoolDto {

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
    private String duration;
	
}
