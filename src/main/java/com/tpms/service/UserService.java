package com.tpms.service;

import java.util.List;

import org.springframework.http.HttpHeaders;

import com.tpms.dto.PageResponse;
import com.tpms.dto.UserDto;
import com.tpms.entity.User;

public interface UserService {

	User saveUser(UserDto user, HttpHeaders httpHeaders);

	PageResponse<User> getUserDetails(int pageNumber, int pageSize);

	UserDto getUserById(Integer userId);

	void deleteUserById(Integer intUserId, Boolean deletedFlag);

	String getStatusOfDuplicacyCheck(String value, String colName);

	List<User> getAllUsers();


}
