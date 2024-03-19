export interface AssessmentDto {
    intActivityAllocateDetId: number;
    intActivityId: number;
    intActivityAllocateId: number;
    activityName: string;
    activityRefNo: string;
    activityDescription: string;
    activityResponsPerson1: string;
    activityAllocateId: number;
    resourceId: number;
     platformId: number;
     assessmentDate: Date;
    marks:number;
    totalMarks:number;
    activityFromDate :Date;
    activityToDate:Date;
  }
  