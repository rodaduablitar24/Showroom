import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportToExcel(data: any[], fileName: string) {
    if (!data || data.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Filter headers (keys from first object)
    const headers = Object.keys(data[0]);
    worksheet.columns = headers.map(header => {
        // Basic configuration for columns
        return {
            header: header,
            key: header,
            width: header.length + 5,
            style: {
                alignment: { vertical: 'middle', horizontal: 'left' }
            }
        };
    });

    // Add rows
    worksheet.addRows(data);

    // Style the header
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30; // Make header taller
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF6B10' } // Gold/Orange color
        };
        cell.font = {
            bold: true,
            color: { argb: 'FFFFFFFF' },
            size: 11,
            name: 'Arial'
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Auto-filter and Freeze Top Row
    worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: headers.length }
    };
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    // Style data cells and auto-adjust widths
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        row.height = 25; // Consistent row height for premium feel
        row.eachCell((cell, colNumber) => {
            // Add border to data cells
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };

            const headerValue = worksheet.getRow(1).getCell(colNumber).value?.toString().toUpperCase() || '';

            // Formatting for numeric values
            if (typeof cell.value === 'number') {
                if (headerValue.includes('TAHUN')) {
                    cell.numFmt = '0'; // Plain number for years
                } else {
                    cell.numFmt = '#,##0'; // Thousands separator for prices/counts
                }
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            }

            // Update column width based on content
            const column = worksheet.getColumn(colNumber);
            const contentLen = cell.value ? cell.value.toString().length : 0;
            const headerLen = headerValue.length;
            const maxLen = Math.max(contentLen, headerLen);

            if (maxLen + 10 > (column.width || 0)) {
                column.width = maxLen + 10;
            }
        });
    });

    // Write to buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
}

export function exportToPDF(headers: string[][], data: any[][], fileName: string, title: string) {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // Add Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

    autoTable(doc, {
        head: headers,
        body: data,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [255, 107, 16], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 40 },
    });

    doc.save(`${fileName}.pdf`);
}
