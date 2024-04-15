export class Resource {
    resourceId!: number;
    resourceName!: string;
    resourceCode!: string;
    platform!: string;
    location!: string;
    engagementPlan!: string;
    experience!: string;
    allocationDate!: string;
    phoneNo!: string;
    email!: string;
    designation!: string;
    createdBy!: number;
    createdOn!: string;
    updatedBy!: number;
    updatedOn!: string;
    status!: string;
    deletedFlag!: boolean;
    
    isAllocatedActivity!: boolean;
    activityAlloc: any[];
    selected: any;
    platformId: any;
    activityName!: string;
}
