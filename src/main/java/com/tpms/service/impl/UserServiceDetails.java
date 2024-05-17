package com.tpms.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tpms.entity.Role;
import com.tpms.entity.User;
import com.tpms.repository.UserRepository;

@Service
public class UserServiceDetails implements UserDetailsService{

	
	private final UserRepository userRepository;
	
	public UserServiceDetails(UserRepository userRepository) {
		this.userRepository=userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
		//users from database
		User user = userRepository.findByUserName(userName);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + userName);
        }

        Role role=user.getRole();
      return org.springframework.security.core.userdetails.User
    		  .withUsername(user.getUserName())
    		  .password(user.getPassword())
    		  .roles(role.getRoleName())
               .build();
	}
	

}
