import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationExtras } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AssessmentserviceService } from 'src/app/AssessmentMgmt/Service/assessmentservice.service';
import { ContactService } from 'src/app/ResourceMgmt/Services/contact.service';
import { LoginService } from '../../Service/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  implements OnInit{

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

  constructor(private  contactService:ContactService,private datePipe:DatePipe,
    private apiService: AssessmentserviceService,private loginService:LoginService,
    private router:Router){
      
    }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.loginService.getAllocationDates().subscribe((response: any[]) => {
      console.log("API Response:", response);
      this.allocationDate = response.map(date => this.datePipe.transform(date, 'dd-MM-yyyy'));
    });

    this.selectedDate=this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.loginService.getAttendance(this.datePipe.transform(this.selectedDate, 'yyyy-dd-MM')).subscribe((response:any)=>{
      debugger;
      this.attendanceData=response;
      console.log(this.attendanceData);
      
    });

    this.fetchAssessmentDates();
    //throw new Error('Method not implemented.');
    this.contactService.getResources().subscribe((response:any)=>{
      this.resources=response.resources;
      const inputDate = new Date(response.allocationDate);
      this.allocationDate = this.datePipe.transform(inputDate, 'd MMMM yyyy');
    })

  }

  fetchAssessmentDates() {
    this.apiService.getAssessmentDates().subscribe(
      (dates: string[]) => {
   
        this.assessmentDateArr = dates.map(date => this.transformDate(date));
        // Sort the dates in descending order (latest to oldest)
        this.assessmentDateArr.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

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


  sendDate() {
    debugger;
    
    // Parse the date string into a Date object
    const parts = this.selectDate.split('-'); // Assuming the date string format is 'dd-mm-yyyy'
    const parsedDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])); // Months are 0-based in JavaScript
  
    // Transform the parsed date into 'yyyy-MM-dd' format using datePipe
    const formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');
    this.loginService.setSelectedDate(formattedDate);
      this.loginService.getResources(formattedDate).subscribe((response: any) => {
      debugger;
      this.resources = response;
      console.log(this.resources); 
    });
  }

  sendActivityNameandDate(activityName: any) {
    //throw new Error('Method not implemented.');
      debugger;
    this.loginService.setSelectedActivityName(activityName);
    this.router.navigate(['takeAtten']);
    
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
  
    
  }
