package com.tpms.service;

import java.util.List;

import com.tpms.entity.User;

public interface UserService {

	User saveUser(User user);

	List<User> getUserDetails();

	User getUserById(Integer userId);

	void deleteUserById(Integer intUserId, Boolean deletedFlag);

	String getStatusOfDuplicacyCheck(String userName);

}
