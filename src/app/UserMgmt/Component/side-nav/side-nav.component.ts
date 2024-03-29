import { Component ,ViewChild, ElementRef, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  @ViewChild('sidebarMenu') sidebarMenu!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    
    const menuElement = this.sidebarMenu.nativeElement;

    const listItems = menuElement.querySelectorAll('li');

    listItems.forEach((item: HTMLElement) => {
     // const listItemValue = item.textContent.trim();
      console.log(item);
    });
  }


}
