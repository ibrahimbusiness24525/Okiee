import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { FaBackward, FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import { dateFormatter } from 'utils/dateFormatter';
import Table from 'components/Table/Table';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';
import BarcodePrinter from 'components/BarcodePrinter/BarcodePrinter';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Modal from 'components/Modal/Modal';

const TodaySales = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [allbulkSales, setAllBulkSales] = useState([]);
  const [showUpdateReturnModal, setShowUpdateReturnModal] = useState(false);
  const [returningPhoneDetail, setReturningPhoneDetail] = useState({
    soldPhoneBuyingPrice: '',
    newBuyingPrice: '',
    remainingWarranty: '',
    soldPhoneId: '',
  });
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
    } catch (error) { }
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
      showInvoice: true,
      editing: true,
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      customerNumber: invoice.customerNumber,
      salePrice: invoice.salePrice,
      profit: invoice.profit,
      salePrice: invoice.salePrice,
      totalInvoice: invoice.totalInvoice,
      sellingPaymentType: invoice.sellingPaymentType,
      warranty: invoice.warranty,
      accessoriesList: invoice.accessories || [],
      dateSold: invoice.dateSold,
      imei1: invoice.imei1,
      createdAt: invoice.createdAt,
      invoiceNumber: invoice.invoiceNumber,
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
  console.log('allBulkInvoice', allbulkSales);
  const handleReturnSinglePhone = async (invoice) => {
    setShowUpdateReturnModal(true);
    setReturningPhoneDetail({
      soldPhoneBuyingPrice: invoice.salePrice,
      soldPhoneId: invoice._id,
    });
    console.log('invoice', invoice);
    console.log('returningPhoneDetail', returningPhoneDetail);
  };
  console.log('returningPhoneDetail', returningPhoneDetail);

  const handleConfirmReturnSinglePhone = async () => {
    try {
      console.log('payload', {
        newBuyingPrice: returningPhoneDetail.newBuyingPrice,
        remainingWarranty: returningPhoneDetail.remainingWarranty,
      });
      await api.post(
        `api/Purchase/return-single-sold-phone/${returningPhoneDetail.soldPhoneId}`,
        {
          newBuyingPrice: returningPhoneDetail.newBuyingPrice,
          remainingWarranty: returningPhoneDetail.remainingWarranty,
        }
      );
      setShowUpdateReturnModal(false);
      setReturningPhoneDetail({
        soldPhoneBuyingPrice: '',
        newBuyingPrice: '',
        remainingWarranty: '',
        soldPhoneId: '',
      });
      toast.success('Phone returned successfully');
      getInvoices(); // Refresh the invoices list after returning
    } catch (error) {
      toast.error('Error returning phone');
      console.error('Error handling return:', error);
    }
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
                    gap: '8px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: obj.profit < 0 ? '#fff0f0' : '#f0fff0',
                    color: obj.profit < 0 ? '#d32f2f' : '#388e3c',
                    fontWeight: '500',
                    width: '100%',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    lineHeight: '1.2',
                  }}
                >
                  <span
                    style={{
                      flex: '0 1 auto',
                      minWidth: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      padding: '4px 0',
                    }}
                  >
                    {obj.profit < 0 ? `▼ ${-obj.profit}` : `▲ ${obj.profit}`}
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button
                      onClick={() => handlePrintClick(obj)}
                      size="small"
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        height: '24px',
                        minWidth: '70px',
                        justifyContent: 'center',
                      }}
                    >
                      <FaPrint
                        style={{ marginRight: '4px', fontSize: '10px' }}
                      />
                      <span>Invoice</span>
                    </Button>

                    <Button
                      onClick={() => handleReturnSinglePhone(obj)}
                      size="small"
                      style={{
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        height: '24px',
                        minWidth: '70px',
                        justifyContent: 'center',
                      }}
                    >
                      <FaBackward
                        style={{ marginRight: '4px', fontSize: '10px' }}
                      />
                      <span>Return</span>
                    </Button>
                  </div>
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
          'imei1',
          // 'purchasePrice',
          'salePrice',
          'sellingPaymentType',
          'customerName',
          'warranty',
          'dateSold',
        ]}
        label={[
          'Type of Sale',
          // 'Purchase Price',
          "IMEI",
          'Sale Price',
          'Selling Payment Type',
          'Customer Name',
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
            index: 1,
            component: (imei1) => {
              return imei1 ? imei1.join(",") : 'Not mentioned';
            },
          },
          {
            index: 3,
            component: (sellingType) => {
              return sellingType ? sellingType : 'Not mentioned';
            },
          },
          {
            index: 6,
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
              <Button
                onClick={() => {
                  // Prepare payload in the exact format used in setTimeout
                  const payload = {
                    sales: Array.isArray(obj.accessoriesList)
                      ? obj.accessoriesList.map((accessory) => ({
                        accessoryId:
                          accessory.name ||
                          accessory.accessoryName ||
                          accessory._id ||
                          accessory.accessoryId,
                        quantity: Number(accessory.quantity),
                        perPiecePrice: Number(accessory.perPiecePrice),
                        name: accessory.name || accessory.accessoryName,
                      }))
                      : [],
                    getPayment: {
                      // Include payment details if available in obj
                      amountFromBank: obj.amountFromBank || 0,
                      amountFromPocket: obj.amountFromPocket || 0,
                      bankAccountUsed: obj.bankAccountUsed || null,
                    },
                    purchasePaymentType: obj.type || 'sale',
                    creditPaymentData: {
                      payableAmountNow: obj.payableAmountNow || 0,
                      payableAmountLater: obj.personGivingCredit || 0,
                      dateOfPayment: obj.dateOfPayment || null,
                    },
                    entityData: {
                      _id: obj.personId,
                      name: obj.personName,
                      number: obj.personNumber,
                      // Include other person fields if needed
                    },
                    // Include all additional transaction details
                    transactionDetails: {
                      _id: obj._id,
                      createdAt: obj.createdAt,
                      updatedAt: obj.updatedAt,
                      profit: obj.profit,
                      totalPrice: obj.totalPrice,
                      status: obj.personStatus,
                      reference: obj.personReference,
                    },
                  };

                  navigate('/invoice/accessory', {
                    state: {
                      data: {
                        ...payload,
                        // Include the original object for backward compatibility
                        originalData: {
                          accessoryId: obj.accessoryId,
                          accessoryName: obj.accessoryName,
                          personGivingCredit: obj.personGivingCredit,
                          personTakingCredit: obj.personTakingCredit,
                          // Include all other original fields
                        },
                      },
                      type: 'accessory',
                    },
                  });
                }}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaPrint style={{ marginRight: '8px' }} />
                Get Invoice
              </Button>
            </div>
          ),
        ]}
      />
      <Modal
        toggleModal={() => setShowUpdateReturnModal(false)}
        show={showUpdateReturnModal}
        size="sm"
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h3
            style={{
              margin: '0 0 10px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            Return Phone Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#555',
              }}
            >
              New Buying Price
            </label>
            <input
              onChange={(e) =>
                setReturningPhoneDetail({
                  ...returningPhoneDetail,
                  newBuyingPrice: e.target.value,
                })
              }
              type="text"
              name="newBuyingPrice"
              value={returningPhoneDetail.newBuyingPrice}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#555',
              }}
            >
              Remaining Warranty (Optional)
            </label>
            <input
              onChange={(e) =>
                setReturningPhoneDetail({
                  ...returningPhoneDetail,
                  remainingWarranty: e.target.value,
                })
              }
              name="remainingWarranty"
              type="text"
              value={returningPhoneDetail.remainingWarranty}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div
            style={{
              marginTop: '10px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: '13px',
                color: '#666',
              }}
            >
              Original Sale Price
            </p>
            <div
              style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#333',
              }}
            >
              {returningPhoneDetail.soldPhoneBuyingPrice}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '10px',
            }}
          >
            <button
              onClick={() => setShowUpdateReturnModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReturnSinglePhone}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Confirm Return
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodaySales;
