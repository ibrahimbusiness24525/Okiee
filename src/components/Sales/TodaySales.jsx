import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import { dateFormatter } from 'utils/dateFormatter';
import Table from 'components/Table/Table';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';

const TodaySales = () => {
  const [search, setSearch] = useState('');
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${BASE_URL}api/invoice/invoices/getAll/${user._id}`);
      console.log(response);

      setAllInvoices(response.data.invoices.filter((item) => {
        return new Date(item.invoiceDate).toDateString() === new Date().toDateString();
    }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // const handleSearchChange = (e) => {
  //   const query = e.target.value.toLowerCase();
  //   setSearch(query);

  //   const filtered = allInvoices.filter((invoice) => {
  //     return (
  //       invoice.invoiceNumber.toLowerCase().includes(query) ||
  //       invoice.items[0]?.mobileName.toLowerCase().includes(query) ||
  //       invoice.items[0]?.imei.toLowerCase().includes(query) ||
  //       invoice.items[0]?.imei2.toLowerCase().includes(query)
  //     );
  //   });

  //   setFilteredInvoices(filtered);
  // };

  // const handleDateFilter = () => {
  //   const fromDate = new Date(dateFrom);
  //   const toDate = new Date(dateTo);

  //   const filtered = allInvoices.filter((invoice) => {
  //     const invoiceDate = new Date(invoice.invoiceDate);
  //     return invoiceDate >= fromDate && invoiceDate <= toDate;
  //   });

  //   setFilteredInvoices(filtered);
  //   setIsPopupOpen(false);
  // };

  const handlePrintClick = (invoice) => {
    navigate('/invoice/shop', { state: { invoice } }); // Pass invoice data to the route
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
     
    },
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
console.log('====================================');
console.log("invoices",allInvoices);
console.log('====================================');
const[scannedBarcodeValue,setScannedBarcodeValue]= useState("")
const handleScan = (value) => {
  console.log("Scanned IMEI:", value);
  setScannedBarcodeValue(value)
};
  return (
    <div style={styles.container}>
      <h2 style={{ width: '100%' }}>Today Sales Invoices</h2>
      {/* <button onClick={() => setIsPopupOpen(true)} style={{ padding: '10px 20px', marginBottom: '10px' }}>
        Filter by Date
      </button> */}
      {/* <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by Imei or Mobile Name"
        style={styles.searchBar}
      /> */}
      {/* {isPopupOpen && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }} onClick={() => setIsPopupOpen(false)}></div>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', zIndex: 1000 }}>
            <h3>Filter by Date</h3>
            <label>
              From:
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={styles.searchBar}
              />
            </label>
            <label>
              To:
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={styles.searchBar}
              />
            </label>
            <div>
              <button onClick={handleDateFilter} style={{ padding: '10px 20px', marginRight: '10px' }}>Apply Filter</button>
              <button onClick={() => setIsPopupOpen(false)} style={{ padding: '10px 20px' }}>Cancel</button>
            </div>
          </div>
        </>
      )} */}
      <div style={styles.tableWrapper}>
        {/* <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.header, ...styles.headerCell }}>Invoice ID</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Mobile</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>IMEI</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>IMEI2</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Purchase Amount</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Sold Amount</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Profit</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Date</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Print</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} style={styles.row}>
                <td style={styles.cell}>{invoice.invoiceNumber}</td>
                <td style={styles.cell}>{invoice.items[0]?.mobileName}</td>
                <td style={styles.cell}>{invoice.items[0]?.imei}</td>
                <td style={styles.cell}>{invoice.items[0]?.imei2}</td>
                <td style={styles.cell}>Rs{invoice.items[0]?.purchaseAmount}</td>
                <td style={styles.cell}>Rs{invoice.totalAmount}</td>
                <td style={styles.cell}>
                  Rs{(invoice.totalAmount - (invoice.items[0]?.purchaseAmount || 0)).toFixed(2)}
                </td>
                <td style={styles.cell}>
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  }).format(new Date(invoice.invoiceDate))}
                </td>
                <td style={styles.cell}>
                  <FaPrint
                    style={styles.printIcon}
                    onClick={() => handlePrintClick(invoice)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
<BarcodeReader onScan={handleScan} />
        <Table
  array={allInvoices}
  search={"imei1"}
  keysToDisplay={[
    "mobileName",
    "mobileCompany",
    "amount",
    "quantity",
    "warranty",
    "invoiceDate",
    
  ]}
  label={[
    "Mobile Name",
    "Company",
    "Price",
    "Number of Mobiles",
    "Warranty",
    "Invoice Date",
  ]}
  customBlocks={[
         {
           index: 2,
          component: (invoice) => {
          // const profit = (invoice.totalAmount - (invoice.items[0]?.purchaseAmount || 0)).toFixed(2);
          return `Rs ${invoice}`;
          }
         },
         {
            index: 5,
            component: (date) => {
            return dateFormatter(date)
           }
         }
        ]}
      />

      </div>
    </div>
  );
};

export default TodaySales;
