import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import styled from 'styled-components';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';
import BarcodePrinter from 'components/BarcodePrinter/BarcodePrinter';

const TodayPurchase = () => {
  const navigate = useNavigate();
  const [newPhones, setNewPhones] = useState([]);
  const [oldPhones, setOldPhones] = useState([]);
  const [singlePhones, setSinglePhones] = useState([]);
  const [bulkPhones, setBulkPhones] = useState([]);
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
      const response = await api.get(`api/accessory/accessoryRecord/purchase`);
      console.log('Accessories Records:', response.data);
      setAccessoriesRecords(response?.data);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching accessories records:', error);
      return [];
    }
  };
  // Inline styles for the table
  const styles = {
    container: {
      padding: '20px',
      // backgroundColor: 'rgb(249, 250, 251)',
      borderRadius: '8px',
    },
    tableWrapper: {
      maxHeight: '400px', // Set maximum height for scroll
      overflowY: 'auto', // Enable vertical scrolling
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    header: {
      backgroundColor: 'rgb(220, 220, 220)',
      color: '#333',
      textAlign: 'center',
      padding: '10px',
      borderBottom: '2px solid #ddd', // Divider in the header
      position: 'sticky', // Make header sticky
      top: 0, // Stick to the top
      zIndex: 1, // Ensure it appears above other content
    },
    headerCell: {
      padding: '8px',
      fontWeight: 'bold',
      fontSize: '1.1em',
    },
    row: {
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
    oddRow: {
      backgroundColor: '#fff',
    },
    evenRow: {
      backgroundColor: 'rgb(249, 250, 251)',
    },
    rowHover: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light gray on row hover
    },
  };

  const getAllPurchasedPhones = async () => {
    try {
      const response = await api.get('api/Purchase/all-purchase-phone');
      // const response = await axios.get(`${BASE_URL}api/Purchase/all-purchase-phone`)
      setSinglePhones(
        response?.data?.data?.singlePhones?.filter((item) => {
          return (
            new Date(item.date).toISOString().split('T')[0] ===
            new Date().toISOString().split('T')[0]
          );
        })
      );
      setNewPhones(
        response?.data?.data?.singlePhones.filter((phone) => {
          const phoneDate = new Date(phone.date).toISOString().split('T')[0]; // Convert phone's date to "YYYY-MM-DD"
          return (
            phoneDate === new Date().toISOString().split('T')[0] &&
            phone.phoneCondition === 'New'
          ); // Check if the phone is new and added today
        })
      );

      setOldPhones(
        response?.data?.data?.singlePhones?.filter((item) => {
          const itemDate = new Date(item.date).toISOString().split('T')[0];
          const todayDate = new Date().toISOString().split('T')[0];

          return itemDate === todayDate && item.phoneCondition === 'Used';
        })
      );

      setBulkPhones(
        response?.data?.data?.bulkPhones?.filter((item) => {
          return (
            new Date(item.date).toISOString().split('T')[0] ===
            new Date().toISOString().split('T')[0]
          );
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    getAllPurchasedPhones();
    getAccessoriesRecords();
  }, []);
  const [scannedBarcodeValue, setScannedBarcodeValue] = useState('');
  const handleScan = (value) => {
    setScannedBarcodeValue(value);
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>
        Today Purchase Records
      </h2>
      {/* <BarcodeReader onScan={handleScan} /> */}
      <div>
        <h3
          style={{
            textAlign: 'start',
            marginBottom: '40px',
            fontWeight: '700',
          }}
        >
          Single Purchases
        </h3>
      </div>
      <StyledHeading>New Phones</StyledHeading>
      <Table
        routes={['/purchase/todayPurchase']}
        array={newPhones}
        search={'imei1'}
        keysToDisplay={[
          'modelName',
          'phoneCondition',
          'imei1',
          'warranty',
          'name',
          'date',
        ]}
        label={[
          'Model Name',
          'Phone Condition',
          'Imei of mobile',
          'Mobile Warranty',
          'Name of Seller',
          'Date of Purchase',

          'Actions',
        ]}
        customBlocks={[
          {
            index: 5,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
        extraColumns={[(obj) => <BarcodePrinter obj={obj} />]}
      />
      <div style={{ marginTop: '3rem' }}>
        <StyledHeading>Used Phones</StyledHeading>
        <Table
          routes={['/purchase/todayPurchase']}
          array={oldPhones}
          search={'imei1'}
          keysToDisplay={[
            'modelName',
            'phoneCondition',
            'imei1',
            'warranty',
            'name',
            'date',
          ]}
          label={[
            'Model Name',
            'Phone Condition',
            'Imei of mobile',
            'Mobile Warranty',
            'Name of Seller',
            'Date of Purchase',

            'Actions',
          ]}
          customBlocks={[
            {
              index: 5,
              component: (date) => {
                return dateFormatter(date);
              },
            },
          ]}
          extraColumns={[(obj) => <BarcodePrinter type="bulk" obj={obj} />]}
        />
      </div>
      <div>
        <h3
          style={{
            textAlign: 'start',
            marginBottom: '40px',
            fontWeight: '700',
            marginTop: '5rem',
          }}
        >
          Bulk Purchases
        </h3>
      </div>
      <Table
        routes={['/purchase/todayPurchase/bulkPurchase']}
        array={bulkPhones}
        search={'imeiNumbers'}
        keysToDisplay={['partyName', 'totalQuantity', 'status', 'date']}
        label={[
          'Party Name',
          'No of quantity',
          'Status',
          'Date of Purchasing',
          'Actions',
        ]}
        customBlocks={[
          {
            index: 3,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
        extraColumns={[
          (obj) => (
            <>
              <div style={{ marginRight: '1rem' }}>
                <select
                  style={{
                    padding: '7px 16px',
                    borderRadius: '5px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    minWidth: '100px',
                    fontSize: '15px',
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    outline: 'none',
                    width: '100%',
                    marginRight: '20px',
                    appearance: 'none', // hides default arrow
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg fill='%23666' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '18px 18px',
                  }}
                >
                  {obj?.ramSimDetails?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.modelName}
                    </option>
                  ))}
                </select>
              </div>

              <BarcodePrinter type="bulk" obj={obj} />
            </>
          ),
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
      {/* <Table
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

      /> */}
      <Table
        array={accessoriesRecords}
        search={'accessoryName'}
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
        ]}
        customBlocks={[
          {
            index: 0, // Type column
            component: (_, row) => (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  backgroundColor:
                    row.personStatus === 'Payable' ? '#FFEBEE' : '#E8F5E9',
                  color: row.personStatus === 'Payable' ? '#D32F2F' : '#388E3C',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                {row.personStatus === 'Payable' ? 'Credit' : 'Paid'}
              </div>
            ),
          },
          {
            index: 1, // Customer name
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
            index: 3, // Unit price
            component: (price) => (
              <span
                style={{
                  fontWeight: 500,
                  color: '#2E7D32',
                }}
              >
                Rs. {price?.toLocaleString() || '0'}
              </span>
            ),
          },
          {
            index: 5, // Credit amount
            component: (amount) => (
              <span
                style={{
                  fontWeight: 500,
                  color: amount > 0 ? '#D32F2F' : '#388E3C',
                }}
              >
                {amount > 0 ? `Rs. ${amount.toLocaleString()}` : 'Cleared'}
              </span>
            ),
          },
          {
            index: 6, // Total price
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
      />
    </div>
  );
};

export default TodayPurchase;
