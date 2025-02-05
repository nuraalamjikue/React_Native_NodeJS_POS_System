import React from 'react';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './logo/logo.png';

const InvoiceModal = ({ isOpen, closeModal, cart, totalPrice, InvoiceNo }) => {
    // Function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF({
            unit: 'pt',
            format: [158.34, 800]
        });
        // Add Logo at the Top
        doc.addImage(logo, 'PNG', 50, 5, 40, 30); // Adjust position (x, y) and size (width, height)

        // Set Title
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.text('Invoice', 70, 40, null, null, 'center');
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice No : ${InvoiceNo}`, 70, 48, null, null, 'center');

        // Set Date
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 6, 60);

        // Customer Details Section
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        // doc.text('Customer Details:', 20, 100);
        // doc.setFont("helvetica", "normal");
        doc.setFont("helvetica", "normal");
        doc.text(`CARRETERA MONT RADON 1208552,TARADELL`, 75, 68, null, null, 'center');
        // doc.text('Name: John Doe', 20, 120);
        // doc.text('Address: 1234 Elm Street, Springfield', 20, 140);
        // doc.text('Email: john.doe@example.com', 20, 160);

        // Table for Items
        const tableColumn = ['Item', 'Quantity', 'Price', 'Total'];
        const tableRows = cart.map(item => [
            item.Item_Name,
            item.qty.toString(),
            `$${item.Item_Price.toFixed(2)}`,
            `$${(item.Item_Price * item.qty).toFixed(2)}`
        ]);

        // Adding the table using autoTable
        doc.autoTable({
            startY: 75,  // Start the table after the customer details section
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            styles: { cellPadding: 4, fontSize: 6 },
            headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontStyle: 'bold' },
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 180, left: 5, right: 5 },
        });

        // Subtotal, Tax, and Total Section
        const subtotal = totalPrice;
        const tax = subtotal * 0.21;
        const grandTotal = subtotal + tax;
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 5, doc.autoTable.previous.finalY + 15);
        doc.text(`Tax (21%): $${tax.toFixed(2)}`, 5, doc.autoTable.previous.finalY + 25);
        doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 5, doc.autoTable.previous.finalY + 35);

        // Generate the PDF Blob URL and open it in a new tab
        const pdfData = doc.output('bloburl');
        const newWindow = window.open(pdfData, '_blank');

        // Check if the new window was opened successfully
        if (!newWindow) {
            alert('Please allow popups for this action.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Invoice Modal"
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    width: '80%',
                    maxWidth: '800px',
                    fontFamily: "'Arial', sans-serif",
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                },
            }}
        >
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Invoice</h2>
                <p style={{ margin: '5px 0', color: '#666' }}>Generated: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Customer Details Section */}
            <div style={{ marginBottom: '2px' }}>
                <strong>Customer Details:</strong>
                <div style={{ marginTop: '2px', fontSize: '14px', color: '#555' }}>
                    <p>Name: John Doe</p>
                    <p>Address: 1234 Elm Street, Springfield</p>
                    <p>Email: john.doe@example.com</p>
                </div>
            </div>

            {/* Items Table Section */}
            <table style={{ width: '100%', marginBottom: '10px', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', }}>Item</th>
                        <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', }}>QTY</th>
                        <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', }}>Price</th>
                        <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.id}>
                            <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', }}>{item.Item_Name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', }}>{item.qty}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', }}>${item.Item_Price.toFixed(2)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', }}>${(item.Item_Price * item.qty).toFixed(2)}</td>
                        </tr>
                    ))}
                    {/* Tax and Grand Total Section */}
                    <tr>
                        <td colSpan="3" style={{ padding: '5px', fontWeight: 'bold', textAlign: 'right', backgroundColor: '#f9f9f9' }}>
                            Subtotal:
                        </td>
                        <td style={{ padding: '5px', fontWeight: 'bold', textAlign: 'right', backgroundColor: '#f9f9f9' }}>
                            ${totalPrice.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ padding: '5px', fontWeight: 'bold', textAlign: 'right', backgroundColor: '#f9f9f9' }}>
                            Tax (5%):
                        </td>
                        <td style={{ padding: '5px', fontWeight: 'bold', textAlign: 'right', backgroundColor: '#f9f9f9' }}>
                            ${(totalPrice * 0.05).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ padding: '10px', fontWeight: 'bold', textAlign: 'right', backgroundColor: '#f9f9f9' }}>
                            Grand Total:
                        </td>
                        <td
                            style={{
                                padding: '10px',
                                fontWeight: 'bold',
                                textAlign: 'right',
                                backgroundColor: '#f9f9f9',
                                color: '#333',
                            }}
                        >
                            ${(totalPrice * 1.05).toFixed(2)} {/* Add 5% tax to the total */}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Print and Close Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                    onClick={generatePDF}
                    style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Generate PDF Invoice
                </button>
                <button
                    onClick={closeModal}
                    style={{
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
