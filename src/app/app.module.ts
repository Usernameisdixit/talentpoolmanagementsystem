import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResourceMgmtComponent } from './ResourceMgmt/resource-mgmt/resource-mgmt.component';
import { UserMgmtComponent } from './UserMgmt/user-mgmt/user-mgmt.component';
import { AttendanceMgmtComponent } from './AttendanceMgmt/attendance-mgmt/attendance-mgmt.component';
import { AssessmentMgmtComponent } from './AssessmentMgmt/assessment-mgmt/assessment-mgmt.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourceMgmtComponent,
    UserMgmtComponent,
    AttendanceMgmtComponent,
    AssessmentMgmtComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
