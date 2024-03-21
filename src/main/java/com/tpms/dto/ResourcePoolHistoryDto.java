package com.tpms.dto;

import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResourcePoolHistoryDto {

	private String resourceCode;
	private String resourceName;
	private LocalDate MinallocationDate;
	private LocalDate MaxallocationDate;
	private String duration;
	
}
