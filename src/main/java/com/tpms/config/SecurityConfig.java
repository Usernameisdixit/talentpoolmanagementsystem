package com.tpms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

//	@Bean
//	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//		// Disable Spring Security's default login screen
//		http.formLogin(
//				fl->fl.disable()
//		);
//		// Allow POST requests without a CSRF token
//		http.csrf(
//				c->c.disable()
//		);
//		return http.build();
//	}
	
	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}
}
