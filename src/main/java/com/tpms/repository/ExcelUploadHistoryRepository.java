package com.tpms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.ExcelUploadHistory;

public interface ExcelUploadHistoryRepository extends JpaRepository<ExcelUploadHistory, Integer> {
	
}
