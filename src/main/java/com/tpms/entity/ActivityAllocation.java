package com.tpms.entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "activity_allocation")
public class ActivityAllocation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long activityAllocateId;

	private Integer resourceId;

	private Integer platformId;

	private Date activityDate;

	private Integer createdBy;

	private Integer updatedBy;

	private Boolean deletedFlag = false;

	@OneToMany(mappedBy = "activityAllocation", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<ActivityAllocationDetails> details;

}
