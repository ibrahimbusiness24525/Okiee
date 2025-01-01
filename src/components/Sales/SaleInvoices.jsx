import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';
import { BASE_URL } from 'config/constant';
import { useNavigate } from 'react-router-dom';

const SaleInvoices = () => {
  const [search, setSearch] = useState('');
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${BASE_URL}api/invoice/invoices/getAll/${user._id}`);
      setAllInvoices(response.data.invoices);
      setFilteredInvoices(response.data.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    const filtered = allInvoices.filter((invoice) => {
      return (
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.items[0]?.mobileName.toLowerCase().includes(query)
      );
    });

    setFilteredInvoices(filtered);
  };

  const handlePrintClick = (invoice) => {
    navigate('/invoice/shop', { state: { invoice } }); // Pass invoice data to the route
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: 'rgb(249, 250, 251)',
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
      maxHeight: '400px',
      overflowY: 'auto',
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
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={{width:'100%'}}>Sale Invoices</h2>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by Invoice Number or Mobile Name"
        style={styles.searchBar}
      />
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
          <tr>
              <th style={{ ...styles.header, ...styles.headerCell }}>Invoice ID</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Mobile</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>imei</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>imei2</th>
              <th style={{ ...styles.header, ...styles.headerCell }}>Purchase Amount</th>
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
      </div>
    </div>
  );
};

export default SaleInvoices;
