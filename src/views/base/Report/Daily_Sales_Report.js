import React, { useState, useEffect } from 'react';
import instance from '../../../axios/axiosInstance';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CRow,
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CSpinner,
} from '@coreui/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DailySalesReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Calculate Grand Total
    const grandTotal = reportData.reduce((total, row) => total + parseFloat(row.TotalAmount || 0), 0);

    // Function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-CA'); // This returns the date as YYYY-MM-DD
    };

    // Fetch data from API
    const fetchReport = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        try {
            setLoading(true);
            const response = await instance.get('/GetSalesReport', {
                params: { startDate, endDate },
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching sales report:', error);
            alert('Failed to fetch report data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Export to Excel
    const exportToExcel = () => {
        if (reportData.length === 0) {
            alert('No data available to export.');
            return;
        }

        // Add a grand total row
        const dataWithTotal = [
            ...reportData,
            { Invoice: 'Grand Total', TotalAmount: grandTotal.toFixed(2), CreateDate: '' },
        ];

        const worksheet = XLSX.utils.json_to_sheet(dataWithTotal);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
        XLSX.writeFile(workbook, 'DailySalesReport.xlsx');
    };

    // Generate PDF
    const generatePDF = () => {
        if (reportData.length === 0) {
            alert('No data available to generate PDF.');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Daily Sales Report', 14, 10);

        // Table configuration
        const tableColumn = ['Invoice', 'Total Amount ($)', 'Create Date'];
        const tableRows = reportData.map((row) => [
            row.Invoice,
            row.TotalAmount,
            formatDate(row.CreateDate), // Format date for PDF
        ]);

        // Add grand total row
        tableRows.push(['Grand Total', `$${grandTotal.toFixed(2)}`, '']);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [79, 129, 189], textColor: [255, 255, 255], fontSize: 12 },
            bodyStyles: { fontSize: 10, valign: 'middle' }, // Align middle
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        doc.save('DailySalesReport.pdf');
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <h4>Daily Sales Report</h4>
                    </CCardHeader>
                    <CCardBody>
                        {/* Date Filters */}
                        <CForm className="row g-3 mb-4">
                            <CCol md={4}>
                                <CFormInput
                                    type="date"
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </CCol>
                            <CCol md={4}>
                                <CFormInput
                                    type="date"
                                    label="End Date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </CCol>
                            <CCol md={4} className="d-flex align-items-end">
                                <CButton color="primary" onClick={fetchReport}>
                                    {loading ? <CSpinner size="sm" /> : 'Fetch Report'}
                                </CButton>
                                <CButton
                                    color="success"
                                    className="ms-2"
                                    onClick={exportToExcel}
                                    disabled={loading || reportData.length === 0}
                                >
                                    Export to Excel
                                </CButton>
                                <CButton
                                    color="danger"
                                    className="ms-2"
                                    onClick={generatePDF}
                                    disabled={loading || reportData.length === 0}
                                >
                                    Generate PDF
                                </CButton>
                            </CCol>
                        </CForm>

                        {/* Data Table */}
                        {reportData.length > 0 ? (
                            <CTable hover responsive bordered>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Invoice</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Total Amount ($)</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Create Date</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {reportData.map((row) => (
                                        <CTableRow key={row.Invoice}>
                                            <CTableDataCell className="align-middle">{row.Invoice}</CTableDataCell>
                                            <CTableDataCell className="align-middle">{row.TotalAmount}</CTableDataCell>
                                            <CTableDataCell className="align-middle">
                                                {formatDate(row.CreateDate)} {/* Format date in the table */}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                                {/* Table Footer */}
                                <tfoot>
                                    <CTableRow>
                                        <CTableDataCell colSpan={1} className="text-end">
                                            <strong>Grand Total:</strong>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <strong>${grandTotal.toFixed(2)}</strong>
                                        </CTableDataCell>
                                        <CTableDataCell></CTableDataCell>
                                    </CTableRow>
                                </tfoot>
                            </CTable>
                        ) : (
                            !loading && <p>No data available for the selected date range.</p>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DailySalesReport;



// import React, { useState, useEffect } from 'react';
// import instance from '../../../axios/axiosInstance';
// import {
//     CButton,
//     CCard,
//     CCardBody,
//     CCardHeader,
//     CCol,
//     CForm,
//     CFormInput,
//     CRow,
//     CTable,
//     CTableHead,
//     CTableHeaderCell,
//     CTableBody,
//     CTableRow,
//     CTableDataCell,
//     CSpinner,
// } from '@coreui/react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// const DailySalesReport = () => {
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [reportData, setReportData] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // Calculate Grand Total
//     const grandTotal = reportData.reduce((total, row) => total + parseFloat(row.TotalAmount || 0), 0);

//     // Fetch data from API
//     const fetchReport = async () => {
//         if (!startDate || !endDate) {
//             alert('Please select both start and end dates.');
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await instance.get('/GetSalesReport', {
//                 params: { startDate, endDate },
//             });
//             setReportData(response.data);
//         } catch (error) {
//             console.error('Error fetching sales report:', error);
//             alert('Failed to fetch report data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Export to Excel
//     const exportToExcel = () => {
//         if (reportData.length === 0) {
//             alert('No data available to export.');
//             return;
//         }

//         // Add a grand total row
//         const dataWithTotal = [
//             ...reportData,
//             { Invoice: 'Grand Total', TotalAmount: grandTotal.toFixed(2), CreateDate: '' },
//         ];

//         const worksheet = XLSX.utils.json_to_sheet(dataWithTotal);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
//         XLSX.writeFile(workbook, 'DailySalesReport.xlsx');
//     };

//     // Generate PDF
//     const generatePDF = () => {
//         if (reportData.length === 0) {
//             alert('No data available to generate PDF.');
//             return;
//         }

//         const doc = new jsPDF();
//         doc.setFontSize(16);
//         doc.text('Daily Sales Report', 14, 10);

//         // Table configuration
//         const tableColumn = ['Invoice', 'Total Amount ($)', 'Create Date'];
//         const tableRows = reportData.map((row) => [
//             row.Invoice,
//             row.TotalAmount,
//             row.CreateDate,
//         ]);

//         // Add grand total row
//         tableRows.push(['Grand Total', `$${grandTotal.toFixed(2)}`, '']);

//         doc.autoTable({
//             head: [tableColumn],
//             body: tableRows,
//             startY: 20,
//             theme: 'grid',
//             headStyles: { fillColor: [79, 129, 189], textColor: [255, 255, 255], fontSize: 12 },
//             bodyStyles: { fontSize: 10, valign: 'middle' }, // Align middle
//             alternateRowStyles: { fillColor: [240, 240, 240] },
//         });

//         doc.save('DailySalesReport.pdf');
//     };

//     return (
//         <CRow>
//             <CCol xs={12}>
//                 <CCard>
//                     <CCardHeader>
//                         <h4>Daily Sales Report</h4>
//                     </CCardHeader>
//                     <CCardBody>
//                         {/* Date Filters */}
//                         <CForm className="row g-3 mb-4">
//                             <CCol md={4}>
//                                 <CFormInput
//                                     type="date"
//                                     label="Start Date"
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                 />
//                             </CCol>
//                             <CCol md={4}>
//                                 <CFormInput
//                                     type="date"
//                                     label="End Date"
//                                     value={endDate}
//                                     onChange={(e) => setEndDate(e.target.value)}
//                                 />
//                             </CCol>
//                             <CCol md={4} className="d-flex align-items-end">
//                                 <CButton color="primary" onClick={fetchReport}>
//                                     {loading ? <CSpinner size="sm" /> : 'Fetch Report'}
//                                 </CButton>
//                                 <CButton
//                                     color="success"
//                                     className="ms-2"
//                                     onClick={exportToExcel}
//                                     disabled={loading || reportData.length === 0}
//                                 >
//                                     Export to Excel
//                                 </CButton>
//                                 <CButton
//                                     color="danger"
//                                     className="ms-2"
//                                     onClick={generatePDF}
//                                     disabled={loading || reportData.length === 0}
//                                 >
//                                     Generate PDF
//                                 </CButton>
//                             </CCol>
//                         </CForm>

//                         {/* Data Table */}
//                         {reportData.length > 0 ? (
//                             <CTable hover responsive bordered>
//                                 <CTableHead>
//                                     <CTableRow>
//                                         <CTableHeaderCell scope="col">Invoice</CTableHeaderCell>
//                                         <CTableHeaderCell scope="col">Total Amount ($)</CTableHeaderCell>
//                                         <CTableHeaderCell scope="col">Create Date</CTableHeaderCell>
//                                     </CTableRow>
//                                 </CTableHead>
//                                 <CTableBody>
//                                     {reportData.map((row) => (
//                                         <CTableRow key={row.Invoice}>
//                                             <CTableDataCell className="align-middle">{row.Invoice}</CTableDataCell>
//                                             <CTableDataCell className="align-middle">{row.TotalAmount}</CTableDataCell>
//                                             <CTableDataCell className="align-middle">{row.CreateDate}</CTableDataCell>
//                                         </CTableRow>
//                                     ))}
//                                 </CTableBody>
//                                 {/* Table Footer */}
//                                 <tfoot>
//                                     <CTableRow>
//                                         <CTableDataCell colSpan={1} className="text-end">
//                                             <strong>Grand Total:</strong>
//                                         </CTableDataCell>
//                                         <CTableDataCell>
//                                             <strong>${grandTotal.toFixed(2)}</strong>
//                                         </CTableDataCell>
//                                         <CTableDataCell></CTableDataCell>
//                                     </CTableRow>
//                                 </tfoot>
//                             </CTable>
//                         ) : (
//                             !loading && <p>No data available for the selected date range.</p>
//                         )}
//                     </CCardBody>
//                 </CCard>
//             </CCol>
//         </CRow>
//     );
// };

// export default DailySalesReport;

