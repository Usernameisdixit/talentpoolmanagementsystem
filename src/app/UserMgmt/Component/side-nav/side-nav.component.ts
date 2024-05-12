import { Component} from '@angular/core';
import { UserService } from '../../Service/user.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  getActivity:boolean=false;
  constructor (private _userService:UserService){

  }
ngOnInit(){
}
  getListItem(event:MouseEvent){
    const target = event.target as HTMLElement;
    const listItemValue = target.textContent?.trim();
    this._userService.changeTitle(listItemValue);
    localStorage.setItem("activeLink",listItemValue);
    // window.location.reload();
  }
  getReload(){
    if( localStorage.getItem('activeLink') === 'Attendance'){
      localStorage.setItem("activeLink","change");
    }
    window.location.reload();
  }


}
