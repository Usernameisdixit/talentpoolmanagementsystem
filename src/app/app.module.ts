import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ForgotpasswordComponent } from './UserMgmt/Component/forgotpassword/forgotpassword.component';
import {MatCardModule} from '@angular/material/card';
import { RestpasswordComponent } from './UserMgmt/Component/restpassword/restpassword.component';
import { MatMenuModule } from '@angular/material/menu';
import { SideNavComponent } from './UserMgmt/Component/side-nav/side-nav.component';
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
import { FileUploadComponent } from './ResourceMgmt/Components/file-upload/file-upload.component';
import { AppLayoutComponent } from './Layout/app-layout/app-layout.component';
import { TalentlistComponent } from './ResourceMgmt/Components/talentlist/talentlist.component';
import {  TalenteditComponent } from './ResourceMgmt/Components/talentedit/talentedit.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { DashboardComponent } from './UserMgmt/Component/dashboard/dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewRoleComponent } from './UserMgmt/Component/role/view-role/view-role.component';
import { CreateRoleComponent } from './UserMgmt/Component/role/create-role/create-role.component';
import { DatePipe } from '@angular/common';
import { AsessmentdetailsComponent } from './AssessmentMgmt/Components/asessmentdetails/asessmentdetails.component';
import { DisclaimerComponent } from './Disclaimer/disclaimer/disclaimer.component';
import { ViewassessmentComponent } from './AssessmentMgmt/Components/viewassessment/viewassessment.component';
import { AssessmentreportComponent } from './Reports/AssessmentReport/assessmentreport/assessmentreport.component';
import { ReportTypeDialogComponent } from './Reports/report-type-dialog/report-type-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AllocationComponent } from './ActivityAllocation/Components/allocation/allocation.component';
import { AllocationDetailsComponent } from './ActivityAllocation/Components/allocation-details/allocation-details.component';
import { FooterComponent } from './Footer/footer/footer.component';

import { AddActivityComponent } from './ActivityMgmt/Components/add-activity/add-activity.component';
import { ActivityListComponent } from './ActivityMgmt/Components/activity-list/activity-list.component';
import { ActivityDetailsComponent } from './ActivityMgmt/Components/activity-details/activity-details.component';
import { ActivityNavbarComponent } from './ActivityMgmt/Components/activity-navbar/activity-navbar.component';
import { EditAssessmentComponent } from './AssessmentMgmt/Components/edit-assessment/edit-assessment.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AttendanceNewComponent } from './AttendanceMgmt/Components/attendance-new/attendance-new.component';
import { JwtInterceptor } from './JwtInterceptor.service';
import { BulkAllocationComponent } from './ActivityAllocation/Components/bulk-allocation/bulk-allocation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResourcehistoryComponent } from './ResourceMgmt/Components/resourcehistory/resourcehistory.component';
import { TimePipe } from './ActivityAllocation/CustomPipes/time.pipe';
import { HeaderComponent } from './UserMgmt/Component/header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReportAttendanceComponent } from './Reports/AttendanceNewReportComponent/report-attendance/report-attendance.component';
import { LoaderComponent } from './loader/loader.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';

import { PlatformViewComponent } from './ResourceMgmt/Components/platform-master/platform-view/platform-view.component';
import { PlatformComponent } from './ResourceMgmt/Components/platform-master/platform/platform.component';
import { HideIdInterceptor } from './HideIdInterceptor.service';
import { ActivityNewReportComponentComponent } from './Reports/ActivityNewReportComponent/activity-new-report-component.component';
import { ResourcereportComponent } from './Reports/ResourceReportComponent/resourcereport/resourcereport.component';
import { MailactivityComponent } from './MailActivity/Component/mailactivity/mailactivity.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { allResourceName, dataActivityName, duplicateCheck, getActivities, getActivityForAuto, getActivityOnFromToUrl, getRoleDetails } from './apiconfig';

defineLocale('en-gb', enGbLocale); //
@NgModule({
  declarations: [
    AppComponent,
  
    UsermgmtComponent,
    UserViewComponent,
    UserComponent,
    ForgotpasswordComponent,
    RestpasswordComponent,
    SideNavComponent,
    LoginComponent,
    NavBarComponent,
    FileUploadComponent,
    AppLayoutComponent,
    TalentlistComponent,
    TalenteditComponent,
    DashboardComponent,
    AsessmentdetailsComponent,
    DisclaimerComponent,
    ViewassessmentComponent,
    ViewRoleComponent,
    CreateRoleComponent,
    AssessmentreportComponent,
    ReportTypeDialogComponent,
    AllocationComponent,
    AllocationDetailsComponent,
    FooterComponent,
    AddActivityComponent,
    ActivityListComponent,
    ActivityDetailsComponent,
    ActivityNavbarComponent,
    EditAssessmentComponent,
    AttendanceNewComponent,
    BulkAllocationComponent,
    ResourcehistoryComponent,
    TimePipe,
    HeaderComponent,
    ReportAttendanceComponent,
    LoaderComponent,
   
    PlatformViewComponent,
    PlatformComponent,
    ActivityNewReportComponentComponent,
    ResourcereportComponent,
    MailactivityComponent

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
    MatPaginatorModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    MatDialogModule,
    MatSnackBarModule,
    NgbModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxUiLoaderModule,
    CKEditorModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
      exclude: [getActivityForAuto,
        dataActivityName, 
        allResourceName,
        getActivityOnFromToUrl,
        getRoleDetails,
        getActivities,
        duplicateCheck,
        
      ]
    }),
    
  ],
  providers: [DatePipe,MatSnackBar,{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HideIdInterceptor, multi: true }],
  bootstrap: [AppComponent]
})


export class AppModule { }
