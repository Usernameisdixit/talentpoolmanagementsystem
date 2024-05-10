import { environment } from "src/environments/environments";

let baseUrl=environment.apiUrl;

export const attendenceUrl=baseUrl+'/emp/attendance';
export const getResourceDetailsWithFileName =baseUrl +'/emp/getResourceDetailsWithFileName';
export const download = baseUrl +'download';
export const getResourceList= baseUrl +'/emp/getResourceList';

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