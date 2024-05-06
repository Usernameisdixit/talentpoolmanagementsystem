import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Talent } from 'src/app/Model/talent';
import { ContactService } from '../../Services/contact.service';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/UserMgmt/Service/user.service';

@Component({
  selector: 'app-talentedit',
  templateUrl: './talentedit.component.html',
  styleUrls: ['./talentedit.component.css']
})
export class TalenteditComponent {

  talent:Talent= new Talent();
  id:number=0;
  talentedit:FormGroup;
  constructor(private service:ContactService, private router:Router, private activeRouter:ActivatedRoute,
    private _userService:UserService){}
  
  ngOnInit():void{
    this.getContact();
  }

getContact(){

  this.id=this.activeRouter.snapshot.params['id'];
  console.log("UPDATED ID:"+this.id);
  this.service.findContactByResourceNumber(this.id).subscribe(
    data=>{
      console.log("Getting A Contact......");
      console.log(data);
      this.talent=data;
    }
  )
}

updateContact(){
 // alert("hello"+this.talent.email);
  console.log(this.talent);
  this.service.createTalent(this.talent).subscribe(
    data=>{
      console.log("Updating a Contact.....");
      console.log(this.talent);
      Swal.fire({
        icon: 'success',
        title: 'Resource Data Update successful',
        text:  'Resource Data has been updated successfully!',
      });
      this.router.navigate(['talents']);
      this._userService.changeTitle("View Resources");
      localStorage.setItem("activeLink","View Resources");
      console.log(data);
    },
    error=>{

    });
    this.getContact();
    
}


cancelData(){


  this.router.navigate(['talents']);
  this._userService.changeTitle("View Resources");
  localStorage.setItem("activeLink","View Resources");
}




}
