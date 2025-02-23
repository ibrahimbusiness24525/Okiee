import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import { dateFormatter } from 'utils/dateFormatter';
import Table from 'components/Table/Table';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';

const TodaySales = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const[allbulkSales,setAllBulkSales] = useState([])
  const navigate = useNavigate();


  useEffect(() => {
    getAllBulkSales()
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`api/Purchase/sold-single-phones`);
      console.log(response);

      setAllInvoices(response.data.soldPhones.filter((item) => {
        return new Date(item.saleDate).toDateString() === new Date().toDateString();
    }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
  const getAllBulkSales = async () => {
    try {
      const response = await api.get(`api/Purchase/all-sales`);
     console.log("These are bulk sales",response);

      setAllBulkSales(response.data.data.filter((item) => {
        return new Date(item.dateSold).toDateString() === new Date().toDateString();
    }));
    } catch (error) {
      console.error('Error fetching bulk sales:', error);
    }
  };

  

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
console.log("invoices",allInvoices);
const[scannedBarcodeValue,setScannedBarcodeValue]= useState("")
const handleScan = (value) => {
  console.log("Scanned IMEI:", value);
  setScannedBarcodeValue(value)
};
console.log('====================================');
console.log("all bulk sales",allbulkSales);
console.log('====================================');
  return (
    <div style={styles.container}>
      <h2 style={{ width: '100%' }}>Today Sales Invoices</h2>
      <div style={styles.tableWrapper}>
      
<BarcodeReader onScan={handleScan} />
      <div>
        <h3 style={{ textAlign: 'start', marginBottom: '40px',fontWeight:"700" }}>Single Invoices</h3>
      </div>
      {/* <StyledHeading>New Phones</StyledHeading> */}
  
      <Table
        // routes={["/sales/saleInvoices"]}
  array={allInvoices}
  search={"imei1"}
  keysToDisplay={[
    "salePrice",
    "warranty",
    "saleDate"
   
    
  ]}
  label={[
    "Price",
    "Warranty",
    "Invoice Date",
        "Actions"
  ]}
  customBlocks={[
       
         {
            index: 2,
            component: (date) => {
            return dateFormatter(date)
           }
         }
        ]}
         extraColumns={[
                        () => {
                            return (
                              <FaPrint
                              style={styles.printIcon}
                              // onClick={() => handlePrintClick(invoice)}
                            />
                           );
                      },
                  ]}
            />

      </div>
      <div>
        <h3 style={{ textAlign: 'start', marginBottom: '40px',fontWeight:"700",marginTop:"2rem" }}>Bulk Invoices</h3>
      </div>
      <Table
  array={allbulkSales}
  search={"imei1"}
  keysToDisplay={[
    "type",
    // "modelName",
    // "companyName",
    // "partyName",
    "salePrice",
    "warranty",
    "dateSold",
    
  ]}
  label={[
    // "Model Name",
    // "Company",
    // "Party Name",
    "Type of Sale",
    "Price",
    "Warranty",
    "Invoice Date",
  ]}
  customBlocks={[
         {
            index: 3,
            component: (date) => {
            return dateFormatter(date)
           }
         }
        ]}
      />
    </div>
  );
};

export default TodaySales;
