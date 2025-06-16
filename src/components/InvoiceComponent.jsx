import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const InvoiceComponent = ({ saleData, display = true }) => {
    const invoiceRef = useRef();

    if (!display) {
        return null;
    }

    // Format number with commas
    const formatNumber = (num) => {
        return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
    };

    // Convert number to words
    const numberToWords = (num) => {
        const words = [
            "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN",
            "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN",
            "EIGHTEEN", "NINETEEN", "TWENTY"
        ];
        return words[num] || num?.toString() || "";
    };

    const currentDate = new Date();
    const timeString = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const totalAmount = saleData?.accessories?.reduce((sum, item) => {
        return sum + (Number(item.price) * Number(item.quantity));
    }, 0) || 0;

    // Function to handle PDF download
    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 148, // A5 width in mm
                height: 210 // A5 height in mm
            });

            // Create PDF in A5 size (148x210mm)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a5'
            });

            // Add canvas image to PDF
            pdf.addImage(canvas, 'PNG', 0, 0, 148, 210);
            pdf.save(`invoice_${saleData.customerName || 'customer'}_${dateString.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    // Function to handle printing
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = `
            <div style="width:210mm;height:148mm;padding:10mm;font-family:Arial;font-size:12px">
                ${printContent}
            </div>
        `;
        window.print();
        document.body.innerHTML = originalContent;
    };

    // Function to display IMEI numbers
    const renderImeiInfo = () => {
        if (saleData?.addedImeis?.length > 0) {
            return (
                <div style={{ margin: '5px 0', padding: '3px', borderTop: '1px dashed #ccc' }}>
                    <div style={{ marginBottom: '3px', fontSize: '11px' }}>IMEI Numbers:</div>
                    {saleData.addedImeis.map((imei, index) => (
                        <div key={index} style={{ marginLeft: '5px', fontSize: '10px' }}>
                            IMEI {index + 1}: {imei}
                        </div>
                    ))}
                </div>
            );
        }
        else if (saleData?.imei1 || saleData?.imei2) {
            return (
                <div style={{ margin: '5px 0', padding: '3px', borderTop: '1px dashed #ccc' }}>
                    <div style={{ marginBottom: '3px', fontSize: '11px' }}>IMEI Numbers:</div>
                    {saleData.imei1 && <div style={{ marginLeft: '5px', fontSize: '10px' }}>IMEI 1: {saleData.imei1}</div>}
                    {saleData.imei2 && <div style={{ marginLeft: '5px', fontSize: '10px' }}>IMEI 2: {saleData.imei2}</div>}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                <button
                    onClick={handleDownloadPDF}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Download PDF
                </button>
                <button
                    onClick={handlePrint}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Print Invoice
                </button>
            </div>

            <div
                ref={invoiceRef}
                style={{
                    fontFamily: 'Arial, sans-serif',
                    width: '210mm',
                    minHeight: '148mm',
                    margin: '0 auto',
                    padding: '10mm',
                    border: '1px solid #000',
                    fontSize: '12px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                }}
            >
                <h1 style={{ textAlign: 'center', margin: '3px 0', fontSize: '16px' }}>SALES INVOICE</h1>

                <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '11px' }}>
                    <div>{timeString}</div>
                    <div>{dateString}</div>
                </div>

                <div style={{ marginBottom: '10px', fontSize: '11px' }}>
                    <div style={{ fontWeight: 'bold' }}>{saleData.shopId || "USAMA MOBILE MALL"} {saleData.mobileNumber || "03009634731"}</div>
                    <div>Add.: {saleData.address || "MALL PLAZA MULTAN"}</div>
                </div>

                {renderImeiInfo()}

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px', fontSize: '11px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                            <th style={{ textAlign: 'left', padding: '2px' }}>Sr. #</th>
                            <th style={{ textAlign: 'left', padding: '2px' }}>Description</th>
                            <th style={{ textAlign: 'right', padding: '2px' }}>Price</th>
                            <th style={{ textAlign: 'center', padding: '2px' }}>Qty.</th>
                            <th style={{ textAlign: 'right', padding: '2px' }}>Net Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {saleData.accessories?.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '2px' }}>{index + 1}</td>
                                <td style={{ padding: '2px' }}>{item.name || saleData.modelName || "PHONE"}</td>
                                <td style={{ textAlign: 'right', padding: '2px' }}>{formatNumber(item.price)}</td>
                                <td style={{ textAlign: 'center', padding: '2px' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', padding: '2px' }}>{formatNumber(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ margin: '8px 0', textAlign: 'center', fontWeight: 'bold', fontSize: '11px' }}>
                    {numberToWords(Math.floor(totalAmount / 1000))} THOUSAND
                </div>

                <div style={{ marginBottom: '10px', fontStyle: 'italic', textAlign: 'center', fontSize: '9px' }}>
                    تومانا نون چین کمپتی گی بارنش سی مرگ دبی کمپتی دهه دار هر گی دوگانه‌دار وارستی کلیم زنجی که پوچید حجمی هرگز استعمال شده جانبه اور ریفریش سبب کی گونی کارنش تغییر.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '11px' }}>
                    <div>Issued By ______</div>
                    <div>Checked By ______</div>
                </div>

                <div style={{ borderTop: '1px dashed #000', paddingTop: '3px', marginBottom: '3px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Invoice Amount:</span>
                        <span>{formatNumber(totalAmount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Previous Balance:</span>
                        <span>{formatNumber(saleData.previousBalance || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Inv. Amt+Prev. Bal.:</span>
                        <span>{formatNumber(totalAmount + (saleData.previousBalance || 0))}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Cash Rec.:</span>
                        <span>{formatNumber(saleData.cashReceived || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Net Balance Amount:</span>
                        <span>{formatNumber((totalAmount + (saleData.previousBalance || 0)) - (saleData.cashReceived || 0))}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '9px' }}>
                    Thank you for your business!
                </div>
            </div>
        </div>
    );
};