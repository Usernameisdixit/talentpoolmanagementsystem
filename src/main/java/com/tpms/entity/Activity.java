package com.tpms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tbl_activity")
public class Activity {

	@Id
	@Column(name="intActivityId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer activityId;

	@Column(name="vchActivityName")
	private String activityName;

	@Column(name="vchActivityRefNo")
	private String activityRefNo;

	@Column(name="vchDescription")
	private String description;

	@Column(name="vchResponsPerson1")
	private String responsPerson1;

	@Column(name="vchResponsPerson2")
	private String responsPerson2;

	@Column(name="isAsesmentEnable")
	private Boolean isAsesmentEnable;

	@Column(name="dtmActivityDate")
	private LocalDateTime activityDate;

	@Column(name="intCreatedBy")
	private Integer createdBy;

	@Column(name="intUpdatedBy")
	private Integer updatedBy;

	@Column(name="bitDeletedFlag")
	private Boolean deletedFlag;
}
