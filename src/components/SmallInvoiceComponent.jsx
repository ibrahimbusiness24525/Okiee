import React from 'react';

export const SmallInvoiceComponent = ({ invoiceData, shopData, logoUrl }) => {
  // Remove local state and API calls since we're getting data from props

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
        model: 'Quest 3',
        brand: 'Meta',
        color: 'Black',
        simOption: 'Dual SIM',
        batteryHealth: '95%',
        warranty: '12 months',
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
  console.log("data",data)

  // Use shop data from props if available, otherwise fallback to static data
  const shopName = shopData?.name || shopData?.shopName || data.shopInfo || 'Mobile Shop';
  const shopAddress = shopData?.address || data.shopInfo || 'Shop Address';
  const shopPhone = shopData?.phone || shopData?.contactNumber?.[0] || 'Phone Number';
  
  console.log('Shop data received:', shopData);
  console.log('Shop address:', shopAddress);
  console.log('Shop address type:', typeof shopAddress);
  console.log('Shop address length:', shopAddress?.length);

  // Build items from phoneDetail/IMEI data when provided; fallback to data.items
  const phoneDetailArray = Array.isArray(data?.phoneDetail)
    ? data.phoneDetail
    : (Array.isArray(data?.dataReceived?.phoneDetail) ? data.dataReceived.phoneDetail : []);
  const imeiPricesArray = Array.isArray(data?.imeiPrices)
    ? data.imeiPrices
    : (Array.isArray(data?.dataReceived?.imeiPrices) ? data.dataReceived.imeiPrices : []);
  const imeisArray = Array.isArray(data?.writtenImeis)
    ? data.writtenImeis
    : (Array.isArray(data?.dataReceived?.writtenImeis)
      ? data.dataReceived.writtenImeis
      : (Array.isArray(data?.addedImeis)
        ? data.addedImeis
        : (Array.isArray(data?.dataReceived?.addedImeis) ? data.dataReceived.addedImeis : [])));

  const parseMoney = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    const cleaned = String(value).replace(/[,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const toCurrency = (n) => {
    const num = parseMoney(n);
    return num.toLocaleString();
  };

  // Build map of prices by IMEI for reliable lookup irrespective of order
  const priceByImei = (imeiPricesArray || []).reduce((acc, row) => {
    const key = row && row.imei != null ? String(row.imei) : '';
    if (key) acc[key] = parseMoney(row.price);
    return acc;
  }, {});

  const computedItems = (() => {
    // If we have explicit phone details or per-IMEI prices, synthesize items
    if (phoneDetailArray.length > 0 || imeiPricesArray.length > 0 || imeisArray.length > 0) {
      // Prefer to drive rows by phoneDetail when present, else by IMEIs, else by imeiPrices
      const baseLen = phoneDetailArray.length || imeisArray.length || imeiPricesArray.length;
      const warranty = data?.warranty || data?.dataReceived?.warranty || '';

      return Array.from({ length: baseLen }, (_, index) => {
        const detail = phoneDetailArray[index] || {};
        const fallbackImei = (imeiPricesArray[index] && imeiPricesArray[index].imei) || '';
        const imei = (detail && (detail.imei1 || detail.imei)) || imeisArray[index] || fallbackImei || '';

        const model = detail?.modelName || (Array.isArray(data?.modelName) ? data.modelName[index] : (Array.isArray(data?.dataReceived?.modelName) ? data.dataReceived.modelName[index] : (data?.modelName || data?.dataReceived?.modelName))) || 'N/A';
        const brand = detail?.companyName || (Array.isArray(data?.companyName) ? data.companyName[index] : (Array.isArray(data?.dataReceived?.companyName) ? data.dataReceived.companyName[index] : (data?.companyName || data?.dataReceived?.companyName))) || 'N/A';
        const color = detail?.color ?? (Array.isArray(data?.color) ? data.color[index] : (Array.isArray(data?.dataReceived?.color) ? data.dataReceived.color[index] : (data?.color || data?.dataReceived?.color))) ?? 'N/A';
        const simOption = detail?.simOption ?? (Array.isArray(data?.simOption) ? data.simOption[index] : (Array.isArray(data?.dataReceived?.simOption) ? data.dataReceived.simOption[index] : (data?.simOption || data?.dataReceived?.simOption))) ?? 'N/A';
        const batteryHealth = detail?.batteryHealth ?? (Array.isArray(data?.batteryHealth) ? data.batteryHealth[index] : (Array.isArray(data?.dataReceived?.batteryHealth) ? data.dataReceived.batteryHealth[index] : (data?.batteryHealth || data?.dataReceived?.batteryHealth))) ?? 'N/A';

        const qty = 1;
        // Prefer price by exact IMEI match; fallback to indexed imeiPrices
        const lookupPrice = imei && priceByImei.hasOwnProperty(String(imei))
          ? priceByImei[String(imei)]
          : parseMoney(imeiPricesArray[index]?.price);
        const rateNum = lookupPrice;
        const amountNum = rateNum * qty;

        return {
          no: index + 1,
          name: model,
          code: imei || '-',
          model,
          brand,
          color,
          simOption,
          batteryHealth,
          warranty: warranty || 'N/A',
          qty,
          rate: toCurrency(rateNum),
          amount: toCurrency(amountNum),
        };
      });
    }

    // Fallback to provided items as-is
    return Array.isArray(data?.items) ? data.items : [];
  })();

  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.open();
    printWindow.document.write(generateInvoiceHTML());
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  const termsHtml = (Array.isArray(data?.termsAndConditions) ? data.termsAndConditions : [])
    .map((item, index) => `
    <div style="margin-bottom: 8px; display: flex; align-items: flex-start;">
      <strong style="font-weight: 600; color: #000; margin-right: 4px;">
        ${index + 1}.
      </strong>
      <span>${item}</span>
    </div>
  `)
    .join('');
  const generateInvoiceHTML = () => {
    // Helper to render items rows
    const itemsRows = computedItems
      .map(
        (item) => `
          <tr>
              <td style="color: #000;">${item.no}</td>
              <td style="color: #000;">${item.name}<br><small style="color: #000;">${item.code}</small></td>
              <td style="color: #000;">${item.qty}</td>
              <td style="color: #000;">${item.amount}</td>
          </tr>
          `
      )
      .join('');

    // Helper to render pending rows

    // <div><span class="label">Discount:</span><span class="value">${data.summary.discount}</span></div>
    // <div><span class="label">Previous Bal:</span><span class="value">${data.summary.previousBal}</span></div>
    // <div class="deposit"><span class="label">Bank Deposit:</span><span class="value">${data.summary.bankDeposit}</span></div>
    // <div><span class="label">Current Total:</span><span class="value">${data.summary.currentTotal}</span></div>
    // <div class="left">
    // <div><span>Items:</span><span class="box">${data.summary.items}</span></div>
    // <div><span>Cash Return:</span><span class="box">${data.summary.cashReturn}</span></div>
    // <div><span>Bank Return:</span><span class="box">${data.summary.bankReturn}</span></div>
    // <div><span>Freight:</span><span class="box">${data.summary.freight}</span></div>
    // </div>
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
              color: #000;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 2mm;
          }
          table th,
          table td {
              border: 1px solid #000;
              padding: 0.5mm;
              text-align: center;
              vertical-align: top;
              font-size: 8px;
              color: #000;
          }
          table th:first-child,
          table td:first-child {
              text-align: left;
              width: 5%;
          }
          table th:nth-child(2),
          table td:nth-child(2) {
              text-align: left;
              width: 25%;
          }
          table th:nth-child(3),
          table td:nth-child(3),
          table th:nth-child(4),
          table td:nth-child(4),
          table th:nth-child(5),
          table td:nth-child(5),
          table th:nth-child(6),
          table td:nth-child(6),
          table th:nth-child(7),
          table td:nth-child(7),
          table th:nth-child(8),
          table td:nth-child(8) {
              text-align: center;
              width: 8%;
          }
          table th:nth-child(9),
          table td:nth-child(9),
          table th:nth-child(10),
          table td:nth-child(10),
          table th:nth-child(11),
          table td:nth-child(11) {
              text-align: center;
              width: 6%;
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
              color: #000;
              font-weight: bold;
          }
          .summary .right .deposit .label {
              color: #000;
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
            <div style={{ display: 'flex', justifyContent: 'space-between',width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                ${logoUrl ? `<img src="${logoUrl}" alt="logo" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.2),0 2px 6px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.2)"/>` : ''}
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px', fontSize: '12px', color: '#000' }}>
                    ${shopName}
                  </div>
                  <div style={{ fontSize: '9px', color: '#000', fontWeight: '500' }}>
                    ${shopAddress}
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#000' }}>Okiiee</h4>
              </div>
            </div>
          </div>
              <div class="title">${data.title}</div>
              <div class="subtitle">${data.subtitle}</div>
          </div>
          <div class="meta">
              <div><strong>Date:</strong> ${data.date}</div>
              // <div><strong>Inv#:</strong> ${data.invoiceNumber}</div>
          </div>
          <div class="customer">
              <strong>Name:</strong> <b>${data.customer.name}</b><br>
              <strong>Cel No:</strong> ${data.customer.phone}
          </div>
          <table>
              <thead>
              <tr>
                  <th style="color: #000;">No</th>
                  <th style="color: #000;">Item</th>
                  <th style="color: #000;">Qty</th>
                  <th style="color: #000;">Amount</th>
              </tr>
              </thead>
              <tbody>
              ${itemsRows}
              </tbody>
          </table>
          <div class="summary">
          
              <div class="right">
              <div><span class="label">SubTotal:</span><span class="value">${data.summary.subTotal}</span></div>
              <div class="net"><span class="label">Net Total:</span><span class="value">${data.summary.netTotal}</span></div>
              <div><span class="label">Total:</span><span class="value">${data.summary.total}</span></div>
            
              </div>
          </div>
             <div
            style={{
              marginTop: '10px',
              padding: '8px',
              borderTop: '1px solid #ccc',
              fontSize: '6px',
              color: '#000',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                marginBottom: '4px',
                textTransform: 'uppercase',
                color: '#000',
              }}
            >
              Terms & Conditions
            </div>

            <div style="margin-top: 10px; padding: 8px; border-top: 1px solid #ccc; font-size: 6px; color: #000; font-family: Arial, sans-serif">
        <div  style="font-weight: bold; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; color: #000">
          Terms & Conditions
        </div>
        <div style="font-size: 8px; display: flex; flex-direction: column; gap: 2px">
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
            color: '#000',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <div>
                  <div
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '2px',
                      fontSize: '12px',
                      color: '#000',
                    }}
                  >
                    {shopName}
                  </div>
                  <div style={{ fontSize: '9px', color: '#000', fontWeight: '500' }}>
                    {shopAddress}
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#000' }}>Okiiee</h4>
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '5px 0',
              color: '#000',
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
              color: '#000',
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
              color: '#000',
            }}
          >
            <div>
              <strong>Date:</strong> {data.date}
            </div>
            <div>
              {/* <strong>Inv#:</strong> {data.invoiceNumber} */}
            </div>
          </div>

          <div style={{ fontSize: '12px', margin: '5px 0', color: '#000' }}>
            <strong>Name:</strong>{' '}
            <span style={{ color: '#000' }}>{data.customer.name}</span>
            <br />
            <strong>Cel No:</strong> {data.customer.phone}
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '10px 0',
              fontSize: '8px',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '2px',
                    textAlign: 'left',
                    color: '#000',
                  }}
                >
                  No
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '2px',
                    textAlign: 'left',
                    color: '#000',
                  }}
                >
                  Item
                </th>
                <th style={{ border: '1px solid #000', padding: '2px', color: '#000' }}>
                  Qty
                </th>
                <th style={{ border: '1px solid #000', padding: '2px', color: '#000' }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {computedItems.map((item) => (
                <tr key={item.no}>
                  <td style={{ border: '1px solid #000', padding: '2px', color: '#000' }}>
                    {item.no}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', color: '#000' }}>
                    {item.name}
                    <br />
                    <small style={{ fontSize: '6px', color: '#000' }}>{item.code}</small>
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '2px',
                      textAlign: 'center',
                      color: '#000',
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      padding: '2px',
                      textAlign: 'center',
                      color: '#000',
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
              color: '#000',
            }}
          >
            {/* <div style={{ width: '48%' }}>
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
            </div> */}

            <div style={{ width: '48%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                  color: '#000',
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
                  color: '#000',
                }}
              >
                <span>Net Total:</span>
                <span style={{ color: '#000', fontWeight: 'bold' }}>
                  {data.summary.netTotal}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                  color: '#000',
                }}
              >
                <span>Total:</span>
                <span>{data.summary.total}</span>
              </div>
              {/* <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span style={{ color: '#000' }}>Bank Deposit:</span>
                <span>{data.summary.bankDeposit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Current Total:</span>
                <span>{data.summary.currentTotal}</span>
              </div> */}
            </div>
          </div>

          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              margin: '10px 0',
            }}
          >
            <div>{data.timestamp}</div>
            <div>Operator: {data.operator}</div>
          </div> */}

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
          {/* 
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
          </div> */}
          <div
            style={{
              marginTop: '10px',
              padding: '8px',
              borderTop: '1px solid #ccc',
              fontSize: '6px',
              color: '#000',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                marginBottom: '4px',
                textTransform: 'uppercase',
                color: '#000',
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
                      color: '#000',
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
