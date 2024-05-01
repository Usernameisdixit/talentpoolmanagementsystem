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

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css'],
})
export class ActivityListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // tutorials?: Tutorial[];
  activities?: Activity[];
  currentActivity: Activity = {};
  currentIndex = -1;
  title = '';
  message: any;
  pagedActivities: Activity[] = [];

  constructor(
    private activityService: ActivityService,
    private router: Router
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
        debugger;
        this.activities = data.content;
        this.totalElements = data.totalElements;
        this.pageSize=data.pageSize;
        console.log('Retrieved activities:', this.activities);
        // this.setPage(this.currentPage);

        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  // setPage(pageIndex: number): void {
  //   const startIndex = (pageIndex - 1) * this.pageSize;
  //   const endIndex = Math.min(startIndex + this.pageSize, this.activities.length);
  //   this.pagedActivities = this.activities.slice(startIndex, endIndex);
  // }

  // onPageChange(event: PageEvent): void {

  //   this.currentPage = event.pageIndex + 1;
  //   this.setPage(this.currentPage);
  // }

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
    this.router.navigate(['/activity', intActivityId]); // Navigate to the detail page for editing
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
          'ActivityRefNo',
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
    return this.activities.map((c, index) => [
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

    const headerStyle = { bold: true };
    const header = [
      { v: 'SL#', s: headerStyle },
      { v: 'ActivityRefNo', s: headerStyle },
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

  // removeAllTutorials(): void {
  //   this.tutorialService.deleteAll().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.refreshList();
  //     },
  //     error: (e) => console.error(e)
  //   });
  // }

  // searchTitle(): void {
  //   this.currentActivity = {};
  //   this.currentIndex = -1;

  //   this.tutorialService.findByTitle(this.title).subscribe({
  //     next: (data) => {
  //       this.tutorials = data;
  //       console.log(data);
  //     },
  //     error: (e) => console.error(e)
  //   });
  // }


  //pagination functionality
  getTableDataChange(event: any) {
    this.currentPage = event;
    // this.indexNumber = (this.pageno - 1) * this.tableSize;
    // console.log(this.indexNumber);

    this.retrieveActivities();
  }

  
}
