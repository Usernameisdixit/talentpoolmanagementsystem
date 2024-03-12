package com.tpms.entity;



import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "role")
public class Role {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleId;

    private String roleName;

    private Integer createdBy;

    
    private Integer updatedBy;

    private Boolean deletedFlag;
    
    @OneToMany(mappedBy = "role" , fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> user;
}
