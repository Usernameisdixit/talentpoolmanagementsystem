import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './Layout/app-layout/app-layout.component';
import { LoginComponent } from './UserMgmt/Component/login/login.component';
import { ForgotpasswordComponent } from './UserMgmt/Component/forgotpassword/forgotpassword.component';
import { RestpasswordComponent } from './UserMgmt/Component/restpassword/restpassword.component';
import { UserComponent } from './UserMgmt/Component/user/user.component';
import { UserViewComponent } from './UserMgmt/Component/user-view/user-view.component';
import { FileUploadComponent } from './ResourceMgmt/Components/file-upload/file-upload.component';
import { TalentlistComponent } from './ResourceMgmt/Components/talentlist/talentlist.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'forgotPassword', component: ForgotpasswordComponent, pathMatch: 'full' },
      { path: 'restpassword/:email', component: RestpasswordComponent, pathMatch: 'full' },
      { path: 'addUser', component: UserComponent },
      { path: 'viewUser', component: UserViewComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'editUser/:userId', component: UserComponent },
      { path: 'deleteUser/:userId', component: UserViewComponent },
      { path: 'uploadExcel', component: FileUploadComponent },
      {path:'talents',component:TalentlistComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
