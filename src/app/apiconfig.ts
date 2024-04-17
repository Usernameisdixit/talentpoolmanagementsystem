import { environment } from "src/environments/environments";

let baseUrl=environment.apiUrl;

export const attendenceUrl=baseUrl+'/emp/attendance';
export const getResourceDetailsWithFileName =baseUrl +'/emp/getResourceDetailsWithFileName';
export const download = baseUrl +'download';
export const getResourceList= baseUrl +'/emp/getResourceList';

