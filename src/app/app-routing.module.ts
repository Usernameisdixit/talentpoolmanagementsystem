import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './UserMgmt/Component/login/login.component';

import { ForgotpasswordComponent } from './UserMgmt/Component/forgotpassword/forgotpassword.component';
import { RestpasswordComponent } from './UserMgmt/Component/restpassword/restpassword.component';
import { SidenavComponent } from './UserMgmt/Component/sidenav/sidenav.component';
import { UserComponent } from './UserMgmt/Component/user/user.component';
import { UserViewComponent } from './UserMgmt/Component/user-view/user-view.component';
import { NavBarComponent } from './UserMgmt/Component/nav-bar/nav-bar.component';

const routes: Routes = [

 
  {
    path:'login',component:LoginComponent,pathMatch:'full'
  },

  {
    path:'forgotPassword',component:ForgotpasswordComponent,pathMatch:'full'
  },
  {
    path:'restpassword/:email',component:RestpasswordComponent,pathMatch:"full"
  },
{
  path:'sidenav',component:SidenavComponent,pathMatch:'full'
},

{
  path:'navbar',component:NavBarComponent,pathMatch:'full'
},
  {path:"addUser",component:UserComponent},
  {path:"viewUser",component:UserViewComponent},
  {path:"",redirectTo:"addUser",pathMatch:'full'},
  {path:"editUser/:userId",component:UserComponent},
  {path:"deleteUser/:userId",component:UserViewComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
