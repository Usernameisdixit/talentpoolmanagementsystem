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
@Table(name = "tbl_assessment")
public class Assessment {

	@Id
	@Column(name="intAsesmentId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer asesmentId;

	@Column(name="intResourceId")
	private Integer resourceId;
	
	@Column(name="intActivityId")
	private Integer activityId;
	
	@Column(name="doubleActivityMark")
	private Double activityMark;
	
	@Column(name="doubleSecuredMark")
	private Double securedMark;

	@Column(name="dtmAsesmentDate")
	private LocalDate asesmentDate;
	
	@Column(name="vchAsesmentHours")
	private String asesmentHours;

	@Column(name="vchRemark")
	private String vchRemark;
	
	@Column(name="intCreatedBy")
	private Integer createdBy;

	@Column(name="intUpdatedBy")
	private Integer updatedBy;

	@Column(name="bitDeletedFlag")
	private Boolean deletedFlag;

}
