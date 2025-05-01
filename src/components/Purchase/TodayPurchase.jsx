import React, { useEffect, useState } from 'react';
import axios from 'axios'; import { FaPrint } from 'react-icons/fa';
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
  const[newPhones,setNewPhones] = useState([])
  const[oldPhones,setOldPhones] = useState([])
  const[singlePhones, setSinglePhones] = useState([])
  const[bulkPhones, setBulkPhones] = useState([])
  
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



  const getAllPurchasedPhones = async() =>{
    try{
      const response = await api.get("api/Purchase/all-purchase-phone")
      // const response = await axios.get(`${BASE_URL}api/Purchase/all-purchase-phone`)
      console.log("This is the records",response)
      setSinglePhones(response?.data?.data?.singlePhones?.filter((item) => {
        return new Date(item.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
    }));
    setNewPhones(response?.data?.data?.singlePhones.filter(phone => {
      const phoneDate = new Date(phone.date).toISOString().split("T")[0]; // Convert phone's date to "YYYY-MM-DD"
      return phoneDate ===  new Date().toISOString().split("T")[0] && phone.phoneCondition === "New"; // Check if the phone is new and added today
    }))
 
    
    
    setOldPhones(response?.data?.data?.singlePhones?.filter((item) => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        const todayDate = new Date().toISOString().split('T')[0];
        
        return itemDate === todayDate && item.phoneCondition === "Used"; 
    }));

      setBulkPhones(response?.data?.data?.bulkPhones?.filter((item) => {
        return new Date(item.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
      }));
      
    }catch(error){
      console.log("error in getting all ledger records", error)
    }
  }
  console.log("These are the new phones",newPhones);
  
  useEffect(()=>{
    getAllPurchasedPhones()
  },[])
  const[scannedBarcodeValue,setScannedBarcodeValue]= useState("")
const handleScan = (value) => {
  console.log("Scanned IMEI:", value);
  setScannedBarcodeValue(value)
};

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Today Purchase Records</h2>
      {/* <BarcodeReader onScan={handleScan} /> */}
      <div>
        <h3 style={{ textAlign: 'start', marginBottom: '40px',fontWeight:"700" }}>Single Purchases</h3>
      </div>
      <StyledHeading>New Phones</StyledHeading>
      <Table
      routes={["/purchase/todayPurchase"]}
                        array={newPhones}
                        search={"imei1"}
                        keysToDisplay={["modelName", "phoneCondition","imei1", "warranty", "name","date"]}
                        label={[
                            "Model Name",
                            "Phone Condition",
                            "Imei of mobile",
                            "Mobile Warranty",
                            "Name of Seller",
                            "Date of Purchase",
                    
                            "Actions",
                        ]}
                        customBlocks={[
                            {
                                index: 5,
                                component: (date) => {
                                    return dateFormatter(date)
                                }
                            }
                        ]}
                        extraColumns={[
                          (obj) => <BarcodePrinter  obj={obj}/>
                      ]}
                    />
        <div style={{marginTop:"3rem"}}>
        <StyledHeading>Used Phones</StyledHeading>
        <Table
           routes={["/purchase/todayPurchase"]}
                        array={oldPhones}
                        search={"imei1"}
                        keysToDisplay={["modelName", "phoneCondition","imei1", "warranty", "name","date"]}
                        label={[
                            "Model Name",
                            "Phone Condition",
                            "Imei of mobile",
                            "Mobile Warranty",
                            "Name of Seller",
                            "Date of Purchase",
                    
                            "Actions",
                        ]}
                        customBlocks={[
                            {
                                index: 5,
                                component: (date) => {
                                    return dateFormatter(date)
                                }
                            }
                        ]}
                        extraColumns={[
                          (obj) => <BarcodePrinter type='bulk' obj={obj}/>
                      ]}
                    />
        </div>
      <div>
        <h3 style={{ textAlign: 'start', marginBottom: '40px',fontWeight:"700",marginTop:"5rem" }}>Bulk Purchases</h3>
      </div>
      <Table
           routes={["/purchase/todayPurchase/bulkPurchase"]}
                        array={bulkPhones }
                        search={"imeiNumbers"}
                        keysToDisplay={["partyName", "totalQuantity","status","date"]}
                        label={[
                            "Party Name",
                            "No of quantity",
                            "Status",
                            "Date of Purchasing",
                            "Actions",
                        ]}
                        customBlocks={[
                           
                            {
                                index: 3,
                                component: (date) => {
                                    return dateFormatter(date)
                                }
                            }
                        ]}
                        extraColumns={[
                          (obj) => <BarcodePrinter type='bulk' obj={obj}/>
                      ]}
                      
                       
                    />
 
    </div>
  );
};

export default TodayPurchase;
