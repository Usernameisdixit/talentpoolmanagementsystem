import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './UserMgmt/Component/login/login.component';
import { ForgotpasswordComponent } from './UserMgmt/Component/forgotpassword/forgotpassword.component';
import { RestpasswordComponent } from './UserMgmt/Component/restpassword/restpassword.component';
import { AppLayoutComponent } from './Layout/app-layout/app-layout.component';
import { UserComponent } from './UserMgmt/Component/user/user.component';
import { UserViewComponent } from './UserMgmt/Component/user-view/user-view.component';
import { NavBarComponent } from './UserMgmt/Component/nav-bar/nav-bar.component';
import { FileUploadComponent } from './ResourceMgmt/Components/file-upload/file-upload.component';
import { TalentlistComponent } from './ResourceMgmt/Components/talentlist/talentlist.component';
import { AttendanceComponent } from './AttendanceMgmt/Components/attendance/attendance.component';
import { DashboardComponent } from './UserMgmt/Component/dashboard/dashboard.component';


import { authGuard } from './Guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgotPassword', component: ForgotpasswordComponent },
  { path: 'restpassword/:email', component: RestpasswordComponent },
  { path: 'navbar', component: NavBarComponent },
  { 
    path: '', 
    component: AppLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]}
        
      ,
      { path: 'addUser', component: UserComponent, canActivate: [authGuard] },
      { path: 'viewUser', component: UserViewComponent, canActivate: [authGuard] },
      { path: 'editUser/:userId', component: UserComponent, canActivate: [authGuard] },
      { path: 'deleteUser/:userId', component: UserViewComponent, canActivate: [authGuard] },
      { path: 'uploadExcel', component: FileUploadComponent,canActivate: [authGuard]  },
      {path: "attendance", component:AttendanceComponent,canActivate: [authGuard]},
      {path:'talents',component:TalentlistComponent,canActivate: [authGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
