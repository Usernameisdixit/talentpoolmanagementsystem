package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.CommunicationContent;

public interface CommunicationContentRepository extends JpaRepository<CommunicationContent, Integer> {

	CommunicationContent findByCommType(String inputType);

}
