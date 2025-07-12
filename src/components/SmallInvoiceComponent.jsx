// src/templates/saleinvoice.js
export const SmallInvoiceComponent = ({ invoiceData }) => {
    // Static invoice data
    const staticInvoiceData = {
        shopInfo: "Shop#46 Mall Road Opp. Meezan Bank Cantt.",
        title: "INVOICE",
        subtitle: "Counter Sale",
        date: "02/01/2025",
        invoiceNumber: "004560",
        customer: {
            name: "Mr. Khaja Muhammad Hussain",
            phone: "____________________"
        },
        items: [
            {
                no: 1,
                name: "OG Meta Quest 3 12/512",
                code: "25558389123",
                qty: 1,
                rate: "187,500",
                amount: "187,500"
            }
        ],
        summary: {
            items: 1,
            cashReturn: "–",
            bankReturn: "–",
            freight: "–",
            subTotal: "187,500",
            discount: "–",
            netTotal: "187,500",
            previousBal: "–",
            total: "187,500",
            bankDeposit: "187,500",
            currentTotal: "–"
        },
        operator: "admin",
        timestamp: "02-Jan-25 15:47",
        pending: [
            {
                no: 1,
                name: "OG Meta Quest 3 12/512",
                qty: 1
            }
        ],
        social: {
            url: "http://www.conceptmobiles.net",
            text: "www.conceptmobiles.net"
        },
        qr: "qr-code.png"
    };

    const handlePrintInvoice = () => {
        // Use invoiceData if provided, otherwise fallback to staticInvoiceData
        const data = invoiceData || staticInvoiceData;

        // Helper to render items rows
        const itemsRows = data.items.map(
            item => `
            <tr>
                <td>${item.no}</td>
                <td>${item.name}<br>${item.code}</td>
                <td>${item.qty}</td>
                <td>${item.rate}</td>
                <td>${item.amount}</td>
            </tr>
            `
        ).join('');

        // Helper to render pending rows
        const pendingRows = data.pending.map(
            item => `
            <tr>
                <td>${item.no}</td>
                <td>${item.name}</td>
                <td>${item.qty}</td>
            </tr>
            `
        ).join('');

        const invoiceHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Invoice & Receipt</title>
            <style>
            @page { size: 80mm auto; margin: 0; }
            @media print {
                html, body { margin: 0; padding: 0; }
                body { background: none; }
            }
            @media screen {
                body { margin: 20px; padding: 20px; background: #f5f5f5; }
            }
            body {
                font-family: 'Calibri', sans-serif;
                font-size: 12px;
                margin: 0;
                padding: 0;
            }
            .invoice-container {
                width: 80mm;
                background: #fff;
                margin: 0 auto;
                padding: 5mm;
                box-sizing: border-box;
            }
            .header,
            .section,
            .footer {
                border-bottom: 1px dashed #000;
                padding-bottom: 2mm;
                margin-bottom: 2mm;
            }
            .header:last-child,
            .section:last-child,
            .footer:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .header .shop-info {
                text-align: center;
                font-weight: bold;
                margin-bottom: 2mm;
            }
            .header .title {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin: 1mm 0;
            }
            .header .subtitle {
                text-align: center;
                font-size: 10px;
                font-style: italic;
            }
            .meta {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                margin: 2mm 0;
            }
            .customer {
                margin: 2mm 0;
            }
            .customer b {
                color: #c00;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 2mm;
            }
            table th,
            table td {
                border: 1px solid #000;
                padding: 1mm;
                text-align: center;
                vertical-align: top;
                font-size: 12px;
            }
            table th:first-child,
            table td:first-child {
                text-align: left;
                width: 8%;
            }
            table th:nth-child(2),
            table td:nth-child(2) {
                text-align: left;
                width: 52%;
            }
            .summary {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                margin-bottom: 2mm;
            }
            .summary .left,
            .summary .right {
                width: 48%;
            }
            .summary .left div,
            .summary .right div {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1mm;
            }
            .summary .left div.box {
                border: 1px solid #000;
                padding: 1mm;
                text-align: center;
                width: 10mm;
            }
            .summary .right .net .value {
                color: #c00;
                font-weight: bold;
            }
            .summary .right .deposit .label {
                color: #0a0;
            }
            .operator {
                font-size: 10px;
                display: flex;
                justify-content: space-between;
                margin-bottom: 2mm;
            }
            .pending-title {
                text-align: center;
                font-weight: bold;
                margin: 2mm 0;
                font-size: 13px;
            }
            .small-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 2mm;
            }
            .small-table th,
            .small-table td {
                border: 1px solid #000;
                padding: 1mm;
                font-size: 12px;
                text-align: center;
            }
            .small-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                margin-top: 2mm;
            }
            .social a {
                color: #000;
                text-decoration: none;
            }
            .qr {
                width: 15mm;
                height: 15mm;
                object-fit: contain;
            }
            </style>
        </head>
        <body>
            <div class="invoice-container">
            <div class="header">
                <div class="shop-info">${data.shopInfo}</div>
                <div class="title">${data.title}</div>
                <div class="subtitle">${data.subtitle}</div>
            </div>
            <div class="meta">
                <div><strong>Date:</strong> ${data.date}</div>
                <div><strong>Inv#:</strong> ${data.invoiceNumber}</div>
            </div>
            <div class="customer">
                <strong>Name:</strong> <b>${data.customer.name}</b><br>
                <strong>Cel No:</strong> ${data.customer.phone}
            </div>
            <table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Sold Items</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                ${itemsRows}
                </tbody>
            </table>
            <div class="summary">
                <div class="left">
                <div><span>Items:</span><span class="box">${data.summary.items}</span></div>
                <div><span>Cash Return:</span><span class="box">${data.summary.cashReturn}</span></div>
                <div><span>Bank Return:</span><span class="box">${data.summary.bankReturn}</span></div>
                <div><span>Freight:</span><span class="box">${data.summary.freight}</span></div>
                </div>
                <div class="right">
                <div><span class="label">SubTotal:</span><span class="value">${data.summary.subTotal}</span></div>
                <div><span class="label">Discount:</span><span class="value">${data.summary.discount}</span></div>
                <div class="net"><span class="label">Net Total:</span><span class="value">${data.summary.netTotal}</span></div>
                <div><span class="label">Previous Bal:</span><span class="value">${data.summary.previousBal}</span></div>
                <div><span class="label">Total:</span><span class="value">${data.summary.total}</span></div>
                <div class="deposit"><span class="label">Bank Deposit:</span><span class="value">${data.summary.bankDeposit}</span></div>
                <div><span class="label">Current Total:</span><span class="value">${data.summary.currentTotal}</span></div>
                </div>
            </div>
            <div class="operator"><div>${data.timestamp}</div><div>Operator: ${data.operator}</div></div>
            <div class="pending-title">Pending Delivery</div>
            <div class="meta"><div><strong>Date:</strong> ${data.date}</div><div><strong>Inv#:</strong> ${data.invoiceNumber}</div></div>
            <table class="small-table"><thead><tr><th>No</th><th>Items</th><th>Qty</th></tr></thead><tbody>${pendingRows}</tbody></table>
            <div class="small-footer"><div class="social"><div>Follow Us On Social Media</div><a href="${data.social.url}" target="_blank">${data.social.text}</a></div><img src="${data.qr}" alt="QR Code" class="qr"></div>
            </div>
        </body>
        </html>`;

        const printWindow = window.open('', '_blank', 'width=400,height=600');
        printWindow.document.open();
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    return (
        <div>
            <button onClick={handlePrintInvoice} style={{ backgroundColor: "#98765", padding: "1rem" }}>Print Small Invoice</button>
        </div>
    )
};

// export const invoiceHtml = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Invoice & Receipt</title>
//   <style>
//     /* Set receipt paper size and remove margins */
//     @page {
//       size: 80mm auto;
//       margin: 0;
//     }

//     /* Ensure no margins on print */
//     @media print {
//       html, body {
//         margin: 0;
//         padding: 0;
//       }
//       body {
//         background: none;
//       }
//     }

//     /* Preview spacing */
//     @media screen {
//       body {
//         margin: 20px;
//         padding: 20px;
//         background: #f5f5f5;
//       }
//     }

//     body {
//       font-family: 'Calibri', sans-serif;
//       font-size: 12px;
//       margin: 0;
//       padding: 0;
//     }

//     /* Match paper width exactly */
//     .invoice-container {
//       width: 80mm;
//       background: #fff;
//       margin: 0 auto;
//       padding: 5mm;
//       box-sizing: border-box;
//     }

//     /* Separator lines */
//     .header,
//     .section,
//     .footer {
//       border-bottom: 1px dashed #000;
//       padding-bottom: 2mm;
//       margin-bottom: 2mm;
//     }

//     .header:last-child,
//     .section:last-child,
//     .footer:last-child {
//       border-bottom: none;
//       margin-bottom: 0;
//       padding-bottom: 0;
//     }

//     /* Header styles */
//     .header .shop-info {
//       text-align: center;
//       font-weight: bold;
//       margin-bottom: 2mm;
//     }
//     .header .title {
//       text-align: center;
//       font-size: 16px;
//       font-weight: bold;
//       margin: 1mm 0;
//     }
//     .header .subtitle {
//       text-align: center;
//       font-size: 10px;
//       font-style: italic;
//     }

//     /* Meta and customer */
//     .meta {
//       display: flex;
//       justify-content: space-between;
//       font-size: 12px;
//       margin: 2mm 0;
//     }
//     .customer {
//       margin: 2mm 0;
//     }
//     .customer b {
//       color: #c00;
//     }

//     /* Table styles */
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-bottom: 2mm;
//     }
//     table th,
//     table td {
//       border: 1px solid #000;
//       padding: 1mm;
//       text-align: center;
//       vertical-align: top;
//       font-size: 12px;
//     }
//     table th:first-child,
//     table td:first-child {
//       text-align: left;
//       width: 8%;
//     }
//     table th:nth-child(2),
//     table td:nth-child(2) {
//       text-align: left;
//       width: 52%;
//     }

//     /* Summary section */
//     .summary {
//       display: flex;
//       justify-content: space-between;
//       font-size: 12px;
//       margin-bottom: 2mm;
//     }
//     .summary .left,
//     .summary .right {
//       width: 48%;
//     }
//     .summary .left div,
//     .summary .right div {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 1mm;
//     }
//     .summary .left div.box {
//       border: 1px solid #000;
//       padding: 1mm;
//       text-align: center;
//       width: 10mm;
//     }
//     .summary .right .net .value {
//       color: #c00;
//       font-weight: bold;
//     }
//     .summary .right .deposit .label {
//       color: #0a0;
//     }

//     /* Operator footer */
//     .operator {
//       font-size: 10px;
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 2mm;
//     }

//     /* Pending section */
//     .pending-title {
//       text-align: center;
//       font-weight: bold;
//       margin: 2mm 0;
//       font-size: 13px;
//     }
//     .small-table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-bottom: 2mm;
//     }
//     .small-table th,
//     .small-table td {
//       border: 1px solid #000;
//       padding: 1mm;
//       font-size: 12px;
//       text-align: center;
//     }

//     /* Footer */
//     .small-footer {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 12px;
//       margin-top: 2mm;
//     }
//     .social a {
//       color: #000;
//       text-decoration: none;
//     }
//     .qr {
//       width: 15mm;
//       height: 15mm;
//       object-fit: contain;
//     }
//   </style>
// </head>
// <body>
//   <div class="invoice-container">
//     <!-- Header -->
//     <div class="header">
//       <div class="shop-info">Shop#46 Mall Road Opp. Meezan Bank Cantt.</div>
//       <div class="title">INVOICE</div>
//       <div class="subtitle">Counter Sale</div>
//     </div>
//     <!-- Invoice Meta -->
//     <div class="meta">
//       <div><strong>Date:</strong> 02/01/2025</div>
//       <div><strong>Inv#:</strong> 004560</div>
//     </div>
//     <!-- Customer Info -->
//     <div class="customer">
//       <strong>Name:</strong> <b>Mr. Khaja Muhammad Hussain</b><br>
//       <strong>Cel No:</strong> ____________________
//     </div>
//     <!-- Items Table -->
//     <table>
//       <thead>
//         <tr>
//           <th>No</th>
//           <th>Sold Items</th>
//           <th>Qty</th>
//           <th>Rate</th>
//           <th>Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>1</td>
//           <td>OG Meta Quest 3 12/512<br>25558389123</td>
//           <td>1</td>
//           <td>187,500</td>
//           <td>187,500</td>
//         </tr>
//       </tbody>
//     </table>
//     <!-- Summary Section -->
//     <div class="summary">
//       <div class="left">
//         <div><span>Items:</span><span class="box">1</span></div>
//         <div><span>Cash Return:</span><span class="box">–</span></div>
//         <div><span>Bank Return:</span><span class="box">–</span></div>
//         <div><span>Freight:</span><span class="box">–</span></div>
//       </div>
//       <div class="right">
//         <div><span class="label">SubTotal:</span><span class="value">187,500</span></div>
//         <div><span class="label">Discount:</span><span class="value">–</span></div>
//         <div class="net"><span class="label">Net Total:</span><span class="value">187,500</span></div>
//         <div><span class="label">Previous Bal:</span><span class="value">–</span></div>
//         <div><span class="label">Total:</span><span class="value">187,500</span></div>
//         <div class="deposit"><span class="label">Bank Deposit:</span><span class="value">187,500</span></div>
//         <div><span class="label">Current Total:</span><span class="value">–</span></div>
//       </div>
//     </div>
//     <!-- Operator & Timestamp -->
//     <div class="operator"><div>02-Jan-25 15:47</div><div>Operator: admin</div></div>
//     <!-- Pending Delivery -->
//     <div class="pending-title">Pending Delivery</div>
//     <div class="meta"><div><strong>Date:</strong> 02/01/2025</div><div><strong>Inv#:</strong> 004560</div></div>
//     <table class="small-table"><thead><tr><th>No</th><th>Items</th><th>Qty</th></tr></thead><tbody><tr><td>1</td><td>OG Meta Quest 3 12/512</td><td>1</td></tr></tbody></table>
//     <!-- Footer with Social & QR -->
//     <div class="small-footer"><div class="social"><div>Follow Us On Social Media</div><a href="http://www.conceptmobiles.net" target="_blank">www.conceptmobiles.net</a></div><img src="qr-code.png" alt="QR Code" class="qr"></div>
//   </div>
// </body>
// </html>`;
