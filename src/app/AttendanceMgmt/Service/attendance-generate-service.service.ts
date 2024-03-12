import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
    // Sort attendanceDetails by activityDate
    attendanceDetails.sort((a, b) => {
      const dateA = new Date(a.activityDate).getTime();
      const dateB = new Date(b.activityDate).getTime();
      return dateA - dateB;
    });


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
      head: [['Resource Name', 'Platform', 'First Half', 'Second Half']],
      body: data,
      startY: 20,              // Adjust starting y-position
      styles: {
        lineColor: [0, 0, 0], // Border color for all cells
        lineWidth: 0.5        // Border width for all cells
      },
      headStyles: {
        fillColor: [203, 61, 40], // Header background color
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

  generateAttendanceReportExcel(attendanceDetails: any[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { skipHeader: true });
    XLSX.utils.sheet_add_aoa(ws, [['Resource Name', 'Platform', 'First Half', 'Second Half']], { origin: 'A2' });

    // Merge cells and add static header content
    ws['A1'] = {
      v: 'Attendance Report',
      t: 's',
      s: {
        font: { bold: true }
      }
    };
    //ws['A1'].s = { font: { bold: true } };
    
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]; // Merge cells

    const data: any[] = [];
    const processedDates = new Set<string>();

    attendanceDetails.sort((a, b) => {
      const dateA = new Date(a.activityDate).getTime();
      const dateB = new Date(b.activityDate).getTime();
      return dateA - dateB;
    });

    attendanceDetails.forEach(detail => {
      const activityDate = detail.activityDate;

      // Check if the date has been processed
      if (!processedDates.has(activityDate)) {
        const dateRowColor = processedDates.has(activityDate) ? 'white' : 'lightblue';
        data.push([activityDate]);
        processedDates.add(activityDate);
      }

      const firstHalfData = this.getFirstHalfData(detail);
      const secondHalfData = this.getSecondHalfData(detail);
      const dataRowColor = 'white';
      data.push([
        { t: 's', v: detail.resourceName },
        { t: 's', v: detail.domain },
        { t: 's', v: firstHalfData },
        { t: 's', v: secondHalfData }
      ]);
    });

    // Add data to worksheet
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A3' });

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'attendance_report.xlsx');
  }
}
