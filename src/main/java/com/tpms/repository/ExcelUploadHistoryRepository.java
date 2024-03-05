package com.tpms.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.ExcelUploadHistory;

public interface ExcelUploadHistoryRepository extends JpaRepository<ExcelUploadHistory, Integer> {
	Optional<ExcelUploadHistory> findByAllocationDate(LocalDate allocationDate);
}
