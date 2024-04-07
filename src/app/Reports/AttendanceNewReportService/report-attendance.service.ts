import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';

@Injectable({
  providedIn: 'root'
})
export class ReportAttendanceService {

  private url = 'http://localhost:9999/tpms';

  constructor(private httpClient: HttpClient) { }

  getActivities(fromDate: string, toDate: string): Observable<any[]> {
    const urlF = `${this.url}/getActivityOnFromTo`;
    return this.httpClient.get<string[]>(`${urlF}?fromDate=${fromDate}&toDate=${toDate}`);
  }

  getResource(value: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:9999/tpms/allResourceName?value=${encodeURIComponent(value)}`);
  }


  attendanceData(reportType: string, fromDate: string, toDate: string, activityId: string, resourceValue: string) {
    const url = `${this.url}/attedanceDataReport`;
    const params = {
      reportType: reportType,
      fromDate: fromDate,
      toDate: toDate,
      activityId: activityId,
      resourceValue: resourceValue,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(url, params, { headers });
  }

  generateAteendancePdf(reportType: string, attendanceData: any[], fromDate: Date, toDate: Date) {
    debugger;
    const pdf = new jsPDF();
    let startYpos = 0;
    const formatFromDate = new Date(fromDate);
    const formatFromday = formatFromDate.getDate();
    const formatFrommonth = formatFromDate.toLocaleString('default', { month: 'short' });
    const formatFromyear = formatFromDate.getFullYear();
    const formatteFromdDate = `${formatFromday} ${formatFrommonth} ${formatFromyear}`;

    const formatTodate = new Date(toDate);
    const formatToday = formatTodate.getDate();
    const formatTomonth = formatTodate.toLocaleString('default', { month: 'short' });
    const formatToyear = formatTodate.getFullYear();
    const formattedToDate = `${formatToday} ${formatTomonth} ${formatToyear}`;

    pdf.text('Attendance Report', 75, 10);
    debugger;
    if (formatteFromdDate === formattedToDate) {
      pdf.setFontSize(10);
      pdf.text('Date : ' + formatteFromdDate, 10, 20);
    } else {
      pdf.setFontSize(10);
      pdf.text('Date Range: ' + formatteFromdDate + ' to ' + formattedToDate, 10, 20);
    }
    if (reportType == 'activity') {
      pdf.setFontSize(10);
      pdf.text('Activity Name: ' + attendanceData[0]?.activityName, 10, 28);
      startYpos = 35;
    }
    if (reportType == 'resource') {
      pdf.setFontSize(10);
      pdf.text('Resorce Name: ' + attendanceData[0]?.resourceName, 10, 26);
      pdf.text('Resorce Code: ' + attendanceData[0]?.resourceCode, 100, 26);
      pdf.text('Platform Name: ' + attendanceData[0]?.platform, 10, 32);
      pdf.text('Designation    : ' + attendanceData[0]?.designation, 100, 32);
      startYpos = 40;
    }
    let head;
    if (reportType == 'activity') {
      head = [['Resource Code', 'Resource Name', 'Designation', 'Platform', 'Attendance Status']];
    } else if (reportType == 'resource') {
      head = [['Date', 'Activity', 'Attendance Status']];
    }

    // Table content
    const data = [];
    let lastDate = null;
    attendanceData.forEach(detail => {

      const atendanceDate = detail.atendanceDate;
      const dataRowColor = [255, 255, 255];
      const rowData = [];

      if (reportType == 'activity') {
        const currentDate = detail.atendanceDate;
        if (currentDate !== lastDate) {
          data.push([{ content: currentDate, colSpan: 6, styles: { fillColor: ['CEEEF5'] } }]);
          lastDate = currentDate; // Update the last date
        }
        rowData.push(
          { content: detail.resourceCode, styles: { fillColor: dataRowColor } },
          { content: detail.resourceName, styles: { fillColor: dataRowColor } },
          { content: detail.designation, styles: { fillColor: dataRowColor } },
          { content: detail.platform, styles: { fillColor: dataRowColor } },
          { content: detail.attendanceStatus, styles: { fillColor: dataRowColor } },
        );
      } else {
        rowData.push(
          { content: detail.atendanceDate, styles: { fillColor: dataRowColor } },
          { content: detail.activityName, styles: { fillColor: dataRowColor } },
          { content: detail.attendanceStatus, styles: { fillColor: dataRowColor } },
        );
      }
      data.push(rowData);
    });

    // Create auto table
    var finalY = null;

    autoTable(pdf, {
      head: head,
      body: data,
      didDrawPage: function (data) {
        finalY = Math.round(data.cursor.y);
      },
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
    pdf.save('attendance_report.pdf');
  }

  generateAteendanceExcel(reportType: string, attendanceData: any[], fromDate: Date, toDate: Date,activityHead:any[]) {
    const formatFromDate = new Date(fromDate);
    const formatFromday = formatFromDate.getDate();
    const formatFrommonth = formatFromDate.toLocaleString('default', { month: 'short' });
    const formatFromyear = formatFromDate.getFullYear();
    const formatteFromdDate = `${formatFromday} ${formatFrommonth} ${formatFromyear}`;

    const formatTodate = new Date(toDate);
    const formatToday = formatTodate.getDate();
    const formatTomonth = formatTodate.toLocaleString('default', { month: 'short' });
    const formatToyear = formatTodate.getFullYear();
    const formattedToDate = `${formatToday} ${formatTomonth} ${formatToyear}`;

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { skipHeader: true });
    
    let headerRow = [];
    if (reportType == 'activity') {
      ws['!cols'] = [
        { wch: 20 }, // Resource code
        { wch: 20 }, // Resource Name
        { wch: 15 }, // Platform
        { wch: 25 }, // Designation
        { wch: 20 }, // Attendane Status
      ];
      headerRow = ['Resource Code', 'Resource Name', 'Designation', 'Platform', 'Attendance Status'];
    } else if (reportType == 'resource') {
      ws['!cols'] = [
        { wch: 20 }, // Date
        { wch: 20 }, // Activity
        { wch: 25 }, // Attendance Status
      ];
      headerRow = ['Date', 'Activity', 'Attendance Status'];
    }else if(reportType=='summary'){
      const colWidths = [
        { wch: 20 }, // Date
        { wch: 20 }, // Resource Name
        { wch: 25 }, // Platform
        { wch: 15 }, // Designation
      ];

       const dynamicHeaders = activityHead.map(item => item.activityName);
        // Append additional column widths for dynamic headers
        dynamicHeaders.forEach(() => colWidths.push({ wch: 10 }));
        ws['!cols'] = colWidths;
         headerRow = ['Date','Resource Code', 'Resource Name', 'Designation', 'Platform', ...dynamicHeaders];
    }
   
    //Heading Start From
    if (reportType == 'activity') {
      XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A6' });
    } else if (reportType == 'resource') {
      XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A7' });
    }else if(reportType=='summary'){
      XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A6' });
    }

    for (let col = 0; col < headerRow.length; col++) {
      let rowNumber;
      if (reportType == 'activity') {
        rowNumber = 5;
      } else if (reportType == 'resource') {
        rowNumber = 6;
      }else if(reportType=='summary'){
        rowNumber = 5
      }
      const cellAddress = XLSX.utils.encode_cell({ r: rowNumber, c: col });
      ws[cellAddress].s = {
        font: { bold: true },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: '52D8F9' },
        },
        alignment: {
          wrapText: true
        },
      };
    }

    ws['A1'] = {
      v: 'Attendance Report',
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

    if(formatteFromdDate===formattedToDate){
      ws['A3'] = {
        v: `Date : ${formatteFromdDate}`,
        t: 's',
      };
    }else{
      ws['A3'] = {
        v: `Date Range: ${formatteFromdDate} to ${formattedToDate}`,
        t: 's',
      };
    }

   

    if (reportType == 'activity') {
      ws['A4'] = {
        v: `Activity Name:  ${attendanceData[0]?.activityName}`,
        t: 's',
      };
    }

    if (reportType == 'resource') {
      ws['A4'] = {
        v: `Resource Name:  ${attendanceData[0]?.resourceName}`,
        t: 's',
      };
      ws['C4'] = {
        v: `Resource Code:  ${attendanceData[0]?.resourceCode}`,
        t: 's',
      };

      ws['A5'] = {
        v: `Platform:  ${attendanceData[0]?.platform}`,
        t: 's',
      };
      ws['C5'] = {
        v: `Designamtion:  ${attendanceData[0]?.designation}`,
        t: 's',
      };
    }

    const colMergerd=activityHead.length+4;
    if (reportType == 'activity') {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]; // Merge cells
    } else if (reportType == 'resource') {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    }else if(reportType=='summary'){
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: colMergerd  } }];
    }

    const data: any[] = [];
    const processedDates = new Set<string>();
    attendanceData.forEach(detail => {
     console.log(attendanceData.length);
      if (reportType == 'activity' || reportType=='summary') {
        const atendanceDate = detail.atendanceDate;
        if (!processedDates.has(atendanceDate)) {
          const dateRowColor = processedDates.has(atendanceDate) ? 'white' : 'red';
          data.push([atendanceDate]);
          const currentRowIndex = data.length + 5;
          let dateMerged;
          if(reportType=='activity'){
              dateMerged=4;
          }else if(reportType=='summary'){
              dateMerged=activityHead.length+4;
          }
          ws['!merges'].push({ s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex, c: dateMerged } });
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
          processedDates.add(atendanceDate);
        }
      }
      const rowData = [];
      if (reportType == 'activity') {
        
        rowData.push(
          { v: detail.resourceCode, s: { alignment: { wrapText: true } } },
          { v: detail.resourceName, s: { alignment: { wrapText: true } } },
          { v: detail.designation, s: { alignment: { wrapText: true } } },
          { v: detail.platform, s: { alignment: { wrapText: true } } },
          { v: detail.attendanceStatus, s: { alignment: { wrapText: true } } },
        );
      } else if (reportType == 'resource') {
        rowData.push(
          { v: detail.atendanceDate, s: { alignment: { wrapText: true } } },
          { v: detail.activityName, s: { alignment: { wrapText: true } } },
          { v: detail.attendanceStatus, s: { alignment: { wrapText: true } } },
        );
      }else if(reportType=='summary'){
        debugger;
        rowData.push(
          { v: detail.atendanceDate, s: { alignment: { wrapText: true } } },
        { v: detail.resourceCode, s: { alignment: { wrapText: true } } },
        { v: detail.resourceName, s: { alignment: { wrapText: true } } },
        { v: detail.designation, s: { alignment: { wrapText: true } } },
        { v: detail.platform, s: { alignment: { wrapText: true } } },      
        );
        if (detail.activityAttenDetails) {
        detail.activityAttenDetails.forEach(activityDetail => {
          rowData.push(
              { v: activityDetail.attendanceStatus, s: { alignment: { wrapText: true } } }
          );
      });
    }
     
      }

      data.push(rowData);
    });

    // Add data to worksheet
    if (reportType == 'activity') {
      XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A7' });
    } else if (reportType == 'resource') {
      XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A8' });
    }else if(reportType=='summary'){
      XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A7' });
    }


    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'attendance_report.xlsx');
  }
}