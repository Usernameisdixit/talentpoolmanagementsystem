package com.tpms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tpms.dto.UserDto;
import com.tpms.entity.Role;
import com.tpms.entity.User;
import com.tpms.exception.ResourceNotFoundException;
import com.tpms.repository.RoleRepository;
import com.tpms.repository.UserRepository;
import com.tpms.service.UserService;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserRepository userRepository;
	
	@Autowired
    private RoleRepository roleRepository;
	
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public User saveUser(UserDto user) {
		
	
		User u1 = new User();
		u1.setUserFullName(user.getUserFullName());
		u1.setUserName(user.getUserName());
		u1.setPhoneNo(user.getPhoneNo());
		u1.setEmail(user.getEmail());
		
		//------- to update User -------
		if(user.getUserId() != 0) {
			User existUser=userRepository.findById(user.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User Not found with id = " + user.getUserId()));
				 u1.setPassword(existUser.getPassword());
                 u1.setIsFirstLogin(existUser.getIsFirstLogin());
		         u1.setUserId(user.getUserId());
		}
		
		else {
			u1.setIsFirstLogin(true);
			u1.setPassword(passwordEncoder.encode(user.getPassword()));
		}
		
		// -------- to set Role at User entity class due to entity association --------
		Role role = roleRepository.findById(user.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role Not found with id = " + user.getRoleId()));
		if(role != null) {
			u1.setRole(role);
		}
		
		u1.setDeletedFlag(false);
		
		return userRepository.save(u1);
	}

	@Override
	public List<User> getUserDetails() {
		
		return userRepository.findAll();
	}

	@Override
	public UserDto getUserById(Integer userId) {
		UserDto user=new UserDto();
		User user1= userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not found with id = " + userId));
		user.setUserName(user1.getUserName());
		user.setUserFullName(user1.getUserFullName());
		user.setRoleId(user1.getRole().getRoleId());
		user.setPhoneNo(user1.getPhoneNo());
		user.setEmail(user1.getEmail());
		
		return user;
	}

	@Override
	public void deleteUserById(Integer intUserId,Boolean deletedFlag) {

		try {
		    userRepository.deleteUser(intUserId,deletedFlag);
		}catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public String getStatusOfDuplicacyCheck(String value,String colName) {
		Integer count=0;
		String result="not Exist";
		
		
        switch(colName) {
		   case "userName": {
			   count=userRepository.getDuplicateNameCount(value);
			 
			   break;
		   }
		   case "phoneNo":{
			   count=userRepository.getDuplicatePhnNoCount(value);
			 
			   break;
		   }
		   case "email":{
			   count=userRepository.getDuplicateEmailCount(value);
			 
			   break;
		   }
		   default:{break;}
        }
        	
		if(count>=1)
			result="Exist";
		
		return result;
	}

}
