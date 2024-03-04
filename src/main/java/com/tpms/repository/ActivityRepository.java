package com.tpms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Integer> {

}