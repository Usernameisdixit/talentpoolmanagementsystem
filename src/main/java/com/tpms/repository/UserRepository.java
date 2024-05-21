package com.tpms.repository;

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

	Integer countByUserName(String userName);

	User findByUserName(String userName);

	User findByEmail(String email);

	Integer countByPhoneNo(String phoneNo);

	Integer countByEmail(String email);
	


}
