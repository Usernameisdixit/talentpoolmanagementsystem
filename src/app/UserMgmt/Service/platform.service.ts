import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {addPlatformUrl,viewPlatformUrl,editPlatformUrl,deletePlatformUrl,duplicateCheckForPlatform} from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  

  constructor(private http:HttpClient) { }

  savePlatform(user:any){
    return this.http.post(addPlatformUrl,user);
  }

  getPlatformDetails(){
    return this.http.get(viewPlatformUrl);
  }

  editPlatform(platformId:any){
    return this.http.get(editPlatformUrl+platformId);
  }

  deletePlatform(userId:any,deletedFlag:any){
    return this.http.delete(deletePlatformUrl+`${userId}/${deletedFlag}`);
  }

  duplicateCheck(value:any,colName:any){
    return this.http.get(duplicateCheckForPlatform+`${value}/${colName}`);
  }
}
