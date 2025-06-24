import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import { dateFormatter } from 'utils/dateFormatter';
import Table from 'components/Table/Table';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';
import BarcodePrinter from 'components/BarcodePrinter/BarcodePrinter';
import { Button } from 'react-bootstrap';

const TodaySales = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [allbulkSales, setAllBulkSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBulkSales();
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`api/Purchase/sold-single-phones`);

      setAllInvoices(
        response.data.soldPhones.filter((item) => {
          return (
            new Date(item.saleDate).toDateString() === new Date().toDateString()
          );
        })
      );
    } catch (error) {}
  };

  const getAllBulkSales = async () => {
    try {
      const response = await api.get(`api/Purchase/all-sales`);

      setAllBulkSales(
        response.data.data.filter((item) => {
          return (
            new Date(item.dateSold).toDateString() === new Date().toDateString()
          );
        })
      );
    } catch (error) {
      console.error('Error fetching bulk sales:', error);
    }
  };

  const handlePrintClick = (invoice) => {
    const formattedInvoice = {
      editing: true,
      id: invoice._id,
      companyName: invoice.companyName,
      modelName: invoice.modelName,
      imei1: invoice.imei1,
      imei2: invoice.imei2 ? invoice.imei2 : undefined,
      customerNumber: invoice.customerNumber,
      finalPrice: invoice.finalPrice,
      sellingType: invoice.sellingPaymentType,
      warranty: invoice.warranty,

      cnicBackPic: invoice.cnicBackPic,
      cnicFrontPic: invoice.cnicFrontPic,
      saleDate: invoice.saleDate,
      customerName: invoice.customerName,
      accessories: invoice.accessories || [],
      bankName: invoice.bankName || '', // provide fallback if missing
      payableAmountNow: invoice.payableAmountNow || 0,
      payableAmountLater: invoice.payableAmountLater || 0,
      payableAmountLaterDate: invoice.payableAmountLaterDate || null,
      exchangePhoneDetail: invoice.exchangePhoneDetail || null,
      customerNumber: invoice.customerNumber,
    };

    navigate('/invoice/shop', { state: formattedInvoice });
  };
  const handlePrintBulkClick = (invoice) => {
    console.log(invoice);

    const formattedInvoice = {
      editing: true,
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      salePrice: invoice.salePrice,
      totalInvoice: invoice.totalInvoice,
      sellingPaymentType: invoice.sellingPaymentType,
      warranty: invoice.warranty,
      dateSold: invoice.dateSold,
      imei1: invoice.imei1,
      imei2: invoice.imei2,
      cnicFrontPic: invoice.cnicFrontPic,
      cnicBackPic: invoice.cnicBackPic,
      accessories: invoice.accessories || [],
      addedImeis: invoice.addedImeis || [],
      type: invoice.type,
      bulkPhonePurchaseId: invoice.bulkPhonePurchaseId,
    };
    //     const formattedInvoice = {
    //   ...invoice,
    //   finalPrice: invoice.salePrice,
    //   sellingType: invoice.sellingPaymentType,
    //   warranty: invoice.warranty,
    //   saleDate: invoice.dateSold,
    //   addedImeis: invoice.addedImeis || [],
    //   cnicBackPic: invoice.cnicBackPic,
    //   cnicFrontPic: invoice.cnicFrontPic,
    //   customerName: invoice.customerName,
    //   accessories: invoice.accessories || [],
    //   bankName: invoice.bankName || '',
    //   payableAmountNow: invoice.payableAmountNow || 0,
    //   payableAmountLater: invoice.payableAmountLater || 0,
    //   payableAmountLaterDate: invoice.payableAmountLaterDate || null,
    //   exchangePhoneDetail: invoice.exchangePhoneDetail || null,
    //   customerNumber: invoice.customerNumber,
    // };
    navigate('/invoice/shop', { state: formattedInvoice });
  };
  const styles = {
    container: {
      padding: '20px',
      // backgroundColor: 'rgb(249, 250, 251)',
      borderRadius: '8px',
    },
    searchBar: {
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      width: '100%',
      boxSizing: 'border-box',
    },
    tableWrapper: {},
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    header: {
      // backgroundColor: 'rgb(220, 220, 220)',
      color: '#333',
      textAlign: 'center',
      padding: '10px',
      borderBottom: '2px solid #ddd',
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
    headerCell: {
      padding: '8px',
      fontWeight: 'bold',
      fontSize: '1.1em',
    },
    row: {
      backgroundColor: '#fff',
      transition: 'background-color 0.3s',
    },
    cell: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
      color: '#333',
    },
    printIcon: {
      cursor: 'pointer',
      color: '#000',
      transition: 'color 0.3s',
    },
  };
  const [scannedBarcodeValue, setScannedBarcodeValue] = useState('');
  const handleScan = (value) => {
    setScannedBarcodeValue(value);
  };
  return (
    <div style={styles.container}>
      <h2 style={{ width: '100%' }}>Today Sales Invoices</h2>
      <div style={styles.tableWrapper}>
        {/* <BarcodeReader onScan={handleScan} /> */}
        <div>
          <h3
            style={{
              textAlign: 'start',
              marginBottom: '40px',
              marginTop: '33px',
              fontWeight: '700',
            }}
          >
            Single Invoices
          </h3>
        </div>
        {/* <StyledHeading>New Phones</StyledHeading> */}

        <Table
          routes={['/sales/todaySales']}
          array={allInvoices}
          search={'imei1'}
          keysToDisplay={[
            'customerName',
            'companyName',
            'sellingPaymentType',
            'purchasePrice',
            'salePrice',
            'saleDate',
          ]}
          label={[
            'Customer Name',
            'Company Name',
            'Selling Payment Type',
            'Purchase Price',
            'Sale Price',
            'Date Sold',
            'Profit/Loss & Barcode Generator',
          ]}
          customBlocks={[
            {
              index: 2,
              component: (sellingType) => {
                return sellingType ? sellingType : 'Not mentioned';
              },
            },
            {
              index: 4,
              component: (salePrice) => {
                return salePrice ? salePrice : 'Not Mentioned';
              },
            },
            {
              index: 5,
              component: (date) => {
                return dateFormatter(date);
              },
            },
          ]}
          extraColumns={[
            (obj) => {
              const salePrice = Number(obj.salePrice) || 0;
              const purchasePrice = Number(obj.purchasePrice) || 0;
              const profitOrLoss = salePrice - purchasePrice;

              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: profitOrLoss < 0 ? '#ffe6e6' : '#e6ffe6',
                    color: profitOrLoss < 0 ? '#cc0000' : '#006600',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    width: '300px', // You can adjust this value as needed
                    justifyContent: 'space-between',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {profitOrLoss < 0
                      ? `Loss of ₹${-profitOrLoss}`
                      : `Profit of ₹${profitOrLoss}`}
                  </p>
                  <Button
                    onClick={() => handlePrintClick(obj)}
                    style={{
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <FaPrint style={{ marginRight: '8px' }} />
                    Get Invoice
                  </Button>
                </div>
              );
            },
          ]}
        />
      </div>
      <div>
        <h3
          style={{
            textAlign: 'start',
            marginBottom: '40px',
            fontWeight: '700',
            marginTop: '2rem',
          }}
        >
          Bulk Invoices
        </h3>
      </div>
      <Table
        routes={['/sales/todayBulkSales']}
        array={allbulkSales}
        search={'imei1'}
        keysToDisplay={[
          'type',
          // "modelName",
          // "companyName",
          // "partyName",
          'salePrice',
          'sellingPaymentType',
          'warranty',
          'dateSold',
        ]}
        label={[
          // "Model Name",
          // "Company",
          // "Party Name",
          'Type of Sale',
          'Price',
          'Selling Payment Type',
          'Warranty',
          'Invoice Date',
        ]}
        customBlocks={[
          {
            index: 2,
            component: (sellingType) => {
              return sellingType ? sellingType : 'Not mentioned';
            },
          },
          {
            index: 4,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
      />
    </div>
  );
};

export default TodaySales;
