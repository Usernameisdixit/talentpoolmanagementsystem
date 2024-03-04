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
@Table(name="tbl_resource_pool")
public class ResourcePool {

	@Id
	@Column(name="intResourceId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer resourceId;

	@Column(name="vchResourceName")
	private String resourceName;

	@Column(name="vchResourceCode")
	private String resourceCode;

	@Column(name="vchPlatform")
	private String platform;

	@Column(name="vchLocation")
	private String location;

	@Column(name="vchEngagementPlan")
	private String engagementPlan;

	@Column(name="vchExperience")
	private String experience;

	@Column(name="dtmAllocationDate")
	private LocalDate allocationDate;

	@Column(name="vchPhoneNo")
	private String phone;

	@Column(name="vchEmail")
	private String email;

	@Column(name="vchStatus")
	private String status;

	@Column(name="intCreatedBy")
	private Integer createdBy;

	@Column(name="intUpdatedBy")
	private Integer updatedBy;

	@Column(name="bitDeletedFlag")
	private Byte deletedFlag;
}
