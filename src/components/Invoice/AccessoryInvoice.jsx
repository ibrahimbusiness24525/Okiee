import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { SmallInvoiceComponent } from 'components/SmallInvoiceComponent';
import Modal from 'components/Modal/Modal';
import { toast } from 'react-toastify';
import { InvoiceComponent } from 'components/InvoiceComponent';

const AccessoryInvoice = () => {
  const { state } = useLocation();
  const invoiceData = state?.data || {};
  const invoiceRef = useRef();

  console.log('Data received in AccessoryInvoice:', invoiceData);

  // State for color selection and invoice type
  const [selectedColor, setSelectedColor] = useState('#004B87');
  const [showSmallInvoice, setShowSmallInvoice] = useState(false);
  const [originalInvoice, setOriginalInvoice] = useState(true);

  // Color options
  const colorOptions = [
    { name: 'Dark Blue', code: '#004B87' },
    { name: 'Sky Blue', code: '#87CEEB' },
    { name: 'Emerald Green', code: '#28a745' },
    { name: 'Bright Orange', code: '#fd7e14' },
    { name: 'Cherry Red', code: '#dc3545' },
    { name: 'Royal Purple', code: '#6f42c1' },
    { name: 'Golden Yellow', code: '#ffc107' },
    { name: 'Black', code: '#000000' },
    { name: 'Soft Grey', code: '#6c757d' },
    { name: 'Slate Grey', code: '#708090' },
    { name: 'Teal Tint', code: '#20c997' },
    { name: 'Lavender', code: '#b57edc' },
  ];

  // Calculate totals
  const subtotal = invoiceData.sales?.reduce(
    (sum, item) => sum + item.perPiecePrice * item.quantity,
    0
  );
  const total = subtotal;

  // Format date
  const invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    pageStyle: `
      @page {
        size: A5;
        margin: 0;
      }
      @media print {
        body {
          padding: 0;
          margin: 0;
        }
        .no-print {
          display: none !important;
        }
        .invoice-container {
          box-shadow: none;
          border: none;
          margin: 0;
          padding: 0;
          width: 100%;
        }
      }
    `,
  });

  // Toggle between invoice views
  const handleChangePreview = () => {
    if (originalInvoice) {
      setOriginalInvoice(false);
      setShowSmallInvoice(true);
    } else {
      setOriginalInvoice(true);
      setShowSmallInvoice(false);
    }
  };
  const [shop, setShop] = useState({});
  useEffect(() => {
    const shopData = localStorage.getItem('shop');
    if (shopData) {
      const parsedShop = JSON.parse(shopData);
      setShop(parsedShop);
    }
  }, []);
  console.log('Shop data:', shop);

  // Prepare data for small invoice
  const smallInvoiceData = {
    termsAndConditions:
      shop?.termsCondition || 'No terms and conditions provided',
    shopInfo: 'Shop Address Not Mentioned',
    title: 'Okiiee',
    subtitle:
      invoiceData.purchasePaymentType === 'credit'
        ? 'Credit Sale'
        : 'Counter Sale',
    date: invoiceDate,
    invoiceNumber: `ACC-${Math.floor(Math.random() * 1000000)}`,
    customer: {
      name:
        invoiceData.entityData?.name ||
        invoiceData?.newEntity?.name ||
        'Customer Name Not Provided',
      phone:
        invoiceData.entityData?.number ||
        invoiceData?.newEntity?.number ||
        '____________________',
    },
    items:
      invoiceData.sales?.map((item, index) => ({
        no: index + 1,
        name: `Accessory ${index + 1}`,
        code: item.accessoryId.slice(-6),
        qty: item.quantity,
        rate: String(item.perPiecePrice),
        amount: String(item.perPiecePrice * item.quantity),
      })) || [],
    summary: {
      items: invoiceData.sales?.length || 0,
      cashReturn: '–',
      bankReturn: '–',
      freight: '–',
      subTotal: String(subtotal),
      discount: '–',
      netTotal: String(total),
      previousBal: '–',
      total: String(total),
      bankDeposit: invoiceData.getPayment?.amountFromBank || '–',
      currentTotal: '–',
    },
    operator: 'admin',
    timestamp: new Date().toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    pending:
      invoiceData.purchasePaymentType === 'credit'
        ? [
            {
              no: 1,
              name: 'Accessory Sale',
              qty: 1,
            },
          ]
        : [],
    social: {
      url: 'http://www.yourshop.com',
      text: 'www.yourshop.com',
    },
    qr: 'qr-code.png',
  };

  // Styles matching your SoldInvoice component
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
      borderBottom: `3px solid ${selectedColor}`,
      color: `${selectedColor}`,
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: `${selectedColor}`,
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
      backgroundColor: `${selectedColor}`,
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
      color: `${selectedColor}`,
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
      borderTop: `3px solid ${selectedColor}`,
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
    },
    termsSection: {
      marginTop: '30px',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      color: '#333',
    },
    termsHeading: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: `${selectedColor}`,
    },
    termsText: {
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '10px',
    },
  };
  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice');
    if (!element) return;
    import('html2pdf.js').then((html2pdf) => {
      html2pdf
        .default()
        .from(element)
        .set({
          margin: 0,
          filename: 'accessory-invoice.pdf',
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        })
        .save();
    });
  };
  return (
    <div>
      {/* Color Selection */}
      {!showSmallInvoice && (
        <div style={{ padding: '20px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
            Select Color:
          </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: selectedColor,
              color: selectedColor === '#000000' ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            <option value="">-- Choose Color --</option>
            {colorOptions.map((color, index) => (
              <option key={index} value={color.code}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          style={{ ...styles.button, ...styles.printBtn }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'none')}
          onClick={handleChangePreview}
        >
          Change Preview
        </button>
        {!showSmallInvoice && (
          <>
            <button
              style={{ ...styles.button, ...styles.printBtn }}
              onMouseEnter={(e) =>
                (e.target.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={(e) => (e.target.style.transform = 'none')}
              onClick={handlePrint}
            >
              Print
            </button>
            <button
              style={{ ...styles.button, ...styles.downloadBtn }}
              onMouseEnter={(e) =>
                (e.target.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={(e) => (e.target.style.transform = 'none')}
              onClick={handleDownloadPDF}
            >
              Download
            </button>
          </>
        )}
      </div>

      {/* Main Invoice Content */}
      {originalInvoice && (
        <div id="invoice" style={styles.container}>
          {/* Header */}
          <header style={styles.header}>
            <div>
              <h2 style={styles.logo}>{shop?.name || 'Accessory Shop'}</h2>
              <p>
                Contact: {shop?.contactNumber?.join(', ') || 'Not Provided'}
              </p>
            </div>
            <h2 style={{ color: `${selectedColor}` }}>Okiiee</h2>
          </header>

          {/* Info Section */}
          <section
            style={{
              ...styles.infoSection,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Side */}
            <div>
              <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                <strong>Shop Address:</strong> 123 Business Street, City
              </p>
              <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                <strong>Invoice No:</strong> ACC-
                {Math.floor(Math.random() * 1000000)}
              </p>
              <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                <strong>Date:</strong> {invoiceDate}
              </p>
            </div>

            {/* Right Side */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                <strong>Customer Name:</strong>{' '}
                {invoiceData.entityData?.name || 'N/A'}
              </p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                <strong>Customer Number:</strong>{' '}
                {invoiceData.entityData?.number || 'N/A'}
              </p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                <strong>Payment Type:</strong>{' '}
                {invoiceData.purchasePaymentType === 'credit'
                  ? 'Credit'
                  : 'Full Payment'}
              </p>
            </div>
          </section>

          {/* Items Table */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Accessory ID</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.sales?.map((item, index) => (
                <tr
                  key={index}
                  style={index % 2 === 0 ? {} : styles.stripedRow}
                >
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>
                    {item?.accessoryId && item.accessoryId?.slice(-6)}
                  </td>
                  <td style={styles.td}>
                    {item?.perPiecePrice && item.perPiecePrice?.toFixed(2)}
                  </td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>
                    {(item?.perPiecePrice * item?.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Payment Summary */}
          <div style={styles.totalSection}>
            {invoiceData.purchasePaymentType === 'credit' && (
              <>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Payable Now:</span>
                  <span>
                    {invoiceData.creditPaymentData?.payableAmountNow || '0'}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Payable Later:</span>
                  <span>
                    {invoiceData.creditPaymentData?.payableAmountLater || '0'}
                  </span>
                </div>
              </>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
              }}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                Total:
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {total?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div style={styles.termsSection}>
            <div style={styles.termsHeading}>Terms & Conditions</div>
            <div style={styles.termsText}>
              {shop?.termsCondition?.map((term, index) => (
                <p key={index}>{term}</p>
              )) || 'No terms and conditions provided'}
            </div>
          </div>

          {/* Footer */}
          <footer style={styles.footer}>
            <p>Thank you for your business!</p>
            <p>For any queries, contact: 123-456-7890</p>
          </footer>
        </div>
      )}

      {/* Small Invoice Preview */}
      {showSmallInvoice && (
        // <SmallInvoiceComponent invoiceData={smallInvoiceData} />
        <InvoiceComponent
          accessoriesData={invoiceData}
          termsAndConditions={shop?.termsCondition}
          a
        />
      )}
    </div>
  );
};

export default AccessoryInvoice;
