package com.tpms.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tpms.dto.PageResponse;
import com.tpms.dto.UserDto;
import com.tpms.entity.Role;
import com.tpms.entity.User;
import com.tpms.exception.ResourceNotFoundException;
import com.tpms.repository.RoleRepository;
import com.tpms.repository.UserRepository;
import com.tpms.security.JwtHelper;
import com.tpms.service.UserService;

@Service
public class UserServiceImpl implements UserService{

	
	private final UserRepository userRepository;
	
    private final RoleRepository roleRepository;
	
	private final JwtHelper jwtHelper;
	
	private final PasswordEncoder passwordEncoder;
	
	public UserServiceImpl(UserRepository userRepository,RoleRepository roleRepository,
			JwtHelper jwtHelper,PasswordEncoder passwordEncoder) {
		this.userRepository=userRepository;
		this.roleRepository=roleRepository;
		this.jwtHelper=jwtHelper;
		this.passwordEncoder=passwordEncoder;
	}
	
	
	@Override
	public User saveUser(UserDto user, HttpHeaders httpHeaders) {
		
		
		String userName = jwtHelper.getUsernameFromToken(httpHeaders.get("Authorization").get(0).replace("Bearer", ""));
		Integer creatorModifierUserID = userRepository.findByUserName(userName).getUserId();
	
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
		         u1.setUpdatedBy(creatorModifierUserID);
		         u1.setCreatedBy(existUser.getCreatedBy());
		}
		
		else {
			u1.setCreatedBy(creatorModifierUserID);
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
	public PageResponse<User> getUserDetails(int pageNumber, int pageSize) {
	    Pageable pageable = PageRequest.of(pageNumber-1, pageSize,Sort.by("userFullName"));
	   
	    Page<User> page = userRepository.findAll(pageable);
	    List<User> userList=page.getContent();
	    PageResponse<User> pageResponse=new PageResponse<>();
	    pageResponse.setContent(userList);
	    pageResponse.setTotalElements(page.getTotalElements());
	    pageResponse.setTotalPages(page.getTotalPages());
	    pageResponse.setPageSize(page.getSize());
	    
	    return pageResponse;
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
		long count=switch(colName) {
		   case "userName"-> userRepository.countByUserName(value);
			 
		   case "phoneNo"-> userRepository.countByPhoneNo(value);
			 
		   case "email" ->  userRepository.countByEmail(value);
			 
		   default -> throw new IllegalStateException("Invalid Data!!");
        };
        return count > 0 ? "Exist" : "Not Exist"; 
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

}
