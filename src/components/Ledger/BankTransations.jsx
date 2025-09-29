import { useParams } from 'react-router-dom';
import { api } from '../../../api/api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { dateFormatter } from 'utils/dateFormatter';

const BankTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
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

  const handleShowNext = () => {
    setDisplayCount(prev => prev + 20);
  };

  useEffect(() => {
    getBankTransactions();
  }, []);

  // Helper function to get background color based on transaction status
  const getRowBackgroundColor = (transaction) => {
    if (transaction.sourceOfAmountAddition) {
      return '#e8f5e8'; // Light green for incoming transactions
    } 
    else if (transaction.reasonOfAmountDeduction && typeof transaction.reasonOfAmountDeduction === 'string' && transaction.reasonOfAmountDeduction.toLowerCase().includes('take')) {
      return '#ffebee'; // Light red for outgoing transactions
    }
    else if (transaction.reasonOfAmountDeduction && typeof transaction.reasonOfAmountDeduction === 'string' && transaction.reasonOfAmountDeduction.toLowerCase().includes('give')) {
      return '#e8f5e8'; // Light green for outgoing transactions
    }
    else if (transaction.reasonOfAmountDeduction) {
      return '#ffebee'; // Light red for outgoing transactions
    }
    return '#ffffff'; // Default white
  };

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

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #e9ecef',
              }}
            >
              <th
                style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#2c3e50',
                  borderBottom: '2px solid #e9ecef',
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: '15px 12px',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#2c3e50',
                  borderBottom: '2px solid #e9ecef',
                }}
              >
                Amount
              </th>
              <th
                style={{
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#2c3e50',
                  borderBottom: '2px solid #e9ecef',
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: '15px 12px',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#2c3e50',
                  borderBottom: '2px solid #e9ecef',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.reverse().slice(0, displayCount).map((transaction, index) => (
              <tr
                key={transaction._id}
                style={{
                  backgroundColor: getRowBackgroundColor(transaction),
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <td
                  style={{
                    padding: '15px 12px',
                    color: '#495057',
                    fontSize: '14px',
                  }}
                >
                  {dateFormatter(transaction.createdAt)}
                </td>
                <td
                  style={{
                    padding: '15px 12px',
                    textAlign: 'right',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {transaction.accountCash?.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: '15px 12px',
                    color: '#495057',
                    fontSize: '14px',
                  }}
                >
                  {transaction.sourceOfAmountAddition || 
                   transaction.reasonOfAmountDeduction || 
                   'Not mentioned'}
                </td>
                <td
                  style={{
                    padding: '15px 12px',
                    textAlign: 'right',
                  }}
                >
                  <FaTrash
                    onClick={() => deleteBankTransaction(transaction._id)}
                    style={{
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#c0392b'}
                    onMouseLeave={(e) => e.target.style.color = '#e74c3c'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length > displayCount && (
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          <button
            onClick={handleShowNext}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Show Next 20
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#7f8c8d',
          textAlign: 'center',
        }}
      >
        Showing {Math.min(displayCount, transactions.length)} of {transactions.length} transactions
      </div>
    </div>
  );
};

export default BankTransactions;

