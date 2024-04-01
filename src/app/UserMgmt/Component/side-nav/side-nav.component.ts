import { Component ,ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  @ViewChild('sidebarMenu') sidebarMenu!: ElementRef;

  constructor() { }
  
  getListItem(event:MouseEvent){
    alert("hii i am clicked");
    const target = event.target as HTMLElement;
    const listItemValue = target.textContent?.trim();
    console.log(listItemValue);
    localStorage.setItem("activeLink",listItemValue);

  }


}
