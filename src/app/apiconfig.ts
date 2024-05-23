import { environment } from "src/environments/environments";

let baseUrl=environment.apiUrl;

export const attendenceUrl=baseUrl+'/emp/attendance';
export const download = baseUrl +'download';


// user management
    //user
    export const addUser=baseUrl+'/addUser';
    export const userList=baseUrl+'/userList';
    export const getRoleDetails=baseUrl+'/getRoleDetails';
    export const getUserById=baseUrl+'/getUserById/'
    export const deleteUser=baseUrl+'/deleteUser/';
    export const duplicateCheck = baseUrl+'/duplicateCheck/';

    // login
    export const getAllUsers=baseUrl+'/getAllUsers';
    export const login=baseUrl+'/login';
    export const getEmail=baseUrl+'/getEmail';
    export const resetPassword=baseUrl+'/resetPassword';
    export const getAllAllocationDate=baseUrl+'/getAllAllocationDate';
    export const getAttendanceData=baseUrl+'/getAttendanceData';
    export const activityByFromToDate=baseUrl+'/activityByFromToDate';
    export const totalActivitiesPlanned=baseUrl+'/totalActivitiesPlanned';

    //platform
    export const addPlatformUrl=baseUrl+'/addPlatform';
    export const viewPlatformUrl=baseUrl+'/platformList';
    export const editPlatformUrl=baseUrl+'/getPlatformById/';
    export const deletePlatformUrl=baseUrl+'/deletePlatform/';
    export const duplicateCheckForPlatform=baseUrl+'/duplicateCheckForPlatform/';

//role 
export const saveRoles=baseUrl+'/saveRoles';
export const getRoles=baseUrl+'/getRoles';
export const deleteRole=baseUrl+'/deleteRole/';
export const editRole=baseUrl+'/editRole/';
export const updateRole=baseUrl+'/updateRole/';

 //Resource Report
 export const getResourceResurceList= baseUrl +'/emp/getResourceReportList';
 export const getDesignationData = baseUrl + '/getDesignation';
 export const getPlaformListData = baseUrl + '/getPlatform';
 export const getLocationData =  baseUrl + '/getLocation';
 export const searchFilterData = baseUrl + '/searchFilterData';


 //Attendance
 export const activityForAtt=baseUrl+'/activityByDate';
 export const attendDataByActivUrl=baseUrl+'/attDataByActivity';
 export const attendanceSaveUrl=baseUrl+'/saveAttendanceByActivity';

 //Mail
 export const allocationDataForMailUrl=baseUrl+'/allocationDataForMail';
 export const mailContentUrl=baseUrl+'/mailContent';
 export const send=baseUrl+'/send';

 //Report

 //Attendance Report
 export const getActivityOnFromToUrl=baseUrl+'/getActivityOnFromTo';
 export const attedanceDataReportUrl=baseUrl+'/attedanceDataReport';
 export const allResourceName=baseUrl+'/allResourceName';
 //ActivityReport 
 export const activitynewDataReport=baseUrl+'/activitynewDataReport';
 export const getActivityReportOnFromTo=baseUrl+'/getActivityReportOnFromTo';
 //AssesmentReport
 export const getActivityForAssesment=baseUrl+'/getActivityForAssesment';
 export const assesmentReportData=baseUrl+'/assesmentReportData';
 //Resource Report
 export const updatetalent=baseUrl+'/emp/updatetalent';
 export const downloadOnResReport=baseUrl+'/emp/download/';
 export const getResourceDetailsWithFileName =baseUrl +'/emp/getResourceDetailsWithFileName';
 export const getResourceList= baseUrl +'/emp/getResourceList';
 //export const getAciveResource= baseUrl +'/getActiveResorces';
 export const fetchActiv= baseUrl+'/emp/ractive';
 export const fetchDuration= baseUrl+'/emp/durations';
 export const findByResourceNo= baseUrl+'/emp/talent/';
 export const deleteByResourceNo= baseUrl+'/emp/delete/talent/';
 export const getEditResource= baseUrl +'/emp/talent/';
 export const deleteResource= baseUrl +'/emp/delete/talent/';
 export const durations= baseUrl +'/emp/durations';
 export const getActiveResorces= baseUrl +'/getActiveResources';

 //Activity Management
 export const getActivity=baseUrl+'/get/activity';
 export const getActivityForAuto=baseUrl+'/getActivityForAuto';
 export const saveActivity=baseUrl+'/save/activity';
 export const updateActivity=baseUrl+'/update/activity';
 export const deleteActivity=baseUrl+'/delete/activity';
 export const updateDeletedFlag=baseUrl+'/update-deleted-flag';
 export const dataActivityName=baseUrl+'/dataActivityName';
 export const activityCheck=baseUrl+'/activityCheck';
 export const searchActivity=baseUrl+'/searchActivity';

 // Activity Allocation
 export const platforms=baseUrl+'/platforms';
 export const resources=baseUrl+'/resources';
 export const activities=baseUrl+'/activities';
 export const saveAllocation=baseUrl+'/saveAllocation';
 export const allocationDetails=baseUrl+'/allocationDetails';
 export const resource=baseUrl+'/resource';
 export const resourcesExcludeRelated=baseUrl+'/resources/exclude-related';
 export const saveBulkAllocation=baseUrl+'/saveBulkAllocation';
 export const platformsIdByName=baseUrl+'/platformsIdByName';
 export const fetchDataByDateRange=baseUrl+'/fetchDataByDateRange';
 export const deleteAllocation=baseUrl+'/deleteAllocation';

//Assessment
export const platformUrl=baseUrl+'/getPlatforms';
export const assesmentDetails = baseUrl+'/api/assessment-details';
export const viewAssesmentDetailsDateWisePagination = baseUrl+'/viewAssesmentDetailsDateWisePagination';
export const getActivityDetails=baseUrl+'/getActivityDetails';
export const checkAssessments=baseUrl+'/checkAssessments';
export const viewAssesmentDetails=baseUrl+'/viewAssesmentDetails';
export const editAssesment=baseUrl+'/editAssessment';
export const updateUrl=baseUrl+'/updateAssessment';
export const getActivities=baseUrl+'/getActivities';
export const viewAssesmentDetailsDateWise=baseUrl+'/viewAssesmentDetailsDateWise';
export const getAssesmentDate=baseUrl+'/assessmentDates';
export const saveAssement=baseUrl+'/assessments';
export const getFromToDate=baseUrl+'/getFromToDate';

// file upload
export const uploadCheck=baseUrl+'/uploadCheck';
export const uploadCheckPhone=baseUrl+'/uploadCheckPhone';
export const uploadCheckEmail=baseUrl+'/uploadCheckEmail';
export const uploadCheckResourceCode=baseUrl+'/uploadCheckResourceCode';
export const upload=baseUrl+'/upload';
export const downloadTemplate=baseUrl+'/downloadTemplate';

