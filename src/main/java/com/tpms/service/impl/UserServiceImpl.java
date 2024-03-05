package com.tpms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tpms.entity.Role;
import com.tpms.entity.User;
import com.tpms.repository.UserRepository;
import com.tpms.service.RoleService;
import com.tpms.service.UserService;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private RoleService roleService;
	
	private PasswordEncoder passwordEncoder;
	
	@Override
	public User saveUser(User user) {
	
		if(user.getUserId() != 0) {
			
			user.setUserId(user.getUserId());
			user.setFirstLogin(true);
		}
		
		else {
			user.setFirstLogin(true);
		}
		user.setDeletedFlag(false);
	        List<Role> roleDetails=roleService.getRoleList();
		    for(Role r:roleDetails) {
			   if(r.getRoleId().equals(user.getRoleId())) {
				user.setRoleName(r.getRoleName());
			  }
		    }
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	@Override
	public List<User> getUserDetails() {
		return userRepository.findByDeletedFlagFalse();
	}

	@Override
	public User getUserById(Integer userId) {
		return userRepository.findById(userId).orElseThrow();
	}

	@Override
	public void deleteUserById(Integer intUserId) {

		 userRepository.deleteUser(intUserId);
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
