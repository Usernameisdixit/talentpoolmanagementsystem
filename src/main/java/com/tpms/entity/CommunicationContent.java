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
@Table(name = "communication_content_type")
public class CommunicationContent {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer commTypeId;

	private String commType;
	
	private String contents;

	private String subject;
	
	

}
