import React, { useEffect, useState } from 'react';
import axios from 'axios'; import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import { api } from '../../../api/api';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';

const LedgerRecords = () => {
  // Static data for today's sales
  const [todayInvoices, setTodayInvoices] = useState([]);
  const navigate = useNavigate();
  const[ledgerRecords, setLedgerRecords] = useState([]);
  const[comitteeRecords, setComitteeRecords] = useState([]);

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

  useEffect(() => {
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${BASE_URL}api/invoice/invoices/getAll/${user._id}`);
      const currentDate = new Date().toISOString().split('T')[0];

      // Filter invoices for today
      const filteredInvoices = response.data.invoices.filter((invoice) => {
        const invoiceDate = new Date(invoice.invoiceDate).toISOString().split('T')[0];
        return invoiceDate === currentDate;
      });

      setTodayInvoices(filteredInvoices); // Assuming `phones` array matches the structure
    } catch (error) {
      console.error('Error fetching mobiles:', error);
    }
  };

  const handlePrintClick = (invoice) => {
      navigate('/invoice/shop', { state: { invoice } }); // Pass invoice data to the route
    };
  const getAllLedgerRecords = async() =>{
    try{
      const response = await api.get(`/api/ledger/all`)
      console.log("This is the records",response)
      setLedgerRecords(response?.data?.records)
    }catch(error){
      console.log("error in getting all ledger records", error)
    }
  }
  
  const getAllCommitteeRecords = async() =>{
    try{
      const response = await api.get("/api/committee/getComitteesRecords");
      setComitteeRecords(response?.data?.committees)
      console.log("This is CommitteeRecords response",response);
    }catch(error){
      console.log("error in getting all ledger records", error)
    }
  }

  const handleChangeStatus = (committeeId,recordId) => {
    const confirmed = window.confirm("Do you really want to mark it as paid?");
        if (confirmed) {
          applyStatusConfirmation(committeeId,recordId);
        }
  };

  const applyStatusConfirmation = async(committeeId,recordId) =>{
    console.log("committee Id", committeeId, "Record ID", recordId);
    
    try{
      const response = await api.patch(`/api/committee/updateComittee/${committeeId}/${recordId}`)
      console.log(response);
      getAllCommitteeRecords();
      toast.success("Paid Successfully");
    }catch(error){
      console.log("Error in making paid", error);
    }

  }
  console.log("This is response",comitteeRecords);
  useEffect(()=>{
    getAllLedgerRecords()
    getAllCommitteeRecords()
  },[])


console.log(todayInvoices,'todayInvoice')
  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Ledger Records</h2>
      <Table
                        routes={["/app/dashboard/ledgerRecords"]}
                        array={ledgerRecords}
                        search={"openingCash"}
                        keysToDisplay={["openingCash", "cashPaid", "cashReceived", "expense", "closingCash","createdAt"]}
                        label={[
                            "Opening Cash",
                            "Cash Paid",
                            "Cash Received",
                            "Expense",
                            "Closing Cash",
                            "Created At"
                            // "Actions",
                        ]}
                        customBlocks={[
                            {
                                index: 5,
                                component: (date) => {
                                    return dateFormatter(date)
                                }
                            }
                        ]}
                        // extraColumns={[
                        //     () => {
                        //         return (
                        //             <MdEdit

                        //                 className="text-[#ccccc] text-[1.3rem]" />
                        //         );
                        //     },
                        // ]}
                    />
                    <div style={{marginTop:"2rem"}}></div>
                   <StyledHeading>Comittee Ledger Records</StyledHeading>
                    {comitteeRecords.map((item)=>{
                        return(
                          <div>
                           <h1 style={{ 
                            fontSize: "22px", 
                            marginTop: "2rem", 
                            fontWeight: "bold", 
                            marginBottom: "8px" 
                          }}>
                            🏛 Committee Name: <span style={{ color: "#5a54b4" }}>{item.committeeName}</span>
                          </h1>
                          <h1 style={{ 
                            fontSize: "20px", 
                            fontWeight: "600", 
                          }}>
                            👤 Committee Head: <span style={{ color: "#5a54b4" }}>{item.headName}</span>
                          </h1>
                          <h1 style={{ 
                            fontSize: "20px", 
                            fontWeight: "600", 
                          }}>
                            📌 My Committee Name Number: <span style={{ color: "#5a54b4" }}>{item.myComitteeNameNumber}</span>
                          </h1>
                                <div>
                                <Table
                                 array={item.monthlyRecords.map((record) => ({
                                   ...record,
                                   statusComponent: (
                                     <button
                                       style={{
                                         color: "#000",
                                         padding: "6px 12px",
                                         borderRadius: "5px",
                                         border: "none",
                                         cursor: record.status === "Paid" ? "default" : "pointer",
                                         transition: "0.3s",
                                       }}
                                       onClick={() =>
                                         record.status !== "Paid" && handleChangeStatus(item._id, record._id)
                                       }
                                     >
                                       {record.status === "Paid" ? "✅ Paid" : "💰 Pay Now"}
                                     </button>
                                   ),
                                 }))}
                                 search="monthNumber"
                                 keysToDisplay={["amountPaid", "monthNumber", "statusComponent"]}
                                 label={["Amount Paid", "Month Number", "Status"]}
                                />
                                </div>
                          </div>
                        )
                    })}
    </div>
  );
};

export default LedgerRecords;

