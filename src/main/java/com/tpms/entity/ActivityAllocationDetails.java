package com.tpms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tbl_activity_allocation_details")
public class ActivityAllocationDetails {

	@Id
	@Column(name="intActivityAllocateDetId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer activityAllocateDetId;

	@Column(name="intActivityId")
	private Integer activityId;

	@Column(name="vchActivityFor")
	private Byte activityFor;

	@Column(name="vchFromHours")
	private String fromHours;

	@Column(name="vchToHours")
	private String toHours;

	@Column(name="vchActivityDetails")
	private String activityDetails;

	@Column(name="intCreatedBy")
	private Integer createdBy;

	@Column(name="intUpdatedBy")
	private Integer updatedBy;

	@Column(name="bitDeletedFlag")
	private Boolean deletedFlag;

}

