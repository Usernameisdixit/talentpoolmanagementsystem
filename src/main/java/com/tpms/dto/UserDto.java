package com.tpms.dto;

import lombok.Data;

@Data
public class UserDto {
	
	 private Integer userId;
	    
	    private String userFullName;

	    private String userName;

	    private String password;

	    private Integer roleId;

	    private String phoneNo;

	    private String email;
	    
	    private Boolean isFirstLogin;

	    private Integer createdBy;
	    
	    private Integer updatedBy;

	    private Boolean deletedFlag;

}
