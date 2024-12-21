import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import { BASE_URL } from 'config/constant';

const ShopTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [shopList, setShopList] = useState([]); // Ensuring it's an array

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (!loggedInUser) {
        console.error('No user found in localStorage.');
        return;
      }

      const { _id: userId, role: userRole } = loggedInUser;
      const response = await axios.get(
        `${BASE_URL}api/shop/allshops?userId=${userId}&userRole=${userRole}`
      );
      
      setShopList(response?.data?.data);
    } catch (error) {
      console.error(
        "Error fetching shops:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const filteredShops = shopList?.filter(
    (shop) =>
      shop?.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.heading}>Shop List</h2>
        <div style={styles.searchContainer}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchBar}
          />
        </div>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Shop Name</th>
              <th style={styles.tableHeader}>Owner Name</th>
              <th style={styles.tableHeader}>Contact</th>
              <th style={styles.tableHeader}>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredShops?.length > 0 ? (
              filteredShops.map((shop, index) => (
                <tr
                  key={shop?._id || index}
                  style={index % 2 === 0 ? styles.row : styles.altRow}
                >
                  <td style={styles.cell}>{shop?.shopName || 'N/A'}</td>
                  <td style={styles.cell}>{shop?.name || 'N/A'}</td>
                  <td style={styles.cell}>{shop?.contactNumber || 'N/A'}</td>
                  <td style={styles.cell}>{shop?.address || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noDataCell}>
                  No shops found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  heading: {
    margin: 0,
    color: '#333',
    fontSize: '24px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '20px',
    padding: '5px 10px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  searchIcon: {
    marginRight: '8px',
    color: '#888',
    fontSize: '20px',
  },
  searchBar: {
    padding: '0px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
  },
  tableWrapper: {
    marginTop: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    width: '100%',
    overflow: 'auto',
    maxHeight: '500px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    minWidth: '150px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    padding: '12px 20px',
    fontSize: '16px',
    textAlign: 'left',
    borderBottom: '2px solid #ccc',
  },
  row: {
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.3s',
  },
  altRow: {
    backgroundColor: '#e0e0e0',
    transition: 'background-color 0.3s',
  },
  cell: {
    minWidth: '150px',
    padding: '10px 20px',
    borderBottom: '1px solid #ccc',
    color: '#333',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#888',
  },
};

export default ShopTable;
