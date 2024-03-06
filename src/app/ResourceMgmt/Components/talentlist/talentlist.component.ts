import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../Services/contact.service';
import { Talent } from 'src/app/Model/talent';
import { Router } from '@angular/router';
import { RouterModule, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-talentlist',
  templateUrl: './talentlist.component.html',
  styleUrls: ['./talentlist.component.css']
})
export class TalentlistComponent implements OnInit {

  talent:Talent[]=[];
  delmsg:string="";
 constructor(private service:ContactService, private router:Router){}


  ngOnInit(): void {
    this.getTalent();
  }
 

  getTalent(){
    debugger;
      this.service.getTalent().subscribe(response => {
        this.talent =response;
        console.log(this.talent);
        
      })
    }

    editalent(id:number){
    this.router.navigate(["/edit",id]);
   }
    
  deletetalent(event:any,id:number){

    if(window.confirm('Are You Sure You Want to Delete the Resource From Resource Pool'))
{
    event.target.innerText="Deleting....";
  this.service.deleteByResourceNumber(id).subscribe(response => {
      this.delmsg=response;
      this.getTalent();
      alert(this.delmsg);
  });
} 
  }


}
