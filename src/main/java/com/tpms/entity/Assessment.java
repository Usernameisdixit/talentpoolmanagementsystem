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
@Table(name = "assessment")
public class Assessment {

	@Id

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer asesmentId;

	
	private Integer resourceId;
	
	
	private Date activityFromDate;
	
	private Date activityToDate;
	
	private Integer activityId;
	

	private Double doubleActivityMark;
	
	
	private Double doubleSecuredMark;

	
	private Date asesmentDate;
	
	
	private String asesmentHours;

	
	private String remark;
	
	
	private Integer createdBy;

	
	private Integer updatedBy;

	
	private Byte deletedFlag;

}
