import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportServiceService {

  private activityReportData = 'http://localhost:9999/tpms';

  constructor(private httpClient: HttpClient) { }

  getActivityReportData(year: string, month: string, platform: string, selectedDate: string): Observable<any> {
    const url = `${this.activityReportData}/activityReportData`;
    const params = {
      year: year,
      month: month,
      platform: platform,
      selectedDate: selectedDate
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(url, params, { headers });
  }

  generateActivityReport(activityData: any[],year: string, monthName: string, platformName: string, selectedDate: string): void {
    const pdf = new jsPDF();

    // Static header content
    pdf.text('Activity Details Report', 10, 10);

    const fontSize = 10; 
     pdf.setFontSize(fontSize);
     const fy = `Year: ${year}`;  ;
     const month = `Month: ${monthName}`;
     const platform = `Platform: ${platformName==='0'?'':platformName}`;
     const reportDate = `Date: ${selectedDate===undefined?'':selectedDate}`;
     
     // Add additional information
     pdf.text(fy, 10, 20);
     pdf.text(month, 100, 20); 
     pdf.text(platform , 10, 26);
     pdf.text(reportDate, 100, 26);

    // Table content
    const data = [];
    const processedDates = new Set<string>();
    // Sort attendanceDetails by activityDate
    activityData.sort((a, b) => {
      const dateA = new Date(a.activityDate).getTime();
      const dateB = new Date(b.activityDate).getTime();
      return dateA - dateB;
    });


    activityData.forEach(detail => {
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
      startY: 30,              
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5        
      },
      headStyles: {
        fillColor: [200, 200, 200], 
        textColor: [0, 0, 0],     
        lineColor: [0, 0, 0],     
        lineWidth: 0.5            
      },
    });

    pdf.save('activity_report.pdf');
  }

  private getFirstHalfData(detail: any): string {
    let firstHalfData = '';
    detail.firstHalf.forEach((firstHalfObj, index, array) => {
      firstHalfData += `${firstHalfObj.activityName} ${firstHalfObj.fromHours} to ${firstHalfObj.toHours}`;
      if (index < array.length - 1) {
        firstHalfData += '\n';
      }
    });
    return firstHalfData;
  }

  private getSecondHalfData(detail: any): string {
    let secondHalfData = '';
    detail.secondHalf.forEach((secondHalfObj, index, array) => {
      secondHalfData += `${secondHalfObj.activityName} ${secondHalfObj.fromHours} to ${secondHalfObj.toHours}`;
      if (index < array.length - 1) {
        secondHalfData += '\n';
      }
    });
    return secondHalfData;
  }

  generateActivityReportExcel(attendanceDetails: any[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { skipHeader: true });

    XLSX.utils.sheet_add_aoa(ws, [['Resource Name', 'Platform', 'First Half', 'Second Half']], { origin: 'A2' });

    // Merge cells and add static header content
    ws['A1'] = { v: 'Activity Report', t: 's', s: { font: { bold: true, size: 14 }, alignment: { horizontal: 'center', vertical: 'center' } } };
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]; // Merge cells

    // Add styles to the merged cell (Attendance Report)
    ws['A1'].s = { font: { bold: true, size: 100, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '000080' } }, alignment: { horizontal: 'center', vertical: 'center' } };
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
        data.push([{
          t: 's', 
          v: activityDate,
          s: {
            fill: { fgColor: { rgb: dateRowColor } },
            alignment: { horizontal: 'left' }
          }
        }]);
        processedDates.add(activityDate);
      }

      const firstHalfData = this.getFirstHalfData(detail);
      const secondHalfData = this.getSecondHalfData(detail);
      const dataRowColor = 'white';
      data.push([
        { t: 's', v: detail.resourceName, s: { fill: { fgColor: { rgb: dataRowColor } } } },
        { t: 's', v: detail.domain, s: { fill: { fgColor: { rgb: dataRowColor } } } },
        { t: 's', v: firstHalfData, s: { fill: { fgColor: { rgb: dataRowColor } } } },
        { t: 's', v: secondHalfData, s: { fill: { fgColor: { rgb: dataRowColor } } } }
      ]);
    });

    
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A3' });
    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'activity_report.xlsx');

  }
}
