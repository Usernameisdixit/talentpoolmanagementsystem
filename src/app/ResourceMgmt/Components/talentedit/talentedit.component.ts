import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Talent } from 'src/app/Model/talent';
import { ContactService } from '../../Services/contact.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-talentedit',
  templateUrl: './talentedit.component.html',
  styleUrls: ['./talentedit.component.css']
})
export class TalenteditComponent {

  talent:Talent= new Talent();
  id:number=0;
  talentedit:FormGroup;
  constructor(private service:ContactService, private router:Router, private activeRouter:ActivatedRoute){}
  
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
  console.log();
}


cancelData(){


  this.router.navigate(['talents']);
}




}
