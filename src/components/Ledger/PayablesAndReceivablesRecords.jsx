import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { TransactionCard } from 'components/TransactionCard';
import { FaTrash } from 'react-icons/fa';

const PayablesAndReceivablesRecords = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonDetail = async () => {
      try {
        const response = await api.get(`/api/person/${id}`);
        setPerson(response.data.person);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Failed to fetch person detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetail();
  }, [id]);
  console.log(transactions);

  if (loading) return <p>Loading...</p>;
  if (!person) return <p>Person not found.</p>;

  return (
    <div
      style={{
        padding: '20px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h2
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}
      >
        {person.name}'s Credit Summary
      </h2>
      <div
        style={{
          marginBottom: '20px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <p>
          <strong>Phone:</strong> {person.number}
        </p>
        <p>
          <strong>Reference:</strong> {person.reference}
        </p>
        <p>
          <strong>Status:</strong> {person.status}
        </p>

        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div
            style={{
              background: '#fef2f2',
              padding: '10px',
              borderRadius: '6px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#b91c1c' }}>
              Taking Credit
            </p>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#b91c1c' }}>
              {person.takingCredit.toLocaleString()} PKR
            </p>
          </div>
          <div
            style={{
              background: '#ecfdf5',
              padding: '10px',
              borderRadius: '6px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#047857' }}>
              Giving Credit
            </p>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#047857' }}>
              {person.givingCredit.toLocaleString()} PKR
            </p>
          </div>
        </div>
      </div>
      {/* <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
          {transactions.map((tx, idx) => (
            <div
              key={tx._id}
              style={{
                padding: "12px",
                border: "1px solid #eee",
                marginBottom: "10px",
                borderRadius: "6px",
                backgroundColor: "#f9fafb",
              }}
            >
              {tx.takingCredit !== 0 && (
                <p style={{
                  margin: "0 0 6px 0",
                  fontSize: "14px",
                  color: "#ef4444", // Red color for taking credit
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444"
                  }}></span>
                  <strong>Taking:</strong> {tx.takingCredit.toLocaleString()} PKR
                </p>
              )}

              {tx.givingCredit !== 0 && (
                <p style={{
                  margin: "0 0 6px 0",
                  fontSize: "14px",
                  color: "#22c55e", // Green color for giving credit
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e"
                  }}></span>
                  <strong>Giving:</strong> {tx.givingCredit.toLocaleString()} PKR
                </p>
              )}

              {tx.description && (
                <p style={{
                  margin: "0 0 6px 0",
                  fontSize: "14px",
                  color: "#4b5563"
                }}>
                  <strong>Description:</strong> {tx.description}
                </p>
              )}

              <p style={{
                margin: 0,
                fontSize: "12px",
                color: "#6b7280",
                fontStyle: "italic"
              }}>
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )} */}
      <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
        Transaction History
      </h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          {/* Column Layout Container */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
            {/* Taking Credit Column */}
            {transactions.some((tx) => tx.takingCredit !== 0) && (
              <div>
                <h4
                  style={{
                    fontSize: '16px',
                    margin: '0 0 12px 0',
                    paddingBottom: '8px',
                    borderBottom: '2px solid #ef4444',
                    color: '#ef4444',
                  }}
                >
                  Taking Credit
                </h4>
                {transactions
                  .filter((tx) => tx.takingCredit !== 0)
                  .map((tx) => (
                    <TransactionCard
                      tx={tx}
                      type="taking"
                      key={`taking-${tx._id}`}
                    />
                  ))}
              </div>
            )}

            {/* Giving Credit Column */}
            {transactions.some((tx) => tx.givingCredit !== 0) && (
              <div>
                <h4
                  style={{
                    fontSize: '16px',
                    margin: '0 0 12px 0',
                    paddingBottom: '8px',
                    borderBottom: '2px solid #22c55e',
                    color: '#22c55e',
                  }}
                >
                  Giving Credit
                </h4>
                {transactions
                  .filter((tx) => tx.givingCredit !== 0)
                  .map((tx) => (
                    <TransactionCard
                      tx={tx}
                      type="giving"
                      key={`giving-${tx._id}`}
                    />
                  ))}
              </div>
            )}

            {/* Simple Transactions Column */}
            {transactions.some(
              (tx) => !tx.takingCredit && !tx.givingCredit && tx.description
            ) && (
              <div>
                <h4
                  style={{
                    fontSize: '16px',
                    margin: '0 0 12px 0',
                    paddingBottom: '8px',
                    borderBottom: '2px solid #3b82f6',
                    color: '#3b82f6',
                  }}
                >
                  Transaction Notes
                </h4>
                {transactions
                  .filter(
                    (tx) =>
                      !tx.takingCredit && !tx.givingCredit && tx.description
                  )
                  .map((tx) => (
                    <TransactionCard
                      tx={tx}
                      type="simple"
                      key={`simple-${tx._id}`}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayablesAndReceivablesRecords;
