import { Component,Input } from '@angular/core';
import { UserService } from '../../Service/user.service';
import{Location} from '@angular/common'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title:string='';
  constructor (private _userService:UserService,private location:Location){
       
  }
ngOnInit(){

   this._userService.title$.subscribe(title=>{
       this.title = title;
    });
    this.title=localStorage.getItem('activeLink');
   
     let url: string = this.location.path();
     if(this.title===''){
      let currentPath:string=url.substring(url.lastIndexOf("/")+1);
      this._userService.changeTitle(currentPath);
      
     }

  }

}
