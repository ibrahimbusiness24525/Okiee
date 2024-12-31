import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from 'config/constant';

const SoldInvoice = () => {
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
      marginBottom: '30px',
      paddingBottom: '15px',
      borderBottom: '3px solid #004B87',
      color: '#004B87',
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#004B87',
      letterSpacing: '1px',
    },
    infoSection: {
      marginBottom: '30px',
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
      backgroundColor: '#004B87',
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
      color: '#004B87',
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
      marginTop: '40px',
      paddingTop: '20px',
      borderTop: '3px solid #004B87',
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
      color: '#004B87',
    },
    termsText: {
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '10px',
    },
  };

  const location = useLocation();
  const dataReceived = location?.state ?? {};

  const [shop, setShop] = useState(null);
  const [price, setPrice] = useState(dataReceived.invoice?.totalAmount ?? dataReceived?.finalPrice ?? dataReceived?.demandPrice ?? 0);
  const [invoiceData, setInvoiceData] = useState({
    shopId: shop?.shopId ?? '',
    invoiceNumber: dataReceived.invoice ? dataReceived.invoice?.invoiceNumber : `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    invoiceDate: dataReceived.invoice 
    ? new Date(dataReceived.invoice?.invoiceDate).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0],
    items: dataReceived.invoice ? dataReceived.invoice?.items : [],
    totalAmount: dataReceived.invoice ? dataReceived.invoice?.totalAmount : 0,
  });

  useEffect(() => {
    const shopData = localStorage.getItem('shop');
    if (shopData) {
      const parsedShop = JSON.parse(shopData);
      setShop(parsedShop);

      setInvoiceData((prevInvoiceData) => ({
        ...prevInvoiceData,
        shopId: parsedShop.shopId,
        totalAmount: price,
        items: [
          {
            mobileId: dataReceived._id,
            mobileName: dataReceived.modelSpecifications,
            mobileCompany: dataReceived.companyName,
            imei: dataReceived.imei,
            imei2: dataReceived.imei2 ?? '',
            warranty: '1 year',
            quantity: 1,
            invoiceNumber: invoiceData.invoiceNumber,
          },
        ],
      }));
    }
  }, []);

  const handlePrint = () => {
    const printContents = document.getElementById('invoice').outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownload = () => {
    const element = document.getElementById('invoice');
    html2pdf().from(element).save('invoice.pdf');
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    setInvoiceData({
      ...invoiceData,
      totalAmount: newPrice,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(BASE_URL + `api/invoice/invoices`, invoiceData);
      if (response) {
        alert('Invoice submitted successfully');
      }
    } catch (error) {
      alert('Error submitting invoice: ' + error.message);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          style={{ ...styles.button, ...styles.printBtn }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'none')}
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          style={{ ...styles.button, ...styles.downloadBtn }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'none')}
          onClick={handleDownload}
        >
          Download
        </button>
        {!dataReceived?.invoice && (
          <button
            style={{ ...styles.button, ...styles.submitBtn }}
            onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.target.style.transform = 'none')}
            onClick={handleSubmit}
          >
            Submit Invoice
          </button>
        )}
      </div>

      <div id="invoice" style={styles.container}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.logo}>{shop?.shopName ?? 'Shop Name'}</h2>
            <p>{shop?.contactNumber?.join(' | ') ?? 'Contact number not available'}</p>
          </div>
          <h2 style={{ color: '#004B87' }}>Okiiee</h2>
        </header>

        <section style={styles.infoSection}>
          <p><strong>Shop Address:</strong> {shop?.address ?? 'Address not available'}</p>
          <p><strong>Invoice No:</strong> {invoiceData.invoiceNumber}</p>
          <p><strong>Date of Sale:</strong> {invoiceData.invoiceDate}</p>
        </section>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Model</th>
              <th style={styles.th}>IMEI</th>
              {dataReceived?.imei2 && <th style={styles.th}>IMEI 2</th>}
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Warranty</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.stripedRow}>
              <td style={styles.td}>{dataReceived?.companyName ?? 'N/A'}</td>
              <td style={styles.td}>{dataReceived?.modelSpecifications ?? 'N/A'}</td>
              <td style={styles.td}>{dataReceived?.imei ?? 'N/A'}</td>
              {dataReceived?.imei2 && <td style={styles.td}>{dataReceived.imei2 ?? 'N/A'}</td>}
              <td style={styles.td}>{dataReceived?.finalPrice ?? 'N/A'}</td>
              <td style={styles.td}>{dataReceived?.warranty ?? 'N/A'}</td>
            </tr>
          </tbody>
        </table>

        <div style={styles.totalSection}>
          <h3>Total:{price}Rs</h3>
        </div>

        {/* Terms & Conditions Section */}
        <div style={styles.termsSection}>
          <h3 style={styles.termsHeading}>Terms & Conditions</h3>
          <p style={styles.termsText}>1. All sales are final once the invoice is generated.</p>
          <p style={styles.termsText}>2. Warranty is valid only for products with a valid invoice.</p>
          <p style={styles.termsText}>3. The company is not responsible for any damages caused by misuse of the product.</p>
          <p style={styles.termsText}>4. Payment must be made in full before the invoice is considered complete.</p>
          <p style={styles.termsText}>5. Terms and conditions are subject to change without prior notice.</p>
        </div>

        <footer style={styles.footer}>
          <p>
            {shop?.shopName ?? 'Shop Name'} | Email: example@mobile.com | Website: example.com
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SoldInvoice;
