package com.tpms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "user")
public class User {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
    
    private String userFullName;

    private String userName;

    private String password;

    @ManyToOne
    @JoinColumn(name = "roleId")
    private Role role;

    private String phoneNo;

    @Column(name = "email")
    private String email;
    
    private Boolean isFirstLogin;

    @Column(name = "createdby")
    private Integer createdBy;

    private Integer updatedBy;

    private Boolean deletedFlag;


}
