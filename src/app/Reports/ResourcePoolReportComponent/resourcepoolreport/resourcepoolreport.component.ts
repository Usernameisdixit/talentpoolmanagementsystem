import { Component } from '@angular/core';

@Component({
  selector: 'app-resourcepoolreport',
  templateUrl: './resourcepoolreport.component.html',
  styleUrls: ['./resourcepoolreport.component.css']
})
export class ResourcepoolreportComponent {

  isOpen = false;
  toggle() {
    this.isOpen = !this.isOpen;
  }

}
