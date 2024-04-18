package com.tpms.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tpms.dto.RoleDto;
import com.tpms.entity.Role;
import com.tpms.service.RoleService;

@CrossOrigin(origins = "*")
@RestController
public class RoleController {

	@Autowired
	private RoleService roleService;

	@GetMapping("/getRoles")
	public List<RoleDto> getAllRoles() {
		return roleService.getRoleList();
	}

	@GetMapping("editRole/{id}")
	public ResponseEntity<Role> getRoleById(@PathVariable("id") Integer id) {
		Role role = roleService.getRoleById(id);
		return ResponseEntity.ok().body(role);
	}

	@PostMapping("/saveRoles")
	public ResponseEntity<Map<String, Object>> createRole(@RequestBody Role role) {
		if (role.getRoleId() != 0) {
			role.setRoleId(role.getRoleId());
		}
		Role createdRole = new Role();
		createdRole.setCreatedBy(1);
		createdRole.setDeletedFlag(false);
		createdRole.setRoleName(role.getRoleName());
		roleService.createRole(createdRole);
		Map<String, Object> response = new HashMap<String, Object>();
		;
		response.put("Status", "Role entered Successfully");
		return ResponseEntity.status(HttpStatus.CREATED).body(response);

	}

	@PutMapping("updateRole/{id}")
	public ResponseEntity<Role> updateRole(@PathVariable("id") Integer id, @RequestBody Role role) {
		Role updatedRole = roleService.updateRole(id, role);
		return updatedRole != null ? ResponseEntity.ok().body(updatedRole) : ResponseEntity.notFound().build();
	}

	@PostMapping("deleteRole/{id}")
	public ResponseEntity<Map<String, Object>> deleteRole(@PathVariable(name = "id") Long id) {

		Boolean result = roleService.getDeletedFlagByRoleId(id);
		if (result == true) {
			roleService.updateBitDeletedFlagByFalse(id);
		} else {
			roleService.updateBitDeletedFlagById(id);
		}

		Map<String, Object> response = new HashMap<>();
		response.put("status", 200);
		response.put("deleted", "Data Deleted Succesfully");
		if (result == true) {
			response.put("deletedFlag", false);
		} else {
			response.put("deletedFlag", true);
		}

		return ResponseEntity.ok().body(response);
	}
}
