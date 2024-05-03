import { Component, OnInit ,ElementRef,ViewChild,ViewChildren,QueryList} from '@angular/core';
import Swal from 'sweetalert2';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerConfig,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';
import { DateRange } from 'src/app/Model/DateRange';
import { NgModel } from '@angular/forms';
import { UserService } from 'src/app/UserMgmt/Service/user.service';

@Component({
  selector: 'app-asessmentdetails',
  templateUrl: './asessmentdetails.component.html',
  styleUrls: ['./asessmentdetails.component.css']
})
export class AsessmentdetailsComponent implements OnInit {

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  bsConfig: Partial<BsDatepickerConfig>;
  isHidden: boolean = true;
  activityAllocations: any[];
  totalMarks: number ;
  platforms: any[] = [];
  selectedPlatform: string = '';
  selectedPlatformName: string = '';
  selectedPlatformId: number;
  selectedYear: number;
  fromDate: Date ;
  toDate: Date ;
  showAssessmentTable: boolean = false;
  showActivityTable :  boolean = false;
  assessments: any[];
  assessmentsExist: any[];
  assessmentDtos: AssessmentDto[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  assessmentDate: Date;
  detailsRetrieved: boolean = false;
  activities: any[]; 
  selectedActivity: any = '';
  hour: any;
  remarks: any;
  marks: number;
  status:string='s';

  
  dateRanges: string[] = [];
  selectedDateRange: string = '';
  fieldValuesList: any[][]=[];
   

  constructor(private http: HttpClient, private datePipe: DatePipe, 
    private apiService: AssessmentserviceService,private route:Router, private _userService:UserService) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers : false
    };

  }

  ngOnInit(): void {
   
    this.fetchFromToDate();
  
  }

  fetchFromToDate(): void {
    this.apiService.getFromToDate().subscribe(
      (data : any[] ) => {
      let fromDate: Date | null = null;
      let toDate: Date | null = null;    
    data.forEach( item => {

      const fromDateItem = new Date(item.maxFromDate);
      const toDateItem = new Date(item.maxToDate);
    

      if (!fromDate || fromDateItem < fromDate) {
        fromDate = fromDateItem;
      }
      if (!toDate || toDateItem > toDate) {
        toDate = toDateItem;
      }
     
      const dateRange = new DateRange(fromDateItem, toDateItem, this.datePipe);
      this.dateRanges.push(dateRange.toString());
      this.selectedDateRange = dateRange.toString();
      
    
    });

    if (this.dateRanges.length > 0) {
      this.selectedDateRange = this.dateRanges[0];
    }
    
   
 
    this.fetchActivities();
       
      },
      error => {
        console.error('Error fetching from/to dates:', error);
      }
    );
  }

  onDateChange(): void {
    this.fetchActivities();
  }

  fetchActivities(): void {
  
    const [fromDateString, toDateString] = this.selectedDateRange.split(' to ');
    this.fromDate = this.parseDateString(fromDateString);
    this.toDate = this.parseDateString(toDateString);

    if (this.fromDate && this.toDate) {
        this.apiService.getActivities(this.fromDate, this.toDate)
            .subscribe((data: any) => {
                this.activities = data;
                console.log(data);
            });
    }
}

 

  validateAndGetDetails() {
    this.page=1;
    this.page1=1;
    if (!this.selectedActivity) {
      Swal.fire('All fields are required','', 'warning');
      return;
    }
  
    const formattedFromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    const formattedToDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
  
   this.assessments = [];
   this.assessmentsExist = [];
   this.assessmentDate = null;
   this.totalMarks = null;
   this.marks = null;
  this.hour = null;
  this.remarks =null;

    this.apiService.checkAssessments(this.selectedActivity, this.fromDate.toISOString(), this.toDate.toISOString())
      .subscribe((result: boolean) => {
        if (result) {
          this.showAssessmentTable = !this.showAssessmentTable;     
          this.apiService.getAssessmentDetails(this.selectedActivity, formattedFromDate, formattedToDate)
            .subscribe((data: any[]) => {
              console.log(data);
              this.assessmentsExist = data;
              data.forEach(obj => {
               this.assessmentDate = new Date(obj[11]);
               this.totalMarks = obj[8];
               this.marks = obj[9];
               this.hour = obj[10];
               this.remarks = obj[12]
              
              });
              this.detailsRetrieved = true;
              this.assessmentDtos = this.mapAssessmentDtos(data);
              this.status='u';
  
              if (!this.assessmentsExist || this.assessmentsExist.length === 0) {
                Swal.fire('No Records Found', 'No assessment records found for the selected criteria', 'info');
              }
            });
        } else {
          this.showActivityTable = !this.showActivityTable;
          
          this.apiService.getActivityDetails(this.selectedActivity, formattedFromDate, formattedToDate)
            .subscribe((data: any[]) => {
              console.log(data);
              
              this.assessments = data;

              this.detailsRetrieved = true;
              this.assessmentDtos = this.mapAssessmentDtos(data);
              this.status='s';
  
              if (!this.assessments || this.assessments.length === 0) {
                Swal.fire('No Records Found', 'No assessment records found for the selected criteria', 'info');
              }
            });
        }
      });
  }
  
  

  mapAssessmentDtos(data: any[]): AssessmentDto[] {
    
    if(this.status==='u'){
      console.log(data);
    return data.map(item => ({
      intActivityId: this.selectedActivity[0],
      resourceId: item[1],
      assessmentDate: this.assessmentDate,
      marks: parseInt(item[9]),
      totalMarks: parseInt(item[8]),
      hour: item[10],
      remarks: item[12],
      activityFromDate:new Date(this.fromDate),
      activityToDate:new Date(this.toDate),
      asesmentId:item[0]
    }));
  }
  else{
    return data.map(item => ({
      intActivityId: this.selectedActivity[0],
      resourceId: item[1],
      assessmentDate: this.assessmentDate,
      marks: item.marks,
      totalMarks: this.totalMarks,
      hour: this.hour,
      remarks: item.remarks,
      activityFromDate:new Date(this.fromDate),
      activityToDate:new Date(this.toDate),
      asesmentId:0
    }));
  }
  }

  

  submitAssessments(): void {

    let errorFlag = false;
    const [fromDateString, toDateString] = this.selectedDateRange.split(' to ');
    const fromDate:Date = new Date(fromDateString);
    const toDate:Date= new Date(toDateString);
     const currentDate: Date = new Date();

    if (!this.selectedActivity || !this.fromDate || !this.toDate) {
        errorFlag = true;
        Swal.fire('Please select activity');
        return;
    }

    if (!this.assessmentDate) {
       errorFlag = true;
        Swal.fire('Please select assessment date');
        return;
    }
    
   if(this.assessmentDate < toDate){
       errorFlag = true;
       Swal.fire("Assessment date should be on or after of the assessment session's 'to date' ");
       this.assessmentDate=null;
       return ;
    }

    if(this.assessmentDate > currentDate){
      errorFlag = true;
      Swal.fire("Assessment date should not be future date ");
      this.assessmentDate=null;
      return ;
    }

    if (!this.totalMarks) {
        errorFlag = true;
        Swal.fire('Total marks cannot be blank');
        return;
    }

    if (!this.hour) {
      errorFlag = true;
      Swal.fire('Assessment hour cannot be blank');
      return;
  }


   if (!errorFlag) {
      Swal.fire({
        title: this.status==='s'?'Do you want to submit?':'Do you want to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: false
      }).then((result) => {
        if (result.isConfirmed) {
          if(this.status==='u'){
            const assessmentDtos: AssessmentDto[] = this.mapAssessmentDtos(this.assessmentsExist);
            this.apiService.updateAssessment(assessmentDtos).subscribe(
              (response: any) => {
                if (response && response.message) {
                  console.log('Assessments updated successfully:', response.message);
                  Swal.fire(response.message,'', 'success');
                } else {
                  console.error('Unexpected response:', response);
                  Swal.fire('Failed to update assessments','', 'error');
                }
              },
              error => {
                console.error('Error updating assessments:', error);
                Swal.fire( 'Failed to update assessments. Please try again later.','', 'error');
                
              });
          }
          else{
            
            const assessmentDtos: AssessmentDto[] = this.mapAssessmentDtos(this.assessments);
            console.log(assessmentDtos);
            
            this.apiService.submitAssessments(assessmentDtos).subscribe(
              (response: any) => {
                if (response && response.message) {
                  console.log('Assessments submitted successfully:', response.message);
                  Swal.fire( response.message,'', 'success');
                  this.status='u';
                  this.showActivityTable = !this.showActivityTable;
                //  this.showAssessmentTable=!this.showAssessmentTable;
               //  this.validateAndGetDetails();
               // location.reload();
               this.route.navigate(['viewasessment']);
               this._userService.changeTitle("View Assessment");
               localStorage.setItem("activeLink","View Assessment");
                } else {
                  console.error('Unexpected response:', response);
                  Swal.fire('Failed to submit assessments','', 'error');
                }
              },
              error => {
                console.error('Error submitting assessments:', error);
                Swal.fire('Failed to submit assessments','', 'error');
            });
          }
         
        }
       });
    }
}

  calculateRowspan(assessment: any): number {
    let count = 1;
    for (let i = this.assessments.indexOf(assessment) + 1; i < this.assessments.length; i++) {
        if (assessment.resourceCode === this.assessments[i].resourceCode && assessment.resourceName === this.assessments[i].resourceName && assessment.selectedPlatformName === this.assessments[i].selectedPlatformName) {
            count++;
        } else {
            break;
        }
    }
    return count;
}


updateTotalMarks(assessment: any): void {


  const sameActivityAssessments = this.assessments.filter(a =>
    a.activityDetails.activity.activityName === assessment.activityDetails.activity.activityName
  );


  sameActivityAssessments.forEach(a => {
    a.activityDetails.totalMarks = assessment.activityDetails.totalMarks;
  });
}


getTotalPages(): number {
  return Math.ceil(this.assessments.length / this.itemsPerPage);
}

// Get assessments for the current page
getCurrentPageAssessments(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.assessments.slice(startIndex, endIndex);
}

// Go to previous page
goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

// Go to next page
goToNextPage(): void {
  if (this.currentPage < this.getTotalPages()) {
    this.currentPage++;
  }
}

// Go to specific page
goToPage(pageNumber: number): void {
  if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
    this.currentPage = pageNumber;
  }
}

getPageNumbers(): number[] {
  return Array.from({ length: this.getTotalPages() }, (_, index) => index + 1);
}
  


 validTotalMark(): void {
     if(this.totalMarks>100 || this.totalMarks<0){
        Swal.fire({
          title: 'Total marks should not be greater than 100 ',
         });
         this.totalMarks=null;
        
      }
}


validHours() : void {
  if(this.status==='s'){
    if(!(this.hour > 0 && this.hour < 5)){
      Swal.fire({
        title: 'Assessment hour should be within 1 to 4 hours',
    });
    this.hour='';
    }
  }
   
}


resetFields() {
  this.fromDate = null;
  this.toDate = null;
  this.selectedActivity = null;
  this.totalMarks=null;
  this.marks=null;
  this.remarks=null;
  this.hour=null;
  this.assessmentDate=null;
}


confirmReset() {
  Swal.fire({
    title: 'Do you want to reset',
    text: 'It will reset all fields. Are you sure you want to proceed?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: false
  }).then((result) => {
    if (result.isConfirmed) {
     // window.location.reload();
     this.resetFields();
      Swal.fire(
        'All fields have been reset.',
        '',
        'success'
      );
    }
  });
}

validateSecuredMarks(assessment: any): void {
 
  if(this.status==='s'){
    if (assessment.marks > this.totalMarks) {
      Swal.fire({
        title: 'Secured marks should not be greater than total marks',
      });
      assessment.marks='';
    }
  }
  else{
    if (assessment[9] > assessment[8]) {
      Swal.fire({
        title: 'Secured marks should not be greater than total marks.',
      });
      assessment[9] = '';
    }
  }
}

parseDateString(dateString: string): Date | null {
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = this.getMonthIndex(parts[1]);
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return null;
}

getMonthIndex(month: string): number {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.indexOf(month);
}


 // for pagination
 indexNumber : number = 0;
 page : number = 1;
 tableSize : number = 10;
 count : number = 0;

getTableDataChange(event : any , details : any[]){
 this.page = event;
 this.indexNumber = (this.page - 1) * this.tableSize;
 this.assessments=details;
 
}

indexNumber1 : number = 0;
 page1 : number = 1;
 tableSize1 : number = 10;
 count1 : number = 0;
getTableDataChange1(event : any , details : any[]){
  this.page1 = event;
  this.indexNumber1 = (this.page1 - 1) * this.tableSize1;
 
  this.assessmentsExist=details;
  
 }


 openDatepicker(): void {
  this.datepicker.show(); 
} 

cancel(){
  window.location.reload();
}
   

}
