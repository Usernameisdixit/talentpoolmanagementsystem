import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
  saveUrl : string = 'http://localhost:9999/tpms/saveRoles';
  viewRoleUrl : string = 'http://localhost:9999/tpms/getRoles';
  editUrl : string = 'http://localhost:9999/tpms/editRole/';
  updateUrl : string = 'http://localhost:9999/tpms/updateRole/';
  constructor(private http :HttpClient) { }

  createRole(role: any): Observable<any> {
    debugger;
    return this.http.post(`${this.saveUrl}`, role);
  }

  viewRole(){
    return this.http.get<any[]>(this.viewRoleUrl);
  }

  delete(id:any){ 
    return this.http.post("http://localhost:9999/tpms/delete/"+id,id);
  }

  editRole(id:any){
    debugger
    return this.http.get(this.editUrl+id);
}

updateRole(id:any,data:any){
  debugger
  return this.http.put(this.updateUrl+id,data);
}

 
}
