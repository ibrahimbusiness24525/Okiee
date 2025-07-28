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
  const [accessoriesRecords, setAccessoriesRecords] = useState([]);

  useEffect(() => {
    const fetchTodayAccessories = async () => {
      const records = await getAccessoriesRecords();
      const today = new Date().toDateString();
      const filtered = records.filter(
        (item) => new Date(item.createdAt).toDateString() === today
      );
      setAccessoriesRecords(filtered);
    };
    fetchTodayAccessories();
  }, []);
  const getAccessoriesRecords = async () => {
    try {
      const response = await api.get(`api/accessory/accessoryRecord`);
      console.log('Accessories Records:', response.data);
      setAccessoriesRecords(response?.data);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching accessories records:', error);
      return [];
    }
  };

  const handlePrintClick = (invoice) => {
    const formattedInvoice = {
      editing: true,
      id: invoice.id,
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
  console.log('allInvoices', allInvoices);
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
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: obj.profit < 0 ? '#ffe6e6' : '#e6ffe6',
                    color: obj.profit < 0 ? '#cc0000' : '#006600',
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
                    {obj.profit < 0
                      ? `Loss of ${-obj.profit}`
                      : `Profit of ${obj.profit}`}
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
        routes={['/sales/BulkSales']}
        array={allbulkSales}
        search={'imei1'}
        keysToDisplay={[
          'type',
          // 'purchasePrice',
          'salePrice',
          'sellingPaymentType',
          'warranty',
          'dateSold',
        ]}
        label={[
          'Type of Sale',
          // 'Purchase Price',
          'Sale Price',
          'Selling Payment Type',
          'Warranty',
          'Invoice Date',
          // "Barcode Generator"
        ]}
        customBlocks={[
          // {
          //   index: 1,
          //   component: (purchasePrice) => {
          //     return purchasePrice === 0 ? 'Not mentioned' : purchasePrice;
          //   },
          // },
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
        extraColumns={[
          (obj) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: obj.profit < 0 ? '#ffe6e6' : '#e6ffe6',
                  color: obj.profit < 0 ? '#cc0000' : '#006600',
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
                  {obj.profit < 0
                    ? `Loss of ${-obj.profit}`
                    : `Profit of ${obj.profit}`}
                </p>
                <Button
                  onClick={() => handlePrintBulkClick(obj)}
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
      <h3
        style={{
          textAlign: 'start',
          marginBottom: '40px',
          fontWeight: '700',
          marginTop: '2rem',
        }}
      >
        Accessory Record
      </h3>
      <Table
        array={accessoriesRecords}
        search="accessoryName"
        keysToDisplay={[
          'type',
          'personName',
          'accessoryList',
          'perPiecePrice',
          'quantity',
          'personTakingCredit',
          'totalPrice',
          'createdAt',
        ]}
        label={[
          'Payment',
          'Customer',
          'Product',
          'Unit Price',
          'Qty',
          'Credit',
          'Total',
          'Date',
          'Profit/Loss',
        ]}
        customBlocks={[
          {
            index: 0, // Payment type
            component: (_, row) => (
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  backgroundColor:
                    row.personStatus === 'Payable' ? '#ffe6e6' : '#e6f9e6',
                  color: row.personStatus === 'Payable' ? '#c0392b' : '#27ae60',
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                }}
              >
                {row.personStatus === 'Payable' ? 'Credit' : 'Paid'}
              </div>
            ),
          },
          {
            index: 2, // Product column
            component: (accessoryList) => (
              <span
                style={{
                  fontWeight: 500,
                  color: '#1976D2',
                }}
              >
                <select
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#fff',
                    color: '#1976D2',
                    fontWeight: 500,
                    fontSize: '0.95em',
                    outline: 'none',
                    minWidth: '100px',
                  }}
                >
                  {Array.isArray(accessoryList) && accessoryList.length > 0 ? (
                    accessoryList.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} quantity ({item.quantity}) price (
                        {item?.perPiecePrice})
                      </option>
                    ))
                  ) : (
                    <option value="">No products</option>
                  )}
                </select>
              </span>
            ),
          },
          {
            index: 1, // Customer Name
            component: (name) => (
              <span
                style={{
                  fontWeight: 500,
                  color: '#1976D2',
                }}
              >
                {name || 'Walk-in'}
              </span>
            ),
          },
          {
            index: 3, // Unit Price
            component: (price) =>
              price === 0 ? (
                <span style={{ color: '#888', fontStyle: 'italic' }}>
                  Not mentioned
                </span>
              ) : (
                <span style={{ fontWeight: 500, color: '#2E7D32' }}>
                  Rs. {price.toLocaleString()}
                </span>
              ),
          },
          {
            index: 5, // Credit
            component: (amount) => (
              <span
                style={{
                  fontWeight: 500,
                  color: amount > 0 ? '#c0392b' : '#388E3C',
                }}
              >
                {amount > 0 ? `Rs. ${amount.toLocaleString()}` : 'Cleared'}
              </span>
            ),
          },
          {
            index: 6, // Total Price
            component: (price) => (
              <span
                style={{
                  fontWeight: 600,
                  color: '#1976D2',
                }}
              >
                Rs. {price.toLocaleString()}
              </span>
            ),
          },
          {
            index: 7, // Date
            component: (date) => (
              <span
                style={{
                  color: '#616161',
                  fontSize: '0.875rem',
                }}
              >
                {new Date(date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            ),
          },
        ]}
        extraColumns={[
          (obj) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: obj.profit < 0 ? '#ffe5e5' : '#e6f9e6',
                color: obj.profit < 0 ? '#c0392b' : '#27ae60',
                fontWeight: 600,
                fontSize: '14px',
                width: '100%',
                maxWidth: '320px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
              }}
            >
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {obj.profit < 0
                  ? `Loss of Rs. ${Math.abs(obj.profit)}`
                  : `Profit of Rs. ${obj.profit}`}
              </span>
            </div>
          ),
        ]}
      />
    </div>
  );
};

export default TodaySales;
