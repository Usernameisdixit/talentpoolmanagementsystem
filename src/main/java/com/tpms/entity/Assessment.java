package com.tpms.entity;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "assessment")
public class Assessment {

	@Id

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer asesmentId;

	
	private Integer resourceId;
	
	
	private Integer activityId;
	

	private Double activityMark;
	
	
	private Double securedMark;

	
	private LocalDate asesmentDate;
	
	
	private String asesmentHours;

	
	private String remark;
	
	
	private Integer createdBy;

	
	private Integer updatedBy;

	
	private Boolean deletedFlag;

}
