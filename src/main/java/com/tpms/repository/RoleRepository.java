package com.tpms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tpms.entity.Role;

import jakarta.transaction.Transactional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

	@Query("SELECT r.deletedFlag FROM Role r WHERE r.id = :id")
	Boolean getDeletedFlagByRoleId(@Param("id") Long id);

	@Modifying
	@Transactional
	@Query("UPDATE Role r SET r.deletedFlag = true WHERE r.id = :id")
	void updateBitDeletedFlagById(@Param("id") Long id);

	@Modifying
	@Transactional
	@Query("UPDATE Role r SET r.deletedFlag = false WHERE r.id = :id")
	void updateBitDeletedFlagByFalse(Long id);
}
