import { Component,Input } from '@angular/core';
import { UserService } from '../../Service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title:string='';
  constructor (private _userService:UserService){
       
  }
ngOnInit(){
 
    this._userService.title$.subscribe(title=>{
      alert(title);
      
      if(title===''){
        this.title="Dashboard";
      }
      else{
        this.title = title;
      }
    });
  }

}
