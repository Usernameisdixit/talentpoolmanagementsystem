import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  headerName:String;
  ngOnInit(){
   this.headerName= localStorage.getItem('activeLink');
   console.log(this.headerName);
  }

}
