import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { Observable } from 'rxjs'; // 
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceGenerateServiceService {

  private platformUrl = 'http://localhost:9999/tpms/getplatform';
  private uniResName = 'http://localhost:9999/tpms/allResourceName';
  finaly: number;

  constructor(private httpClient: HttpClient) { }


  ngOnInit() {
    this.getPlatforms();

  }
  generateAttendanceReport(attendanceDetails: any[], year: string, monthName: string, platformName: string, selectedDate: string, presentCount: number, absentCount: number, resourceValue: any): void {
    const pdf = new jsPDF();

    // Static header content
    pdf.text('Attendance Report', 10, 10);
    const fontSize = 10;
    pdf.setFontSize(fontSize);
    const fy = `Year: ${year}`;;
    const month = `Month: ${monthName}`;
    if (platformName != '0') {
      const platform = `Platform: ${platformName === '0' ? '' : platformName}`;
      pdf.text(platform, 10, 26);
    }
    if (selectedDate != undefined) {
      const reportDate = `Date: ${selectedDate === undefined ? '' : selectedDate}`;
      pdf.text(reportDate, 100, 26);
    }

    pdf.text(fy, 10, 20);
    pdf.text(month, 100, 20);
    let head;
    if (resourceValue !== '0'&& selectedDate==null) {
      head = [['Date', 'Resource Name', 'Platform', 'First Half', 'Second Half']];

    } else {
      head = [['Resource Name', 'Platform', 'First Half', 'Second Half']];
    }


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

      if (resourceValue != 0 && selectedDate==null) {
        rowData.push(
          detail.activityDate,
          { content: detail.resourceName, styles: { fillColor: dataRowColor } },
          { content: detail.domain, styles: { fillColor: dataRowColor } },
          { content: firstHalfData, styles: { fillColor: dataRowColor } },
          { content: secondHalfData, styles: { fillColor: dataRowColor } }
        );
      } else {
        rowData.push(
          // detail.activityDate,
          { content: detail.resourceName, styles: { fillColor: dataRowColor } },
          { content: detail.domain, styles: { fillColor: dataRowColor } },
          { content: firstHalfData, styles: { fillColor: dataRowColor } },
          { content: secondHalfData, styles: { fillColor: dataRowColor } }
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
        console.log("Final Y position after table:", finalY);
      },
      startY: 30,
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
    debugger;
    if (presentCount == 0 && absentCount == 0) {

    } else {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(`SUMMARY`, 10, finalY + 10);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(`Total Activity: ${presentCount + absentCount}`, 10, finalY + 20);
      pdf.text(`Present: ${presentCount}`, 75, finalY + 20);
      pdf.text(`Absent: ${absentCount}`, 140, finalY + 20);
    }
    pdf.save('attendance_report.pdf');
  }


  private getFirstHalfData(detail: any): string {
    let firstHalfData = '';
    detail.firstHalf.forEach((firstHalfObj, index, array) => {
      firstHalfData += `${firstHalfObj.activityName} (${firstHalfObj.fromHours} to ${firstHalfObj.toHours}) ${firstHalfObj.attendanceStatus}`;
      if (index < array.length - 1) {
        firstHalfData += '\n';
      }
    });
    return firstHalfData;
  }

  private getSecondHalfData(detail: any): string {
    let secondHalfData = '';
    detail.secondHalf.forEach((secondHalfObj, index, array) => {
      secondHalfData += `${secondHalfObj.activityName} (${secondHalfObj.fromHours} to ${secondHalfObj.toHours}) ${secondHalfObj.attendanceStatus}`;
      if (index < array.length - 1) {
        secondHalfData += '\n';
      }
    });
    return secondHalfData;
  }

  getPlatforms(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.platformUrl);
  }

  generateAttendanceReportExcel(attendanceDetails: any[], year: string, monthName: string, platformName: string, selectedDate: string, presentCount: number, absentCount: number): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { skipHeader: true });

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Resource Name
      { wch: 15 }, // Platform
      { wch: 40 }, // First Half
      { wch: 40 }, // Second Half
    ];

    // Add headings with wrapText
    const headerRow = ['Resource Name', 'Platform', 'First Half', 'Second Half'];
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

    ws['A3'] = {
      v: `Financial Year: ${year}`,
      t: 's',
    };
    ws['C3'] = {
      v: ` Month: ${monthName}`,
      t: 's',
    };

    ws['A4'] = {
      v: platformName === '0' ? 'Platform: ' : `Platform: ${platformName}`,
      t: 's',
    };
    ws['C4'] = {
      v: selectedDate === undefined ? 'Date: ' : `Date: ${selectedDate}`,
      t: 's',
    };

    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }]; // Merge cells

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
      debugger;
      if (!processedDates.has(activityDate)) {
        const dateRowColor = processedDates.has(activityDate) ? 'white' : 'red';
        console.log(data.length);
        data.push([activityDate]);
        const currentRowIndex = data.length + 5;
        ws['!merges'].push({ s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex, c: 3 } });
        // Apply the fill color to each cell in the merged range
        for (let col = 0; col < 4; col++) {
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

      const firstHalfData = this.getFirstHalfData(detail);
      const secondHalfData = this.getSecondHalfData(detail);
      data.push([
        { v: detail.resourceName, s: { alignment: { wrapText: true } } },
        { v: detail.domain, s: { alignment: { wrapText: true } } },
        { v: firstHalfData, s: { alignment: { wrapText: true } } },
        { v: secondHalfData, s: { alignment: { wrapText: true } } },
      ]);
    });
    if (presentCount == 0 && absentCount == 0) {

    } else {
      data.push([
        { v: '' },
        { v: '' },
        { v: '' },
        { v: '' }
      ]);

      data.push([
        { v: `Total Acityvity: ${presentCount + absentCount}`, s: { font: { bold: true }, alignment: { wrapText: true } } },
        { v: '', s: { font: { bold: true }, alignment: { wrapText: true } } },
        { v: `Present: ${presentCount}`, s: { font: { bold: true }, alignment: { wrapText: true } } },
        { v: `Present: ${absentCount}`, s: { font: { bold: true }, alignment: { wrapText: true } } },
      ]);
    }


    // Add data to worksheet
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A7' });

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'attendance_report.xlsx');
  }

  getResource(value: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:9999/tpms/allResourceName?value=${encodeURIComponent(value)}`);
  }

}
