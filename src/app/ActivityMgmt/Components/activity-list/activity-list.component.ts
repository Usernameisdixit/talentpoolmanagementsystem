import { Component, OnInit, ViewChild } from '@angular/core';
import { Activity } from 'src/app/Model/activity.model';
import { ActivityService } from 'src/app/ActivityMgmt/Service/activity.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from 'src/app/UserMgmt/Service/user.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css'],
})
export class ActivityListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // tutorials?: Tutorial[];
  activities?: Activity[];
  activitiesdetails?: Activity[];
  currentActivity: Activity = {};
  currentIndex = -1;
  title = '';
  message: any;
  pagedActivities: Activity[] = [];

  constructor(
    private activityService: ActivityService,
    private router: Router,
    private _uerService:UserService
  ) {}

  currentPage: number = 1;
  pageSize: number;
  totalPages: number[] = [];
  totalElements: number = 0;

  ngOnInit(): void {
    this.retrieveActivities();
  }

  retrieveActivities(): void {
    this.activityService.getAll(this.currentPage).subscribe({
      next: (data:any) => {

        this.activities = data.content;
        this.totalElements = data.totalElements;
        this.pageSize=data.pageSize;
        console.log('Retrieved activities:', this.activities);
        // this.setPage(this.currentPage);

        console.log(data);
      },
      error: (e) => console.error(e),
    });


    this.activityService.getAll(0).subscribe((data: any) => {

      this.activitiesdetails = data;
    });
  }

  getActivity(id: string): void {
    this.activityService.get(id).subscribe({
      next: (data: Activity) => {
        // Map Activity data to Activity
        this.currentActivity = {
          activityId: data.activityId,
          activityName: data.activityName,
          description: data.description,
          responsPerson1: data.responsPerson1,
          responsPerson2: data.responsPerson2,
          // Map other properties similarly
        };
        console.log('Current activity after mapping:', this.currentActivity);
        console.log(
          'Activity ID after mapping:',
          this.currentActivity ? this.currentActivity.activityId : null
        );
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  editActivity(intActivityId: string): void {
    this.getActivity(intActivityId);
    this.router.navigate(['/activity', intActivityId]);
    this._uerService.changeTitle("Edit Activity");
    localStorage.setItem('activeLink',"Edit Activity");
  }

  refreshList(): void {
    this.retrieveActivities();
    this.currentActivity = {};
    this.currentIndex = -1;
  }

  setActiveActivity(activity: Activity, index: number): void {
    this.currentActivity = activity;
    this.currentIndex = index;
  }

  deleteActivity(activity: Activity): void {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.delete(activity.activityId).subscribe({
        next: () => {
          console.log('Activity deleted successfully');
          // Remove the deleted activity from the activities array
          if (this.activities) {
            this.activities = this.activities.filter(
              (a) => a.activityId !== activity.activityId
            );
          }
        },
        error: (e) => console.error('Error deleting activity:', e),
      });
    }
  }

  toggleDeletedFlag(activity: Activity): void {
    activity.deletedFlag = !activity.deletedFlag; // Toggle the deletedFlag
    this.activityService
      .updateDeletedFlag(activity.activityId, activity.deletedFlag)
      .subscribe({
        next: () => console.log('Deleted flag updated successfully'),
        error: (e) => console.error('Error updating deleted flag:', e),
      });
  }

  exportToPDF() {
    const doc = new jsPDF();

    const data = this.getTableDataa();

    // Add title centered
    const pageTitle = 'Activity Details';
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 15);

    // Add the table
    (doc as any).autoTable({
      head: [
        [
          'SL#',
          'ActivityName',
          'ActivityDescription	',
          'ActivityResponsPerson1',
          'ActivityResponsPerson2',
          'Status',
        ],
      ],
      body: data,
      startY: 20,
      margin: { top: 15 },
    });

    doc.save('Activity_Details.pdf');
  }

  private getTableDataa(): any[][] {
    let serialNumber = 1;
    return this.activitiesdetails.map((c, index) => [
      serialNumber++,
      // c.activityRefNo,
      c.activityName,
      c.description,
      c.responsPerson1,
      c.responsPerson2,
      c.deletedFlag ? 'Inactive' : 'Active',
    ]);
  }

  // For Implimenting Excel Format Data Reporting
  exportToExcel() {
    const tableData = this.getTableDataa();

    let headerStyle = {
      font: { bold: true }
  };

  const header = [
    { v: 'SL#', s: headerStyle },
    { v: 'ActivityName', s: headerStyle },
    { v: 'ActivityDescription', s: headerStyle },
    { v: 'ActivityResponsPerson1', s: headerStyle },
    { v: 'ActivityResponsPerson2', s: headerStyle },
    { v: 'Status', s: headerStyle },
];

    tableData.unshift(header);

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);

    // Add header row
    //const header = ['ResourceId', 'Resource Name', 'Resource Code', 'Platform', 'Location', 'Experience', 'Mobile','Email'];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Activity_Details');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  //pagination functionality
  getTableDataChange(event: any) {
    this.currentPage = event;
    this.retrieveActivities();
  }

  // ........... for searching section.................

  searchBtn(){
    this.currentPage=1;
    let activityId=document.getElementById("activityName") as HTMLSelectElement ;
    let activityPerson=document.getElementById("activityPerson") as HTMLInputElement;
    
    this.activityService.findByActivityNameandPerson(activityId.value,activityPerson.value,this.currentPage)
    .subscribe({
      next:(data:any)=>{
        if(activityId.value==='0' && activityPerson.value===''){
           this.activities=data;
        }
        else{
        this.activities = data.content;
        this.totalElements = data.totalElements;
        this.pageSize=data.pageSize;
        }
      },
      error:(e)=>console.log(e) 
    });
  }


}
