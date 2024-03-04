package com.tpms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {

}
