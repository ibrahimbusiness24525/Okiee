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
import { get } from 'jquery';

const SaleInvoices = () => {
  const [search, setSearch] = useState('');
  const [allInvoices, setAllInvoices] = useState([]);
  const [allbulkSales, setAllBulkSales] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getInvoices();
    getAllBulkSales();
    getAccessoriesRecords();
  }, []);

  const getInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`api/Purchase/sold-single-phones`);
      // const response = await axios.get(`${BASE_URL}api/invoice/invoices/getAll/${user._id}`);

      setAllInvoices(response.data.soldPhones.slice().reverse());
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
  const getAllBulkSales = async () => {
    try {
      const response = await api.get(`api/Purchase/all-sales`);

      setAllBulkSales(response?.data?.data);
    } catch (error) {
      console.error('Error fetching bulk sales:', error);
    }
  };
  console.log('allInvoices', allbulkSales);
  const [accessoriesRecords, setAccessoriesRecords] = useState([]);
  const getAccessoriesRecords = async () => {
    try {
      const response = await api.get(`api/accessory/accessoryRecord`);
      console.log("Accessories Records:", response.data);
      setAccessoriesRecords(response?.data);
      return response?.data || [];


    } catch (error) {
      console.error('Error fetching accessories records:', error);
      return [];
    }
  }
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
      showInvoice: true,
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
    tableWrapper: {
      // maxHeight: '400px',
      // overflowY: 'auto',
      // borderRadius: '8px',
      // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    header: {
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
      <h2 style={{ width: '100%' }}>Sale Invoices</h2>

      <div style={styles.tableWrapper}>
        <div></div>
        <div>
          <h3
            style={{
              textAlign: 'start',
              marginBottom: '40px',
              fontWeight: '700',
              marginTop: '2rem',
            }}
          >
            Single Invoice
          </h3>
        </div>
        <Table
          routes={['/sales/sales']}
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
          'purchasePrice',
          'salePrice',
          'sellingPaymentType',
          'warranty',
          'dateSold',
        ]}
        label={[
          'Type of Sale',
          'Purchase Price',
          'Sale Price',
          'Selling Payment Type',
          'Warranty',
          'Invoice Date',
          // "Barcode Generator"
        ]}
        customBlocks={[
          {
            index: 1,
            component: (purchasePrice) => {
              return purchasePrice === 0 ? 'Not mentioned' : purchasePrice;
            },
          },
          {
            index: 3,
            component: (sellingType) => {
              return sellingType ? sellingType : 'Not mentioned';
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
        search={'accessoryName'}
        keysToDisplay={[
          'type',
          'accessoryName',
          'perPiecePrice',
          'quantity',
          'totalPrice',
          'createdAt',
        ]}
        label={[
          'Type',
          'Accessory Name',
          'Per Piece Price',
          'Quantity',
          'Total Price',
          'Date',
        ]}
        customBlocks={[
          {
            index: 2,
            component: (price) => (price === 0 ? 'Not mentioned' : `Rs. ${price}`),
          },
          {
            index: 5,
            component: (date) => dateFormatter(date),
          },
        ]}
        extraColumns={[
          (obj) => (
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
                width: '300px',
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
                  ? `Loss of Rs. ${-obj.profit}`
                  : `Profit of Rs. ${obj.profit}`}
              </p>
              {/* <Button
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
              </Button> */}
            </div>
          ),
        ]}
      />


    </div>
  );
};

export default SaleInvoices;
