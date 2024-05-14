import { DatePipe } from '@angular/common';
import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { BsDatepickerConfig,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AssessmentserviceService } from 'src/app/AssessmentMgmt/Service/assessmentservice.service';
import { ContactService } from 'src/app/ResourceMgmt/Services/contact.service';
import { LoginService } from '../../Service/login.service';
import { UserService } from '../../Service/user.service';

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
    private router:Router,
    private _userService:UserService){

      this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY',showWeekNumbers : false });
      
    }
  ngOnInit(): void {
    
    this.maxDate=new Date();
    this.loginService.getAllocationDates().subscribe((response: any[]) => {
        if(response.length==0){
        this.resources=null;
      }
      this.allocationDate = response.map(date => this.datePipe.transform(date, 'dd-MMM-yyyy'));
      this.alDate=this.allocationDate[this.allocationDate.length-1];
      this.sendDateFromResource(this.alDate);
    });
    
    this.atnDate=this.datePipe.transform(new Date(), 'dd-MMM-yyyy');

    this.selectedDate=this.datePipe.transform(this.atnDate, 'dd-MMM-yyyy');
    this.loginService.getAttendance(this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')).subscribe((response:any)=>{
      
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

    var curr = new Date;
    
    var firstday = new Date(curr.setDate(curr.getDate() - (curr.getDay()-1)));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+5));

    this.fromDate=this.datePipe.transform(firstday, 'dd-MMM-yyyy');
    this.toDate=this.datePipe.transform(lastday, 'dd-MMM-yyyy');

    this.loginService.gettotalActivitiesPlanned(this.datePipe.transform(firstday, 'yyyy-MM-dd'),this.datePipe.transform(lastday, 'yyyy-MM-dd')).subscribe((response: any) => {  
      if(response==0)
      {
        this.ActivtiesPlanned=null;
      }else{
       this.ActivtiesPlanned = response;
      }

     });
    
  }

  closeModal() {
    const modal = document.getElementById('detailsModal1');
    if (modal) {
      modal.classList.remove('show');
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
    
    // Transform the parsed date into 'yyyy-MM-dd' format using datePipe
    const formattedDate = this.datePipe.transform(this.alDate, 'yyyy-MM-dd');
    this.loginService.setSelectedDate(formattedDate);
      this.loginService.getResources(formattedDate).subscribe((response: any) => {
      
      this.resources = response;
      console.log(this.resources); 
    });
  }
//Dashboard ->For Attendance
  sendActivityNameandDate(activityName: any,selectedDate:string) {
    //throw new Error('Method not implemented.');
      
      selectedDate=this.datePipe.transform(selectedDate,'yyyy-MM-dd')
    this.loginService.setSelectedActivityName(activityName,selectedDate);
    this.router.navigate(['takeAtten']);
    this._userService.changeTitle("Attendance Management");
    localStorage.setItem("activeLink","Attendance");
    
    }
    // attendance data for dashboard modal
    getDateFromAttendanceDashboard(atnDate:string){
      
      this.loginService.getAttendance(this.datePipe.transform(atnDate, 'yyyy-MM-dd')).subscribe((response:any)=>{
        
        this.attendanceData=response;
        
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
      this._userService.changeTitle("View Assessment");
      localStorage.setItem("activeLink","View Assessment");
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
      this.ActivityData = response;
    
    });
    }

    sendActivityPlanneddata() {

      const fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');

      this.loginService.gettotalActivitiesPlanned(fromDate,toDate).subscribe((response: any) => {
       
      this.ActivtiesPlanned = response;
      
       });

    }

    openDatepicker(): void {
      this.datepicker.show();
  
    }

    openDatepicker1():void{

      this.datepicker1.show();
    }

    onViewResource(){

      this.router.navigate(['resourceHistory']);
      this._userService.changeTitle("View Resource Log");
      localStorage.setItem("activeLink","View Resource Log");
    }

    
  }
