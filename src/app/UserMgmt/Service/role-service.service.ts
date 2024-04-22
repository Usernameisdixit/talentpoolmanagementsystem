import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { deleteRole, editRole, getRoles, saveRoles, updateRole } from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
 // saveUrl : string = 'http://localhost:9999/tpms/saveRoles';
 // viewRoleUrl : string = 'http://localhost:9999/tpms/getRoles';
 // editUrl : string = 'http://localhost:9999/tpms/editRole/';
  //updateUrl : string = 'http://localhost:9999/tpms/updateRole/';
  constructor(private http :HttpClient) { }

  createRole(role: any): Observable<any> {
    let saveUrl=saveRoles;
    return this.http.post(`${saveUrl}`, role);
  }

  viewRole(){
    let viewRoleUrl=getRoles;
    return this.http.get<any[]>(viewRoleUrl);
  }

  delete(id:any){ 
    
    return this.http.post(deleteRole+id,id);
  }

  editRole(id:any){
    let editUrl=editRole;
    return this.http.get(editUrl+id);
}

updateRole(id:any,data:any){
  let updateUrl=updateRole;
  return this.http.put(updateUrl+id,data);
}

 
}
