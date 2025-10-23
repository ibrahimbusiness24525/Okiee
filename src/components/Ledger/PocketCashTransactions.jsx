import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
  const deletePocketCashTransaction = async (id) => {
    if (
      !confirm('Are you sure you want to delete this pocket cash transaction?')
    )
      return;

    try {
      const response = await api.delete(`/api/pocketCash/delete/${id}`);
      getTransactions();
      toast.success('Transaction deleted successfully');
      return response?.data || [];
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error('Error fetching pocket cash transactions:', error);
      throw error;
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
  // const getType = (txn) => {
  //   if (txn.amountAdded)
  //     return { type: 'Credit', amount: txn.amountAdded, color: '#27ae60' };
  //   if (txn.amountDeducted)
  //     return { type: 'Debit', amount: txn.amountDeducted, color: '#c0392b' };
  //   return {
  //     type: txn.accountCash >= 0 ? 'Credit' : 'Debit',
  //     amount: Math.abs(txn.accountCash),
  //     color: txn.accountCash >= 0 ? '#27ae60' : '#c0392b',
  //   };
  // };

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
        maxWidth: '95%',
        margin: '20px auto',
        padding: '0 16px',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        }}
      >
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #fff, #f0f9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          💰 Pocket Cash Transactions
        </h2>
        <p
          style={{
            margin: '0',
            fontSize: '16px',
            opacity: '0.9',
            fontWeight: '400',
          }}
        >
          Track your financial transactions with ease
        </p>
      </div>

      {/* Transactions List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {transactions.slice(0, displayCount).map((txn, index) => {
          const { color } = txn;
          const amount = txn.amountAdded || txn.amountDeducted;
          const isDebit =
            txn.reasonOfAmountDeduction &&
            typeof txn.reasonOfAmountDeduction === 'string' &&
            (txn.reasonOfAmountDeduction.toLowerCase().includes('purchase') ||
              txn.reasonOfAmountDeduction.toLowerCase().includes('take') ||
              txn.reasonOfAmountDeduction.toLowerCase().includes('return'));

          const transactionType = txn.amountAdded ? 'Credit' : 'Debit';
          const typeColor =
            transactionType === 'Credit' ? '#10b981' : '#ef4444';
          const typeBg = transactionType === 'Credit' ? '#d1fae5' : '#fee2e2';

          return (
            <div
              key={txn._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = typeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 12px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = '#f1f5f9';
              }}
            >
              {/* Left Section - Transaction Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  flex: '1',
                }}
              >
                {/* Transaction Type Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: typeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: typeColor,
                    fontWeight: '600',
                  }}
                >
                  {transactionType === 'Credit' ? '📈' : '📉'}
                </div>

                {/* Transaction Details */}
                <div
                  style={{
                    flex: '1',
                    minWidth: '0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: typeColor,
                      }}
                    >
                      {amount ? `PKR ${amount.toLocaleString()}` : 'N/A'}
                    </div>
                    <div
                      style={{
                        background: typeBg,
                        color: typeColor,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {transactionType}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: '4px',
                    }}
                  >
                    {formatDate(txn.createdAt)}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#475569',
                      fontWeight: '500',
                      lineHeight: '1.4',
                    }}
                  >
                    {txn.sourceOfAmountAddition ||
                      txn.reasonOfAmountDeduction ||
                      'No description available'}
                  </div>
                </div>
              </div>

              {/* Right Section - Balance and Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {/* Balance */}
                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '4px',
                    }}
                  >
                    Balance
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1e293b',
                    }}
                  >
                    PKR{' '}
                    {(txn.remainingAmount ?? txn.accountCash)?.toLocaleString()}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deletePocketCashTransaction(txn._id)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                    minWidth: '80px',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  <FaTrash size={12} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {transactions.length > displayCount && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '32px',
          }}
        >
          <button
            onClick={handleViewMore}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 8px 30px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 20px rgba(102, 126, 234, 0.3)';
            }}
          >
            📄 View More ({transactions.length - displayCount} remaining)
          </button>
        </div>
      )}

      {/* Footer Stats */}
      <div
        style={{
          marginTop: '32px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            color: '#475569',
            fontWeight: '600',
            marginBottom: '8px',
          }}
        >
          📊 Transaction Summary
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#64748b',
          }}
        >
          Showing {Math.min(displayCount, transactions.length)} of{' '}
          {transactions.length} transactions
        </div>
      </div>
    </div>
  );
};

export default PocketCashTransactions;
