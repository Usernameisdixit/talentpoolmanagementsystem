import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { addUser, userList ,getRoleDetails, getUserById, deleteUser, duplicateCheck} from 'src/app/apiconfig';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private dataSubject = new Subject<any>();
  title$ =this.dataSubject.asObservable();

  constructor(private http:HttpClient) { }

  saveUser(user:any){
    let addUserUrl=addUser;
    return this.http.post(addUserUrl,user);
  }

  getUserDetails(pageNumber:number){
    let viewUserUrl=`${userList}?pageNumber=${pageNumber}`;
    return this.http.get(viewUserUrl);
  }

  getRoleDetails(){
    let getRoleUrl=getRoleDetails;
    return this.http.get(getRoleUrl);
  }

  editUser(userId:any){
    let editUserUrl=getUserById;
    return this.http.get(editUserUrl+userId);
  }

  deleteUser(userId:any,deletedFlag:any){
    let deleteUserUrl=deleteUser;
    return this.http.delete(deleteUserUrl+`${userId}/${deletedFlag}`);
  }

  duplicateCheck(value:any,colName:any){
    let duplicateCheckUrl=duplicateCheck;
    return this.http.get(duplicateCheckUrl+`${value}/${colName}`);
  }
  changeTitle(title:any){

     this.dataSubject.next(title);
  }


}
