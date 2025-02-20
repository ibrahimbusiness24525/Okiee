import React, { useEffect, useState } from 'react';
import axios from 'axios'; import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import { api } from '../../../api/api';

const LedgerRecords = () => {
  // Static data for today's sales
  const [todayInvoices, setTodayInvoices] = useState([]);
  const navigate = useNavigate();
  const[ledgerRecords, setLedgerRecords] = useState([])

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
  
  useEffect(()=>{
    getAllLedgerRecords()
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
      {/* <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.header, ...styles.headerCell }}>Opening Cash</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Cash Paid</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Cash Recieved</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Expense</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Closing Cash</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {todayInvoices.map((invoice, index) => (
              <tr
                key={invoice.id}
                style={{
                  ...styles.row,
                  ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.rowHover.backgroundColor;
                  e.currentTarget.querySelector('svg').style.color = styles.printIconHover.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? styles.evenRow.backgroundColor : styles.oddRow.backgroundColor;
                  e.currentTarget.querySelector('svg').style.color = styles.printIcon.color;
                }}
              >
                <td style={styles.cell}>{invoice.invoiceNumber}</td>
                <td style={styles.cell}>{invoice.items[0]?.mobileName}</td>
                <td style={styles.cell}>{invoice.items[0]?.imei}</td>
                <td style={styles.cell}>{invoice.items[0]?.imei2}</td>
                <td style={styles.cell}>Rs{invoice.items[0]?.purchaseAmount}</td>
                <td style={styles.cell}>Rs{invoice.totalAmount}</td>
                <td style={styles.cell}>{new Intl.DateTimeFormat('en-US', {
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
        </table>
      </div> */}
    </div>
  );
};

export default LedgerRecords;
