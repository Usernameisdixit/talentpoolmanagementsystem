package com.tpms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
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
	@Autowired
    private JwtAuthenticationEntryPoint point;
    @Autowired
    private JwtAuthenticationFilter filter;

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
    
    
    
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http.csrf(csrf -> csrf.disable())
//        		.cors(cors->cors.disable())
//                .authorizeHttpRequests(auth->
//                auth.requestMatchers("/login").permitAll().anyRequest().authenticated())
//                .exceptionHandling(ex -> ex.authenticationEntryPoint(point))
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//        http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
//        return http.build();
//    }
	
	
    @Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(CsrfConfigurer::disable)
				.authorizeHttpRequests(auth -> auth.requestMatchers("/login").permitAll())
				.authorizeHttpRequests(auth->auth.requestMatchers("/getEmail").permitAll())
				.authorizeHttpRequests(auth->auth.requestMatchers("/resetPassword").permitAll().anyRequest().authenticated())
				.exceptionHandling(ex -> ex.authenticationEntryPoint(point))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);

		return http.build(); // Enable CORS support
	}

	
	
//	@Bean
//	public PasswordEncoder encoder() {
//		return new BCryptPasswordEncoder();
//	}
}
