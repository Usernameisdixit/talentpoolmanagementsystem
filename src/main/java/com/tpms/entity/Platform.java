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
@Table(name="tbl_mst_platforms")
public class Platform {

	@Id
	@Column(name="intPlatformId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer platformId;
	
	@Column(name="vchPlatform")
	private String platformName;

	@Column(name="vchUserName")
	private String platformCode;
	
	@Column(name="intCreatedBy")
	private Integer createdBy;
	
	@Column(name="intUpdatedBy")
	private Integer updatedBy;
	
	@Column(name="bitDeletedFlag")
	private Byte deletedFlag;
}
