package com.tpms.entity;

public class FormData {
	private String username;

	private String password;
	
	private String email;
	
	private String newpassword;
	
	private String confirmpassword;

	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	
	
	public String getNewpassword() {
		return newpassword;
	}

	public void setNewpassword(String newpassword) {
		this.newpassword = newpassword;
	}

	public String getConfirmpassword() {
		return confirmpassword;
	}

	public void setConfirmpassword(String confirmpassword) {
		this.confirmpassword = confirmpassword;
	}

	@Override
	public String toString() {
		return "FormData [username=" + username + ", password=" + password + ", email=" + email + ", newpassword="
				+ newpassword + ", confirmpassword=" + confirmpassword + "]";
	}

	

	

	
}
