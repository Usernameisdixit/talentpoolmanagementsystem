package com.tpms.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "attendance")
public class Attendance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer atendanceId;

	private Integer resourceId;
	
	private Integer activityAllocateId;

	private Integer activityAllocateDetId;
	
	private Date atendanceDate;
	
	private int atendanceFor;
	
	private Boolean isPresent;
	
	private Integer createdBy;

	private Integer updatedBy;

	private Boolean deletedFlag;

}
