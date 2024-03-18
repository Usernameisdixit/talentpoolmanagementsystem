package com.tpms.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpms.dto.RoleDto;
import com.tpms.entity.Role;
import com.tpms.repository.RoleRepository;
import com.tpms.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public List<RoleDto> getRoleList() {
		List<RoleDto> roleDto=new ArrayList<>();
		List<Role> roleDetails= roleRepository.findAll();
		
	    for(Role r :roleDetails) {
	    	RoleDto r1=new RoleDto();
	    	r1.setRoleId(r.getRoleId());
	    	r1.setRoleName(r.getRoleName());
	    	r1.setDeletedFlag(r.getDeletedFlag());
	    	roleDto.add(r1);
	    }
		return roleDto;
	}

	@Override
	public Role createRole(Role role) {
		return roleRepository.save(role);
	}

	public Role updateRole(Integer id, Role newRole) {
		if (roleRepository.existsById(id)) {
			newRole.setRoleId(id);
			return roleRepository.save(newRole);
		} else {
			return null; // Handle not found
		}
	}

	@Override
	public Role getRoleById(Integer id) {
		return roleRepository.findById(id).orElseThrow(null);
	}

	@Override
	public void updateBitDeletedFlagById(Long id) {
		roleRepository.updateBitDeletedFlagById(id);
	}

	@Override
	public Boolean getDeletedFlagByRoleId(Long id) {
		return roleRepository.getDeletedFlagByRoleId(id);
	}

	@Override
	public void updateBitDeletedFlagByFalse(Long id) {
		roleRepository.updateBitDeletedFlagByFalse(id);
	}

}
