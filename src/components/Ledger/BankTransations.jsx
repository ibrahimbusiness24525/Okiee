import { useParams } from 'react-router-dom';
import { api } from '../../../api/api';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap'; // assuming you're using react-bootstrap Button
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const BankTransactions = () => {

  const [transactions, setTransactions] = useState([]);
  const { id } = useParams();

  const getBankTransactions = async () => {
    try {
      const response = await api.get(`/api/banks/getBankTransaction/${id}`);
      setTransactions(response?.data?.transactions || []);
    } catch (error) {
      toast.error('Failed to fetch bank transactions');
      console.error('Error fetching bank transactions:', error);
    }

  };

  const deleteBankTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this bank transaction?')) return;

    try {
      const response = await api.delete(`/api/banks/deleteTransaction/${id}`);
      getBankTransactions();
      toast.success('Transaction deleted successfully');
      return response?.data || [];
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error('Error fetching bank transactions:', error);
      throw error;
    }
  };


  useEffect(() => {
    getBankTransactions();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1
        style={{
          textAlign: 'center',
          fontSize: '32px',
          marginBottom: '20px',
          color: '#2c3e50',
        }}
      >
        Bank Transactions
      </h1>
      <p
        style={{
          textAlign: 'center',
          fontSize: '18px',
          marginBottom: '30px',
          color: '#7f8c8d',
        }}
      >
        Here is the list of all transactions made in the bank account.
      </p>

      <Table
        routes={['/app/dashboard/bankTransaction']}
        array={transactions.reverse()}
        keysToDisplay={[
          'accountCash',
          // 'sourceOfAmountAddition',
          'createdAt',
          // 'updatedAt',
        ]}
        label={['Amount (Cash)',
          // 'Source', 
          'Created At',
          // 'Updated At', 
          'Actions']}
        customBlocks={[
          {
            index: 0, // accountCash formatting
            component: (cash) => {
              const isNegative = cash < 0;
              return (
                <span
                  style={{
                    color: isNegative ? '#e74c3c' : '#2ecc71',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    backgroundColor: isNegative ? '#fdecea' : '#e8f8f5',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    minWidth: '100px',
                    textAlign: 'center',
                  }}
                >
                  {isNegative ? `-${Math.abs(cash)}` : `+${cash}`}
                </span>
              );
            },
          },
          // {
          //   index: 1, // sourceOfAmountAddition handling
          //   component: (source) => {
          //     return (
          //       <span
          //         style={{
          //           color: source ? '#34495e' : '#95a5a6',
          //           fontStyle: source ? 'normal' : 'italic',
          //         }}
          //       >
          //         {source || 'Not Mentioned'}
          //       </span>
          //     );
          //   },
          // },
          {
            index: 1, // createdAt formatting
            component: (date) => {
              return (
                <span style={{ color: '#2980b9', fontSize: '14px' }}>
                  {dateFormatter(date)}
                </span>
              );
            },
          },
          // {
          //   index: 3, // updatedAt formatting
          //   component: (date) => {
          //     return (
          //       <span style={{ color: '#8e44ad', fontSize: '14px' }}>
          //         {dateFormatter(date)}
          //       </span>
          //     );
          //   },
          // },
        ]}
        extraColumns={[
          (obj) => (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
                {obj.sourceOfAmountAddition || obj.reasonOfAmountDeduction || "not mentioned"}
              </div>
              <FaTrash
                onClick={() => deleteBankTransaction(obj._id)}
                style={{
                  color: '#e74c3c',
                  cursor: 'pointer',
                }}
              />
            </div>
          ),
        ]}
      />
    </div>
  );
};

export default BankTransactions;

