import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { TransactionCard } from 'components/TransactionCard';
import {
  FaArrowDown,
  FaArrowUp,
  FaDollarSign,
  FaPlus,
  FaStickyNote,
  FaTrash,
} from 'react-icons/fa';
import Modal from 'components/Modal/Modal';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DatePicker } from 'antd';
import { Button } from 'react-bootstrap';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
const PayablesAndReceivablesRecords = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [giveCredit, setGiveCredit] = useState([]);
  const [takeCredit, setTakeCredit] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTakingCredit, setShowTakingCredit] = useState(false);
  const [showGivingCredit, setShowGivingCredit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showGiveCreditModal, setShowGiveCreditModal] = useState(false);
  const [showGiveCreditChildModal, setShowGiveCreditChildModal] =
    useState(false);
  const [showTakeCreditModal, setShowTakeCreditModal] = useState(false);
  const [dataRange, setDataRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [creditData, setCreditData] = useState({
    personId: id,
    amount: '',
    description: '',
  });

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
  console.log('transactions', transactions);
  const handleDownloadPDF = async () => {
    try {
      // Filter transactions by selected date range
      let filteredTransactions = transactions;
      if (dataRange.startDate) {
        const start = new Date(dataRange.startDate);
        filteredTransactions = filteredTransactions.filter(
          (tx) => new Date(tx.createdAt) >= start
        );
      }
      if (dataRange.endDate) {
        const end = new Date(dataRange.endDate);
        end.setHours(23, 59, 59, 999); // Include full end day
        filteredTransactions = filteredTransactions.filter(
          (tx) => new Date(tx.createdAt) <= end
        );
      }

      // Dynamically import jsPDF and autoTable
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      // Create new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text(`${person.name}'s Accessory Transactions`, 14, 16);

      // Add subtitle with date range if specified
      doc.setFontSize(10);
      let subtitle = 'All Transactions';
      if (dataRange.startDate || dataRange.endDate) {
        const startStr = dataRange.startDate
          ? new Date(dataRange.startDate).toLocaleDateString()
          : 'Beginning';
        const endStr = dataRange.endDate
          ? new Date(dataRange.endDate).toLocaleDateString()
          : 'Today';
        subtitle = `From ${startStr} to ${endStr}`;
      }
      doc.text(subtitle, 14, 22);

      // Generate table
      autoTable(doc, {
        startY: 30,
        head: [
          [
            'Date',
            'Type',
            // 'Accessory', 'Qty', 'Price', 'Total',
            'Description',
          ],
        ],
        body: filteredTransactions.map((tx) => {
          const type = tx.type === 'purchase' ? 'Purchase' : 'Sale';
          const date = new Date(tx.createdAt).toLocaleDateString();

          // Handle accessories list
          let accessoryName = tx.accessoryName || '';
          let quantity = tx.quantity || '';
          let price = tx.perPiecePrice
            ? `Rs. ${tx.perPiecePrice.toLocaleString()}`
            : '';
          let total = tx.totalPrice
            ? `Rs. ${tx.totalPrice.toLocaleString()}`
            : '';

          // For transactions with multiple accessories
          if (tx.accessoriesList?.length > 0) {
            accessoryName = tx.accessoriesList
              .map((a) => a.name || a.accessoryName)
              .join(', ');
            quantity = tx.accessoriesList.reduce(
              (sum, a) => sum + (a.quantity || 0),
              0
            );
            price = `Multiple`;
            total = `Rs. ${tx.totalPrice.toLocaleString()}`;
          }

          return [
            date,
            type,
            // accessoryName,
            // quantity,
            // price,
            // total,
            tx.description || '',
          ];
        }),
        styles: {
          fontSize: 9,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 10,
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Date
          1: { cellWidth: 15 }, // Type
          // 2: { cellWidth: 40 }, // Accessory
          // 3: { cellWidth: 15 }, // Qty
          // 4: { cellWidth: 20 }, // Price
          // 5: { cellWidth: 20 }, // Total
          6: { cellWidth: 'auto' }, // Description
        },
      });

      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      doc.save(
        `${person.name}_accessory_transactions_${new Date().toISOString().slice(0, 10)}.pdf`
      );
      setShowPDFModal(false);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // Optionally show error to user
      // setError('Failed to generate PDF. Please try again.');
    }
  };
  const handleGiveCredit = async (e) => {
    e.preventDefault();
    if (!creditData.personId || !creditData.amount) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/person/give-credit', {
        personId: creditData.personId,
        amount: Number.parseFloat(creditData.amount),
        description: creditData.description || '',
        giveCredit: giveCredit,
      });

      setShowGiveCreditModal(false);
      setCreditData({ personId: '', amount: '' });
      alert('Credit given successfully!');
    } catch (error) {
      console.error('Error giving credit:', error);
      alert('Error giving credit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Take credit
  const handleTakeCredit = async (e) => {
    e.preventDefault();
    if (!creditData.personId || !creditData.amount) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/person/take-credit', {
        personId: creditData.personId,
        amount: Number.parseFloat(creditData.amount),
        description: creditData.description || '',
        takeCredit: takeCredit,
      });

      setShowTakeCreditModal(false);
      setCreditData({ personId: '', amount: '' });
      alert('Credit taken successfully!');
    } catch (error) {
      console.error('Error taking credit:', error);
      alert('Error taking credit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <strong
            style={{
              fontSize: '18px',
              color: '#333',
              fontWeight: 'bold',
            }}
          >
            Phone:
          </strong>{' '}
          {person.number}
        </p>
        <p>
          <strong
            style={{
              fontSize: '18px',
              color: '#333',
              fontWeight: 'bold',
            }}
          >
            Reference:
          </strong>{' '}
          {person.reference}
        </p>
        <p>
          <strong
            style={{
              fontSize: '18px',
              color: '#333',
              fontWeight: 'bold',
            }}
          >
            Status:
          </strong>{' '}
          {person.status}
        </p>

        {/* <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
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
        </div> */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div
            style={{
              background:
                person.takingCredit > person.givingCredit
                  ? '#fef2f2'
                  : person.givingCredit > person.takingCredit
                    ? '#ecfdf5'
                    : '#f3f4f6',
              padding: '10px',
              borderRadius: '6px',
              flex: 1,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color:
                  person.takingCredit > person.givingCredit
                    ? '#b91c1c'
                    : person.givingCredit > person.takingCredit
                      ? '#047857'
                      : '#4b5563',
              }}
            >
              {person.takingCredit > person.givingCredit
                ? 'Net Taking Credit'
                : person.givingCredit > person.takingCredit
                  ? 'Net Giving Credit'
                  : 'All Settled'}
            </p>
            <p
              style={{
                margin: 0,
                fontWeight: 'bold',
                color:
                  person.takingCredit > person.givingCredit
                    ? '#b91c1c'
                    : person.givingCredit > person.takingCredit
                      ? '#047857'
                      : '#4b5563',
              }}
            >
              {Math.abs(
                person.takingCredit - person.givingCredit
              ).toLocaleString()}{' '}
              PKR
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowGiveCreditModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#059669')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#10b981')
              }
            >
              <FaArrowUp /> MAINE DIYE
              {/* <FaArrowUp /> Give Credit */}
            </button>

            <button
              onClick={() => setShowTakeCreditModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#d97706')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#f59e0b')
              }
            >
              <FaArrowDown /> MAINE LIYE
              {/* <FaArrowDown /> Take Credit */}
            </button>
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

      {/* <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
        Transaction History
      </h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px' }}>
       
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
   
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
      )} */}

      <div
        style={{
          width: '100%',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
          Transaction History
        </h3>
        <button
          onClick={() => setShowPDFModal(true)}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
          }}
        >
          Download PDF
        </button>
      </div>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div style={{ padding: '12px 0' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {transactions.map((tx) => {
              const isCreditReceived = tx.takingCredit !== 0;
              const isCreditGiven = tx.givingCredit !== 0;
              const isPayment = !isCreditReceived && !isCreditGiven;

              const colors = {
                border: isCreditReceived
                  ? '#ef4444'
                  : isCreditGiven
                    ? '#22c55e'
                    : '#3b82f6',
                bg: isCreditReceived
                  ? '#fef2f2'
                  : isCreditGiven
                    ? '#f0fdf4'
                    : '#f0f9ff',
                text: isCreditReceived
                  ? '#b91c1c'
                  : isCreditGiven
                    ? '#15803d'
                    : '#1d4ed8',
              };

              const amount = isCreditReceived
                ? tx.takingCredit
                : isCreditGiven
                  ? tx.givingCredit
                  : 0;
              const formattedAmount = `Rs. ${Math.abs(amount).toLocaleString()}`;

              const transactionType = isCreditReceived
                ? 'Taking Credit'
                : isCreditGiven
                  ? 'Giving Credit'
                  : 'Payment';

              return (
                <div
                  key={tx._id}
                  style={{
                    display: 'flex',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Left Box (75%) - Transaction Details */}
                  <div
                    style={{
                      width: '75%',
                      padding: '14px',
                      backgroundColor: colors.bg,
                      borderLeft: `4px solid ${colors.border}`,
                      display: 'flex',
                      gap: '16px',
                    }}
                  >
                    {/* Date/Time Column */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontWeight: '700',
                          fontSize: '14px',
                          color: '#334155',
                        }}
                      >
                        {new Date(tx.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#64748b',
                          marginTop: '2px',
                        }}
                      >
                        {new Date(tx.createdAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>

                    {/* Transaction Info Column */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '15px',
                          color: colors.text,
                          marginBottom: '4px',
                        }}
                      >
                        {transactionType}
                        {` ${formattedAmount}`}
                      </div>

                      {tx.description && (
                        <p
                          style={{
                            margin: 0,
                            color: '#475569',
                            fontSize: '13.5px',
                            lineHeight: '1.4',
                          }}
                        >
                          {tx.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Box (25%) - Amount */}
                  <div
                    style={{
                      width: '25%',
                      padding: '14px',
                      backgroundColor: '#ffffff',
                      border: `1px solid ${colors.border}`,
                      borderLeft: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        marginBottom: '4px',
                      }}
                    >
                      {isPayment ? 'Amount' : 'Credit'}
                    </span>

                    <span
                      style={{
                        fontWeight: '700',
                        fontSize: '16px',
                        color: colors.text,
                      }}
                    >
                      {formattedAmount}
                    </span>

                    {isPayment && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          marginTop: '4px',
                          fontStyle: 'italic',
                        }}
                      >
                        {amount === 0
                          ? 'Settled'
                          : amount > 0
                            ? 'To Receive'
                            : 'To Pay'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Modal
        size="sm"
        show={showPDFModal}
        toggleModal={() => setShowPDFModal(false)}
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#333',
            }}
          >
            Select Date Range
          </p>

          <DatePicker
            getPopupContainer={(triggerNode) => triggerNode.parentNode} // Important!
            dropdownStyle={{ zIndex: 1000000 }} // Higher than modal
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
            placeholder="Start Date"
            onChange={(date, dateString) =>
              setDataRange((prev) => ({ ...prev, startDate: dateString }))
            }
          />

          <DatePicker
            getPopupContainer={(triggerNode) => triggerNode.parentNode} // Important!
            dropdownStyle={{ zIndex: 1000000 }} // Higher than modal
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
            placeholder="End Date"
            onChange={(date, dateString) =>
              setDataRange((prev) => ({ ...prev, endDate: dateString }))
            }
          />

          <button
            onClick={handleDownloadPDF}
            style={{
              marginTop: '12px',
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Download PDF
          </button>
        </div>
      </Modal>
      <Modal
        size="sm"
        show={showGiveCreditModal}
        toggleModal={() => setShowGiveCreditModal(false)}
      >
        <h2
          style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          Give Credit
        </h2>

        <form onSubmit={handleGiveCredit}>
          <div style={{ marginBottom: '20px' }}></div>

          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Amount (PKR) *
            </label>
            <div style={{ position: 'relative' }}>
              <FaDollarSign
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}
              />
              <input
                type="number"
                value={creditData.amount}
                onChange={(e) =>
                  setCreditData({ ...creditData, amount: e.target.value })
                }
                placeholder="Enter amount"
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Desciption *
            </label>
            <div style={{ position: 'relative' }}>
              <FaStickyNote
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}
              />
              <input
                type="text"
                value={creditData.description}
                onChange={(e) =>
                  setCreditData({
                    ...creditData,
                    description: e.target.value,
                  })
                }
                placeholder="Enter description"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>
          {/* <Button
            variant="secondary"
            onClick={() =>
              setShowGiveCreditChildModal(!showGiveCreditChildModal)
            }
          >
            Proceed To Pay
          </Button> */}
          <WalletTransactionModal
            show={showGiveCreditChildModal}
            toggleModal={() =>
              setShowGiveCreditChildModal(!showGiveCreditChildModal)
            }
            singleTransaction={giveCredit}
            setSingleTransaction={setGiveCredit}
          />

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => setShowGiveCreditModal(false)}
              style={{
                padding: '12px 24px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#f9fafb')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'white')
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: isSubmitting ? '#9ca3af' : '#10b981',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseOut={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              {isSubmitting ? 'Processing...' : 'Give Credit'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        size="sm"
        show={showTakeCreditModal}
        toggleModal={() => setShowTakeCreditModal(false)}
      >
        <h2
          style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          Take Credit
        </h2>

        <form onSubmit={handleTakeCredit}>
          <div style={{ marginBottom: '20px' }}></div>

          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Amount (PKR) *
            </label>
            <div style={{ position: 'relative' }}>
              <FaDollarSign
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}
              />
              <input
                type="number"
                value={creditData.amount}
                onChange={(e) =>
                  setCreditData({ ...creditData, amount: e.target.value })
                }
                placeholder="Enter amount"
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Desciption *
            </label>
            <div style={{ position: 'relative' }}>
              <FaStickyNote
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}
              />
              <input
                type="text"
                value={creditData.description}
                onChange={(e) =>
                  setCreditData({
                    ...creditData,
                    description: e.target.value,
                  })
                }
                placeholder="Enter description"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>
          {/* <Button
            variant="secondary"
            onClick={() =>
              setShowWalletTransactionModal(!showWalletTransactionModal)
            }
          >
            Proceed To Get Payment
          </Button> */}
          {/* <WalletTransactionModal
            show={showWalletTransactionModal}
            toggleModal={() =>
              setShowWalletTransactionModal(!showWalletTransactionModal)
            }
            singleTransaction={takeCredit}
            setSingleTransaction={setTakeCredit}
          /> */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => setShowTakeCreditModal(false)}
              style={{
                padding: '12px 24px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#f9fafb')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'white')
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: isSubmitting ? '#9ca3af' : '#f59e0b',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = '#d97706';
              }}
              onMouseOut={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = '#f59e0b';
              }}
            >
              {isSubmitting ? 'Processing...' : 'Take Credit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PayablesAndReceivablesRecords;
