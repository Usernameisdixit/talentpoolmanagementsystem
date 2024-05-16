package com.tpms.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@CrossOrigin
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private Logger loggers = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtHelper jwtHelper;

    private final UserDetailsService userDetailsService;
    
    
    public JwtAuthenticationFilter(UserDetailsService userDetailsService,JwtHelper jwtHelper) {
    	this.userDetailsService=userDetailsService;
    	this.jwtHelper=jwtHelper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = extractTokenFromHeader(request.getHeader("Authorization"));
        if (token != null) {
            try {
                String username = jwtHelper.getUsernameFromToken(token);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (Boolean.TRUE.equals(jwtHelper.validateToken(token, userDetails))) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        loggers.info("Token validation failed");
                    }
                }
            } catch (ExpiredJwtException e) {
                loggers.info("Given JWT token is expired");
            } catch (MalformedJwtException e) {
                loggers.info("Invalid token format");
            } catch (Exception e) {
                loggers.error("Error processing JWT token", e);
            }
        } else {
            loggers.info("Invalid or missing Authorization header");
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }

}
