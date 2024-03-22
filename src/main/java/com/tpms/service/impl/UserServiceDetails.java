package com.tpms.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tpms.entity.Role;
import com.tpms.entity.User;
import com.tpms.repository.UserRepository;

@Service
public class UserServiceDetails implements UserDetailsService{

	@Autowired
	UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
		//users from database
		User user = userRepository.findByUserName(userName);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + userName);
        }
//        else {
//        	return new CustomUserDetails(user);
//        }

        Role role=user.getRole();
      return org.springframework.security.core.userdetails.User
    		  .withUsername(user.getUserName())
    		  .password(user.getPassword())
    		  .roles(role.getRoleName())
               .build();
	}
	
	//private List<Users> userList=new ArrayList<>();
//	public UserService() {
//		userList.add(new Users(UUID.randomUUID().toString(),"jiban jena","jiban@gmail.com"));
//		userList.add(new Users(UUID.randomUUID().toString(),"ilu jena","ilu@gmail.com"));
//		userList.add(new Users(UUID.randomUUID().toString(),"jilu jena","jilu@gmail.com"));
//		userList.add(new Users(UUID.randomUUID().toString(),"silu jena","silu@gmail.com"));
//		
//	}
	
//	public List<Users> getUsers()
//	{
//		return this.userList;
//	}
}
