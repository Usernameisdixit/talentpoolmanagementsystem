package com.tpms.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="platforms")
public class Platform {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer platformId;
	
	private String platform;

	private String platformCode;
	
	private Integer createdBy;
	
	private Integer updatedBy;
	
	private byte deletedFlag;
}
