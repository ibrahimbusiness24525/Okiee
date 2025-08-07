export const SmallInvoiceComponent = ({ invoiceData }) => {
  // Static invoice data
  const staticInvoiceData = {
    shopInfo: 'Shop#46 Mall Road Opp. Meezan Bank Cantt.',
    title: 'INVOICE',
    subtitle: 'Counter Sale',
    date: '02/01/2025',
    invoiceNumber: '004560',
    customer: {
      name: 'Mr. Khaja Muhammad Hussain',
      phone: '____________________',
    },
    items: [
      {
        no: 1,
        name: 'OG Meta Quest 3 12/512',
        code: '25558389123',
        qty: 1,
        rate: '187,500',
        amount: '187,500',
      },
    ],
    summary: {
      items: 1,
      cashReturn: '–',
      bankReturn: '–',
      freight: '–',
      subTotal: '187,500',
      discount: '–',
      netTotal: '187,500',
      previousBal: '–',
      total: '187,500',
      bankDeposit: '187,500',
      currentTotal: '–',
    },
    operator: 'admin',
    timestamp: '02-Jan-25 15:47',
    pending: [
      {
        no: 1,
        name: 'OG Meta Quest 3 12/512',
        qty: 1,
      },
    ],
    social: {
      url: 'http://www.conceptmobiles.net',
      text: 'www.conceptmobiles.net',
    },
    qr: 'qr-code.png',
    termsAndConditions: [
      'All sales are final.',
      'No returns or exchanges after purchase.',
      'Please keep your receipt for warranty purposes.',
      'Warranty claims must be made within 30 days of purchase.',
      'For any issues, contact our customer service.',
    ],
  };

  const data = invoiceData || staticInvoiceData;

  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.open();
    printWindow.document.write(generateInvoiceHTML());
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  const termsHtml = Array.isArray(data?.termsAndConditions)
    ? data.termsAndConditions
    : []
        ?.map(
          (item, index) => `
    <p style="margin: 0; padding: 0; display: flex; align-items: flex-start; line-height: 1.2">
      <strong style="font-weight: 600; color: #333; margin-right: 4px">
        ${index + 1}.
      </strong>
      ${item}
    </p>
  `
        )
        .join('');
  const generateInvoiceHTML = () => {
    // Helper to render items rows
    const itemsRows = data.items
      .map(
        (item) => `
          <tr>
              <td>${item.no}</td>
              <td>${item.name}<br>${item.code}</td>
              <td>${item.qty}</td>
              <td>${item.rate}</td>
              <td>${item.amount}</td>
          </tr>
          `
      )
      .join('');

    // Helper to render pending rows
    const pendingRows = data.pending
      .map(
        (item) => `
          <tr>
              <td>${item.no}</td>
              <td>${item.name}</td>
              <td>${item.qty}</td>
          </tr>
          `
      )
      .join('');

    return `<!DOCTYPE html>
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
            <div>
            <div style={{ display: 'flex', justifyContent: 'space-between',width: '100%' }}>
              <div>
                <div
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                  }}
                >
                  ${data.shopInfo}
                </div>
              </div>
              <div>
                <h4>Okiiee</h4>
              </div>
            </div>
          </div>
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
             <div
            style={{
              marginTop: '10px',
              padding: '8px',
              borderTop: '1px solid #ccc',
              fontSize: '6px',
              color: '#333',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                marginBottom: '4px',
                textTransform: 'uppercase',
                color: '#111',
              }}
            >
              Terms & Conditions
            </div>

            <div style="margin-top: 10px; padding: 8px; border-top: 1px solid #ccc; font-size: 6px; color: #333; font-family: Arial, sans-serif">
        <div style="font-weight: bold; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; color: #111">
          Terms & Conditions
        </div>
        <div style="font-size: 5px; display: flex; flex-direction: column; gap: 2px">
          ${termsHtml}
        </div>
      </div>
          </div>
          </div>
      </body>
      </html>`;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={handlePrintInvoice}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            ':hover': {
              backgroundColor: '#45a049',
            },
          }}
        >
          Print Small Invoice
        </button>
      </div>

      {/* Preview Section */}
      <div
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '20px',
          marginTop: '20px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333',
            fontSize: '18px',
          }}
        >
          Small Invoice Preview
        </h2>

        {/* Invoice Preview Content */}
        <div
          style={{
            maxWidth: '90mm',
            margin: '0 auto',
            border: '1px dashed #ccc',
            padding: '10px',
            background: '#fff',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                  }}
                >
                  {data.shopInfo}
                </div>
              </div>
              <div>
                <h4>Okiiee</h4>
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '5px 0',
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontStyle: 'italic',
              marginBottom: '10px',
            }}
          >
            {data.subtitle}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              margin: '5px 0',
            }}
          >
            <div>
              <strong>Date:</strong> {data.date}
            </div>
            <div>
              <strong>Inv#:</strong> {data.invoiceNumber}
            </div>
          </div>

          <div style={{ fontSize: '12px', margin: '5px 0' }}>
            <strong>Name:</strong>{' '}
            <span style={{ color: '#c00' }}>{data.customer.name}</span>
            <br />
            <strong>Cel No:</strong> {data.customer.phone}
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '10px 0',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '3px',
                    textAlign: 'left',
                  }}
                >
                  No
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '3px',
                    textAlign: 'left',
                  }}
                >
                  Sold Items
                </th>
                <th style={{ border: '1px solid #000', padding: '3px' }}>
                  Qty
                </th>
                <th style={{ border: '1px solid #000', padding: '3px' }}>
                  Rate
                </th>
                <th style={{ border: '1px solid #000', padding: '3px' }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.no}>
                  <td style={{ border: '1px solid #000', padding: '3px' }}>
                    {item.no}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '3px' }}>
                    {item.name}
                    <br />
                    {item.code}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '3px',
                      textAlign: 'center',
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '3px',
                      textAlign: 'center',
                    }}
                  >
                    {item.rate}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '3px',
                      textAlign: 'center',
                    }}
                  >
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              margin: '10px 0',
            }}
          >
            <div style={{ width: '48%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span>Items:</span>
                <span
                  style={{
                    border: '1px solid #000',
                    padding: '2px 5px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {data.summary.items}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span>Cash Return:</span>
                <span
                  style={{
                    border: '1px solid #000',
                    padding: '2px 5px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {data.summary.cashReturn}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span>Bank Return:</span>
                <span
                  style={{
                    border: '1px solid #000',
                    padding: '2px 5px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {data.summary.bankReturn}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Freight:</span>
                <span
                  style={{
                    border: '1px solid #000',
                    padding: '2px 5px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {data.summary.freight}
                </span>
              </div>
            </div>

            <div style={{ width: '48%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span>SubTotal:</span>
                <span>{data.summary.subTotal}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span>Net Total:</span>
                <span style={{ color: '#c00', fontWeight: 'bold' }}>
                  {data.summary.netTotal}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span>Total:</span>
                <span>{data.summary.total}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span style={{ color: '#0a0' }}>Bank Deposit:</span>
                <span>{data.summary.bankDeposit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Current Total:</span>
                <span>{data.summary.currentTotal}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              margin: '10px 0',
            }}
          >
            <div>{data.timestamp}</div>
            <div>Operator: {data.operator}</div>
          </div>

          {/* <div
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              margin: '10px 0',
              fontSize: '13px',
            }}
          >
            Pending Delivery
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              margin: '5px 0',
            }}
          >
            <div>
              <strong>Date:</strong> {data.date}
            </div>
            <div>
              <strong>Inv#:</strong> {data.invoiceNumber}
            </div>
          </div> */}

          {/* <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '10px 0',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr>
                <th style={{ border: '1px solid #000', padding: '3px' }}>No</th>
                <th style={{ border: '1px solid #000', padding: '3px' }}>
                  Items
                </th>
                <th style={{ border: '1px solid #000', padding: '3px' }}>
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {data.pending.map((item) => (
                <tr key={item.no}>
                  <td style={{ border: '1px solid #000', padding: '3px' }}>
                    {item.no}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '3px' }}>
                    {item.name}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '3px' }}>
                    {item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              marginTop: '10px',
            }}
          >
            <div>
              <div>Follow Us On Social Media</div>
              <a
                href={data.social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#000', textDecoration: 'none' }}
              >
                {data.social.text}
              </a>
            </div>
            <div
              style={{
                width: '15mm',
                height: '15mm',
                background: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              [QR Code]
            </div>
          </div>
          <div
            style={{
              marginTop: '10px',
              padding: '8px',
              borderTop: '1px solid #ccc',
              fontSize: '6px',
              color: '#333',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                marginBottom: '4px',
                textTransform: 'uppercase',
                color: '#111',
              }}
            >
              Terms & Conditions
            </div>

            <div
              style={{
                fontSize: '5px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {data?.termsAndConditions?.map((item, index) => (
                <p
                  key={index}
                  style={{
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'flex-start',
                    lineHeight: '1.2',
                  }}
                >
                  <strong
                    style={{
                      fontWeight: '600',
                      color: '#333',
                      marginRight: '4px',
                    }}
                  >
                    {index + 1}.
                  </strong>{' '}
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// // src/templates/saleinvoice.js
// export const SmallInvoiceComponent = ({ invoiceData }) => {
//   // Static invoice data
//   const staticInvoiceData = {
//     shopInfo: 'Shop#46 Mall Road Opp. Meezan Bank Cantt.',
//     title: 'INVOICE',
//     subtitle: 'Counter Sale',
//     date: '02/01/2025',
//     invoiceNumber: '004560',
//     customer: {
//       name: 'Mr. Khaja Muhammad Hussain',
//       phone: '____________________',
//     },
//     items: [
//       {
//         no: 1,
//         name: 'OG Meta Quest 3 12/512',
//         code: '25558389123',
//         qty: 1,
//         rate: '187,500',
//         amount: '187,500',
//       },
//     ],
//     summary: {
//       items: 1,
//       cashReturn: '–',
//       bankReturn: '–',
//       freight: '–',
//       subTotal: '187,500',
//       discount: '–',
//       netTotal: '187,500',
//       previousBal: '–',
//       total: '187,500',
//       bankDeposit: '187,500',
//       currentTotal: '–',
//     },
//     operator: 'admin',
//     timestamp: '02-Jan-25 15:47',
//     pending: [
//       {
//         no: 1,
//         name: 'OG Meta Quest 3 12/512',
//         qty: 1,
//       },
//     ],
//     social: {
//       url: 'http://www.conceptmobiles.net',
//       text: 'www.conceptmobiles.net',
//     },
//     qr: 'qr-code.png',
//   };

//   const handlePrintInvoice = () => {
//     // Use invoiceData if provided, otherwise fallback to staticInvoiceData
//     const data = invoiceData || staticInvoiceData;

//     // Helper to render items rows
//     const itemsRows = data.items
//       .map(
//         (item) => `
//             <tr>
//                 <td>${item.no}</td>
//                 <td>${item.name}<br>${item.code}</td>
//                 <td>${item.qty}</td>
//                 <td>${item.rate}</td>
//                 <td>${item.amount}</td>
//             </tr>
//             `
//       )
//       .join('');

//     // Helper to render pending rows
//     const pendingRows = data.pending
//       .map(
//         (item) => `
//             <tr>
//                 <td>${item.no}</td>
//                 <td>${item.name}</td>
//                 <td>${item.qty}</td>
//             </tr>
//             `
//       )
//       .join('');

//     const invoiceHtml = `<!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <title>Invoice & Receipt</title>
//             <style>
//             @page { size: 80mm auto; margin: 0; }
//             @media print {
//                 html, body { margin: 0; padding: 0; }
//                 body { background: none; }
//             }
//             @media screen {
//                 body { margin: 20px; padding: 20px; background: #f5f5f5; }
//             }
//             body {
//                 font-family: 'Calibri', sans-serif;
//                 font-size: 12px;
//                 margin: 0;
//                 padding: 0;
//             }
//             .invoice-container {
//                 width: 80mm;
//                 background: #fff;
//                 margin: 0 auto;
//                 padding: 5mm;
//                 box-sizing: border-box;
//             }
//             .header,
//             .section,
//             .footer {
//                 border-bottom: 1px dashed #000;
//                 padding-bottom: 2mm;
//                 margin-bottom: 2mm;
//             }
//             .header:last-child,
//             .section:last-child,
//             .footer:last-child {
//                 border-bottom: none;
//                 margin-bottom: 0;
//                 padding-bottom: 0;
//             }
//             .header .shop-info {
//                 text-align: center;
//                 font-weight: bold;
//                 margin-bottom: 2mm;
//             }
//             .header .title {
//                 text-align: center;
//                 font-size: 16px;
//                 font-weight: bold;
//                 margin: 1mm 0;
//             }
//             .header .subtitle {
//                 text-align: center;
//                 font-size: 10px;
//                 font-style: italic;
//             }
//             .meta {
//                 display: flex;
//                 justify-content: space-between;
//                 font-size: 12px;
//                 margin: 2mm 0;
//             }
//             .customer {
//                 margin: 2mm 0;
//             }
//             .customer b {
//                 color: #c00;
//             }
//             table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-bottom: 2mm;
//             }
//             table th,
//             table td {
//                 border: 1px solid #000;
//                 padding: 1mm;
//                 text-align: center;
//                 vertical-align: top;
//                 font-size: 12px;
//             }
//             table th:first-child,
//             table td:first-child {
//                 text-align: left;
//                 width: 8%;
//             }
//             table th:nth-child(2),
//             table td:nth-child(2) {
//                 text-align: left;
//                 width: 52%;
//             }
//             .summary {
//                 display: flex;
//                 justify-content: space-between;
//                 font-size: 12px;
//                 margin-bottom: 2mm;
//             }
//             .summary .left,
//             .summary .right {
//                 width: 48%;
//             }
//             .summary .left div,
//             .summary .right div {
//                 display: flex;
//                 justify-content: space-between;
//                 margin-bottom: 1mm;
//             }
//             .summary .left div.box {
//                 border: 1px solid #000;
//                 padding: 1mm;
//                 text-align: center;
//                 width: 10mm;
//             }
//             .summary .right .net .value {
//                 color: #c00;
//                 font-weight: bold;
//             }
//             .summary .right .deposit .label {
//                 color: #0a0;
//             }
//             .operator {
//                 font-size: 10px;
//                 display: flex;
//                 justify-content: space-between;
//                 margin-bottom: 2mm;
//             }
//             .pending-title {
//                 text-align: center;
//                 font-weight: bold;
//                 margin: 2mm 0;
//                 font-size: 13px;
//             }
//             .small-table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-bottom: 2mm;
//             }
//             .small-table th,
//             .small-table td {
//                 border: 1px solid #000;
//                 padding: 1mm;
//                 font-size: 12px;
//                 text-align: center;
//             }
//             .small-footer {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 font-size: 12px;
//                 margin-top: 2mm;
//             }
//             .social a {
//                 color: #000;
//                 text-decoration: none;
//             }
//             .qr {
//                 width: 15mm;
//                 height: 15mm;
//                 object-fit: contain;
//             }
//             </style>
//         </head>
//         <body>
//             <div class="invoice-container">
//             <div class="header">
//                 <div class="shop-info">${data.shopInfo}</div>
//                 <div class="title">${data.title}</div>
//                 <div class="subtitle">${data.subtitle}</div>
//             </div>
//             <div class="meta">
//                 <div><strong>Date:</strong> ${data.date}</div>
//                 <div><strong>Inv#:</strong> ${data.invoiceNumber}</div>
//             </div>
//             <div class="customer">
//                 <strong>Name:</strong> <b>${data.customer.name}</b><br>
//                 <strong>Cel No:</strong> ${data.customer.phone}
//             </div>
//             <table>
//                 <thead>
//                 <tr>
//                     <th>No</th>
//                     <th>Sold Items</th>
//                     <th>Qty</th>
//                     <th>Rate</th>
//                     <th>Amount</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 ${itemsRows}
//                 </tbody>
//             </table>
//             <div class="summary">
//                 <div class="left">
//                 <div><span>Items:</span><span class="box">${data.summary.items}</span></div>
//                 <div><span>Cash Return:</span><span class="box">${data.summary.cashReturn}</span></div>
//                 <div><span>Bank Return:</span><span class="box">${data.summary.bankReturn}</span></div>
//                 <div><span>Freight:</span><span class="box">${data.summary.freight}</span></div>
//                 </div>
//                 <div class="right">
//                 <div><span class="label">SubTotal:</span><span class="value">${data.summary.subTotal}</span></div>
//                 <div><span class="label">Discount:</span><span class="value">${data.summary.discount}</span></div>
//                 <div class="net"><span class="label">Net Total:</span><span class="value">${data.summary.netTotal}</span></div>
//                 <div><span class="label">Previous Bal:</span><span class="value">${data.summary.previousBal}</span></div>
//                 <div><span class="label">Total:</span><span class="value">${data.summary.total}</span></div>
//                 <div class="deposit"><span class="label">Bank Deposit:</span><span class="value">${data.summary.bankDeposit}</span></div>
//                 <div><span class="label">Current Total:</span><span class="value">${data.summary.currentTotal}</span></div>
//                 </div>
//             </div>
//             <div class="operator"><div>${data.timestamp}</div><div>Operator: ${data.operator}</div></div>
//             <div class="pending-title">Pending Delivery</div>
//             <div class="meta"><div><strong>Date:</strong> ${data.date}</div><div><strong>Inv#:</strong> ${data.invoiceNumber}</div></div>
//             <table class="small-table"><thead><tr><th>No</th><th>Items</th><th>Qty</th></tr></thead><tbody>${pendingRows}</tbody></table>
//             <div class="small-footer"><div class="social"><div>Follow Us On Social Media</div><a href="${data.social.url}" target="_blank">${data.social.text}</a></div><img src="${data.qr}" alt="QR Code" class="qr"></div>
//             </div>
//         </body>
//         </html>`;

//     const printWindow = window.open('', '_blank', 'width=400,height=600');
//     printWindow.document.open();
//     printWindow.document.write(invoiceHtml);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//   };

//   return (
//     <div>
//       <button
//         onClick={handlePrintInvoice}
//         style={{ backgroundColor: '#98765', padding: '1rem' }}
//       >
//         Print Small Invoice
//       </button>
//     </div>
//   );
// };
