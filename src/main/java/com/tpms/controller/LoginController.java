package com.tpms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.entity.FormData;
import com.tpms.entity.User;
import com.tpms.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 *@author Jiban Jena
**/ 

@RestController
@CrossOrigin
public class LoginController {
	
	@Autowired
	private UserRepository userRepository;

//	@Value("${server.servlet.session.timeout}")
//	private Integer sessionTime;
	
	@GetMapping("/getAllUsers")
	public ResponseEntity<List<User>> getAllUSers()
	{
		List<User> users=userRepository.findAll();
		return ResponseEntity.ok(users);
	}
	
	
	 @PostMapping("/login")
	    public ResponseEntity<?> loginUser(@RequestBody FormData formData) {		 
	        User user = userRepository.findByUserName(formData.getUsername());
	         //System.out.println("session timeout"+sessionTime);
	        if (user != null && BCrypt.checkpw(formData.getPassword(), user.getPassword())) {
	        	if(user.getIsFirstLogin()) {
	        		return ResponseEntity.ok(Map.of("status", "firstlogin", "message", "First time user logged in.","email",user.getEmail()));
	        	}
	        	else {
	               return ResponseEntity.ok(Map.of("status", "success", "message", "Login successful","user",user));
	        	}
	        } else {
	            return ResponseEntity.ok(Map.of("status", "error", "message", "Invalid credentials"));
	        }
	    }
	
		/*
		 * public static boolean verifyPassword(String enteredPassword, String
		 * passwordFromDatabase) { return BCrypt.checkpw(enteredPassword,
		 * passwordFromDatabase); }
		 */
	
	@PostMapping("/getEmail")
    public ResponseEntity<?> getEmail(@RequestBody FormData formEmail) {
        User user = userRepository.findByEmail(formEmail.getEmail());
		if (user != null && formEmail.getEmail().equalsIgnoreCase(user.getEmail()))
	    {
			return ResponseEntity.ok(Map.of("status", "success", "message", "Mail Verified successfully"));
		}
		else {
			return ResponseEntity.ok(Map.of("status", "error", "message", "Invalid Email"));
		}
    }
//********Method For Checking Valid email********
//	private boolean isValidEmail(String email) {
//	    String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
//	    return email.matches(emailRegex);
//	}
	
	
	@PostMapping("/resetPassword")
	public ResponseEntity<?> resetPassword(@RequestBody FormData formData) {
		User user = userRepository.findByEmail(formData.getEmail());
		if(!formData.getNewpassword().equalsIgnoreCase(formData.getConfirmpassword())) {
			return ResponseEntity
					.ok(Map.of("status", "mismatch", "message", "Enter Password Correctly."));
		}
//		***************condition for checking the password saved in database and entering password must be different**************
//		if (user != null && !formPass.getConfirmpassword().equalsIgnoreCase(user.getVchPassword())) {
//			user.setVchPassword(formPass.getConfirmpassword());
//			userRepository.save(user);
//			return ResponseEntity.ok(Map.of("status", "success", "message", "Password Verified successfully"));
//		} 
		
		if (user != null && (formData.getNewpassword() != ""
				&& formData.getNewpassword().equalsIgnoreCase(formData.getConfirmpassword()))) {
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
			String pwd = encoder.encode(formData.getConfirmpassword());
			user.setPassword(pwd);
			user.setIsFirstLogin(false);
			userRepository.save(user);
			return ResponseEntity.ok(Map.of("status", "success", "message", "Password Verified successfully"));
		} else {
			return ResponseEntity
					.ok(Map.of("status", "error", "message", "Password Must be different from the Previous one"));
		}

	}
	
	
//	@GetMapping("/sessionTimeout")
//    public ResponseEntity<Integer> getSessionTimeout() {
//        int sessionTimeout =sessionTime; // Get session timeout from configuration or other source
//        return ResponseEntity.ok(sessionTimeout);
//    }

}
