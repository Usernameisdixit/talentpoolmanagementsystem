package com.tpms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="tbl_user")
public class User {

	@Id
	@Column(name="intUserId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userId;

	@Column(name="vchUserFullName")
	private String userFullName;

	@Column(name="vchUserName")
	private String userName;

	@Column(name="vchPassword")
	private String password;

	@Column(name="intRoleId")
	private Integer roleId;
	
	@Column(name="vchRoleName")
	private String roleName;

	@Column(name="vchPhoneNo")
	private String phone;

	@Column(name="vchEmail")
	private String email;

	@Column(name="bitFirstLogin")
	private Byte firstLogin;

	@Column(name="intCreatedBy")
	private Integer createdBy;

	@Column(name="intUpdatedBy")
	Integer updatedBy;

	@Column(name="bitDeletedFlag")
	private Byte deletedFlag;

}
