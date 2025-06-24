// import React, { useRef } from 'react';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

// export const InvoiceComponent = ({ saleData, display = true }) => {
//     const invoiceRef = useRef();

//     if (!display) {
//         return null;
//     }

//     // Format number with commas
//     const formatNumber = (num) => {
//         return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
//     };

//     // Convert number to words
//     const numberToWords = (num) => {
//         const words = [
//             "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN",
//             "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN",
//             "EIGHTEEN", "NINETEEN", "TWENTY"
//         ];
//         return words[num] || num?.toString() || "";
//     };

//     const currentDate = new Date();
//     const timeString = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//     const dateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

//     const totalAmount = saleData?.accessories?.reduce((sum, item) => {
//         return sum + (Number(item.price) * Number(item.quantity));
//     }, 0) || 0;

//     // Function to handle PDF download
//     const handleDownloadPDF = async () => {
//         if (!invoiceRef.current) return;

//         try {
//             const canvas = await html2canvas(invoiceRef.current, {
//                 scale: 2,
//                 logging: false,
//                 useCORS: true,
//                 allowTaint: true,
//                 width: 148, // A5 width in mm
//                 height: 210 // A5 height in mm
//             });

//             // Create PDF in A5 size (148x210mm)
//             const pdf = new jsPDF({
//                 orientation: 'portrait',
//                 unit: 'mm',
//                 format: 'a5'
//             });

//             // Add canvas image to PDF
//             pdf.addImage(canvas, 'PNG', 0, 0, 148, 210);
//             pdf.save(`invoice_${saleData.customerName || 'customer'}_${dateString.replace(/\s+/g, '_')}.pdf`);
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//         }
//     };

//     // Function to handle printing
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML;
//         const originalContent = document.body.innerHTML;

//         document.body.innerHTML = `
//             <div style="width:210mm;height:148mm;padding:10mm;font-family:Arial;font-size:12px">
//                 ${printContent}
//             </div>
//         `;
//         window.print();
//         document.body.innerHTML = originalContent;
//     };

//     // Function to display IMEI numbers
//     const renderImeiInfo = () => {
//         if (saleData?.addedImeis?.length > 0) {
//             return (
//                 <div style={{ margin: '5px 0', padding: '3px', borderTop: '1px dashed #ccc' }}>
//                     <div style={{ marginBottom: '3px', fontSize: '11px' }}>IMEI Numbers:</div>
//                     {saleData.addedImeis.map((imei, index) => (
//                         <div key={index} style={{ marginLeft: '5px', fontSize: '10px' }}>
//                             IMEI {index + 1}: {imei}
//                         </div>
//                     ))}
//                 </div>
//             );
//         }
//         else if (saleData?.imei1 || saleData?.imei2) {
//             return (
//                 <div style={{ margin: '5px 0', padding: '3px', borderTop: '1px dashed #ccc' }}>
//                     <div style={{ marginBottom: '3px', fontSize: '11px' }}>IMEI Numbers:</div>
//                     {saleData.imei1 && <div style={{ marginLeft: '5px', fontSize: '10px' }}>IMEI 1: {saleData.imei1}</div>}
//                     {saleData.imei2 && <div style={{ marginLeft: '5px', fontSize: '10px' }}>IMEI 2: {saleData.imei2}</div>}
//                 </div>
//             );
//         }
//         return null;
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
//                 <button
//                     onClick={handleDownloadPDF}
//                     style={{
//                         padding: '8px 16px',
//                         backgroundColor: '#4CAF50',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     Download PDF
//                 </button>
//                 <button
//                     onClick={handlePrint}
//                     style={{
//                         padding: '8px 16px',
//                         backgroundColor: '#2196F3',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     Print Invoice
//                 </button>
//             </div>

//             <div
//                 ref={invoiceRef}
//                 style={{
//                     fontFamily: 'Arial, sans-serif',
//                     width: '210mm',
//                     minHeight: '148mm',
//                     margin: '0 auto',
//                     padding: '10mm',
//                     border: '1px solid #000',
//                     fontSize: '12px',
//                     backgroundColor: 'white',
//                     boxSizing: 'border-box'
//                 }}
//             >
//                 <h1 style={{ textAlign: 'center', margin: '3px 0', fontSize: '16px' }}>SALES INVOICE</h1>

//                 <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '11px' }}>
//                     <div>{timeString}</div>
//                     <div>{dateString}</div>
//                 </div>

//                 <div style={{ marginBottom: '10px', fontSize: '11px' }}>
//                     <div style={{ fontWeight: 'bold' }}>{saleData.shopId || "USAMA MOBILE MALL"} {saleData.mobileNumber || "03009634731"}</div>
//                     <div>Add.: {saleData.address || "MALL PLAZA MULTAN"}</div>
//                 </div>

//                 {renderImeiInfo()}

//                 <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px', fontSize: '11px' }}>
//                     <thead>
//                         <tr style={{ borderBottom: '1px solid #000' }}>
//                             <th style={{ textAlign: 'left', padding: '2px' }}>Sr. #</th>
//                             <th style={{ textAlign: 'left', padding: '2px' }}>Description</th>
//                             <th style={{ textAlign: 'right', padding: '2px' }}>Price</th>
//                             <th style={{ textAlign: 'center', padding: '2px' }}>Qty.</th>
//                             <th style={{ textAlign: 'right', padding: '2px' }}>Net Amount</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {saleData.accessories?.map((item, index) => (
//                             <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
//                                 <td style={{ padding: '2px' }}>{index + 1}</td>
//                                 <td style={{ padding: '2px' }}>{item.name || saleData.modelName || "PHONE"}</td>
//                                 <td style={{ textAlign: 'right', padding: '2px' }}>{formatNumber(item.price)}</td>
//                                 <td style={{ textAlign: 'center', padding: '2px' }}>{item.quantity}</td>
//                                 <td style={{ textAlign: 'right', padding: '2px' }}>{formatNumber(item.price * item.quantity)}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <div style={{ margin: '8px 0', textAlign: 'center', fontWeight: 'bold', fontSize: '11px' }}>
//                     {numberToWords(Math.floor(totalAmount / 1000))} THOUSAND
//                 </div>

//                 <div style={{ marginBottom: '10px', fontStyle: 'italic', textAlign: 'center', fontSize: '9px' }}>
//                     تومانا نون چین کمپتی گی بارنش سی مرگ دبی کمپتی دهه دار هر گی دوگانه‌دار وارستی کلیم زنجی که پوچید حجمی هرگز استعمال شده جانبه اور ریفریش سبب کی گونی کارنش تغییر.
//                 </div>

//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '11px' }}>
//                     <div>Issued By ______</div>
//                     <div>Checked By ______</div>
//                 </div>

//                 <div style={{ borderTop: '1px dashed #000', paddingTop: '3px', marginBottom: '3px', fontSize: '11px' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <span>Total Invoice Amount:</span>
//                         <span>{formatNumber(totalAmount)}</span>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <span>Previous Balance:</span>
//                         <span>{formatNumber(saleData.previousBalance || 0)}</span>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
//                         <span>Inv. Amt+Prev. Bal.:</span>
//                         <span>{formatNumber(totalAmount + (saleData.previousBalance || 0))}</span>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <span>Cash Rec.:</span>
//                         <span>{formatNumber(saleData.cashReceived || 0)}</span>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
//                         <span>Net Balance Amount:</span>
//                         <span>{formatNumber((totalAmount + (saleData.previousBalance || 0)) - (saleData.cashReceived || 0))}</span>
//                     </div>
//                 </div>

//                 <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '9px' }}>
//                     Thank you for your business!
//                 </div>
//             </div>
//         </div>
//     );
// };
// import React, { useRef } from 'react';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

// export const InvoiceComponent = ({ saleData, display = true }) => {
//   const invoiceRef = useRef();

//   if (!display) {
//     return null;
//   }

//   // Format number with commas
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return '0.00';
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//   };

//   // Convert number to words
//   const numberToWords = (num) => {
//     const single = [
//       '',
//       'ONE',
//       'TWO',
//       'THREE',
//       'FOUR',
//       'FIVE',
//       'SIX',
//       'SEVEN',
//       'EIGHT',
//       'NINE',
//     ];
//     const double = [
//       'TEN',
//       'ELEVEN',
//       'TWELVE',
//       'THIRTEEN',
//       'FOURTEEN',
//       'FIFTEEN',
//       'SIXTEEN',
//       'SEVENTEEN',
//       'EIGHTEEN',
//       'NINETEEN',
//     ];
//     const tens = [
//       '',
//       '',
//       'TWENTY',
//       'THIRTY',
//       'FORTY',
//       'FIFTY',
//       'SIXTY',
//       'SEVENTY',
//       'EIGHTY',
//       'NINETY',
//     ];

//     if (num === 0) return 'ZERO';

//     let words = '';
//     if (num >= 100000) {
//       const lakh = Math.floor(num / 100000);
//       words += single[lakh] + ' LAKH ';
//       num %= 100000;
//     }

//     if (num >= 1000) {
//       const thousand = Math.floor(num / 1000);
//       if (thousand < 20) {
//         words +=
//           (thousand < 10 ? single[thousand] : double[thousand - 10]) +
//           ' THOUSAND ';
//       } else {
//         const ten = Math.floor(thousand / 10);
//         const unit = thousand % 10;
//         words += tens[ten] + ' ' + single[unit] + ' THOUSAND ';
//       }
//       num %= 1000;
//     }

//     if (num > 0) {
//       if (num < 10) {
//         words += single[num];
//       } else if (num < 20) {
//         words += double[num - 10];
//       } else {
//         const ten = Math.floor(num / 10);
//         const unit = num % 10;
//         words += tens[ten] + ' ' + single[unit];
//       }
//     }

//     return words.trim();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return `${date.getFullYear().toString().substr(-2)}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
//   };

//   // Get total amount based on data structure
//   const getTotalAmount = () => {
//     if (saleData?.accessories?.length > 0) {
//       return saleData.accessories.reduce(
//         (sum, item) => sum + Number(item.price) * Number(item.quantity),
//         0
//       );
//     }
//     return saleData?.finalPrice || saleData?.price?.finalPrice || 0;
//   };

//   const totalAmount = getTotalAmount();

//   // Function to handle PDF download
//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current) return;

//     try {
//       const canvas = await html2canvas(invoiceRef.current, {
//         scale: 2,
//         logging: false,
//         useCORS: true,
//         allowTaint: true,
//         width: 148,
//         height: 210,
//       });

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a5',
//       });

//       pdf.addImage(canvas, 'PNG', 0, 0, 148, 210);
//       pdf.save(`invoice_${saleData.customerName || 'customer'}.pdf`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     }
//   };

//   // Function to handle printing
//   const handlePrint = () => {
//     const printContent = invoiceRef.current.innerHTML;
//     const originalContent = document.body.innerHTML;

//     document.body.innerHTML = `
//             <div style="width:210mm;height:148mm;padding:10mm;font-family:Arial;font-size:12px">
//                 ${printContent}
//             </div>
//         `;
//     window.print();
//     document.body.innerHTML = originalContent;
//   };

//   // Function to render IMEI information based on data structure
//   const renderImeiInfo = () => {
//     if (saleData?.addedImeis?.length > 0) {
//       return (
//         <div style={{ margin: '5px 0', fontSize: '10px' }}>
//           {saleData.addedImeis.join(', ')}
//         </div>
//       );
//     } else if (saleData?.imei1) {
//       return (
//         <div style={{ margin: '5px 0', fontSize: '10px' }}>
//           {saleData.imei1}
//           {saleData.imei2 && `, ${saleData.imei2}`}
//         </div>
//       );
//     } else if (saleData?.ramSimDetails?.length > 0) {
//       const imeis = [];
//       saleData.ramSimDetails.forEach((detail) => {
//         detail.imeiNumbers.forEach((imei) => {
//           imeis.push(imei.imei1);
//         });
//       });
//       return (
//         <div style={{ margin: '5px 0', fontSize: '10px' }}>
//           {imeis.join(', ')}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Get model name based on data structure
//   const getModelName = () => {
//     if (saleData?.modelName) return saleData.modelName;
//     if (saleData?.ramSimDetails?.length > 0) {
//       return saleData.ramSimDetails.map((d) => d.modelName).join(' / ');
//     }
//     return 'PHONE';
//   };

//   // Get brand/company name based on data structure
//   const getBrandName = () => {
//     if (saleData?.companyName) return saleData.companyName;
//     if (saleData?.ramSimDetails?.length > 0) {
//       return saleData.ramSimDetails.map((d) => d.companyName).join(' / ');
//     }
//     return 'BRAND';
//   };

//   return (
//     <div
//       style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
//     >
//       <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
//         <button
//           onClick={handleDownloadPDF}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           Download PDF
//         </button>
//         <button
//           onClick={handlePrint}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#2196F3',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           Print Invoice
//         </button>
//       </div>

//       <div
//         ref={invoiceRef}
//         style={{
//           fontFamily: 'Arial, sans-serif',
//           width: '210mm',
//           minHeight: '148mm',
//           margin: '0 auto',
//           padding: '10mm',
//           border: '1px solid #000',
//           fontSize: '12px',
//           backgroundColor: 'white',
//           boxSizing: 'border-box',
//         }}
//       >
//         <h1
//           style={{
//             textAlign: 'center',
//             margin: '3px 0',
//             fontSize: '16px',
//             fontWeight: 'bold',
//           }}
//         >
//           MEGA MAIL MOBILE
//         </h1>

//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             marginBottom: '10px',
//             fontSize: '11px',
//           }}
//         >
//           <div>
//             <strong>Date :</strong>{' '}
//             {formatDate(saleData.date || saleData.saleDate)}
//           </div>
//           <div>
//             <strong>Invoice #</strong> {saleData._id?.substr(-4) || '0000'}
//           </div>
//         </div>

//         <div style={{ marginBottom: '10px', fontSize: '11px' }}>
//           <div>
//             <strong>Party Code:</strong>{' '}
//             {saleData.partyLedgerId?.substr(-6) || '000000'}
//           </div>
//           <div>
//             <strong>Party Name:</strong>{' '}
//             {saleData.partyName || saleData.customerName || 'CUSTOMER'}
//           </div>
//         </div>

//         <table
//           style={{
//             width: '100%',
//             borderCollapse: 'collapse',
//             marginBottom: '8px',
//             fontSize: '11px',
//           }}
//         >
//           <thead>
//             <tr style={{ borderBottom: '1px solid #000' }}>
//               <th style={{ textAlign: 'left', padding: '2px' }}>Model No</th>
//               <th style={{ textAlign: 'left', padding: '2px' }}>Brand</th>
//               <th style={{ textAlign: 'right', padding: '2px' }}>Wruty</th>
//               <th style={{ textAlign: 'right', padding: '2px' }}>Inv. Price</th>
//               <th style={{ textAlign: 'right', padding: '2px' }}>Dis. Rs</th>
//               <th style={{ textAlign: 'right', padding: '2px' }}>Net Price</th>
//               <th style={{ textAlign: 'center', padding: '2px' }}>QV</th>
//               <th style={{ textAlign: 'right', padding: '2px' }}>
//                 Total Amount
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr style={{ borderBottom: '1px solid #ddd' }}>
//               <td style={{ padding: '2px' }}>{getModelName()}</td>
//               <td style={{ padding: '2px' }}>{getBrandName()}</td>
//               <td style={{ textAlign: 'right', padding: '2px' }}>
//                 {formatNumber(totalAmount)}
//               </td>
//               <td style={{ textAlign: 'right', padding: '2px' }}>.00</td>
//               <td style={{ textAlign: 'right', padding: '2px' }}>.00</td>
//               <td style={{ textAlign: 'right', padding: '2px' }}>
//                 {formatNumber(totalAmount)}
//               </td>
//               <td style={{ textAlign: 'center', padding: '2px' }}>1</td>
//               <td style={{ textAlign: 'right', padding: '2px' }}>
//                 {formatNumber(totalAmount)}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {renderImeiInfo()}

//         <div
//           style={{
//             margin: '8px 0',
//             textAlign: 'center',
//             fontWeight: 'bold',
//             fontSize: '11px',
//             textTransform: 'uppercase',
//           }}
//         >
//           {numberToWords(Math.floor(totalAmount))}
//         </div>

//         <div
//           style={{ marginBottom: '10px', textAlign: 'center', fontSize: '9px' }}
//         >
//           <strong>Company Will be responsible for all warranty sets.</strong>
//         </div>

//         <div
//           style={{
//             borderTop: '1px dashed #000',
//             margin: '10px 0',
//             paddingTop: '5px',
//           }}
//         >
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               fontSize: '11px',
//             }}
//           >
//             <div>Checked By:......</div>
//             <div>Issued By</div>
//           </div>
//         </div>

//         <div style={{ marginBottom: '10px', fontSize: '11px' }}>
//           <div>
//             <strong>Address Cell #:-</strong>
//           </div>
//         </div>

//         <table
//           style={{
//             width: '100%',
//             borderCollapse: 'collapse',
//             marginBottom: '8px',
//             fontSize: '11px',
//           }}
//         >
//           <tbody>
//             <tr>
//               <td style={{ padding: '2px' }}>QV</td>
//               <td style={{ padding: '2px', textAlign: 'right' }}>
//                 Total Amount
//               </td>
//             </tr>
//             <tr>
//               <td style={{ padding: '2px' }}>Net Price</td>
//               <td style={{ padding: '2px', textAlign: 'right' }}>
//                 {formatNumber(totalAmount)}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ padding: '2px' }}>Total : 1</td>
//               <td style={{ padding: '2px', textAlign: 'right' }}>
//                 {formatNumber(totalAmount)}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <div style={{ marginTop: '10px', fontSize: '11px' }}>
//           <div>
//             <strong>Amount With Tax</strong>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <span>Previous Bal :</span>
//             <span>{formatNumber(saleData.previousBalance || '0.00')}</span>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <span>Gross Total :</span>
//             <span>{formatNumber(totalAmount)}</span>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <span>Cash Rec. :</span>
//             <span>{formatNumber(saleData.cashReceived || '0.00')}</span>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <span>Net Balance :</span>
//             <span>
//               {formatNumber(totalAmount - (saleData.cashReceived || 0))}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const InvoiceComponent = ({
  saleData,
  display = true,
  shopName = '',
}) => {
  const invoiceRef = useRef();

  if (!display) {
    return null;
  }

  // Format number with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0.00';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Improved number to words conversion
  const numberToWords = (num) => {
    if (isNaN(num) || num === 0) return 'ZERO';

    const single = [
      '',
      'ONE',
      'TWO',
      'THREE',
      'FOUR',
      'FIVE',
      'SIX',
      'SEVEN',
      'EIGHT',
      'NINE',
    ];
    const double = [
      'TEN',
      'ELEVEN',
      'TWELVE',
      'THIRTEEN',
      'FOURTEEN',
      'FIFTEEN',
      'SIXTEEN',
      'SEVENTEEN',
      'EIGHTEEN',
      'NINETEEN',
    ];
    const tens = [
      '',
      '',
      'TWENTY',
      'THIRTY',
      'FORTY',
      'FIFTY',
      'SIXTY',
      'SEVENTY',
      'EIGHTY',
      'NINETY',
    ];

    num = Math.floor(num);
    let words = '';

    if (num >= 10000000) {
      const crore = Math.floor(num / 10000000);
      words += numberToWords(crore) + ' CRORE ';
      num %= 10000000;
    }

    if (num >= 100000) {
      const lakh = Math.floor(num / 100000);
      words += numberToWords(lakh) + ' LAKH ';
      num %= 100000;
    }

    if (num >= 1000) {
      const thousand = Math.floor(num / 1000);
      words += numberToWords(thousand) + ' THOUSAND ';
      num %= 1000;
    }

    if (num >= 100) {
      const hundred = Math.floor(num / 100);
      words += single[hundred] + ' HUNDRED ';
      num %= 100;
    }

    if (num > 0) {
      if (num < 10) {
        words += single[num];
      } else if (num < 20) {
        words += double[num - 10];
      } else {
        const ten = Math.floor(num / 10);
        const unit = num % 10;
        words += tens[ten] + ' ' + single[unit];
      }
    }

    return words.trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear().toString().substr(-2)}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  // Get total amount based on data structure
  const getTotalAmount = () => {
    if (saleData?.accessories?.length > 0) {
      return saleData.accessories.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );
    }
    return (
      saleData?.finalPrice ||
      saleData?.price?.finalPrice ||
      saleData?.price ||
      0
    );
  };

  const totalAmount = getTotalAmount();

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 148,
        height: 210,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });

      pdf.addImage(canvas, 'PNG', 0, 0, 148, 210);
      pdf.save(`invoice_${saleData.customerName || 'customer'}.pdf`);
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

  // Function to render IMEI information based on data structure
  const renderImeiInfo = () => {
    if (saleData?.addedImeis?.length > 0) {
      return (
        <div style={{ margin: '5px 0', fontSize: '10px' }}>
          {saleData.addedImeis.join(', ')}
        </div>
      );
    } else if (saleData?.imei1) {
      return (
        <div style={{ margin: '5px 0', fontSize: '10px' }}>
          {saleData.imei1}
          {saleData.imei2 && `, ${saleData.imei2}`}
        </div>
      );
    } else if (saleData?.ramSimDetails?.length > 0) {
      const imeis = [];
      saleData.ramSimDetails.forEach((detail) => {
        detail.imeiNumbers.forEach((imei) => {
          imeis.push(imei.imei1);
        });
      });
      return (
        <div style={{ margin: '5px 0', fontSize: '10px' }}>
          {imeis.join(', ')}
        </div>
      );
    }
    return null;
  };

  // Get model name based on data structure
  const getModelName = () => {
    if (saleData?.modelName) return saleData.modelName;
    if (saleData?.ramSimDetails?.length > 0) {
      return saleData.ramSimDetails.map((d) => d.modelName).join(' / ');
    }
    return 'PHONE';
  };

  // Get brand/company name based on data structure
  const getBrandName = () => {
    if (saleData?.companyName) return saleData.companyName;
    if (saleData?.ramSimDetails?.length > 0) {
      return saleData.ramSimDetails.map((d) => d.companyName).join(' / ');
    }
    return 'BRAND';
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          margin: '10px 0',
          color: '#000',
        }}
      >
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
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
            cursor: 'pointer',
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
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            margin: '3px 0',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {shopName || ''}
        </h1>

        <div
          style={{
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '11px',
          }}
        >
          <div>
            <strong>Date :</strong>{' '}
            {formatDate(saleData.date || saleData.saleDate)}
          </div>
          <div>
            <strong>Invoice #</strong> {saleData._id?.substr(-4) || '0000'}
          </div>
        </div>

        <div style={{ marginBottom: '10px', fontSize: '11px', color: '#000' }}>
          <div>
            <strong style={{ color: '#000' }}>Party Code:</strong>{' '}
            {saleData.partyLedgerId?.substr(-6) || '000000'}
          </div>
          <div>
            <strong>Party Name:</strong>{' '}
            {saleData.partyName || saleData.customerName || 'CUSTOMER'}
          </div>
        </div>

        <table
          style={{
            color: '#000',
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px',
            border: '1px solid #000',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid #000' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                Model No
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                Brand
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                Wrnty
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                Inv. Price
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                Dis. Rs
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                Net Price
              </th>
              <th
                style={{
                  textAlign: 'center',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                QV
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '2px', border: '1px solid #000' }}>
                {getModelName()}
              </td>
              <td style={{ padding: '2px', border: '1px solid #000' }}>
                {getBrandName()}
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                {formatNumber(totalAmount)}
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                .00
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                .00
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                {formatNumber(totalAmount)}
              </td>
              <td
                style={{
                  textAlign: 'center',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                1
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '2px',
                  border: '1px solid #000',
                }}
              >
                {formatNumber(totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ border: '1px solid #000', color: '#000' }}>
          {renderImeiInfo()}
        </div>

        <div
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: '11px',
            border: '1px solid #000',
            textTransform: 'uppercase',
          }}
        >
          {numberToWords(totalAmount)}
        </div>

        <div style={{ color: '#000', marginBottom: '10px', fontSize: '9px' }}>
          <strong>Company Will be responsible for all warranty sets.</strong>
        </div>
        {/* 
        <div style={{ marginBottom: '10px', fontSize: '11px' }}>
          <div>
            <strong>Address Cell #:-</strong>
          </div>
        </div> */}

        {/* <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '8px',
            fontSize: '11px',
            border: '1px solid #000',
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: '2px', border: '1px solid #000' }}>QV</td>
              <td
                style={{
                  padding: '2px',
                  textAlign: 'right',
                  border: '1px solid #000',
                }}
              >
                Total Amount
              </td>
            </tr>
            <tr>
              <td style={{ padding: '2px', border: '1px solid #000' }}>
                Net Price
              </td>
              <td
                style={{
                  padding: '2px',
                  textAlign: 'right',
                  border: '1px solid #000',
                }}
              >
                {formatNumber(totalAmount)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '2px', border: '1px solid #000' }}>
                Total : 1
              </td>
              <td
                style={{
                  padding: '2px',
                  textAlign: 'right',
                  border: '1px solid #000',
                }}
              >
                {formatNumber(totalAmount)}
              </td>
            </tr>
          </tbody>
        </table> */}

        <div
          style={{
            color: '#000',
            marginTop: '10px',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'right',
          }}
        >
          <div>
            <strong>Amount With Tax</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <span>Previous Bal :</span>
            <span>{formatNumber(saleData.previousBalance || '0.00')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <span>Gross Total :</span>
            <span>{formatNumber(totalAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <span>Cash Rec. :</span>
            <span>{formatNumber(saleData.cashReceived || '0.00')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <span>Net Balance :</span>
            <span>
              {formatNumber(totalAmount - (saleData.cashReceived || 0))}
            </span>
          </div>
        </div>

        <div
          style={{
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
            fontSize: '11px',
            paddingTop: '5px',
          }}
        >
          <div>Checked By:______</div>
          <div>Issued By:______</div>
        </div>
      </div>
    </div>
  );
};
