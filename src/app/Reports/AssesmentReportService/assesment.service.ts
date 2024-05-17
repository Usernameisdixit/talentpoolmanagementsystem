import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import { DatePipe } from '@angular/common';
import { getActivityForAssesment,assesmentReportData} from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class AssesmentService {
  constructor(private httpClient: HttpClient,private datePipe: DatePipe) { }

  getActivitiesForAssesment(fromDate: string, toDate: string): Observable<any[]> {
    return this.httpClient.get<string[]>(`${getActivityForAssesment}?fromDate=${fromDate}&toDate=${toDate}`);
  }

  assementData(reportType: string, fromDate: string, toDate: string, activityId: string, resourceValue: string) {
    const params = {
      reportType: reportType,
      fromDate: fromDate,
      toDate: toDate,
      activityId: activityId,
      resourceValue: resourceValue,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(assesmentReportData, params, { headers });
  }

  generateAssesmentPdf(reportType: string, assesmentData: any[], fromDate: Date, toDate: Date) {
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
    if(reportType=='activity'){
      let activityNameForExcel = assesmentData[0]?.activityName;
      pdf.save('Assesment Report For Activity '+activityNameForExcel+'-'+formatteFromdDate+' to '+formattedToDate+'.pdf');
    }else if(reportType=='resource'){
      let resourceNameForExcel = assesmentData[0]?.resourceName;
      pdf.save('Assesment Report For Resource '+resourceNameForExcel+'-'+formatteFromdDate+' to '+formattedToDate+'.pdf');
    }else{
      pdf.save('Assesment Summary Report For -'+formatteFromdDate+' to '+formattedToDate+'.pdf');
    }
    // pdf.save('assesment_report.pdf');
  }



  generateAssesmentExcel(reportType: string, assesmentData: any[], fromDate: Date, toDate: Date){
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
        { wch: 15 }, // Total Mark
        { wch: 15 }, // Secured Mark
        { wch: 20 }, // Remark
      ];
      headerRow = ['Resource Code', 'Resource Name','Designation', 'Platform', 'Total Mark', 'Secured Mark','Remark'];
    } else if (reportType == 'resource') {
      const colWidths= [
        { wch: 15 }, // Total Mark
        { wch: 15 }, // Secured Mark
        { wch: 20 }, // Remark
      ];
      headerRow = ['Assesment Date','Total Mark', 'Secured Mark','Remark'];
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
      v: 'Assesment Report',
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
        v: `Activity Name:  ${assesmentData[0]?.activityName}`,
        t: 's',
      };
    }

    if (reportType == 'resource') {
      ws['A4'] = {
        v: `Resource Name:  ${assesmentData[0]?.resourceName}`,
        t: 's',
      };
      ws['C4'] = {
        v: `Resource Code:  ${assesmentData[0]?.resourceCode}`,
        t: 's',
      };

      ws['A5'] = {
        v: `Platform:  ${assesmentData[0]?.platform}`,
        t: 's',
      };
      ws['C5'] = {
        v: `Designation:  ${assesmentData[0]?.designation}`,
        t: 's',
      };
    }
    
    //HEADING MERGED
    //const colMergerd=assesmentData.length+3;
    //let colMergerdResource;
    if(reportType == 'resource'){
      // colMergerdResource=activityHeadResource.length;
    }
    if (reportType == 'activity') {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }]; // Merge cells
    } else if (reportType == 'resource') {
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
    }

    const data: any[] = [];
    const processedDates = new Set<string>();
    assesmentData.forEach(detail => {
  
      if (reportType == 'activity') {
        const assesmentDate = detail.asesmentDate;
        const formattedFromDate = this.datePipe.transform(detail.activityFromDate, 'd MMM yyyy');
        const formattedToDate = this.datePipe.transform(detail.activityToDate, 'd MMM yyyy');
        const formattedCurrentDate = this.datePipe.transform(assesmentDate, 'd MMM yyyy');
        if (!processedDates.has(assesmentDate)) {
          const dateRowColor = processedDates.has(assesmentDate) ? 'white' : 'red';
          data.push(['Period ('+formattedFromDate+' to '+formattedToDate+')       '+ 'Assesment Date: '+formattedCurrentDate]);
          const currentRowIndex = data.length + 5;
          let dateMerged;
          if(reportType=='activity'){
              dateMerged=6;
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
          processedDates.add(assesmentDate);
        }
      }
      const rowData = [];
     
      if (reportType == 'activity') {  
        rowData.push(
          { v: detail.resourceCode, s: { alignment: { wrapText: true } } },
          { v: detail.resourceName, s: { alignment: { wrapText: true } } },
          { v: detail.designation, s: { alignment: { wrapText: true } } },
          { v: detail.platform, s: { alignment: { wrapText: true } } },
          { v: detail.doubleActivityMark, s: { alignment: { wrapText: true } } },
          { v: detail.doubleSecuredMark, s: { alignment: { wrapText: true } } },
          { v: detail.remark, s: { alignment: { wrapText: true } } },
        );
      }else if(reportType == 'resource'){
        const formattedAsesmentDate = this.datePipe.transform(detail.asesmentDate, 'd MMM yyyy');
        rowData.push(
          { v:formattedAsesmentDate, s: { alignment: { wrapText: true } } },
          { v: detail.doubleActivityMark, s: { alignment: { wrapText: true } } },
          { v: detail.doubleSecuredMark, s: { alignment: { wrapText: true } } },
          { v: detail.remark, s: { alignment: { wrapText: true } } },
        );

      } 
      data.push(rowData);
    });

    // Add data to worksheet
    if (reportType == 'activity') {
      XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A7' });
    } else if (reportType == 'resource') {
      XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A8' });
    }


    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assesmentt Report');

    // Save the workbook as an Excel file
    if(reportType=='activity'){
      let activityNameForExcel = assesmentData[0]?.activityName;
      XLSX.writeFile(wb, 'Assesment Report For Activity '+activityNameForExcel+'-'+formatteFromdDate+' to '+formattedToDate+'.xlsx');
    }else if(reportType=='resource'){
      let resourceNameForExcel = assesmentData[0]?.resourceName;
      XLSX.writeFile(wb, 'Assesment Report For Resource '+resourceNameForExcel+'-'+formatteFromdDate+' to '+formattedToDate+'.xlsx');
    }else{
      XLSX.writeFile(wb, 'Assesment Summary Report For -'+formatteFromdDate+' to '+formattedToDate+'.xlsx');
    }
    // XLSX.writeFile(wb, 'assesment.xlsx');

  }
}
