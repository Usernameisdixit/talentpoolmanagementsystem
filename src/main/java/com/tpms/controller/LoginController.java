package com.tpms.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

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
	
	private static final String INVALID_CREDENTIALS = "Invalid credentials";

	private static final String SUCCESS = "success";

	private static final String MESSAGE = "message";

	private static final String ERROR = "error";

	private static final String STATUS = "status";

	private static final ResponseEntity<Map<String, Object>> OK = ResponseEntity.ok(Map.of(STATUS, ERROR, MESSAGE, INVALID_CREDENTIALS));

	private final UserRepository userRepository;

    private final UserServiceDetails userServiceDetails;

    private final JwtHelper helper;
    
    public LoginController (JwtHelper helper,UserServiceDetails userServiceDetails,UserRepository userRepository) {
    	this.userRepository=userRepository;
    	this.helper=helper;
    	this.userServiceDetails=userServiceDetails;
    }


	@GetMapping("/getAllUsers")
	public ResponseEntity<List<User>> getAllUSers()
	{
		List<User> users=userRepository.findAll();
		return ResponseEntity.ok(users);
	}
	
    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@RequestBody JWTRequest request) {
    	try {
    	User user=doAuthenticate(request.getUsername(), request.getPassword());

        UserDetails userDetails = userServiceDetails.loadUserByUsername(request.getUsername());
        String token =helper.generateToken(userDetails);
        Date expiryTime=helper.getExpirationDateFromToken(token);
        Date currentTime = new Date();
        long tokenExpiryInMiliSeconds = expiryTime.getTime()-currentTime.getTime();
        if (Boolean.TRUE.equals(user.getIsFirstLogin())) {
            return ResponseEntity.ok(Map.of(STATUS, "firstlogin", MESSAGE, "First time user logged in.", "user", user));
        } else {
            return ResponseEntity.ok(Map.of(STATUS, SUCCESS, MESSAGE, "Login successful", "token", token, "user", user,"tokenTime",tokenExpiryInMiliSeconds));
        }
    } catch (UsernameNotFoundException e) {
        return OK;
    }
    }
    
    public User doAuthenticate(String username, String password) {
        User user = userRepository.findByUserName(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UsernameNotFoundException(INVALID_CREDENTIALS);
        }
        return user;
    }
    
    
    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid !!";
    }
	
	
	@PostMapping("/getEmail")
    public ResponseEntity<Map<String,String>> getEmail(@RequestBody FormData formEmail) {
        User user = userRepository.findByEmail(formEmail.getEmail());
		if (user != null && formEmail.getEmail().equalsIgnoreCase(user.getEmail()))
	    {
			return ResponseEntity.ok(Map.of(STATUS, SUCCESS, MESSAGE, "Mail Verified successfully"));
		}
		else {
			return ResponseEntity.ok(Map.of(STATUS, ERROR, MESSAGE, "Invalid Email"));
		}
    }
	
	@PostMapping("/resetPassword")
	public ResponseEntity<Map<String,String>> resetPassword(@RequestBody FormData formData) {
		User user = userRepository.findByEmail(formData.getEmail());
		if(!formData.getNewpassword().equalsIgnoreCase(formData.getConfirmpassword())) {
			return ResponseEntity
					.ok(Map.of(STATUS, "mismatch", MESSAGE, "Enter Password Correctly."));
		}
		
		if (user != null && (!"".equals(formData.getNewpassword())
				&& formData.getNewpassword().equalsIgnoreCase(formData.getConfirmpassword()))) {
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
			String pwd = encoder.encode(formData.getConfirmpassword());
			user.setPassword(pwd);
			user.setIsFirstLogin(false);
			userRepository.save(user);
			return ResponseEntity.ok(Map.of(STATUS, SUCCESS, MESSAGE, "Password Verified successfully"));
		} else {
			return ResponseEntity
					.ok(Map.of(STATUS, ERROR, MESSAGE, "Password Must be different from the Previous one"));
		}

	}
	

}
