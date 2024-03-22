package com.tpms.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.dto.JWTRequest;
import com.tpms.entity.FormData;
import com.tpms.entity.User;
import com.tpms.repository.UserRepository;
import com.tpms.security.JwtHelper;
import com.tpms.service.impl.UserServiceDetails;

/**
 *@author Jiban Jena
**/ 

@RestController
@CrossOrigin
public class LoginController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
    private UserServiceDetails userServiceDetails;

    @Autowired
    private JwtHelper helper;

//	@Value("${server.servlet.session.timeout}")
//	private Integer sessionTime;
	
	@GetMapping("/getAllUsers")
	public ResponseEntity<List<User>> getAllUSers()
	{
		List<User> users=userRepository.findAll();
		return ResponseEntity.ok(users);
	}
	
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JWTRequest request) {
    	try {
    	//UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
    	User user=doAuthenticate(request.getUsername(), request.getPassword());

        UserDetails userDetails = userServiceDetails.loadUserByUsername(request.getUsername());
        String token =helper.generateToken(userDetails);
        Date expiryTime=helper.getExpirationDateFromToken(token);
        Date currentTime = new Date();
        long tokenExpiryInMiliSeconds = expiryTime.getTime()-currentTime.getTime();
        if (user.getIsFirstLogin()) {
            return ResponseEntity.ok(Map.of("status", "firstlogin", "message", "First time user logged in.", "user", user));
        } else {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Login successful", "token", token, "user", user,"tokenTime",tokenExpiryInMiliSeconds));
        }
    } catch (UsernameNotFoundException e) {
        return ResponseEntity.ok(Map.of("status", "error", "message", "Invalid credentials"));
    }
    }
    
    
    
    
   
    
    public User doAuthenticate(String username, String password) {
        User user = userRepository.findByUserName(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UsernameNotFoundException("Invalid credentials");
        }
        return user;
    }
    
    
    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid !!";
    }
	
	
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
