package com.tpms.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.dto.PageResponse;
import com.tpms.dto.RoleDto;
import com.tpms.dto.UserDto;
import com.tpms.entity.User;
import com.tpms.service.RoleService;
import com.tpms.service.UserService;


@RestController
@CrossOrigin("*")
public class UserController {
	
	
	private final UserService userService;
	
	
	private final RoleService roleService;
	
	public UserController(UserService userService,RoleService roleService) {
		this.userService=userService;
		this.roleService=roleService;
	}
	
	
	@Value("${user.default.password}")
	private String password;
	
	@PostMapping("/addUser")
	public ResponseEntity<User> saveUser(@RequestBody UserDto user, @RequestHeader HttpHeaders httpHeaders){
		User userDetail=null;
		try {
		  user.setPassword(password);
		   userDetail=userService.saveUser(user,httpHeaders);
		  
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} 
		
		return ResponseEntity.ok().body(userDetail);
	}
	
	@GetMapping("/getRoleDetails")
	public ResponseEntity<List<RoleDto>> getRoleId(){
		List<RoleDto> roleDetails=null;
		try {
		  roleDetails=roleService.getRoleList();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok().body(roleDetails);
	}
	
	@GetMapping("/userList")
	public ResponseEntity<?> getUserList(
			@RequestParam(defaultValue = "1") Integer pageNumber){		
		if(pageNumber==0) {
			List<User> userList=userService.getAllUsers();
			userList=userList.stream().sorted((a,b)->a.getUserFullName().compareTo(b.getUserFullName())).toList();
			return ResponseEntity.ok().body(userList);
		}
		
	    PageResponse<User> userList = userService.getUserDetails(pageNumber, 10);
	    
		return ResponseEntity.ok().body(userList);
	}
	
	@GetMapping("/getUserById/{id}")
	public ResponseEntity<UserDto> getUserById(@PathVariable(name = "id") Integer userId){
		UserDto user=userService.getUserById(userId);
		return ResponseEntity.ok().body(user);
	}
	
	@DeleteMapping("/deleteUser/{userId}/{deletedFlag}")
	public ResponseEntity<Map<String,Object>> deleteUser(@PathVariable Integer userId,@PathVariable Boolean deletedFlag){

		userService.deleteUserById(userId,deletedFlag);
		Map<String, Object> response = new HashMap<>();
		response.put("Status" , 200);
		response.put("Deleted", "This user data is deleted.");
		return ResponseEntity.ok().body(response);
	}
	
	@GetMapping("/duplicateCheck/{value}/{colName}")
	public ResponseEntity<String> checkDuplicateUser(@PathVariable(name="value") String value,
			@PathVariable(name="colName") String colName){
		
		String result=userService.getStatusOfDuplicacyCheck(value,colName);
		
		return ResponseEntity.ok().body("{\"status\": \"" + result + "\"}");
	}
	
	
	
}
