package com.tpms.dto;

import lombok.Data;

@Data
public class PlatformDto {
	
private Integer platformId;
	
	private String platform;

	private String platformCode;
	
	private Integer createdBy;
	
	private Integer updatedBy;
	
	private Boolean deletedFlag;
	
}
