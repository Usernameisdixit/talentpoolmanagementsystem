import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AssesmentService {
  private url = 'http://localhost:9999/tpms';
  constructor(private httpClient: HttpClient,private datePipe: DatePipe) { }

  getActivitiesForAssesment(fromDate: string, toDate: string): Observable<any[]> {
    const urlF = `${this.url}/getActivityForAssesment`;
    return this.httpClient.get<string[]>(`${urlF}?fromDate=${fromDate}&toDate=${toDate}`);
  }

  assementData(reportType: string, fromDate: string, toDate: string, activityId: string, resourceValue: string) {
    const url = `${this.url}/assesmentReportData`;
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

  generateAssesmentPdf(reportType: string, assesmentData: any[], fromDate: Date, toDate: Date) {
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

    pdf.text('Assesment Report', 75, 10);
    debugger;
    if (formatteFromdDate === formattedToDate) {
      pdf.setFontSize(10);
      pdf.text('Date : ' + formatteFromdDate, 10, 20);
    } else {
      pdf.setFontSize(10);
      pdf.text('Date Range: ' + formatteFromdDate + ' to ' + formattedToDate, 10, 20);
    }
    if (reportType == 'activity'|| reportType=='summary') {
      pdf.setFontSize(10);
      pdf.text('Activity Name: ' + assesmentData[0]?.activityName, 10, 28);
      startYpos = 35;
    }
    if (reportType == 'resource') {
      pdf.setFontSize(10);
      pdf.text('Resorce Name: ' + assesmentData[0]?.resourceName, 10, 26);
      pdf.text('Resorce Code: ' + assesmentData[0]?.resourceCode, 100, 26);
      pdf.text('Platform Name: ' + assesmentData[0]?.platform, 10, 32);
      pdf.text('Designation    : ' + assesmentData[0]?.designation, 100, 32);
      startYpos = 40;
    }
    let head;
    if (reportType == 'activity'|| reportType=='summary') {
      head = [[ 'Resource Code', 'Resource Name', 'Platform', 'Total Mark ', 'Secured', 'Remark']];
    } else if (reportType == 'resource') {
      head = [['Assement Date','Activity','Total Mark ', 'Secured', 'Remark']];
    }

    // Table content
    const data = [];
    let lastDate = null;
    assesmentData.forEach(detail => {

      const dfg = detail.assementDate;
      const dataRowColor = [255, 255, 255];
      const rowData = [];
      let activityData = '';
      if (reportType == 'activity') {
        const currentDate = detail.asesmentDate;
        const formattedFromDate = this.datePipe.transform(detail.activityFromDate, 'd MMM yyyy');
        const formattedToDate = this.datePipe.transform(detail.activityToDate, 'd MMM yyyy');
        const formattedCurrentDate = this.datePipe.transform(currentDate, 'd MMM yyyy');
        if (currentDate !== lastDate) {
          data.push([{ content: `Period (${formattedFromDate} to ${formattedToDate})      Assessment Date:- ${formattedCurrentDate}`, colSpan: 7, styles: { fillColor: ['CEEEF5'] }  }]);
          // data.push([{ content: 'Period (' + detail.activityFromDate + ' to ' + detail.activityToDate + ') Assesment Date ' + currentDate, colSpan: 7, styles: { fillColor: ['CEEEF5'] } }]);
          lastDate = currentDate; // Update the last date
        }
        rowData.push(
          { content: detail.resourceCode, styles: { fillColor: dataRowColor } },
          { content: detail.resourceName, styles: { fillColor: dataRowColor } },
          { content: detail.platform, styles: { fillColor: dataRowColor } },
          { content: detail.doubleActivityMark, styles: { fillColor: dataRowColor } },
          { content: detail.doubleSecuredMark, styles: { fillColor: dataRowColor } },
          { content: detail.remark, styles: { fillColor: dataRowColor } },
        );
      } else if(reportType=='resource') {
        const formattedAsesmentDate = this.datePipe.transform(detail.asesmentDate, 'd MMM yyyy');
         rowData.push(
           { content: formattedAsesmentDate, styles: { fillColor: dataRowColor } },
           { content: detail.activityName, styles: { fillColor: dataRowColor } },
           { content: detail.doubleActivityMark, styles: { fillColor: dataRowColor } },
           { content: detail.doubleSecuredMark, styles: { fillColor: dataRowColor } },
           { content: detail.remark, styles: { fillColor: dataRowColor } },
         );
      }else{
        const formattedAsesmentDate = this.datePipe.transform(detail.asesmentDate, 'd MMM yyyy');
         rowData.push(
          { content: detail.resourceCode, styles: { fillColor: dataRowColor } },
          { content: detail.resourceName, styles: { fillColor: dataRowColor } },
          { content: detail.platform, styles: { fillColor: dataRowColor } },
          { content: detail.doubleActivityMark, styles: { fillColor: dataRowColor } },
          { content: detail.doubleSecuredMark, styles: { fillColor: dataRowColor } },
          { content: detail.remark, styles: { fillColor: dataRowColor } },
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
    pdf.save('assesment_report.pdf');
  }
}
