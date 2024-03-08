import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable } from 'rxjs'; // Import Observable from rxjs
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceGenerateServiceService {

  private platformUrl = 'http://localhost:9999/tpms/getplatform';

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.getPlatforms();
    
  }
  generateAttendanceReport(attendanceDetails: any[]): void {
    const pdf = new jsPDF();
  
    // Static header content
    pdf.text('Attendance Report', 10, 10);
  
    // Table content
    const data = [];
    const processedDates = new Set<string>();
  
    attendanceDetails.forEach(detail => {
      const activityDate = detail.activityDate;
  
      // Check if the date has been processed
      if (!processedDates.has(activityDate)) {
        const dateRowColor = processedDates.has(activityDate) ? [255, 255, 255] : [200, 200, 255];
        data.push([{ content: activityDate, colSpan: 5, styles: { fillColor: dateRowColor, halign: 'left' } }]);
        processedDates.add(activityDate);
      }
  
      
      const firstHalfData = this.getFirstHalfData(detail);
      const secondHalfData = this.getSecondHalfData(detail);
      const dataRowColor = [255, 255, 255];
      data.push([
        //detail.activityDate,
      { content: detail.resourceName, styles: { fillColor: dataRowColor } },
      { content: detail.domain, styles: { fillColor: dataRowColor } },
      { content: firstHalfData, styles: { fillColor: dataRowColor } },
      { content: secondHalfData, styles: { fillColor: dataRowColor } }
      ]);
    });
  
    // Create auto table
    autoTable(pdf, {
      head: [[ 'Resource Name', 'Platform', 'First Half', 'Second Half']],
      body: data,
      startY: 20,              // Adjust starting y-position
      styles: {
        lineColor: [0, 0, 0], // Border color for all cells
        lineWidth: 0.5        // Border width for all cells
      },
      headStyles: {
        fillColor: [200, 200, 200], // Header background color
        textColor: [0, 0, 0],      // Header text color
        lineColor: [0, 0, 0],     // Border color for header cells
        lineWidth: 0.5            // Border width for header cells
      },
    });
  
    pdf.save('attendance_report.pdf');
  }
  

  private getFirstHalfData(detail: any): string {
    let firstHalfData = '';
    detail.firstHalf.forEach((firstHalfObj, index, array) => {
      firstHalfData += `${firstHalfObj.attendanceStatus} : ${firstHalfObj.activityName} ${firstHalfObj.fromHours} to ${firstHalfObj.toHours}`;
      if (index < array.length - 1) {
        firstHalfData += '\n';
      }
    });
    return firstHalfData;
  }

  private getSecondHalfData(detail: any): string {
    let secondHalfData = '';
    detail.secondHalf.forEach((secondHalfObj, index, array) => {
      secondHalfData += `${secondHalfObj.attendanceStatus} : ${secondHalfObj.activityName} ${secondHalfObj.fromHours} to ${secondHalfObj.toHours}`;
      if (index < array.length - 1) {
        secondHalfData += '\n';
      }
    });
    return secondHalfData;
  }

  getPlatforms(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.platformUrl);
  }
}
