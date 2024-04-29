import { DatePipe } from '@angular/common';
import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { BsDatepickerConfig,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AssessmentserviceService } from 'src/app/AssessmentMgmt/Service/assessmentservice.service';
import { ContactService } from 'src/app/ResourceMgmt/Services/contact.service';
import { LoginService } from '../../Service/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  implements OnInit{

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  @ViewChild('dp1') datepicker1: BsDatepickerDirective;
  resources:any;
  allocationDate: any;
  // allocationDate: any;
  attendanceData: any;
  assessmentDateArr: any[];
  assessmentDate: string;
  assessmentDateRanges: any[];
  showAssessmentTable: boolean=false;
  selectedDate: string;
  selectDate: string;
  selectedValue: string = '';
  maxDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;
  fromDate:any;
  toDate:any;
  ActivityData: any;
  ActivtiesPlanned : any;
  atnDate: string;
  alDate: any;

  constructor(private  contactService:ContactService,private datePipe:DatePipe,
    private apiService: AssessmentserviceService,private loginService:LoginService,
    private router:Router){

      this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
      
    }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    debugger;
    this.maxDate=new Date();
    this.loginService.getAllocationDates().subscribe((response: any[]) => {
      debugger;
      //response=[];
      if(response.length==0){
        this.resources=null;
      }
      this.allocationDate = response.map(date => this.datePipe.transform(date, 'dd-MMM-yyyy'));
      this.alDate=this.allocationDate[this.allocationDate.length-1];
      //this.alDate.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      this.sendDateFromResource(this.alDate);
    });
    debugger;
    this.atnDate=this.datePipe.transform(new Date(), 'dd-MMM-yyyy');

    this.selectedDate=this.datePipe.transform(this.atnDate, 'dd-MMM-yyyy');
    this.loginService.getAttendance(this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')).subscribe((response:any)=>{
      debugger;
      //response=[];
      if(response.length==0){
        this.attendanceData=null;
      }else{
      this.attendanceData=response;
      }
      console.log(this.attendanceData);
      
    });

    this.fetchAssessmentDates();
    //throw new Error('Method not implemented.');
    this.contactService.getResources().subscribe((response:any)=>{
      this.resources=response.resources;
      const inputDate = new Date(response.allocationDate);
      this.allocationDate = this.datePipe.transform(inputDate, 'd MMMM yyyy');
    })

   
    //var curr =new Date;
    //alert(this.fromDate);
    //alert(curr);
    
    var curr = new Date;
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
 
    this.fromDate=this.datePipe.transform(firstday, 'dd-MMM-yyyy');
    this.toDate=this.datePipe.transform(lastday, 'dd-MMM-yyyy');

    this.loginService.gettotalActivitiesPlanned(this.datePipe.transform(firstday, 'yyyy-MM-dd'),this.datePipe.transform(lastday, 'yyyy-MM-dd')).subscribe((response: any) => {
    //response=0;
      if(response==0)
      {
        this.ActivtiesPlanned=null;
      }else{
       this.ActivtiesPlanned = response;
      }
      // console.log(this.ActivityData); 
      // alert(this.ActivtiesPlanned);
     });
    
  }

  closeModal() {
    const modal = document.getElementById('detailsModal1');
    if (modal) {
      modal.classList.remove('show');
      //document.body.classList.remove('modal-open');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    }
  }
  

  fetchAssessmentDates() {
    this.apiService.getAssessmentDates().subscribe(
      (dates: string[]) => {
        debugger;        
        //dates=[];
        if(dates.length===0)
        {
          this.assessmentDateArr=null;
        }
        else{
        this.assessmentDateArr = dates.map(date => this.transformDate(date));
        // Sort the dates in descending order (latest to oldest)
        this.assessmentDateArr.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
   }
       // Set the assessmentDate to the latest date by default
      if (this.assessmentDateArr.length > 0) {
        this.assessmentDate = this.assessmentDateArr[0];
      }

      console.log(this.assessmentDateArr);

        console.log(this.assessmentDateArr);
      },
      error => {
        console.error('Error fetching assessment dates:', error);
      }
    );
  }

  transformDate(date: string): string {
   
    return this.datePipe.transform(new Date(date), 'dd-MMM-yyyy') || '';
  }



//Dashboard->For Resource
  sendDateFromResource(alDate:string) {
    debugger;
    // Transform the parsed date into 'yyyy-MM-dd' format using datePipe
    const formattedDate = this.datePipe.transform(this.alDate, 'yyyy-MM-dd');
    this.loginService.setSelectedDate(formattedDate);
      this.loginService.getResources(formattedDate).subscribe((response: any) => {
      debugger;
      this.resources = response;
      console.log(this.resources); 
    });
  }
//Dashboard ->For Attendance
  sendActivityNameandDate(activityName: any,selectedDate:string) {
    //throw new Error('Method not implemented.');
      debugger;
      selectedDate=this.datePipe.transform(selectedDate,'yyyy-MM-dd')
    this.loginService.setSelectedActivityName(activityName,selectedDate);
    this.router.navigate(['takeAtten']);
    
    }
    // attendance data for dashboard modal
    getDateFromAttendanceDashboard(atnDate:string){
      debugger;
      this.loginService.getAttendance(this.datePipe.transform(atnDate, 'yyyy-MM-dd')).subscribe((response:any)=>{
        debugger;
        this.attendanceData=response;
        console.log(this.attendanceData);
        
      });
    }

  
    redirectToViewAssessment(date:string) {
      
      // Redirect to the view assessment page with the selected assessment date
      //this.router.navigate(['/viewasessment'], { queryParams: { date: date } });
      let navigationExtras: NavigationExtras = {
        
      state: {
          date: date,
          fromDashboard: true 
       }
      
      };
      
      this.router.navigate(['/viewasessment'], navigationExtras);
    }                         
  
    onviewActivity(): void{


      let fromdateMsg = '';
      let todateMsg = '';
    
      const fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');

    if (!fromDate) {
      fromdateMsg = 'Please select an Activity From date.\n';
    }

    if (!fromDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: fromdateMsg
      });
      return;
    }

    if (!toDate) {
      todateMsg = 'Please select an Activity To date.\n';
    }

    if (!toDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: todateMsg
      });
      return;
    }


    const formData = new FormData();
    formData.append('toDate', this.toDate);
    formData.append('fromDate', this.fromDate);
   

    this.loginService.activityFromto(fromDate,toDate).subscribe((response: any) => {
     // debugger;
      this.ActivityData = response;
     // console.log(this.ActivityData); 
     // alert(this.ActivityData);
    });
    }

    sendActivityPlanneddata() {

      const fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');

      //alert(toDate);

      this.loginService.gettotalActivitiesPlanned(fromDate,toDate).subscribe((response: any) => {
        // debugger;
         this.ActivtiesPlanned = response;
        // console.log(this.ActivityData); 
        // alert(this.ActivtiesPlanned);
       });

    }

    openDatepicker(): void {
      this.datepicker.show();
  
    }

    openDatepicker1():void{

      this.datepicker1.show();
    }

    
  }
