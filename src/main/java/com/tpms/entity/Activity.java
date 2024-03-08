package com.tpms.entity;

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
@Table(name = "activity")
public class Activity {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer activityId;
    
    private Integer isAsesmentEnable;
    
    private String activityName;
    
    private String activityRefNo; // manually generated activityRefNo
    
    private String description;
    
    private String responsPerson1;
    
    private String responsPerson2;
    
    @ManyToOne
    @JoinColumn(name = "createdby")
    private User createdBy;
    
    @ManyToOne
    @JoinColumn(name = "updatedby")
    private User updatedBy;
    
    private Boolean deletedFlag;
    
}
