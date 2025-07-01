import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { useParams } from 'react-router-dom';

const PocketCashTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);
  const { id } = useParams();

  const getTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/pocketCash/get/${id}`);
      setTransactions(response?.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [id]);

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  // Helper to get transaction type and amount
  const getType = (txn) => {
    if (txn.amountAdded)
      return { type: 'Credit', amount: txn.amountAdded, color: '#27ae60' };
    if (txn.amountDeducted)
      return { type: 'Debit', amount: txn.amountDeducted, color: '#c0392b' };
    return {
      type: txn.accountCash >= 0 ? 'Credit' : 'Debit',
      amount: Math.abs(txn.accountCash),
      color: txn.accountCash >= 0 ? '#27ae60' : '#c0392b',
    };
  };

  const handleViewMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '30px auto',
          padding: 24,
          textAlign: 'center',
          color: '#666',
        }}
      >
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '30px auto',
          padding: 24,
          textAlign: 'center',
          color: '#c0392b',
        }}
      >
        {error}
        <button
          onClick={getTransactions}
          style={{
            marginTop: 10,
            padding: '8px 16px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '90%',
        margin: '30px auto',
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: 24,
      }}
    >
      <h3
        style={{
          textAlign: 'center',
          marginBottom: 24,
          color: '#2c3e50',
        }}
      >
        Pocket Cash Transactions
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14,
          }}
        >
          <thead>
            <tr
              style={{
                background: '#f8f9fa',
                borderBottom: '2px solid #e9ecef',
              }}
            >
              <th
                style={{
                  padding: '12px 10px',
                  textAlign: 'left',
                  fontWeight: 600,
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: '12px 10px',
                  textAlign: 'left',
                  fontWeight: 600,
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '12px 10px',
                  textAlign: 'right',
                  fontWeight: 600,
                }}
              >
                Amount
              </th>
              <th
                style={{
                  padding: '12px 10px',
                  textAlign: 'left',
                  fontWeight: 600,
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: '12px 10px',
                  textAlign: 'right',
                  fontWeight: 600,
                }}
              >
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, displayCount).map((txn) => {
              const { type, amount, color } = getType(txn);
              return (
                <tr
                  key={txn._id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    ':hover': {
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                >
                  <td
                    style={{
                      padding: '12px 10px',
                      color: '#495057',
                    }}
                  >
                    {formatDate(txn.createdAt)}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      color,
                      fontWeight: 600,
                    }}
                  >
                    {type}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      color,
                      fontWeight: 600,
                      textAlign: 'right',
                    }}
                  >
                    {amount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      color: '#495057',
                    }}
                  >
                    {txn.sourceOfAmountAddition ||
                      txn.reasonOfAmountDeduction ||
                      '-'}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      fontWeight: 500,
                      textAlign: 'right',
                      color: '#2c3e50',
                    }}
                  >
                    {(txn.remainingAmount ?? txn.accountCash)?.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {transactions.length > displayCount && (
        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          <button
            onClick={handleViewMore}
            style={{
              padding: '8px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#2980b9',
              },
            }}
          >
            View More ({transactions.length - displayCount} remaining)
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: '#7f8c8d',
          textAlign: 'center',
        }}
      >
        Showing {Math.min(displayCount, transactions.length)} of{' '}
        {transactions.length} transactions
      </div>
    </div>
  );
};

export default PocketCashTransactions;
