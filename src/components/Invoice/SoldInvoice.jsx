import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from 'config/constant';

const SoldInvoice = () => {
  const styles = {
    container: {
      width: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      padding: '25px',
      background: 'linear-gradient(to bottom right, #ffffff, #a9b7d0)',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      boxSizing: 'border-box',
    },

    OkieeText: {
   color: '#a9b7d0'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '15px',
      borderBottom: '2px solid #3f4d67',
    },
    title: {
      color: '#3f4d67',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    button: {
      margin: '10px 5px',
      padding: '12px 24px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    printBtn: {
      backgroundColor: '#6c757d',
      color: '#fff',
    },
    downloadBtn: {
      backgroundColor: '#28a745',
      color: '#fff',
    },
    submitBtn: {
      backgroundColor: '#3f4d67',
      color: '#fff',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop:'80px'
    },
    info: {
      marginTop: '80px',
      padding: '20px', // Add padding for better spacing inside the border
      border: '2px solid #3f4d67', // Border color matching the theme
      borderRadius: '12px', // Rounded corners
      backgroundColor: 'linear-gradient(to bottom right, #ffffff, #a9b7d0)', // Light background for contrast
    },
    
    th: {
      padding: '12px',
      backgroundColor: '#3f4d67',
      color: '#a9b7d0',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    td: {
      padding: '12px',
      textAlign: 'center',
      color: '#3f4d67',
    },
    stripedRow: {
      backgroundColor: '#f9f9f9',
    },
    totalSection: {
      padding: '8px', // Add padding for better spacing inside the border
      border: '2px solid #3f4d67', // Border color matching the theme
      borderRadius: '12px', // Rounded corners
      backgroundColor: 'linear-gradient(to bottom right, #ffffff, #a9b7d0)',
      textAlign: 'left',
      marginTop: '40px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
    },
    footer: {
      textAlign: 'center',
      marginTop: '30px',
      paddingTop: '15px',
      borderTop: '2px solid #a9b7d0',
      color: 'black',
      fontSize: '14px',
    },
    input: {
      width: '100px',
      padding: '8px',
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    regulationsSection: {
      marginTop: '50px',
      marginBottom:'80px',
      padding: '15px',
      backgroundColor: '#3f4d67',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#a9b7d0',
    },
    regulationTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#a9b7d0',
    },
    regulationText: {
      marginTop: '10px',
      fontSize: '14px',
      color: '#a9b7d0',
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
      <div style={{ textAlign: 'right', marginRight: '225px', marginBottom:'10px' }}>
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
          <h2 style={{color:'#3f4d67'}}>{shop?.shopName ?? 'Shop Name'}</h2>
          <p style={{color:'#3f4d67'}}><strong>Contact Number:</strong> {shop?.contactNumber[1] ? '1:-'+ shop?.contactNumber[0] +'   ' +'2:-'+ shop?.contactNumber[1] : shop?.contactNumber[0]}</p>

           <h2 style={styles.OkieeText}>Okiee</h2>
        </header>

        <section style={styles.info}>
          <p style={{color:'#3f4d67'}}><strong>Shop Adress:</strong> {shop?.address ?? 'Address not available'}</p>
          <div>
            <p style={{color:'#3f4d67'}}><strong>Invoice No:</strong> {invoiceData.invoiceNumber}</p>
            <p style={{color:'#3f4d67'}}><strong>Date of Sale:</strong> {invoiceData.invoiceDate}</p>
          </div>
        </section>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Model</th>
              <th style={styles.th}>{dataReceived?.imei2 ? 'IMEI 1' : 'IMEI'}</th>
              {dataReceived?.imei2 && <th style={styles.th}>IMEI 2</th>}
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Company Warranty</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.stripedRow}>
              <td style={styles.td}>{dataReceived.invoice ? dataReceived.invoice?.items[0]?.mobileCompany : dataReceived?.companyName ?? 'N/A'}</td>
              <td style={styles.td}>{dataReceived.invoice ? dataReceived.invoice?.items[0]?.mobileName : dataReceived?.modelSpecifications ?? 'N/A'}</td>
              <td style={styles.td}>{dataReceived?.imei ?? 'N/A'}</td>
              {dataReceived?.imei2 && <td style={styles.td}>{dataReceived.imei2 ?? 'N/A'}</td>}
              <td style={styles.td}>
                {dataReceived.invoice ? dataReceived.invoice?.totalAmount : dataReceived?.finalPrice ?? 'N/A'}
              </td>
              <td style={styles.td}>
              {dataReceived.warranty ?? 'N/A'}

              </td>
            </tr>
          </tbody>
        </table>

        <div style={styles.totalSection}>
          <h3 style={{color:'#3f4d67'}}>Total: {price}</h3>
        </div>

        {/* Rules and Regulations Section */}
        <div style={styles.regulationsSection}>
  <div style={styles.regulationTitle}>Terms and Conditions</div>
  <div style={styles.regulationText}>
    {shop?.termsCondition.map((item, index) => (
      <p key={index}><strong>{index + 1}.</strong> {item}</p>
    ))}
  </div>
</div>



        <footer style={styles.footer}>
          <p style={{color:'#3f4d67'}}>
            Contact Numbers:{' '}
            {shop?.contactNumber?.length
              ? shop.contactNumber.map((number, index) => (
                <span key={index}>
                  {number}
                  {index < shop.contactNumber.length - 1 && ', '}
                </span>
              ))
              : 'N/A'}
          </p>
          <p style={{color:'#3f4d67'}}>
            {shop?.shopName ?? 'Shop Name'} | Email: example@mobile.com | Website: example.com
          </p>
        </footer>
      </div>

      
    </div>
  );
};

export default SoldInvoice;
