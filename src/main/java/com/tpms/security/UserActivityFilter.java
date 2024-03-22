//package com.tpms.security;
//import java.io.IOException;
//import java.util.Date;
//import java.util.concurrent.ConcurrentHashMap;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.GenericFilterBean;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.ServletRequest;
//import jakarta.servlet.ServletResponse;
//import jakarta.servlet.http.HttpServletRequest;
//
//@Component
//public class UserActivityFilter extends GenericFilterBean {
//
//    private final ConcurrentHashMap<String, Long> userActivityMap = new ConcurrentHashMap<>();
//    //private final long maxInactiveTimeMillis = 5 * 60 * 1000; // 15 minutes
//    
//    @Value("${jwt.token.validity.minutes}")
//    private int maxInactiveTimeMillis;
//    
//    @Autowired
//    JwtHelper jwtHelper;
//    
//
//    @Override
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
//        HttpServletRequest httpRequest = (HttpServletRequest) request;
////        HttpServletResponse httpResponse = (HttpServletResponse) response;
//        String requestHeader = httpRequest.getHeader("Authorization");
//        String username = httpRequest.getRemoteUser();
//        String token =null; 
//        if (username != null) {
//        	token=requestHeader.substring(7);
//        	jwtHelper.updateExpiryTime(token, maxInactiveTimeMillis*60*1000);
//
//        	//Date time=jwtHelper.getExpirationDateFromToken(token);
//        }
//
//        chain.doFilter(request, response);
//    }
//
////    @Scheduled(fixedDelay = 60000) // Check user activity every minute
////    public void checkUserActivity() {
////        long currentTime = System.currentTimeMillis();
////        for (String username : userActivityMap.keySet()) {
////            long lastActivityTime = userActivityMap.getOrDefault(username, 0L);
////            if (currentTime - lastActivityTime > maxInactiveTimeMillis *60* 1000) {
////                // Take action for inactive user (e.g., log out)
////                userActivityMap.remove(username);
////                // You can perform logout or invalidate user session here
////            }
////        }
////    }
//}
