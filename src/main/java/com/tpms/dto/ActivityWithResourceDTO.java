package com.tpms.dto;

import com.tpms.entity.ActivityAllocation;
import com.tpms.entity.ActivityAllocationDetails;

import lombok.Data;

@Data
public class ActivityWithResourceDTO {
    private ActivityAllocationDetails activityDetails;
    private ActivityAllocation activityAllocation;
    private String resourceName;
    private String resourceCode;

    public ActivityWithResourceDTO(ActivityAllocationDetails activityDetails,ActivityAllocation activityAllocation, String resourceName,String resourceCode) {
        this.activityDetails = activityDetails;
        this.activityAllocation=activityAllocation;
        this.resourceName = resourceName;
        this.resourceCode = resourceCode;
       
    }

    
}
