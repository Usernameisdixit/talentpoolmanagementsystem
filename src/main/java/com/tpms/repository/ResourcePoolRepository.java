package com.tpms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.ResourcePool;

public interface ResourcePoolRepository extends JpaRepository<ResourcePool, Integer> {
}
