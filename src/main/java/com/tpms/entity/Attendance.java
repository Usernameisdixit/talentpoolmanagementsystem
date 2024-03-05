package com.tpms.entity;

import java.time.LocalDate;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tbl_attendance")
public class Attendance {

	@Id
	@Column(name="intAtendanceId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer atendanceId;

	@Column(name="intResourceId")
	private Integer resourceId;
	
	@Column(name="intActivityAllocateId")
	private Integer activityAllocateId;

	@Column(name="intActivityAllocateDetId")
	private Integer activityAllocateDetId;
	
	@Column(name="dtmAtendanceDate")
	private Date dtmAtendanceDate;
	
	@Column(name = "intAtendanceFor")
	private int intAtendanceFor;
	
	@Column(name="isPresent")
	private Boolean isPresent;
	
	@Column(name="intCreatedBy")
	private Integer createdBy;

	@Column(name="intUpdatedBy")
	private Integer updatedBy;

	@Column(name="bitDeletedFlag")
	private Boolean deletedFlag;

}
