import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import { DatePipe } from '@angular/common';
// import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportServiceService {

  private baseurl = 'http://localhost:9999/tpms';

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { }

  getActivityReportData(platform: string, resourceValue: string, selectedDate: string): Observable<any> {
    const url = `${this.baseurl}/activityReportData`;
    let datesArray: string[] = selectedDate.split(" to ");
    let fromDate: string = datesArray[0];
    let toDate: string = datesArray[1];   
    const params = {
      fromDate:fromDate,
      toDate:toDate,
      platform: platform,
      resourceValue: resourceValue
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(url, params, { headers });
  }

  getAllDate(month: any, year: any): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseurl}/getDistinctDate?month=${month}&year=${year}`);
  }

  generateActivityReport(activityData: any[], year: string, monthName: string, platformName: string, selectedDate: string, resourceValue: any): void {
    debugger;
    const pdf = new jsPDF();

    // Static header content
    //pdf.text('Activity Details Report', 10, 10, { align: 'center' })
    pdf.text('Activity Details Report', 75, 10);

    const fontSize = 10;
    pdf.setFontSize(fontSize);
    const fy = `Year: ${year}`;;
    const month = `Month: ${monthName}`;
    // if (platformName != '0') {
    //   const platform = `Platform: ${platformName === '0' ? '' : platformName}`;
    //   pdf.text(platform, 10, 26);
    //   pdf.text(platform+"jhgfd", 100, 26);
    // }
    
    const dateRangeString = selectedDate;
    const [startDateStr, endDateStr] = dateRangeString.split(' to ');
   
    const [day1, month1, year1] = startDateStr.split('-').map(Number);
    const startDateObject = new Date(year1, month1 - 1, day1);
    const formattedDate = startDateObject ? this.datePipe.transform(startDateObject, 'dd-MMM-yyyy') : '';
    
    const [day2, month2, year2] = endDateStr.split('-').map(Number);
    const endDateObject = new Date(year2, month2 - 1, day2);
    const formattedDate1 = endDateObject ? this.datePipe.transform(endDateObject, 'dd-MMM-yyyy') : null;
    
    const finalDate=formattedDate +" to " +formattedDate1;
    
    let startYpos=0;
    if(platformName=='0' && resourceValue==0){
      pdf.text("Activity Session: "+finalDate, 10, 26);
      startYpos=30;
    }else if(platformName!='0'){
      pdf.text("Platform: "+platformName, 10, 26);
      pdf.text("Activity Session: "+finalDate, 100, 26);
      startYpos=30;
    }else if(resourceValue!='0'){
      const plaName=activityData[0].domain
      const code =  activityData[0].resourceCode ;
      pdf.text("Resource Name: "+resourceValue, 10, 26);
      pdf.text("resourcecode: "+code, 100, 26);
      pdf.text("Platform: "+plaName, 10, 32);
      pdf.text("Activity Session: "+finalDate, 100, 32);
      startYpos=40;
    }
   

    // Add additional information
    pdf.text(fy, 10, 20);
    pdf.text(month, 100, 20);

    let head;
    if (resourceValue !== '0' ) {
      head = [['First Half', 'Second Half']];
    } else if(platformName!='0') {
      head = [['Resource Code', 'Resource Name', 'First Half', 'Second Half']];
    }else{
      head = [['Resource Code', 'Resource Name', 'Platform', 'First Half', 'Second Half']];
    }
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
      if (resourceValue == "0") {
        if (selectedDate == null && !processedDates.has(activityDate)) {
          const dateRowColor = processedDates.has(activityDate) ? [255, 255, 255] : ['CEEEF5'];
          data.push([{ content: activityDate, colSpan: 5, styles: { fillColor: dateRowColor, halign: 'left' } }]);
          processedDates.add(activityDate);
        }
      }


      const firstHalfData = this.getFirstHalfData(detail);
      const secondHalfData = this.getSecondHalfData(detail);
      const dataRowColor = [255, 255, 255];
      const rowData = [];

      if (resourceValue != '0' ) {
        rowData.push(
          { content: firstHalfData, styles: { fillColor: dataRowColor } },
          { content: secondHalfData, styles: { fillColor: dataRowColor } }
        );
      } else if(platformName!='0') {
        rowData.push(
          { content: detail.resourceCode, styles: { fillColor: dataRowColor } },
          { content: detail.resourceName, styles: { fillColor: dataRowColor } },
          // { content: detail.domain, styles: { fillColor: dataRowColor } },
          { content: firstHalfData, styles: { fillColor: dataRowColor } },
          { content: secondHalfData, styles: { fillColor: dataRowColor } }
        );
      }else{
        rowData.push(
          { content: detail.resourceCode, styles: { fillColor: dataRowColor } },
          { content: detail.resourceName, styles: { fillColor: dataRowColor } },
          { content: detail.domain, styles: { fillColor: dataRowColor } },
          { content: firstHalfData, styles: { fillColor: dataRowColor } },
          { content: secondHalfData, styles: { fillColor: dataRowColor } }
        );
      }
      
      data.push(rowData);
    });

    // Create auto table
    autoTable(pdf, {
      head: head,
      body: data,
      startY: startYpos,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [104, 211, 245],
        textColor: [9, 9, 9],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        fontStyle: 'bold',
      },
      margin: { left: 10 },
    });

    pdf.save('activity_report.pdf');
  }

  private getFirstHalfData(detail: any): string {
    let firstHalfData = '';
    detail.firstHalf.forEach((firstHalfObj, index, array) => {
      firstHalfData += `${firstHalfObj.activityName} (${firstHalfObj.fromHours} to ${firstHalfObj.toHours})`;
      if (index < array.length - 1) {
        firstHalfData += '\n';
      }
    });
    return firstHalfData;
  }

  private getSecondHalfData(detail: any): string {
    let secondHalfData = '';
    detail.secondHalf.forEach((secondHalfObj, index, array) => {
      secondHalfData += `${secondHalfObj.activityName} (${secondHalfObj.fromHours} to ${secondHalfObj.toHours})`;
      if (index < array.length - 1) {
        secondHalfData += '\n';
      }
    });
    return secondHalfData;
  }

  generateActivityReportExcel(activityData: any[], year: string, monthName: string, platformName: string, selectedDate: string, resourceValue: any): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { skipHeader: true });

    // Set column widths
    if (resourceValue !== '0' && selectedDate == null) {
      ws['!cols'] = [
        { wch: 20 },//Date
        { wch: 20 }, // Resource code
        { wch: 20 }, // Resource Name
        { wch: 15 }, // Platform
        { wch: 40 }, // First Half
        { wch: 40 }, // Second Half
      ];
    } else {
      ws['!cols'] = [
        { wch: 20 }, // Resource code
        { wch: 20 }, // Resource Name
        { wch: 15 }, // Platform
        { wch: 40 }, // First Half
        { wch: 40 }, // Second Half
      ];
    }

    // Add headings with wrapText

    let headerRow = [];
    if (resourceValue !== '0' && selectedDate == null) {
      headerRow = ['Date', 'Resource code', 'Resource Name', 'Platform', 'First Half', 'Second Half'];

    } else {
      headerRow = ['Resource code', 'Resource Name', 'Platform', 'First Half', 'Second Half'];
    }
    XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A6' });
    for (let col = 0; col < headerRow.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 5, c: col });
      ws[cellAddress].s = {
        font: { bold: true },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: '52D8F9' },
        },
        alignment: {
          wrapText: true,
        },
      };
    }

    ws['A1'] = {
      v: 'Activity Report',
      t: 's',
      s: {
        font: {
          bold: true,
          size: 14,
          color: { rgb: '1D05EE' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      },
    };

    ws['A3'] = {
      v: `Financial Year: ${year}`,
      t: 's',
    };
    ws['C3'] = {
      v: ` Month: ${monthName}`,
      t: 's',
    };

    if (platformName != '0') {
      ws['A4'] = {
        v: platformName === '0' ? 'Platform: ' : `Platform: ${platformName}`,
        t: 's',
      };
    }
    if (selectedDate != undefined) {
      ws['C4'] = {
        v: selectedDate === undefined ? 'Date: ' : `Date: ${selectedDate}`,
        t: 's',
      };
    }
    if (resourceValue !== '0' && selectedDate == null) {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]; // Merge cells
    } else {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    }
    const data: any[] = [];
    const processedDates = new Set<string>();

    activityData.sort((a, b) => {
      const dateA = new Date(a.activityDate).getTime();
      const dateB = new Date(b.activityDate).getTime();
      return dateA - dateB;
    });

    activityData.forEach(detail => {
      const activityDate = detail.activityDate;
      // Check if the date has been processed
      debugger;
      if (resourceValue == "0") {
        if (selectedDate == null && !processedDates.has(activityDate)) {
          const dateRowColor = processedDates.has(activityDate) ? 'white' : 'red';
          console.log(data.length);
          data.push([activityDate]);
          const currentRowIndex = data.length + 5;
          ws['!merges'].push({ s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex, c: 4 } });
          // Apply the fill color to each cell in the merged range
          for (let col = 0; col < 5; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: currentRowIndex, c: col });
            ws[cellAddress] = {
              v: null,
              s: {
                font: {
                  bold: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'CEEEF5' },
                },
                alignment: {
                  wrapText: true,
                },
              },
            };
          }
          processedDates.add(activityDate);
        }
      }

      const firstHalfData = this.getFirstHalfData(detail);
      const secondHalfData = this.getSecondHalfData(detail);
      const rowData = [];
      if (resourceValue != 0 && selectedDate == null) {
        rowData.push(
          { v: detail.activityDate, s: { alignment: { wrapText: true } } },
          { v: detail.resourceCode, s: { alignment: { wrapText: true } } },
          { v: detail.resourceName, s: { alignment: { wrapText: true } } },
          { v: detail.domain, s: { alignment: { wrapText: true } } },
          { v: firstHalfData, s: { alignment: { wrapText: true } } },
          { v: secondHalfData, s: { alignment: { wrapText: true } } },
        );
      } else {
        rowData.push(
          { v: detail.resourceCode, s: { alignment: { wrapText: true } } },
          { v: detail.resourceName, s: { alignment: { wrapText: true } } },
          { v: detail.domain, s: { alignment: { wrapText: true } } },
          { v: firstHalfData, s: { alignment: { wrapText: true } } },
          { v: secondHalfData, s: { alignment: { wrapText: true } } },
        );
      }
      data.push(rowData);
    });

    // Add data to worksheet
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A7' });

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'activity_report.xlsx');
  }
}