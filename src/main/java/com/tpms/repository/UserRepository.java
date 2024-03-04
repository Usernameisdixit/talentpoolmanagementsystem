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
	@Query(value = "update tbl_user set bitDeletedFlag=true where intUserId=:userId",nativeQuery = true)
	void deleteUser(Integer userId);

	@Query(value = "select * from tbl_user where bitDeletedFlag=0;",nativeQuery=true)
	List<User> getUserDetails();

	@Query(value = "select count(1) from tbl_user where vchUserName=:userName and bitDeletedFlag=0;",nativeQuery = true)
	Integer getDuplicateCount(String userName);


}
