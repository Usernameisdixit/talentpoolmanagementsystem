import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  addUserUrl:string="http://localhost:9999/tpms/addUser/";
  viewUserUrl:string="http://localhost:9999/tpms/userList";
  editUserUrl:string="http://localhost:9999/tpms/getUserById/";
  getRoleUrl:string="http://localhost:9999/tpms/getRoleDetails";
  deleteUserUrl:string="http://localhost:9999/tpms/deleteUser/";
  duplicateCheckUrl:string="http://localhost:9999/tpms/duplicateCheck/";
  
  private dataSubject = new Subject<any>();
  title$ =this.dataSubject.asObservable();

  constructor(private http:HttpClient) { }

  saveUser(user:any, userId:any){
    return this.http.post(this.addUserUrl+`${userId}`,user);
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

  duplicateCheck(value:any,colName:any){
    return this.http.get(this.duplicateCheckUrl+`${value}/${colName}`);
  }
  changeTitle(title:any){
     this.dataSubject.next(title);
  }


}
