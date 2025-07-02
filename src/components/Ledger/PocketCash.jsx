import React, { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { toast } from 'react-toastify';
const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '20px',
  padding: '40px 30px',
  maxWidth: '500px',
  margin: '50px auto',
  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #00c6ff, #0072ff)', // Updated gradient
  color: '#fff',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  boxSizing: 'border-box',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
};

const buttonStyle = {
  padding: '15px 30px',
  margin: '15px 10px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  transition: 'transform 0.2s ease, background-color 0.3s',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const addButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#00C851',
  color: 'white',
};

const removeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ff4444',
  color: 'white',
};

const PocketCash = () => {
  const [totalCash, setTotalCash] = useState(0);

  const fetchTotalCash = async () => {
    try {
      const res = await api.get('/api/pocketCash/total');
      setTotalCash(res.data.total);
    } catch (error) {
      console.error('Failed to fetch total cash:', error);
    }
  };

  const handleTransaction = async (type) => {
    const amount = Number(prompt(`Enter amount to ${type}:`));
    if (!amount || amount <= 0) return alert('Enter a valid amount');

    try {
      const endpoint =
        type === 'add' ? '/api/pocketCash/add' : '/api/pocketCash/deduct';
      await api.post(endpoint, {
        amount,
      });
      toast.success('transation is successful!');
      fetchTotalCash();
    } catch (error) {
      toast.error('Error in making transaction!');
      console.error(`Failed to ${type} cash:`, error);
    }
  };

  useEffect(() => {
    fetchTotalCash();
  }, []);

  return (
    <div
      style={cardStyle}
      onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
      onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
    >
      <h2>Pocket Cash 💸</h2>
      <h3 style={{ fontSize: '36px', margin: '20px 0', fontWeight: 'bold' }}>
        {' '}
        {totalCash}
      </h3>

      <div>
        <button style={addButtonStyle} onClick={() => handleTransaction('add')}>
          Add Cash
        </button>
        <button
          style={removeButtonStyle}
          onClick={() => handleTransaction('deduct')}
        >
          Remove Cash
        </button>
      </div>
    </div>
  );
};

export default PocketCash;
