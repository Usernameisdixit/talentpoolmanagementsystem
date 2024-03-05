package com.tpms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userId;

	private String userFullName;

	private String userName;

	private String password;

	private Integer roleId;
	
	private String roleName;

	private String phoneNo;

	private String email;

	private Boolean isFirstLogin;

	private Integer createdBy;

	private Integer updatedBy;

	private Boolean deletedFlag;

}
