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
@Table(name="tbl_excel_upload_history")
public class ExcelUploadHistory {

	@Id
	@Column(name="intExcelFileId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer excelFileId;

	@Column(name="vchFileName")
	private String fileName;

	@Column(name="dtmAllocationDate")
	private LocalDate allocationDate;

	@Column(name="intCreatedBy")
	private Integer createdBy;

	@Column(name="intUpdatedBy")
	private Integer updatedBy;

	@Column(name="bitDeletedFlag")
	private Byte deletedFlag;
}
