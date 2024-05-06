import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Talent } from 'src/app/Model/talent';
import { ResourceHistory } from 'src/app/Model/ResourceHistory';
import {getResourceDetailsWithFileName, getResourceList, getResourceResurceList } from 'src/app/apiconfig';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';

@Injectable({
  providedIn: 'root'
})
export class ResourcereportService {

  private baseUrl = "http://localhost:9999/tpms/emp"


  constructor(private httpClient: HttpClient, ) { }

  createTalent(talent: Talent): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/updatetalent`, talent, { responseType: "text" });
  }

  getTalent(pageNumber:number) {
    let fullUrl = `${getResourceResurceList}?pageNumber=${pageNumber}`;
    return this.httpClient.get(fullUrl);

  }

//  getResourceDetailsWithFileName(): Observable<ResourceHistory[]> {

//     return this.httpClient.get<ResourceHistory[]>(`${this.baseUrl}/getResourceDetailsWithFileName`);

//   }
  getResourceDetailsWithFileName() {
    let fullUrl = getResourceDetailsWithFileName;
    return this.httpClient.get(fullUrl);

  }

  downloadExcelFile(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.httpClient.get(`${this.baseUrl}/download/${fileName}`, {
      headers: headers,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }
   

  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;
    } else {

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  findContactByResourceNumber(id: number): Observable<Talent> {
    return this.httpClient.get<Talent>(`${this.baseUrl}/talent/${id}`);
  }

  //deleteByResourceNumber(id:number):Observable<string>{
  // return this.httpClient.delete(`${this.baseUrl}/talent/${id}`, {responseType:"text"});
  //}

  deleteByResourceNumber(id: number): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/delete/talent/${id}`, id, { responseType: "text" });
  }

  getResources(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:9999/tpms/getActiveResorces');
  }

  fetchDurations(code: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/durations?code=${code}`);
  }

  
  generateResourceReportPdf(attendanceData: any,  talent:any) {
    debugger;
    const pdf = new jsPDF();
    let startYpos = 0;

    pdf.text('Resource Report', 75, 10);

    for (let i = 0; i < talent.length; i++) {
      if (attendanceData.resource_code==talent[i].resourceCode){
    
         pdf.setFontSize(10);
         pdf.text('Resorce Name : ' + attendanceData.resource_name, 10, 26);
         pdf.text('Resorce Code : ' + attendanceData.resource_code, 100, 26);
         pdf.text('Designation : ' + talent[i].designation, 10, 32);
         pdf.text('Platform Name : ' + talent[i].platform, 100, 32);
         pdf.text('Location : ' + talent[i].location, 10, 38);
         pdf.text('Experience : ' + talent[i].experience, 100, 38);
         pdf.text('Email ID : ' + talent[i].email, 10, 44);
         pdf.text('Phone : ' + talent[i].phoneNo, 100, 44);
         startYpos = 50;

      }}
    let head;
     head = [['Sl. No','Period','Days']];
    let Total=0;

    // Table content
    const data = [];
    let lastDate = null;
    
    for (let i = 0; i < attendanceData.allocation_periods.length; i++) {

     // const atendanceDate = detail.atendanceDate;
      const dataRowColor = [255, 255, 255];
      const rowData = [];

      const formatFromDate = new Date(attendanceData.allocation_periods[i].start_date);
      const formatFromday = formatFromDate.getDate();
      const formatFrommonth = formatFromDate.toLocaleString('default', { month: 'short' });
      const formatFromyear = formatFromDate.getFullYear();
      const formatteFromdDate = `${formatFromday} ${formatFrommonth} ${formatFromyear}`;
  
      const formatTodate = new Date(attendanceData.allocation_periods[i].end_date);
      const formatToday = formatTodate.getDate();
      const formatTomonth = formatTodate.toLocaleString('default', { month: 'short' });
      const formatToyear = formatTodate.getFullYear();
      const formattedToDate = `${formatToday} ${formatTomonth} ${formatToyear}`;

      const range = `${formatteFromdDate} To ${formattedToDate}`;
      
      const days = this.calculateDuration(attendanceData.allocation_periods[i].start_date, attendanceData.allocation_periods[i].end_date);
      
      Total=Total+days;
       
        rowData.push(
          { content: i+1, styles: { fillColor: dataRowColor } },
          { content: range , styles: { fillColor: dataRowColor } },
          { content: days , styles: { fillColor: dataRowColor } },
         
        );
      
      data.push(rowData);

    }
    
    pdf.text('Total Number of Days in Talent Pool: ' + Total+" Days", 10, 100);

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
    pdf.save('Resource_Report.pdf');
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }

  generateAteendanceExcel(reportType: string, attendanceData: any[], fromDate: Date, toDate: Date,activityHead:any[],activityHeadResource:any[]) {
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
     // headerRow = ['Resource Code', 'Resource Name', 'Designation', 'Platform', 'Attendance Status'];
     headerRow = ['Resource Code', 'Resource Name', 'Designation', 'Platform'];
    } else if (reportType == 'resource') {
      const colWidths= [
        { wch: 20 }, // Date
      ];
      activityHeadResource.forEach(() => colWidths.push({ wch: 10 }));
      ws['!cols'] = colWidths;
     // headerRow = ['Date',...activityHeadResource];
     headerRow = ['Period','Activity_Name'];
    }else if(reportType=='summary'){
      const colWidths = [
        { wch: 20 }, // Date
        { wch: 20 }, // Resource Name
        { wch: 25 }, // Platform
        { wch: 15 }, // Designation
      ];

       const dynamicHeaders = activityHead.map(item => item.activityName);
        dynamicHeaders.forEach(() => colWidths.push({ wch: 10 }));
        ws['!cols'] = colWidths;
         headerRow = ['Resource Code', 'Resource Name', 'Designation', 'Platform', ...dynamicHeaders];
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
      ws['B4'] = {
        v: `Resource Code:  ${attendanceData[0]?.resourceCode}`,
        t: 's',
      };

      ws['A5'] = {
        v: `Platform:  ${attendanceData[0]?.platform}`,
        t: 's',
      };
      ws['B5'] = {
        v: `Designation:  ${attendanceData[0]?.designation}`,
        t: 's',
      };
    }
    
    //HEADING MERGED
    const colMergerd=activityHead.length+3;
    let colMergerdResource;
    if(reportType == 'resource'){
      colMergerdResource=activityHeadResource.length;
    }
    if (reportType == 'activity') {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]; // Merge cells
    } else if (reportType == 'resource') {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: colMergerdResource } }];
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
              dateMerged=activityHead.length+3;
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
          // { v: detail.activityName, s: { alignment: { wrapText: true } } },
          // { v: detail.attendanceStatus, s: { alignment: { wrapText: true } } },
          { v: detail.activityName, s: { alignment: { wrapText: true } } },
        );
       if (detail.activityAttenDetails) {
          detail.activityAttenDetails.forEach(activityDetail => {
            rowData.push(
                { v: activityDetail.attendanceStatus, s: { alignment: { wrapText: true } } }
            );
        });
      }
      }else if(reportType=='summary'){
        debugger;
        rowData.push(
          // { v: detail.atendanceDate, s: { alignment: { wrapText: true } } },
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
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'activity_report.xlsx');
  }





}
