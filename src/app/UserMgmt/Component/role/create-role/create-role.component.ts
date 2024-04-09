import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleServiceService } from 'src/app/UserMgmt/Service/role-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent {
  RoleForm:any;
  roleId: number=0;
  constructor(private formBuilder: FormBuilder,private router:Router,
    private actRoute:ActivatedRoute,private roleMasterService:RoleServiceService) {
    this.RoleForm = this.formBuilder.group({
      roleName: [''],
      roleId:[0],
      deletedFlag:[false]
    })
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe((params: { [x: string]: any; }) => {
      console.log();
      this.roleId = params['roleId'];
      console.log('Student ID:', this.roleId);
      if (this.roleId > 0) {
        this.editRolePatch();
      }
      else {
        this.roleId = 0;
      }
    });
  }

  saveRole() {
    // alert("inside createRole");
    const formData = this.RoleForm.value;
    this.RoleForm.value.id=this.roleId;
    console.log(JSON.stringify(formData, null, 2));
    this.roleMasterService.createRole(formData).subscribe((response: any) => {
    Swal.fire({
           icon: 'success',
           title: 'Role Creation successful',
           text: 'Your Role has been added successfully!',
         });
    this.router.navigate(["viewRole"]); 
      console.log("inside save");
    });
  }

  editRolePatch() {
    this.roleMasterService.editRole(this.roleId).subscribe((data: any) => {
      debugger
      let deletedFlag = data.deletedFlag
      this.RoleForm.patchValue(
        {
          roleName: data.roleName,
          roleId:data.roleId,
          deletedFlag : data.deletedFlag
        }
      );
   
    })
  }

  updateRole() {
    debugger;
    const formData = this.RoleForm.value;
    const roleId = formData.roleId; // Get the roleId from the form data
    console.log(JSON.stringify(formData, null, 2));
    this.roleMasterService.updateRole(roleId, formData).subscribe((response: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Role Update successful',
        text: 'Your Role has been updated successfully!',
      });
      this.router.navigate(["viewRole"]); 
      console.log("inside updateRole");
    });
  }



}
