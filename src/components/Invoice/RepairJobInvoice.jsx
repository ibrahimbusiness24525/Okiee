import React, { useRef, useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { BASE_URL } from 'config/constant';

const RepairJobInvoice = ({ jobData, onClose }) => {
  const invoiceRef = useRef();
  const [logoUrl, setLogoUrl] = useState(null);
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
      try {
        const res = await api.get('/api/shop/logo');
        if (isMounted && res?.data?.success && res?.data?.logo) {
          const path = String(res.data.logo);
          if (
            path &&
            path !== '{}' &&
            path !== 'null' &&
            path !== 'undefined'
          ) {
            const full = `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
            setLogoUrl(full);
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    const fetchShopData = async () => {
      try {
        // Try to get shop data from localStorage first
        const shopDataFromStorage = localStorage.getItem('shop');
        if (shopDataFromStorage) {
          const parsedShop = JSON.parse(shopDataFromStorage);
          if (isMounted) {
            setShopData(parsedShop);
          }
        } else {
          // Fallback to API if not in localStorage
          const user = JSON.parse(localStorage.getItem('user'));
          if (user?._id) {
            const res = await api.get(`/api/shop/getshop/${user._id}`);
            if (isMounted && res?.data?.shop) {
              setShopData(res.data.shop);
              localStorage.setItem('shop', JSON.stringify(res.data.shop));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
      }
    };

    fetchLogo();
    fetchShopData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0.00';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Number to words conversion
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
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().substr(-2)}`;
  };

  // Generate Job Number from ID
  const getJobNumber = () => {
    if (!jobData?.id) return 'N/A';
    const date = new Date(jobData.createdAt || new Date());
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const idPart = jobData.id.substring(0, 2).toUpperCase();
    return `${year}${month}${day}${idPart}`;
  };

  const totalAmount = Number(jobData?.estimatedAmount || 0);
  const advanceAmount = Number(jobData?.advance || 0);
  const remainingAmount = totalAmount - advanceAmount;

  const totalPartsCost = Array.isArray(jobData?.parts)
    ? jobData.parts.reduce((sum, part) => sum + Number(part?.price || 0), 0)
    : 0;

  const profitAmountRaw =
    typeof jobData?.profit === 'number'
      ? jobData.profit
      : totalAmount - totalPartsCost;
  const profitAmount = profitAmountRaw > 0 ? profitAmountRaw : 0;

  // Print handler - Direct approach
  const handlePrint = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Print button clicked');
    console.log('Invoice ref:', invoiceRef.current);

    if (!invoiceRef.current) {
      console.error('Invoice ref not available');
      alert('Invoice content not ready. Please try again.');
      return;
    }

    try {
      const printContent = invoiceRef.current.innerHTML;
      console.log('Print content length:', printContent.length);

      const printWindow = window.open('', '_blank', 'width=300,height=600');

      if (!printWindow) {
        alert('Please allow popups to print the invoice.');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Repair Job Invoice - ${getJobNumber()}</title>
            <meta charset="UTF-8">
            <style>
              @page {
                size: 80mm auto;
                margin: 0;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                .no-print {
                  display: none !important;
                }
              }
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                padding: 5mm;
                margin: 0;
                width: 80mm;
                background: white;
              }
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load, then print
      const printAfterLoad = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 200);
      };

      if (printWindow.document.readyState === 'complete') {
        printAfterLoad();
      } else {
        printWindow.onload = printAfterLoad;
        // Fallback timeout
        setTimeout(printAfterLoad, 1000);
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Error printing invoice: ' + error.message);
    }
  };

  const shopName = shopData?.shopName || shopData?.name || 'Mobile Shop';
  const shopNumber =
    shopData?.contactNumber?.[0] || shopData?.phone || 'Phone Number';
  const shopAddress = shopData?.address || 'Shop Address';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 8,
          width: '95vw',
          maxWidth: 900,
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 20,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header with close and print buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>
            Repair Job Invoice
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handlePrint}
              className="no-print"
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="no-print"
              style={{
                background: '#6b7280',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice Content - Compact Receipt Format */}
        <div
          ref={invoiceRef}
          style={{
            fontFamily: 'Arial, sans-serif',
            width: '80mm',
            margin: '0 auto',
            padding: '5mm',
            border: '1px solid #000',
            fontSize: '12px',
            backgroundColor: 'white',
            boxSizing: 'border-box',
          }}
        >
          {/* Header Section - Compact */}
          <div
            style={{
              textAlign: 'center',
              borderBottom: '1px dashed #000',
              paddingBottom: '8px',
              marginBottom: '8px',
            }}
          >
            {logoUrl && (
              <div style={{ marginBottom: '6px', textAlign: 'center' }}>
                <img
                  src={logoUrl}
                  alt="logo"
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'contain',
                  }}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#000',
                marginBottom: '2px',
              }}
            >
              {shopName}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#000',
                marginBottom: '2px',
              }}
            >
              {shopAddress}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#000',
              }}
            >
              CONTACT: {shopNumber}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              margin: '6px 0',
              color: '#000',
              textTransform: 'uppercase',
            }}
          >
            SERVICE RECEIPT
          </div>

          {/* Service Receipt Details */}
          <div
            style={{
              borderBottom: '1px dashed #000',
              paddingBottom: '6px',
              marginBottom: '6px',
              fontSize: '11px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '3px',
              }}
            >
              <span>
                <strong>Received:</strong>{' '}
                {formatDate(jobData?.receivedDate || jobData?.createdAt || '')}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '3px',
              }}
            >
              <span>
                <strong>Exp Delivery:</strong>{' '}
                {formatDate(
                  jobData?.expectedDeliveryDate || jobData?.deliveryDate || ''
                )}
              </span>
              <span>
                <strong>Delivered:</strong>{' '}
                {formatDate(
                  jobData?.deliveryDate || jobData?.handoverDate || ''
                )}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                <strong>Handset Received:</strong>{' '}
                {jobData?.isPhoneReceived ? 'Yes' : 'No'}
              </span>
              <span>
                <strong>Dead Approval:</strong>{' '}
                {jobData?.isDeadApproval ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Customer and Device Information */}
          <div
            style={{
              borderBottom: '1px dashed #000',
              paddingBottom: '6px',
              marginBottom: '6px',
              fontSize: '11px',
            }}
          >
            <div style={{ marginBottom: '3px' }}>
              <strong>Customer:</strong> {jobData?.customerName || 'N/A'}
            </div>
            <div style={{ marginBottom: '3px' }}>
              <strong>Cell#:</strong> {jobData?.customerNumber || 'N/A'}
            </div>
            {(jobData?.company || jobData?.model) && (
              <div>
                <strong>Item:</strong>{' '}
                {jobData?.company?.name || jobData?.company || ''}
                {jobData?.model?.name || jobData?.model
                  ? ` ${jobData?.model?.name || jobData?.model}`
                  : ''}
              </div>
            )}
          </div>

          {/* Repair Details */}
          <div
            style={{
              borderBottom: '1px dashed #000',
              paddingBottom: '6px',
              marginBottom: '6px',
              fontSize: '11px',
            }}
          >
            <div style={{ marginBottom: '3px' }}>
              <strong>Issue:</strong> {jobData?.faultIssue || 'N/A'}
            </div>
            <div style={{ marginBottom: '3px' }}>
              <strong>Accessories With Set:</strong> Not Mentioned
            </div>
          </div>

          {/* Parts - names only, no prices */}
          {jobData?.parts && jobData.parts.length > 0 && (
            <div
              style={{
                borderBottom: '1px dashed #000',
                paddingBottom: '6px',
                marginBottom: '6px',
                fontSize: '11px',
              }}
            >
              <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                Parts Used:
              </div>
              <ul style={{ paddingLeft: '14px', margin: 0 }}>
                {jobData.parts.map((part, index) => (
                  <li key={index} style={{ marginBottom: '2px' }}>
                    {part.name || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Financial Summary */}
          <div
            style={{
              borderBottom: '1px dashed #000',
              paddingBottom: '6px',
              marginBottom: '6px',
              fontSize: '11px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '3px',
              }}
            >
              <strong>Est Amt:</strong>
              <span>{formatNumber(totalAmount)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '3px',
              }}
            >
              <strong>Advance:</strong>
              <span>{formatNumber(advanceAmount)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold',
              }}
            >
              <strong>Balance:</strong>
              <span>{formatNumber(remainingAmount)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '3px',
              }}
            >
              <strong>Profit:</strong>
              <span>{formatNumber(profitAmount)}</span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              fontSize: '10px',
              textAlign: 'center',
              color: '#000',
              marginTop: '8px',
            }}
          >
            <div style={{ marginBottom: '2px' }}>
              <strong>Entry By:</strong> Admin
            </div>
            <div>
              <strong>Get Accounting Software:</strong> {shopNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairJobInvoice;
