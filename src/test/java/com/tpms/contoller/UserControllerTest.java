package com.tpms.contoller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.tpms.controller.UserController;
import com.tpms.dto.UserDto;
import com.tpms.entity.User;
import com.tpms.service.UserService;

 class UserControllerTest {
	
	@Mock
	UserService userService;
	
	@InjectMocks
	UserController userController;
	
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	
	@Test
    void testSaveUser() {
        // Mocking the behavior of userService.saveUser()
        UserDto userDto = new UserDto();
        userDto.setUserFullName("testUserFullName");
        userDto.setUserName("testUser");
        userDto.setPassword("Csmtech@123");
        userDto.setEmail("test@gmail.com");
        userDto.setPhoneNo("765456776");
       

        User savedUser = new User();
        savedUser.setUserId(1);
        savedUser.setUserName(userDto.getUserName());
        savedUser.setPassword(userDto.getPassword());
        savedUser.setUserFullName(userDto.getUserFullName());
        savedUser.setPhoneNo(userDto.getPhoneNo());
        savedUser.setEmail(userDto.getEmail());
        
        
        
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", httpHeaders.get("Authorization").get(0));
        httpHeaders.add("Content-Type", "application/json");
        

        when(userService.saveUser(any(UserDto.class),any(HttpHeaders.class))).thenReturn(savedUser);

        // Calling the controller method
        ResponseEntity<User> responseEntity = userController.saveUser(userDto,httpHeaders);

        // Assertions
        assert responseEntity.getStatusCode().equals(HttpStatus.OK);
      
    }

}
