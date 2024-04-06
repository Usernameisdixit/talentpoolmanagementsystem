import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  addPlatformUrl:string="http://localhost:9999/tpms/addPlatform";
  viewPlatformUrl:string="http://localhost:9999/tpms/platformList";
  editPlatformUrl:string="http://localhost:9999/tpms/getPlatformById/";
  deletePlatformUrl:string="http://localhost:9999/tpms/deletePlatform/";
  duplicateCheckUrl:string="http://localhost:9999/tpms/duplicateCheckForPlatform/";

  constructor(private http:HttpClient) { }

  savePlatform(user:any){
    return this.http.post(this.addPlatformUrl,user);
  }

  getPlatformDetails(){
    return this.http.get(this.viewPlatformUrl);
  }

  editPlatform(platformId:any){
    return this.http.get(this.editPlatformUrl+platformId);
  }

  deletePlatform(userId:any,deletedFlag:any){
    return this.http.delete(this.deletePlatformUrl+`${userId}/${deletedFlag}`);
  }

  duplicateCheck(value:any,colName:any){
    return this.http.get(this.duplicateCheckUrl+`${value}/${colName}`);
  }
}
