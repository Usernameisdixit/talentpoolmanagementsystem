package com.tpms.entity;

import java.time.LocalDate;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="excel_upload_history")
public class ExcelUploadHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer excelFileId;


	private String fileName;

	
	private LocalDate allocationDate;


	private Integer createdBy;


	private Integer updatedBy;


	private Byte deletedFlag;
}
