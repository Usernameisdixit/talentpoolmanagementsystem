import { Component} from '@angular/core';
import { UserService } from '../../Service/user.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  constructor (private _userService:UserService){

  }

  getListItem(event:MouseEvent){
    const target = event.target as HTMLElement;
    const listItemValue = target.textContent?.trim();
    this._userService.changeTitle(listItemValue);
    localStorage.setItem("activeLink",listItemValue);
    
  }


}
