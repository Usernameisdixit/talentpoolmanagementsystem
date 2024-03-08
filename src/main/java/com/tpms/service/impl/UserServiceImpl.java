package com.tpms.service.impl;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tpms.entity.Role;
import com.tpms.entity.User;
import com.tpms.exception.ResourceNotFoundException;
import com.tpms.repository.UserRepository;
import com.tpms.service.RoleService;
import com.tpms.service.UserService;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private RoleService roleService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public User saveUser(User user) {
	
		if(user.getUserId() != 0) {
			User existUser=getUserById(user.getUserId());
				 user.setPassword(existUser.getPassword());
                 user.setIsFirstLogin(existUser.getIsFirstLogin());
			
                 user.setUserId(user.getUserId());
		}
		
		else {
			user.setIsFirstLogin(true);
			user.setPassword(passwordEncoder.encode(user.getPassword()));
		}
		user.setDeletedFlag(false);
	        List<Role> roleDetails=roleService.getRoleList();
		    for(Role r:roleDetails) {
			   if(r.getRoleId().equals(user.getRoleId())) {
				user.setRoleName(r.getRoleName());
			  }
		    }
		
		
		return userRepository.save(user);
	}

	@Override
	public List<User> getUserDetails() {
		return userRepository.findAll();
	}

	@Override
	public User getUserById(Integer userId) {
		return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not found with id = " + userId));
	}

	@Override
	public void deleteUserById(Integer intUserId,Boolean deletedFlag) {

		userRepository.deleteUser(intUserId,deletedFlag);
	}

	@Override
	public String getStatusOfDuplicacyCheck(String userName) {
		
		String result="";
		Integer count=userRepository.getDuplicateCount(userName);
		if(count>0) {
			result="Exist";
		}
		else
			result="NotExist";
		return result;
	}

}
