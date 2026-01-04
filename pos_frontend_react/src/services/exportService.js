import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import default export

/**
 * Export data to Excel (.xlsx)
 * @param {Array} data - Array of Objects (data source)
 * @param {String} fileName - Name of the file without extension
 * @param {String} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, fileName = 'export', sheetName = 'Data') => {
    // 1. Convert JSON to Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Create Workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 3. Write file (Trigger download)
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Export data to PDF using jsPDF-AutoTable
 * @param {Array} columns - Array of objects defining headers (e.g. [{ title: "Name", dataKey: "name" }])
 * @param {Array} data - Array of Objects
 * @param {String} fileName - Name of the file
 * @param {String} title - Title inside the PDF document
 */
export const exportToPDF = (columns, data, fileName = 'export', title = 'Report') => {
    const doc = new jsPDF();

    // 1. Add Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // 2. Add Table
    // autoTable(doc, options) <-- Cara pemanggilan yang lebih aman di versi terbaru
    autoTable(doc, {
        startY: 35,
        columns: columns,
        body: data,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }, 
        styles: { fontSize: 10 }
    });

    // 3. Save File
    doc.save(`${fileName}.pdf`);
};