package com.tpms.service;

import java.util.List;

import com.tpms.entity.Role;

public interface RoleService {
	
	List<Role> getRoleList();
	
	Role getRoleById(Integer id);
	
	Role createRole(Role role);
	
	void updateBitDeletedFlagById(Long id);
	
	Boolean getDeletedFlagByRoleId(Long id);
	
	void updateBitDeletedFlagByFalse(Long id);

	Role updateRole(Integer id, Role newRole);
	
}
