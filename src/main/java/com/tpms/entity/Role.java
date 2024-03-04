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
@Table(name="tbl_mst_role")
public class Role {

	@Id
	@Column(name="intRoleId")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer roleId;
	
	@Column(name="vchRoleName")
	private String roleName;
	
	@Column(name="intCreatedBy")
	private Integer createdBy;
	
	@Column(name="intUpdatedBy")
	private Integer updatedBy;
	
	@Column(name="bitDeletedFlag")
	private Byte deletedFlag;
}
