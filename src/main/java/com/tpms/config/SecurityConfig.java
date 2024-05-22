package com.tpms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.tpms.security.JwtAuthenticationEntryPoint;
import com.tpms.security.JwtAuthenticationFilter;

@Configuration
@CrossOrigin
public class SecurityConfig {
	
    private final JwtAuthenticationEntryPoint point;
    
    private final JwtAuthenticationFilter filter;
    
    public SecurityConfig(JwtAuthenticationEntryPoint point,JwtAuthenticationFilter filter) {
    	this.point=point;
    	this.filter=filter;
    	
    }
	
    @Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(CsrfConfigurer::disable)
		.authorizeHttpRequests(auth -> auth.requestMatchers("/actuator/**").permitAll())
				.authorizeHttpRequests(auth -> auth.requestMatchers("/login").permitAll())
				.authorizeHttpRequests(auth->auth.requestMatchers("/getEmail").permitAll())
				.authorizeHttpRequests(auth->auth.requestMatchers("/resetPassword").permitAll().anyRequest().authenticated())
				.exceptionHandling(ex -> ex.authenticationEntryPoint(point))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);

		return http.build(); // Enable CORS support
	}

}
