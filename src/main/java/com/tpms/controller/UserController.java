package com.tpms.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.dto.RoleDto;
import com.tpms.dto.UserDto;
import com.tpms.entity.User;
import com.tpms.service.RoleService;
import com.tpms.service.UserService;

/**
 * 
 * @author kiran.swain
 *
 */


@RestController
@CrossOrigin("*")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RoleService roleService;
	
	
	@Value("${user.default.password}")
	private String password;
	
	@PostMapping("/addUser")
	public ResponseEntity<User> saveUser(@RequestBody UserDto user){
		user.setPassword(password);
		User userDetail=userService.saveUser(user);
		
		return ResponseEntity.ok().body(userDetail);
	}
	
	@GetMapping("/getRoleDetails")
	public ResponseEntity<List<RoleDto>> getRoleId(){
		 List<RoleDto> roleDetails=roleService.getRoleList();
		
		return ResponseEntity.ok().body(roleDetails);
	}
	
	@GetMapping("/userList")
	public ResponseEntity<List<User>> getStudent(){
		
		List<User> userList = userService.getUserDetails();
		return ResponseEntity.ok().body(userList);
	}
	
	@GetMapping("/getUserById/{id}")
	public ResponseEntity<UserDto> getStudentById(@PathVariable(name = "id") Integer userId){
		UserDto user=userService.getUserById(userId);
		return ResponseEntity.ok().body(user);
	}
	
	@DeleteMapping("/deleteUser/{userId}/{deletedFlag}")
	public ResponseEntity<Map<String,Object>> deleteStudent(@PathVariable Integer userId,@PathVariable Boolean deletedFlag){

		userService.deleteUserById(userId,deletedFlag);
		Map<String, Object> response = new HashMap<>();
		response.put("Status" , 200);
		response.put("Deleted", "This student data is deleted.");
		return ResponseEntity.ok().body(response);
	}
	
	@GetMapping("/duplicateCheck/{userName}")
	public ResponseEntity<String> checkDuplicateUser(@PathVariable(name="userName") String userName){
		
		String result=userService.getStatusOfDuplicacyCheck(userName);
		
		return ResponseEntity.ok().body("{\"status\": \"" + result + "\"}");
	}
	
}
