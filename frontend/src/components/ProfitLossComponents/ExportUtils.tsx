import React from 'react';

interface ExportUtilsProps {
  statementRef: React.RefObject<HTMLDivElement>;
  periodLabel: string;
}

const ExportUtils: React.FC<ExportUtilsProps> = ({ statementRef, periodLabel }) => {
  const handlePrint = () => {
    if (!statementRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the P&L statement');
      return;
    }

    const content = statementRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Profit & Loss Statement - ${periodLabel}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 20mm;
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 8px 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f3f4f6;
              font-weight: 600;
            }
            .text-right {
              text-align: right;
            }
            .font-bold {
              font-weight: bold;
            }
            .text-green-600 {
              color: #059669;
            }
            .text-red-600 {
              color: #dc2626;
            }
            .bg-blue-50 {
              background-color: #eff6ff;
            }
            .bg-green-50 {
              background-color: #f0fdf4;
            }
            .bg-yellow-50 {
              background-color: #fefce8;
            }
            .bg-red-50 {
              background-color: #fef2f2;
            }
            .bg-gray-100 {
              background-color: #f3f4f6;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 8px;
            }
            h2 {
              font-size: 18px;
              color: #374151;
              margin-bottom: 16px;
            }
            h3 {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #000;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportCSV = () => {
    if (!statementRef.current) return;

    const tables = statementRef.current.querySelectorAll('table');
    if (tables.length === 0) return;

    let csvContent = `Profit & Loss Statement\n${periodLabel}\n\n`;

    tables.forEach((table) => {
      const rows = table.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => {
          let text = cell.textContent || '';
          // Remove special characters and clean up
          text = text.replace(/[↑↓]/g, '').trim();
          // Wrap in quotes if contains comma
          if (text.includes(',')) {
            text = `"${text}"`;
          }
          return text;
        });
        csvContent += rowData.join(',') + '\n';
      });
      csvContent += '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `PL_Statement_${periodLabel.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-3 justify-end mb-6">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print PDF
      </button>
      
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>
    </div>
  );
};

export default ExportUtils;
