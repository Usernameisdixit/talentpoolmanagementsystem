package com.tpms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.ResourcePoolHistory;

public interface ResourcePoolHistoryRepository extends JpaRepository<ResourcePoolHistory, Integer> {

}
