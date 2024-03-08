package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.tpms.entity.User;


public interface UserRepository extends JpaRepository<User, Integer> {

	@Transactional
	@Modifying
	@Query(value = "update user set deletedFlag=:deletedFlag where userId=:userId",nativeQuery = true)
	void deleteUser(Integer userId,Boolean deletedFlag);

	@Query(value = "select count(1) from user where userName=:userName and deletedFlag=0;",nativeQuery = true)
	Integer getDuplicateCount(String userName);

	User findByUserName(String userName);

	User findByEmail(String email);
	


}
