import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-report-type-dialog',
  templateUrl: './report-type-dialog.component.html',
  styleUrls: ['./report-type-dialog.component.css']
})
export class ReportTypeDialogComponent {
selectedType : any ;
  constructor(private dialogRef: MatDialogRef<ReportTypeDialogComponent>) {}

  choose(type: string): void {
    this.dialogRef.close(type);
  }
}
