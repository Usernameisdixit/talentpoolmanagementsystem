package com.tpms.service;

import java.util.List;

import com.tpms.dto.UserDto;
import com.tpms.entity.User;

public interface UserService {

	User saveUser(UserDto user);

	List<User> getUserDetails();

	UserDto getUserById(Integer userId);

	void deleteUserById(Integer intUserId, Boolean deletedFlag);

	String getStatusOfDuplicacyCheck(String value, String colName);


}
