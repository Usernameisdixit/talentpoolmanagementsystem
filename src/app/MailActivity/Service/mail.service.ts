import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { allocationDataForMailUrl,mailContentUrl,send} from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class MailService {
 

  constructor(private httpClient: HttpClient) { }

  getAllActivityAllocationDetails(fromDate: string, toDate: string) {
    const params = {
      fromDate: fromDate,
      toDate: toDate,  
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(allocationDataForMailUrl, params, { headers });
  }

  fetContent(inputType : string){
    return this.httpClient.get<any>(`${mailContentUrl}?inputType=${inputType}`);

  }

  generateExcel( allocationData: any[], fromDate: Date, toDate: Date,activityHead:any[]){
    debugger;
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
    
      const colWidths = [
        { wch: 20 }, // code
        { wch: 20 }, // Resource Name
        { wch: 25 }, // Platform
        { wch: 15 }, // Designation
      ];

      //  const dynamicHeaders = activityHead.map(item => item.activityName);
      activityHead.forEach(() => colWidths.push({ wch: 15 }));

        ws['!cols'] = colWidths;
         headerRow = ['Resource Code', 'Resource Name', 'Designation', 'Platform', ...activityHead];
   
    //Heading Start From

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
          wrapText: true
        },
      };
    }

    ws['A1'] = {
      v: 'Activity Allocation For Resources',
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
        v: `Period: ${formatteFromdDate} to ${formattedToDate}`,
        t: 's',
      };
  

    
    //HEADING MERGED   
    const colMergerd=activityHead.length+3;
    let colMergerdResource;
   
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: colMergerd  } }];

    const data: any[] = [];
    const processedDates = new Set<string>();
    allocationData.forEach(detail => {
  
      debugger;
      const rowData = [];
      let activityData='';
        debugger;
        rowData.push(
          // { v: detail.atendanceDate, s: { alignment: { wrapText: true } } },
        { v: detail.resourceCode, s: { alignment: { wrapText: true } } },
        { v: detail.resourceName, s: { alignment: { wrapText: true } } },
        { v: detail.designation, s: { alignment: { wrapText: true } } },
        { v: detail.platform, s: { alignment: { wrapText: true } } },      
        );
        if (detail.activityAllocationDetails) {
        detail.activityAllocationDetails.forEach(activityDetail => {
          rowData.push(
              { v: activityDetail.isActivity, s: { alignment: { wrapText: true } } }
          );
      });
    }
      data.push(rowData);
    });

    // Add data to worksheet   
      XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A7' });
    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All0cation Details');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'Talent Pool engagement planner'+formatteFromdDate+ ' to '+ formattedToDate +'.xlsx');

  }

  sendMail(mailData:any){
    return this.httpClient.post(`${send}`, mailData);
  }
}
