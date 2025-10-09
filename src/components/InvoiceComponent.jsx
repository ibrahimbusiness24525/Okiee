// import React, { useRef } from 'react';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

// export const InvoiceComponent = ({
//   accessoriesData = {},
//   saleData,
//   companyName = '',
//   modelName = '',
//   warranty = '',
//   display = true,
//   shopName = '',
//   color = '',
//   simOption = '',
//   address = '',
//   number = '',
//   batteryHealth = '',
//   type = '',
//   ramMemory = '',
//   invoiceNumber = '',
//   termsAndConditions = [],
// }) => {
//   const invoiceRef = useRef();
//   if (!display) {
//     return null;
//   }

//   // Format number with commas
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return '0.00';
//     const number = typeof num === 'string' ? parseFloat(num) : num;
//     return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//   };

//   // Improved number to words conversion
//   const numberToWords = (num) => {
//     if (isNaN(num) || num === 0) return 'ZERO';

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

//     num = Math.floor(num);
//     let words = '';

//     if (num >= 10000000) {
//       const crore = Math.floor(num / 10000000);
//       words += numberToWords(crore) + ' CRORE ';
//       num %= 10000000;
//     }

//     if (num >= 100000) {
//       const lakh = Math.floor(num / 100000);
//       words += numberToWords(lakh) + ' LAKH ';
//       num %= 100000;
//     }

//     if (num >= 1000) {
//       const thousand = Math.floor(num / 1000);
//       words += numberToWords(thousand) + ' THOUSAND ';
//       num %= 1000;
//     }

//     if (num >= 100) {
//       const hundred = Math.floor(num / 100);
//       words += single[hundred] + ' HUNDRED ';
//       num %= 100;
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
//     return (
//       saleData?.finalPrice ||
//       saleData?.price?.finalPrice ||
//       saleData?.price ||
//       0
//     );
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
//     if (
//       saleData?.addedImeis?.length > 0 ||
//       saleData?.writtenImeis?.length > 0
//     ) {
//       return (
//         <div style={{ margin: '5px 0', fontSize: '12px' }}>
//           {saleData.addedImeis.join(', ') || saleData?.writtenImeis.join(', ')}
//         </div>
//       );
//     } else if (saleData?.imei1) {
//       return (
//         <div style={{ margin: '5px 0', fontSize: '12px' }}>
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
//         <div style={{ margin: '5px 0', fontSize: '12px' }}>
//           {imeis.join(', ')}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Get model name based on data structure
//   const getModelName = () => {
//     if (modelName) return modelName;
//     if (saleData?.ramSimDetails?.length > 0) {
//       return saleData.ramSimDetails.map((d) => d.modelName).join(' / ');
//     }
//     return 'PHONE';
//   };

//   // Get brand/company name based on data structure
//   const getBrandName = () => {
//     if (companyName) return companyName;
//     if (saleData?.ramSimDetails?.length > 0) {
//       return saleData.ramSimDetails.map((d) => d.companyName).join(' / ');
//     }
//     return 'BRAND';
//   };
//   const styles = {
//     container: {
//       width: '210mm',
//       minHeight: 'auto',
//       margin: '30px auto',
//       padding: '30px',
//       background: '#f9f9f9',
//       borderRadius: '15px',
//       boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//       fontFamily: "'Poppins', sans-serif",
//       color: '#333',
//       boxSizing: 'border-box',
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '40px',
//       paddingBottom: '1px',
//       borderBottom: `3px solid  #000`,
//       color: `#000`,
//     },
//     logo: {
//       fontSize: '28px',
//       fontWeight: 'bold',
//       color: `#000`,
//       letterSpacing: '1px',
//     },
//     infoSection: {
//       marginBottom: '25px',
//       padding: '20px',
//       background: '#fff',
//       borderRadius: '10px',
//       boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       marginBottom: '30px',
//     },
//     th: {
//       padding: '15px',
//       backgroundColor: `#000`,
//       color: '#fff',
//       textAlign: 'center',
//       fontWeight: 'bold',
//     },
//     td: {
//       padding: '12px',
//       textAlign: 'center',
//       backgroundColor: '#fafafa',
//       borderBottom: '1px solid #eee',
//       color: '#333',
//     },
//     stripedRow: {
//       backgroundColor: '#f4f4f4',
//     },
//     totalSection: {
//       padding: '20px',
//       background: '#fff',
//       borderRadius: '10px',
//       boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
//       textAlign: 'right',
//       fontSize: '20px',
//       fontWeight: 'bold',
//       color: `#000`,
//     },
//     button: {
//       margin: '10px',
//       padding: '12px 30px',
//       cursor: 'pointer',
//       border: 'none',
//       borderRadius: '8px',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       transition: 'all 0.3s ease',
//     },
//     printBtn: {
//       backgroundColor: '#28a745',
//       color: '#fff',
//     },
//     downloadBtn: {
//       backgroundColor: '#007bff',
//       color: '#fff',
//     },
//     submitBtn: {
//       backgroundColor: '#ffc107',
//       color: '#fff',
//     },
//     buttonHover: {
//       transform: 'translateY(-2px)',
//       boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//     },
//     footer: {
//       marginTop: '15px',
//       paddingTop: '10px',
//       borderTop: `3px solid  #000`,
//       textAlign: 'center',
//       fontSize: '14px',
//       color: '#666',
//     },
//     termsSection: {
//       width: '100%',
//       background: '#fff',
//       borderRadius: '10px',
//       // boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
//       color: '#333',
//     },
//     termsHeading: {
//       fontSize: '15px',
//       fontWeight: 'bold',
//       marginBottom: '10px',
//       color: `#000`,
//     },
//     termsText: {
//       fontSize: '5px',
//     },
//   };
//   console.log('terms and ..', termsAndConditions);

//   return (
//     <div
//       style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
//     >
//       <div
//         style={{
//           width: '100%',
//           display: 'flex',
//           justifyContent: 'flex-end',
//           gap: '10px',
//           margin: '10px 0',
//           color: '#000',
//         }}
//       >
//         <button
//           onClick={handleDownloadPDF}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '14px',
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
//             fontSize: '14px',
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
//           fontSize: '14px',
//           backgroundColor: 'white',
//           boxSizing: 'border-box',
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             borderBottom: '2px solid #000',
//             marginBottom: '15px',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}>
//           <div
//             style={{

//             }}
//           >
//             <h1
//               style={{
//                 textAlign: 'center',
//                 margin: '5px 0',
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//                 textTransform: 'uppercase',
//               }}
//             >
//               {shopName || 'Mobile Shop'}
//             </h1>
//             <div
//               style={{
//                 display: 'flex',
//                 width: '100%',
//                 alignItems: 'center',
//               }}
//             >
//               <h1
//                 style={{
//                   textAlign: 'center',
//                   margin: '5px 0',
//                   fontSize: '14px',
//                   fontWeight: 'normal',
//                 }}
//               >
//                 {address || 'Mobile Shop address'},
//               </h1>
//               <h1
//                 style={{
//                   textAlign: 'center',
//                   margin: '5px 0',
//                   fontSize: '14px',
//                   fontWeight: 'normal',
//                 }}
//               >
//                 {number || 'Mobile Shop number'}
//               </h1>
//             </div>

//           </div>
//           <h1
//             style={{
//               textAlign: 'center',
//               margin: '5px 0',
//               fontSize: '34px',
//               fontWeight: 'bold',
//               textTransform: 'uppercase',
//             }}
//           >
//             Okiiee
//           </h1>
//         </div>
//         <div
//           style={{
//             color: '#000',
//             display: 'flex',
//             justifyContent: 'space-between',
//             marginBottom: '15px',
//             fontSize: '14px',
//           }}
//         >
//           <div>
//             <strong>Date :</strong>{' '}
//             {formatDate(saleData.date || saleData.saleDate)}
//           </div>
//           <div>
//             <strong>Invoice #</strong> {invoiceNumber || '0000'}
//           </div>
//         </div>

//         <div style={{ marginBottom: '15px', fontSize: '14px', color: '#000' }}>
//           <div>
//             <strong style={
//               { fontWeight: 'bold', color: '#000' }
//             }>Customer Name:</strong>{' '}
//             {saleData.partyName || saleData.customerName || 'CUSTOMER'}
//           </div>
//           <div>
//             <strong style={
//               { fontWeight: 'bold', color: '#000' }
//             }>Customer Number:</strong>{' '}
//             {saleData.partyLedgerId?.substr(-6) ||
//               saleData?.customerNumber ||
//               '000000'}
//           </div>
//         </div>

//         <table
//           style={{
//             color: '#000',
//             width: '100%',
//             borderCollapse: 'collapse',
//             fontSize: '14px',
//             border: '1px solid #000',
//           }}
//         >
//           <thead>
//             <tr style={{ borderBottom: '1px solid #000' }}>
//               <th
//                 style={{
//                   textAlign: 'left',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 Model No
//               </th>
//               <th
//                 style={{
//                   textAlign: 'left',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 Brand
//               </th>
//               {color && (
//                 <th
//                   style={{
//                     textAlign: 'left',
//                     padding: '5px',

//                     border: '1px solid #000',
//                   }}
//                 >
//                   Color
//                 </th>
//               )
//               }
//               {simOption && (
//                 <th
//                   style={{
//                     textAlign: 'left',
//                     padding: '5px',

//                     border: '1px solid #000',
//                   }}
//                 >
//                   simOption
//                 </th>
//               )
//               }
//               {ramMemory && (
//                 <th
//                   style={{
//                     textAlign: 'left',
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   Ram Memory
//                 </th>
//               )}
//               {batteryHealth && (
//                 <th
//                   style={{
//                     textAlign: 'left',
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   Battery Health
//                 </th>
//               )}
//               {type && (
//                 <th
//                   style={{
//                     textAlign: 'left',
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   Type
//                 </th>
//               )}
//               {
//                 warranty && (
//                   <th
//                     style={{
//                       textAlign: 'right',
//                       padding: '5px',
//                       border: '1px solid #000',
//                     }}
//                   >
//                     Wrnty
//                   </th>
//                 )
//               }
//               <th
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 Inv. Price
//               </th>
//               {/* <th
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 Dis. Rs
//               </th>
//               <th
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 Net Price
//               </th> */}
//               <th
//                 style={{
//                   textAlign: 'center',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 QV
//               </th>
//               <th
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 Total Amount
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td style={{ padding: '5px', border: '1px solid #000' }}>
//                 {getModelName()}
//               </td>
//               <td style={{ padding: '5px', border: '1px solid #000' }}>
//                 {getBrandName()}
//               </td>
//               {color && (
//                 <td
//                   style={{
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   {color}
//                 </td>
//               )
//               }
//               {simOption && (
//                 <td
//                   style={{
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   {simOption}
//                 </td>
//               )
//               }
//               {ramMemory && (
//                 <td
//                   style={{
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   {ramMemory}
//                 </td>
//               )}
//               {batteryHealth && (
//                 <td
//                   style={{
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   {batteryHealth}
//                 </td>
//               )}
//               {type && (
//                 <td
//                   style={{
//                     padding: '5px',
//                     border: '1px solid #000',
//                   }}
//                 >
//                   {type}
//                 </td>
//               )}
//               {warranty &&
//                 (
//                   <td
//                     style={{
//                       textAlign: 'right',
//                       padding: '5px',
//                       border: '1px solid #000',
//                     }}
//                   >
//                     {warranty}
//                   </td>
//                 )}
//               <td
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 {formatNumber(totalAmount)}
//               </td>
//               {/* <td
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 .00
//               </td>
//               <td
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 {formatNumber(totalAmount)}
//               </td> */}
//               <td
//                 style={{
//                   textAlign: 'center',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 1
//               </td>
//               <td
//                 style={{
//                   textAlign: 'right',
//                   padding: '5px',
//                   border: '1px solid #000',
//                 }}
//               >
//                 {formatNumber(totalAmount)}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <div
//           style={{ border: '1px solid #000', color: '#000', padding: '5px' }}
//         >
//           {renderImeiInfo()}
//         </div>

//         <div
//           style={{
//             color: '#000',
//             fontWeight: 'bold',
//             fontSize: '14px',
//             border: '1px solid #000',
//             textTransform: 'uppercase',
//             padding: '5px',
//             marginBottom: '10px',
//           }}
//         >
//           {numberToWords(totalAmount)}
//         </div>
//         {/*
//         <div style={{ color: '#000', marginBottom: '15px', fontSize: '12px' }}>
//           <strong>Company Will be responsible for all warranty sets.</strong>
//         </div> */}

//         <div
//           style={{
//             color: '#000',
//             marginTop: '15px',
//             fontSize: '14px',
//             display: 'flex',
//             gap: '10px',
//             justifyContent: 'space-between',
//           }}
//         >
//           <div style={styles.termsSection}>
//             {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
//             <div style={styles.termsHeading}>Terms & conditions</div>
//             <div style={{ fontSize: '5px', display: 'flex', flexDirection: 'column' }}>
//               {termsAndConditions.map((item, index) => (
//                 <p key={index}>
//                   <strong
//                     style={{
//                       margin: 0,
//                       fontWeight: '600',
//                       color: '#333',
//                       width: '100%',
//                     }}
//                   >
//                     {index + 1}.
//                   </strong>{' '}
//                   {item}
//                 </p>
//               ))}
//             </div>
//           </div>
//           <div>
//             <div>
//               <strong>Amount With Tax</strong>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'end' }}>
//               <span style={{ width: '120px', textAlign: 'left' }}>
//                 Previous Bal :
//               </span>
//               <span style={{ width: '80px', textAlign: 'right' }}>
//                 {formatNumber(saleData.previousBalance || '0.00')}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'end' }}>
//               <span style={{ width: '120px', textAlign: 'left' }}>
//                 Gross Total :
//               </span>
//               <span style={{ width: '80px', textAlign: 'right' }}>
//                 {formatNumber(totalAmount)}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'end' }}>
//               <span style={{ width: '120px', textAlign: 'left' }}>
//                 Cash Rec. :
//               </span>
//               <span style={{ width: '80px', textAlign: 'right' }}>
//                 {formatNumber(saleData.cashReceived || '0.00')}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'end' }}>
//               <span style={{ width: '120px', textAlign: 'left' }}>
//                 Net Balance :
//               </span>
//               <span style={{ width: '80px', textAlign: 'right' }}>
//                 {formatNumber(totalAmount - (saleData.cashReceived || 0))}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             color: '#000',
//             display: 'flex',
//             justifyContent: 'space-between',
//             marginTop: '30px',
//             fontSize: '14px',
//             paddingTop: '15px',
//           }}
//         >
//           <div>Checked By:______</div>
//           <div>Issued By:______</div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useRef, useEffect, useState } from 'react';
import { api } from '../../api/api';
import { BASE_URL } from 'config/constant';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const InvoiceComponent = ({
  accessoriesData = {},
  saleData,
  imeiPrices = [],
  companyName = '',
  modelName = '',
  warranty = '',
  display = true,
  shopName = '',
  color = '',
  simOption = '',
  address = '',
  number = '',
  batteryHealth = '',
  type = '',
  ramMemory = '',
  invoiceNumber = '',
  termsAndConditions = [],
  dataReceived = {},
}) => {
  const invoiceRef = useRef();
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
      try {
        const res = await api.get('/api/shop/logo');
        if (isMounted && res?.data?.success && res?.data?.logo) {
          const path = String(res.data.logo);
          if (path && path !== '{}' && path !== 'null' && path !== 'undefined') {
            const full = `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
            setLogoUrl(full);
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
    return () => { isMounted = false; };
  }, []);


// Check individual array elements


  // Check if we're dealing with accessories
  const isAccessoryInvoice = accessoriesData?.sales?.length > 0;

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
    if (imeiPrices?.length > 0) {
      return imeiPrices.reduce((sum, item) => sum + Number(item.price || 0), 0);
    }
    if (isAccessoryInvoice) {
      return accessoriesData.sales.reduce(
        (sum, item) => sum + item.perPiecePrice * item.quantity,
        0
      );
    }
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
      saleData?.totalInvoice ||
      0
    );
  };

  const totalAmount = getTotalAmount();

  // Build per-IMEI details if provided (prefer dataReceived.imeiPrices, then imeiPrices prop)
  const sourceImeiPrices = Array.isArray(dataReceived?.imeiPrices) && dataReceived.imeiPrices.length > 0
    ? dataReceived.imeiPrices
    : (Array.isArray(imeiPrices) ? imeiPrices : []);

  // Prefer dataReceived.ramSimDetails; fallback to saleData.ramSimDetails
  const ramSource = (dataReceived?.ramSimDetails || saleData?.ramSimDetails || []);
  const ramImeiIndex = (ramSource)
    .flatMap(r => r?.imeiNumbers || [])
    .reduce((idx, n) => {
      if (n?.imei1) idx[String(n.imei1)] = n;
      return idx;
    }, {});

  // If no IMEI prices but we have array data, create perImeiDetails from arrays
  let perImeiDetails = [];
  
  if (sourceImeiPrices.length > 0) {
    // Use IMEI prices data
    perImeiDetails = sourceImeiPrices.map((item, index) => {
    const imei1 = String(item?.imei ?? '');
    const node = ramImeiIndex?.[imei1];
    
    // Get values from arrays, using index to match IMEI with corresponding attributes
    const getArrayValue = (arr, fallback = 'N/A') => {
      if (Array.isArray(arr) && arr[index] !== undefined && arr[index] !== '') {
        return arr[index];
      }
      return fallback;
    };

    const result = {
      imei: imei1,
      price: Number(item?.price || 0),
      color: (node?.color !== undefined ? node.color : getArrayValue(dataReceived?.color, getArrayValue(color, 'N/A'))),
      simOption: (node?.simOption !== undefined ? node.simOption : getArrayValue(dataReceived?.simOption, getArrayValue(simOption, 'N/A'))),
      batteryHealth: (node?.batteryHealth !== undefined ? node.batteryHealth : getArrayValue(dataReceived?.batteryHealth, getArrayValue(batteryHealth, 'N/A'))),
      warranty: saleData?.warranty ? saleData.warranty : (warranty ? warranty : 'N/A'),
      qv: 1,
      model: (node?.modelName !== undefined ? node.modelName : 
              (dataReceived?.modelName && Array.isArray(dataReceived.modelName) && dataReceived.modelName[index] ? dataReceived.modelName[index] : 
               (Array.isArray(modelName) && modelName[index] ? modelName[index] : 
                (dataReceived?.modelName && !Array.isArray(dataReceived.modelName) ? dataReceived.modelName :
                 (modelName && !Array.isArray(modelName) ? modelName : 'PHONE')))) || 'PHONE'),
      brand: (node?.companyName !== undefined ? node.companyName : 
              (dataReceived?.companyName && Array.isArray(dataReceived.companyName) && dataReceived.companyName[index] ? dataReceived.companyName[index] : 
               (Array.isArray(companyName) && companyName[index] ? companyName[index] : 
                (dataReceived?.companyName && !Array.isArray(dataReceived.companyName) ? dataReceived.companyName :
                 (companyName && !Array.isArray(companyName) ? companyName : 'BRAND')))) || 'BRAND'),
    };

 
    return result;
  });
  } else {
    // Fallback: create perImeiDetails from array data if available
    
    const maxLength = Math.max(
      Array.isArray(modelName) ? modelName.length : 0,
      Array.isArray(companyName) ? companyName.length : 0,
      Array.isArray(color) ? color.length : 0,
      Array.isArray(batteryHealth) ? batteryHealth.length : 0,
      Array.isArray(simOption) ? simOption.length : 0,
      Array.isArray(ramMemory) ? ramMemory.length : 0
    );



    if (maxLength > 0) {
      perImeiDetails = Array.from({ length: maxLength }, (_, index) => {
        const getArrayValue = (arr, fallback = 'N/A') => {
          if (Array.isArray(arr) && arr[index] !== undefined && arr[index] !== '') {
            return arr[index];
          }
          return fallback;
        };



        const result = {
          imei: `IMEI-${index + 1}`,
          price: totalAmount / maxLength, // Distribute total amount equally
          color: getArrayValue(dataReceived?.color, getArrayValue(color, 'N/A')),
          simOption: getArrayValue(dataReceived?.simOption, getArrayValue(simOption, 'N/A')),
          batteryHealth: getArrayValue(dataReceived?.batteryHealth, getArrayValue(batteryHealth, 'N/A')),
          warranty: saleData?.warranty ? saleData.warranty : (warranty ? warranty : 'N/A'),
          qv: 1,
          model: (dataReceived?.modelName && Array.isArray(dataReceived.modelName) && dataReceived.modelName[index] ? dataReceived.modelName[index] : 
                  (Array.isArray(modelName) && modelName[index] ? modelName[index] : 
                   (dataReceived?.modelName && !Array.isArray(dataReceived.modelName) ? dataReceived.modelName :
                    (modelName && !Array.isArray(modelName) ? modelName : 'PHONE')))),
          brand: (dataReceived?.companyName && Array.isArray(dataReceived.companyName) && dataReceived.companyName[index] ? dataReceived.companyName[index] : 
                  (Array.isArray(companyName) && companyName[index] ? companyName[index] : 
                   (dataReceived?.companyName && !Array.isArray(dataReceived.companyName) ? dataReceived.companyName :
                    (companyName && !Array.isArray(companyName) ? companyName : 'BRAND')))),
        };

        console.log(`Fallback IMEI ${index + 1} details:`, result);
        return result;
      });
    } else {
      console.log('No array data found for fallback - maxLength is 0');
    }
  }

  const perImeiTotal = perImeiDetails.reduce((sum, x) => sum + Number(x.price || 0), 0);

  // Debug logging for perImeiDetails
  console.log('perImeiDetails:', perImeiDetails);
  console.log('perImeiDetails.length:', perImeiDetails.length);
  console.log('sourceImeiPrices:', sourceImeiPrices);

  // Decide which attribute columns to show based on availability across IMEIs
  const showColorCol = perImeiDetails.some(x => x.color && x.color !== 'N/A');
  const showSimCol = perImeiDetails.some(x => x.simOption && x.simOption !== 'N/A');
  const showBatteryCol = perImeiDetails.some(x => x.batteryHealth && x.batteryHealth !== 'N/A');
  const showWarrantyCol = perImeiDetails.some(x => x.warranty && x.warranty !== 'N/A');

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
      pdf.save(
        `invoice_${isAccessoryInvoice ? 'accessory' : saleData?.customerName || 'customer'}.pdf`
      );
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

  // Function to render accessory items
  const renderAccessoryItems = () => {
    if (!isAccessoryInvoice) return null;

    return (
      <table
        style={{
          color: '#000',
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          border: '1px solid #000',
          marginBottom: '10px',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #000' }}>
            <th
              style={{
                textAlign: 'left',
                padding: '5px',
                border: '1px solid #000',
              }}
            >
              Accessory
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '5px',
                border: '1px solid #000',
              }}
            >
              Price
            </th>
            <th
              style={{
                textAlign: 'center',
                padding: '5px',
                border: '1px solid #000',
              }}
            >
              Qty
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '5px',
                border: '1px solid #000',
              }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {accessoriesData.sales.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '5px', border: '1px solid #000' }}>
                {item.name || 'Accessory'}
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '5px',
                  border: '1px solid #000',
                }}
              >
                {formatNumber(item.perPiecePrice)}
              </td>
              <td
                style={{
                  textAlign: 'center',
                  padding: '5px',
                  border: '1px solid #000',
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '5px',
                  border: '1px solid #000',
                }}
              >
                {formatNumber(item.perPiecePrice * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Function to render payment summary for accessories
  const renderAccessoryPaymentSummary = () => {
    if (!isAccessoryInvoice) return null;

    return (
      <div style={{ marginTop: '15px', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal:</span>
          <span>{formatNumber(totalAmount)}</span>
        </div>
        {accessoriesData.purchasePaymentType === 'credit' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Payable Now:</span>
              <span>
                {formatNumber(
                  accessoriesData.creditPaymentData?.payableAmountNow || 0
                )}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Payable Later:</span>
              <span>
                {formatNumber(
                  accessoriesData.creditPaymentData?.payableAmountLater || 0
                )}
              </span>
            </div>
          </>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '5px',
            fontWeight: 'bold',
          }}
        >
          <span>Total:</span>
          <span>{formatNumber(totalAmount)}</span>
        </div>
      </div>
    );
  };

  // Styles
  const styles = {
    container: {
      width: '210mm',
      minHeight: 'auto',
      margin: '30px auto',
      padding: '30px',
      background: '#f9f9f9',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Poppins', sans-serif",
      color: '#333',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      paddingBottom: '1px',
      borderBottom: `3px solid #000`,
      color: `#000`,
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: `#000`,
      letterSpacing: '1px',
    },
    infoSection: {
      marginBottom: '25px',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '30px',
    },
    th: {
      padding: '15px',
      backgroundColor: `#000`,
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    td: {
      padding: '12px',
      textAlign: 'center',
      backgroundColor: '#fafafa',
      borderBottom: '1px solid #eee',
      color: '#333',
    },
    stripedRow: {
      backgroundColor: '#f4f4f4',
    },
    totalSection: {
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      textAlign: 'right',
      fontSize: '20px',
      fontWeight: 'bold',
      color: `#000`,
    },
    button: {
      margin: '10px',
      padding: '12px 30px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    printBtn: {
      backgroundColor: '#28a745',
      color: '#fff',
    },
    downloadBtn: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    submitBtn: {
      backgroundColor: '#ffc107',
      color: '#fff',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    footer: {
      marginTop: '15px',
      paddingTop: '10px',
      borderTop: `3px solid #000`,
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
    },
    termsSection: {
      width: '100%',
      background: '#fff',
      borderRadius: '10px',
      color: '#333',
    },
    termsHeading: {
      fontSize: '15px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: `#000`,
    },
    termsText: {
      fontSize: '5px',
    },
  };

  if (!display) {
    return null;
  }

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
            fontSize: '14px',
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
            fontSize: '14px',
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
          fontSize: '14px',
          backgroundColor: 'white',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #000',
            marginBottom: '8px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {logoUrl && (
              <img
                src={logoUrl}
                alt="logo"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '2px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <h1
              style={{
                textAlign: 'center',
                margin: '5px 0',
                fontSize: '24px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              {shopName || 'Mobile Shop'}
            </h1>
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <h1
                style={{
                  textAlign: 'center',
                  margin: '5px 0',
                  fontSize: '14px',
                  fontWeight: 'normal',
                }}
              >
                {address || 'Mobile Shop address'},
              </h1>
              <h1
                style={{
                  textAlign: 'center',
                  margin: '5px 0',
                  fontSize: '14px',
                  fontWeight: 'normal',
                }}
              >
                {number || 'Mobile Shop number'}
              </h1>
            </div>
          </div>
          <h1
            style={{
              textAlign: 'center',
              margin: '5px 0',
              fontSize: '34px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Okiiee
          </h1>
        </div>

        <div
          style={{
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
          }}
        >
          <div>
            <strong style={{fontWeight: 'bold', color: '#000'}}>Date :</strong>{' '}
            {formatDate(
              isAccessoryInvoice
                ? new Date()
                : saleData?.date || saleData?.saleDate || saleData.createdAt
            )}
          </div>
          {/* <div>
            <strong>Invoice #</strong>{' '}
            {invoiceNumber ||
              (isAccessoryInvoice
                ? `ACC-${Math.floor(Math.random() * 10000)}`
                : '0000')}
          </div> */}
        </div>

        <div style={{ marginBottom: '8px', fontSize: '14px', color: '#000' }}>
          <div>
            <strong style={{ fontWeight: 'bold', color: '#000' }}>
              Customer Name:
            </strong>{' '}
            {isAccessoryInvoice
              ? accessoriesData.entityData?.name
              : saleData?.partyName || saleData?.customerName || 'CUSTOMER'}
          </div>
          <div>
            <strong style={{ fontWeight: 'bold', color: '#000' }}>
              Customer Number:
            </strong>{' '}
            {isAccessoryInvoice
              ? accessoriesData.entityData?.number
              : saleData?.partyLedgerId?.substr(-6) ||
                saleData?.customerNumber ||
                '000000'}
          </div>
        </div>

        {/* Render accessory items if present */}
        {isAccessoryInvoice ? (
          <>
            {renderAccessoryItems()}
            {renderAccessoryPaymentSummary()}
          </>
        ) : (
          <table
            style={{
              color: '#000',
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              border: '1px solid #000',
            }}
          >
            {perImeiDetails.length > 0 ? (
              <>
                <thead>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <th style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>No.</th>
                    <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Model No</th>
                    <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Brand</th>
                    {showColorCol && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Color</th>
                    )}
                    {showSimCol && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>SIM</th>
                    )}
                    {showBatteryCol && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Battery</th>
                    )}
                    {showWarrantyCol && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Warranty</th>
                    )}
                    <th style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>Inv. Price</th>
                    <th style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>QV</th>
                    <th style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {perImeiDetails.map((row, idx) => (
                    <tr key={`${row.imei}-${idx}`}>
                      <td style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>{idx + 1}</td>
                      <td style={{ padding: '5px', border: '1px solid #000' }}>{row.model}</td>
                      <td style={{ padding: '5px', border: '1px solid #000' }}>{row.brand}</td>
                      {showColorCol && (
                        <td style={{ padding: '5px', border: '1px solid #000' }}>{row.color || 'N/A'}</td>
                      )}
                      {showSimCol && (
                        <td style={{ padding: '5px', border: '1px solid #000' }}>{row.simOption || 'N/A'}</td>
                      )}
                      {showBatteryCol && (
                        <td style={{ padding: '5px', border: '1px solid #000' }}>{row.batteryHealth || 'N/A'}</td>
                      )}
                      {showWarrantyCol && (
                        <td style={{ padding: '5px', border: '1px solid #000' }}>{row.warranty || 'N/A'}</td>
                      )}
                      <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>{formatNumber(row.price)}</td>
                      <td style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>{row.qv}</td>
                      <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>{formatNumber(row.price * row.qv)}</td>
                    </tr>
                  ))}
                  {(() => {
                    const colSpan = 1 /* No. column */
                      + 1 /* model */
                      + 1 /* brand */
                      + (showColorCol ? 1 : 0)
                      + (showSimCol ? 1 : 0)
                      + (showBatteryCol ? 1 : 0)
                      + (showWarrantyCol ? 1 : 0)
                      + 1 /* Inv. Price */
                      + 1 /* QV */;
                    return (
                      <tr>
                        <td colSpan={colSpan} style={{ textAlign: 'right', padding: '5px', border: '1px solid #000', fontWeight: 'bold' }}>Total</td>
                        <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #000', fontWeight: 'bold' }}>{formatNumber(perImeiTotal)}</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <th style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>No.</th>
                    <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Model No</th>
                    <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Brand</th>
                    {color && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Color</th>
                    )}
                    {simOption && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>simOption</th>
                    )}
                    {ramMemory && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Ram Memory</th>
                    )}
                    {batteryHealth && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Battery Health</th>
                    )}
                    {type && (
                      <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #000' }}>Type</th>
                    )}
                    {warranty && (
                      <th style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>Wrnty</th>
                    )}
                    <th style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>Inv. Price</th>
                    <th style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>QV</th>
                    <th style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>1</td>
                    <td style={{ padding: '5px', border: '1px solid #000' }}>
                      {modelName || 'PHONE'}
                    </td>
                    <td style={{ padding: '5px', border: '1px solid #000' }}>
                      {companyName || 'BRAND'}
                    </td>
                    {color && (
                      <td style={{ padding: '5px', border: '1px solid #000' }}>
                        {color}
                      </td>
                    )}
                    {simOption && (
                      <td style={{ padding: '5px', border: '1px solid #000' }}>
                        {simOption}
                      </td>
                    )}
                    {ramMemory && (
                      <td style={{ padding: '5px', border: '1px solid #000' }}>
                        {ramMemory}
                      </td>
                    )}
                    {batteryHealth && (
                      <td style={{ padding: '5px', border: '1px solid #000' }}>
                        {batteryHealth}
                      </td>
                    )}
                    {type && (
                      <td style={{ padding: '5px', border: '1px solid #000' }}>
                        {type}
                      </td>
                    )}
                    {warranty && (
                      <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>
                        {warranty}
                      </td>
                    )}
                    <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>
                      {formatNumber(totalAmount)}
                    </td>
                    <td style={{ textAlign: 'center', padding: '5px', border: '1px solid #000' }}>
                      1
                    </td>
                    <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #000' }}>
                      {formatNumber(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </>
            )}
          </table>
        )}

        <div
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: '14px',
            border: '1px solid #000',
            textTransform: 'uppercase',
            padding: '5px',
            marginBottom: '6px',
          }}
        >
          {numberToWords(totalAmount)}
        </div>
        <div
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: '14px',
            border: '1px solid #000',
            textTransform: 'uppercase',
            padding: '5px',
            marginBottom: '10px',
          }}
        >
          {!isAccessoryInvoice && saleData && (
            <>
              {/* IMEI Numbers */}
              {(() => {
                // Try to get IMEIs from different possible fields
                if (saleData.addedImeis && saleData.addedImeis.length > 0) {
                  return <div>IMEI: {saleData.addedImeis.join(', ')}</div>;
                }
                if (saleData.writtenImeis && saleData.writtenImeis.length > 0) {
                  return <div>IMEI: {saleData.writtenImeis.join(', ')}</div>;
                }
                if (saleData.imei1) {
                  return (
                    <div>
                      IMEI:{' '}
                      {Array.isArray(saleData?.imei1)
                        ? saleData.imei1.join(',')
                        : saleData?.imei1}
                      {saleData.imei2 ? `, ${saleData.imei2}` : ''}
                      {/* IMEI: {saleData?.imei1?.join(',')}
                      {saleData.imei2 ? `, ${saleData.imei2}` : ''} */}
                    </div>
                  );
                }
                if (
                  saleData.ramSimDetails &&
                  saleData.ramSimDetails.length > 0
                ) {
                  // Collect all imei1 from ramSimDetails
                  const imeis = [];
                  saleData.ramSimDetails.forEach((detail) => {
                    if (detail.imeiNumbers && detail.imeiNumbers.length > 0) {
                      detail.imeiNumbers.forEach((imeiObj) => {
                        if (imeiObj.imei1) imeis.push(imeiObj.imei1);
                        if (imeiObj.imei2) imeis.push(imeiObj.imei2);
                      });
                    }
                  });
                  if (imeis.length > 0) {
                    return <div>IMEI: {imeis.join(', ')}</div>;
                  }
                }
                return null;
              })()}
            </>
          )}
        </div>

        <div
          style={{
            color: '#000',
            marginTop: '8px',
            fontSize: '14px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-between',
          }}
        >
          <div style={styles.termsSection}>
            <div style={styles.termsHeading}>Terms & conditions</div>
            <div
              style={{
                fontSize: '5px',
                display: 'flex',
                lineHeight: '1.2',
                flexDirection: 'column',
              }}
            >
              {termsAndConditions.map((item, index) => (
                <p key={index}>
                  <strong
                    style={{
                      fontWeight: '600',
                      color: '#333',
                      width: '100%',
                    }}
                  >
                    {index + 1}.
                  </strong>{' '}
                  {item}
                </p>
              ))}
            </div>
          </div>
          {!isAccessoryInvoice && (
            <div>
              <div>
                <strong>Amount With Tax</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <span style={{ width: '120px', textAlign: 'left' }}>
                  Previous Bal :
                </span>
                <span style={{ width: '80px', textAlign: 'right' }}>
                  {formatNumber(saleData?.previousBalance || '0.00')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <span style={{ width: '120px', textAlign: 'left' }}>
                  Gross Total :
                </span>
                <span style={{ width: '80px', textAlign: 'right' }}>
                  {formatNumber(totalAmount)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <span style={{ width: '120px', textAlign: 'left' }}>
                  Cash Rec. :
                </span>
                <span style={{ width: '80px', textAlign: 'right' }}>
                  {formatNumber(saleData?.cashReceived || '0.00')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <span style={{ width: '120px', textAlign: 'left' }}>
                  Net Balance :
                </span>
                <span style={{ width: '80px', textAlign: 'right' }}>
                  {formatNumber(totalAmount - (saleData?.cashReceived || 0))}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '12px',
            paddingTop: '6px',
          }}
        >
          <div>Checked By:______</div>
          <div>Issued By:______</div>
        </div>
      </div>
    </div>
  );
};
