package com.tpms.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "activity_allocation_details")
public class ActivityAllocationDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer activityAllocateDetId;

	@ManyToOne
	@JoinColumn(name = "activityAllocateId")
	@JsonBackReference
	private ActivityAllocation activityAllocation;

	private Integer resourceId;

	private Integer platformId;

	private Integer createdBy;

	private Integer updatedBy;

	private Boolean deletedFlag = false;

}
