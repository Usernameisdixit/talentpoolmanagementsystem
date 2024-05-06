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

  generateAteendanceExcel(attendanceData: any, talent:any) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { skipHeader: true });
    
    let headerRow = [];
    let index=0;
    let Total=0;
      const colWidths= [
        { wch: 40 }, // Date
      ];

      for (let i = 0; i < talent.length; i++) {
        if (attendanceData.resource_code==talent[i].resourceCode){
        colWidths.push({ wch: 30 });
        index=i; 

        }
       }

      //attendanceData.forEach(() => colWidths.push({ wch: 10 }));
      ws['!cols'] = colWidths;
     // headerRow = ['Date',...activityHeadResource];
     headerRow = ['Sl. No','Period','Days'];
    
   
    //Heading Start From
     
      XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A9' });
    

    for (let col = 0; col < headerRow.length; col++) {
      let rowNumber;
      
        rowNumber = 8;
      
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
      v: 'Resource Report',
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
        v: `Resource Name:  ${talent[index].resourceName}`,
        t: 's',
      };
      ws['B3'] = {
        v: `Resource Code:  ${attendanceData.resource_code}`,
        t: 's',
      };

      ws['A4'] = {
        v: `Designation:  ${talent[index].designation}`,
        t: 's',
      };

      ws['B4'] = {
        v: `Platform:  ${talent[index].platform}`,
        t: 's',
      };

      ws['A5'] = {
        v: `Location:  ${talent[index].location}`,
        t: 's',
      };

      ws['B5'] = {
        v: `Experience:  ${talent[index].experience}`,
        t: 's',
      };
    
      ws['A6'] = {
        v: `Email_ID:  ${talent[index].email}`,
        t: 's',
      };

      ws['B6'] = {
        v: `Phone:  ${talent[index].phoneNo}`,
        t: 's',
      };


     

    
    //HEADING MERGED
    const colMergerd=attendanceData.allocation_periods.length+1;
    let colMergerdResource;
   
      colMergerdResource=attendanceData.allocation_periods.length;
    
    
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: colMergerdResource } }];
    

    const data: any[] = [];
    for (let i = 0; i < attendanceData.allocation_periods.length; i++) {
     
     console.log(attendanceData.allocation_periods.length);

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
          { v: i+1, s: { alignment: { wrapText: true } } },
          { v: range, s: { alignment: { wrapText: true } } },
          // { v: detail.attendanceStatus, s: { alignment: { wrapText: true } } },
          { v: days, s: { alignment: { wrapText: true } } },
        );
      
      data.push(rowData);
    }

    //const data2: any[] = [];
    let h="";
    let Str="TOTAL DAYS IN TALENT POOL";
    let Final= Total+" Days";
    const rowData2 = [];
    rowData2.push(
      { v: h, s: { fill: {
        patternType: 'solid',
        fgColor: { rgb: '52D8F9' },
      }, alignment: { wrapText: true } } },
      { v: Str, s: {
        font: {
          bold: true,
          size: 8,
          color: { rgb: '1D05EE' },
        },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: '52D8F9' },
        }, 
        alignment: { wrapText: true } } },
      { v: Final, s: { 
        font: {
        bold: true,
        size: 10,
        color: { rgb: '1D05EE' },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: '52D8F9' },
        }
      },  alignment: { wrapText: true } } },
     );

     data.push(rowData2);


  

    // Add data to worksheet
    XLSX.utils.sheet_add_json(ws, data,  { skipHeader: true, origin: 'A10' });
    


    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resource Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'Resource_report.xlsx');
  }





}
