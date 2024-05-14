import { environment } from "src/environments/environments";

let baseUrl=environment.apiUrl;

export const attendenceUrl=baseUrl+'/emp/attendance';
export const download = baseUrl +'download';


// user management
export const addUser=baseUrl+'/addUser';
export const userList=baseUrl+'/userList';
export const getRoleDetails=baseUrl+'/getRoleDetails';
export const getUserById=baseUrl+'/getUserById/'
export const deleteUser=baseUrl+'/deleteUser/';
export const duplicateCheck = baseUrl+'/duplicateCheck/';

//role 
export const saveRoles=baseUrl+'/saveRoles';
export const getRoles=baseUrl+'/getRoles';
export const deleteRole=baseUrl+'/deleteRole/';
export const editRole=baseUrl+'/editRole/';
export const updateRole=baseUrl+'/updateRole/';

 //Resource Report
 export const getResourceResurceList= baseUrl +'/emp/getResourceReportList';

 //Attendance
 export const activityForAtt=baseUrl+'/activityByDate';
 export const attendDataByActivUrl=baseUrl+'/attDataByActivity';
 export const attendanceSaveUrl=baseUrl+'/saveAttendanceByActivity';

 //Mail
 export const allocationDataForMailUrl=baseUrl+'/allocationDataForMail';
 export const mailContentUrl=baseUrl+'/mailContent';

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
 export const getAciveResource= baseUrl +'/getActiveResorces';
 export const fetchActiv= baseUrl+'/emp/ractive';
 export const fetchDuration= baseUrl+'/emp/durations';
 export const findByResourceNo= baseUrl+'/emp/talent/';
 export const deleteByResourceNo= baseUrl+'/emp/delete/talent/';