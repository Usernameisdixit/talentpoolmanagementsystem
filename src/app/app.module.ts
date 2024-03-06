import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResourceMgmtComponent } from './ResourceMgmt/Components/resource-mgmt/resource-mgmt.component';

import { AttendanceMgmtComponent } from './AttendanceMgmt/Components/attendance-mgmt/attendance-mgmt.component';
import { AssessmentMgmtComponent } from './AssessmentMgmt/Components/assessment-mgmt/assessment-mgmt.component';
import { UsermgmtComponent } from './UserMgmt/Component/usermgmt/usermgmt.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './UserMgmt/Component/login/login.component';

import { NavBarComponent } from './UserMgmt/Component/nav-bar/nav-bar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ForgotpasswordComponent } from './UserMgmt/Component/forgotpassword/forgotpassword.component';
import {MatCardModule} from '@angular/material/card';
import { RestpasswordComponent } from './UserMgmt/Component/restpassword/restpassword.component';
import { MatMenuModule } from '@angular/material/menu';
import { SidenavComponent } from './UserMgmt/Component/sidenav/sidenav.component';
import { MatListModule } from '@angular/material/list';
import { UserComponent } from './UserMgmt/Component/user/user.component';
import { UserViewComponent } from './UserMgmt/Component/user-view/user-view.component';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    ResourceMgmtComponent,
    AttendanceMgmtComponent,
    AssessmentMgmtComponent,
    UsermgmtComponent,
    UserViewComponent,
    UserComponent,
    ForgotpasswordComponent,
    RestpasswordComponent,
    SidenavComponent,
    LoginComponent,
    NavBarComponent

    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
