package com.tpms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

}
