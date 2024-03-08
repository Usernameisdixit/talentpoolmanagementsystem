import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  addUserUrl:string="http://localhost:9999/tpms/addUser";
  viewUserUrl:string="http://localhost:9999/tpms/userList";
  editUserUrl:string="http://localhost:9999/tpms/getUserById/";
  getRoleUrl:string="http://localhost:9999/tpms/getRoleDetails";
  deleteUserUrl:string="http://localhost:9999/tpms/deleteUser/";
  duplicateCheckUrl:string="http://localhost:9999/tpms/duplicateCheck/";

  constructor(private http:HttpClient) { }

  saveUser(user:any){
    return this.http.post(this.addUserUrl,user);
  }

  getUserDetails(){
    return this.http.get(this.viewUserUrl);
  }

  getRoleDetails(){
    return this.http.get(this.getRoleUrl);
  }

  editUser(userId:any){
    return this.http.get(this.editUserUrl+userId);
  }

  deleteUser(userId:any,deletedFlag:any){
    return this.http.delete(this.deleteUserUrl+`${userId}/${deletedFlag}`);
  }

  duplicateCheck(userName:any){
    return this.http.get(this.duplicateCheckUrl+userName);
  }
}
