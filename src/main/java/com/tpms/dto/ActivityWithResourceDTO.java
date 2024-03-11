package com.tpms.dto;

import com.tpms.entity.ActivityAllocationDetails;

import lombok.Data;

@Data
public class ActivityWithResourceDTO {
    private ActivityAllocationDetails activityDetails;
    private String resourceName;
    private String resourceCode;

    public ActivityWithResourceDTO(ActivityAllocationDetails activityDetails, String resourceName,String resourceCode) {
        this.activityDetails = activityDetails;
        this.resourceName = resourceName;
        this.resourceCode = resourceCode;
    }

    
}
