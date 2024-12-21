import React, { useEffect, useState } from 'react';
import axios from 'axios'; import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';

const SaleInvoices = () => {
  const [filter, setFilter] = useState('All');
  const [allIvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${BASE_URL}api/invoice/invoices/getAll/${user._id}`);
      setAllInvoices(response.data.invoices); // Assuming `phones` array matches the structure
      setFilteredInvoices(response.data.invoices); // Assuming `phones` array matches the structure
    } catch (error) {
      console.error('Error fetching mobiles:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    filterOutInvoices()
  };

  // Filtering invoices based on date range
  const filterOutInvoices = () => {
    if (filter == 'All') {
      setFilteredInvoices(allIvoices);
      return
    }
    const now = new Date();
    const filtered = allIvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.invoiceDate);
      switch (filter) {
        case 'Yesterday':
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return invoiceDate.toDateString() === yesterday.toDateString();
        case 'This Week':
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
          return invoiceDate >= startOfWeek;
        case 'This Month':
          return (
            invoiceDate.getMonth() === now.getMonth() &&
            invoiceDate.getFullYear() === now.getFullYear()
          );
        case 'Last Three Months':
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return invoiceDate >= threeMonthsAgo;
        case 'This Year':
          return invoiceDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    setFilteredInvoices(filtered);
  };

  const handlePrintClick = (invoice) => {
    navigate('/invoice/shop', { state: { invoice } }); // Pass invoice data to the route
  };

  // Inline styles for the table
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: 'rgb(249, 250, 251)',
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

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2>Sale Invoices</h2>
        <div>
          <select value={filter} onChange={handleFilterChange} style={{ padding: '5px' }}>
            <option value="All">All</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Last Three Months">Last Three Months</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.header, ...styles.headerCell }}>Invoice ID</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Mobile</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Sold Amount</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Date</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Print</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice, index) => (
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
                <td style={styles.cell}>${invoice.totalAmount}</td>
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
      </div>
    </div>
  );
};

export default SaleInvoices;
