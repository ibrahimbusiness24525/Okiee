import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { useParams } from 'react-router-dom';
import {
  FaTrash,
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const PocketCashTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);
  const [dateRange, setDateRange] = useState([null, null]);
  const [deletingId, setDeletingId] = useState(null);
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
    if (deletingId === id) return; // Prevent multiple clicks on the same item

    if (
      !confirm('Are you sure you want to delete this pocket cash transaction?')
    )
      return;

    try {
      setDeletingId(id); // Set loading state for this specific transaction
      const response = await api.delete(`/api/pocketCash/delete/${id}`);
      await getTransactions(); // Wait for refresh to complete
      toast.success('Transaction deleted successfully');
      return response?.data || [];
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error('Error fetching pocket cash transactions:', error);
      throw error;
    } finally {
      setDeletingId(null); // Clear loading state
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

  // Filter transactions based on date range
  const filteredTransactions = transactions.filter((txn) => {
    if (!dateRange[0] || !dateRange[1]) return true;
    const txnDay = dayjs(txn.createdAt).format('YYYY-MM-DD');
    const startDay = dayjs(dateRange[0]).format('YYYY-MM-DD');
    const endDay = dayjs(dateRange[1]).format('YYYY-MM-DD');
    return txnDay >= startDay && txnDay <= endDay;
  });

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      const filtered = filteredTransactions;

      if (filtered.length === 0) {
        toast.warning('No transactions found for the selected date range');
        return;
      }

      // Sort transactions by date (oldest to newest)
      const sortedTransactions = [...filtered].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      // Dynamically import PDF libs to ensure plugin registration
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      // Create new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40, 62, 80);
      doc.text('Pocket Cash Transactions', 14, 20);

      // Add date range information
      let dateRangeText = 'All Transactions';
      if (dateRange[0] && dateRange[1]) {
        const startStr = dayjs(dateRange[0]).format('DD/MM/YYYY');
        const endStr = dayjs(dateRange[1]).format('DD/MM/YYYY');
        dateRangeText = `Date Range: ${startStr} to ${endStr}`;
      }

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(dateRangeText, 14, 30);
      doc.text(`Generated on: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 14, 36);

      // Prepare table data
      const tableData = sortedTransactions.map((txn) => {
        const amount = txn.amountAdded || txn.amountDeducted;
        const description =
          txn.sourceOfAmountAddition || txn.reasonOfAmountDeduction || '-';
        const balance = txn.remainingAmount ?? txn.accountCash;
        const date = dayjs(txn.createdAt).format('DD/MM/YYYY HH:mm');

        return [
          date,
          amount ? amount.toLocaleString() : '-',
          description,
          balance ? balance.toLocaleString() : '-',
        ];
      });

      // Generate table
      autoTable(doc, {
        startY: 42,
        head: [['Date', 'Amount', 'Description', 'Balance']],
        body: tableData,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
        columnStyles: {
          0: { cellWidth: 35 }, // Date
          1: { cellWidth: 30, halign: 'right' }, // Amount
          2: { cellWidth: 70 }, // Description
          3: { cellWidth: 30, halign: 'right' }, // Balance
        },
      });

      // Calculate totals
      const totalAdded = sortedTransactions.reduce(
        (sum, txn) => sum + (txn.amountAdded || 0),
        0
      );
      const totalDeducted = sortedTransactions.reduce(
        (sum, txn) => sum + (txn.amountDeducted || 0),
        0
      );
      const finalBalance =
        sortedTransactions.length > 0
          ? sortedTransactions[sortedTransactions.length - 1].remainingAmount ??
            sortedTransactions[sortedTransactions.length - 1].accountCash
          : 0;

      // Add summary after table
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 42;

      // autoTable(doc, {
      //   startY: finalY,
      //   head: [['Summary']],
      //   body: [
      //     [`Total Added: Rs. ${totalAdded.toLocaleString()}`],
      //     [`Total Deducted: Rs. ${totalDeducted.toLocaleString()}`],
      //     [`Net Balance: Rs. ${(totalAdded - totalDeducted).toLocaleString()}`],
      //     [
      //       `Final Balance: Rs. ${finalBalance ? finalBalance.toLocaleString() : '0'}`,
      //     ],
      //   ],
      //   styles: {
      //     fontSize: 9,
      //     cellPadding: 3,
      //   },
      //   headStyles: {
      //     fillColor: [46, 125, 50],
      //     textColor: 255,
      //     fontSize: 10,
      //     fontStyle: 'bold',
      //   },
      //   columnStyles: {
      //     0: { cellWidth: 'auto' },
      //   },
      // });

      // Add page numbers
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
      const fileName = `PocketCash_Transactions_${
        dateRange[0] && dateRange[1]
          ? `${dayjs(dateRange[0]).format('YYYY-MM-DD')}_to_${dayjs(dateRange[1]).format('YYYY-MM-DD')}`
          : 'All'
      }_${dayjs().format('YYYY-MM-DD')}.pdf`;

      doc.save(fileName);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF');
    }
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

      {/* Date Range Picker Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'white',
              marginBottom: 4,
            }}
          >
            <FaCalendarAlt size={18} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>
              Select Date Range
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <DatePicker.RangePicker
              size="large"
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0].toDate(), dates[1].toDate()]);
                } else {
                  setDateRange([null, null]);
                }
              }}
              value={
                dateRange[0] && dateRange[1]
                  ? [dayjs(dateRange[0]), dayjs(dateRange[1])]
                  : null
              }
              format="DD/MM/YYYY"
              placeholder={['Start Date', 'End Date']}
              style={{
                flex: 1,
                minWidth: 250,
                borderRadius: 8,
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.95)',
                padding: '8px 12px',
                fontSize: 14,
              }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
            <button
              onClick={handleDownloadPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.95)',
                color: '#667eea',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}
            >
              <FaDownload size={16} />
              <span>Download PDF</span>
            </button>
            {(dateRange[0] || dateRange[1]) && (
              <button
                onClick={() => setDateRange([null, null])}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.5)',
                  backgroundColor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 13,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Clear Filter
              </button>
            )}
          </div>
          {(dateRange[0] || dateRange[1]) && (
            <div
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Showing {filteredTransactions.length} of {transactions.length}{' '}
              transactions
              {dateRange[0] && dateRange[1] && (
                <span>
                  {' '}
                  ({dayjs(dateRange[0]).format('DD/MM/YYYY')} -{' '}
                  {dayjs(dateRange[1]).format('DD/MM/YYYY')})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transactions Cards Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {filteredTransactions.slice(0, displayCount).map((txn) => {
          const amount = txn.amountAdded || txn.amountDeducted;
          const isCredit = !!txn.amountAdded;
          const description =
            txn.sourceOfAmountAddition || txn.reasonOfAmountDeduction || '-';
          const balance = txn.remainingAmount ?? txn.accountCash;

          // Determine card background color based on transaction type
          const cardBgColor =
            txn.reasonOfAmountDeduction &&
            typeof txn.reasonOfAmountDeduction === 'string' &&
            (txn.reasonOfAmountDeduction.toLowerCase().includes('purchase') ||
              txn.reasonOfAmountDeduction.toLowerCase().includes('take') ||
              (!txn.reasonOfAmountDeduction
                .toLowerCase()
                .includes('take credit') &&
                txn.reasonOfAmountDeduction.toLowerCase().includes('return')))
              ? 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)'
              : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';

          const borderColor = isCredit ? '#22c55e' : '#ef4444';
          const amountColor = isCredit ? '#16a34a' : '#dc2626';

          return (
            <div
              key={txn._id}
              style={{
                background: cardBgColor,
                borderRadius: 12,
                padding: 14,
                boxShadow:
                  '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                border: `2px solid ${borderColor}20`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
              }}
            >
              {/* Decorative accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: borderColor,
                }}
              />

              {/* Card Content - Horizontal Layout */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginLeft: 6,
                  flexWrap: 'wrap',
                }}
              >
                {/* Left Section - Icon, Date, Description */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flex: 1,
                    minWidth: 250,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `${borderColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${borderColor}40`,
                      flexShrink: 0,
                    }}
                  >
                    {isCredit ? (
                      <FaArrowUp size={16} color={amountColor} />
                    ) : (
                      <FaArrowDown size={16} color={amountColor} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#6b7280',
                        fontWeight: 500,
                        marginBottom: 2,
                      }}
                    >
                      {formatDate(txn.createdAt)}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#1f2937',
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {description}
                    </div>
                  </div>
                </div>

                {/* Right Section - Amount, Balance, Delete */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Amount */}
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: '#6b7280',
                        fontWeight: 500,
                        marginBottom: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {isCredit ? 'Added' : 'Deducted'}
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        color: amountColor,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isCredit ? '+' : '-'}
                      {amount ? `Rs. ${amount.toLocaleString()}` : '-'}
                    </div>
                  </div>

                  {/* Balance */}
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: '#6b7280',
                        fontWeight: 500,
                        marginBottom: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Balance
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        color: '#1f2937',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Rs. {balance ? balance.toLocaleString() : '0'}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div>
                    {deletingId === txn._id ? (
                      <div
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          borderRadius: 6,
                          color: '#6b7280',
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        Deleting...
                      </div>
                    ) : (
                      <button
                        onClick={() => deletePocketCashTransaction(txn._id)}
                        style={{
                          padding: '6px 10px',
                          background: '#fee2e2',
                          border: '1px solid #fecaca',
                          borderRadius: 6,
                          cursor: 'pointer',
                          color: '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.2s ease',
                          fontWeight: 500,
                          fontSize: 11,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fecaca';
                          e.currentTarget.style.borderColor = '#fca5a5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.borderColor = '#fecaca';
                        }}
                      >
                        <FaTrash size={12} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTransactions.length > displayCount && (
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
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2980b9';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3498db';
            }}
          >
            View More ({filteredTransactions.length - displayCount} remaining)
          </button>
        </div>
      )}

      {filteredTransactions.length === 0 && (
        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
            padding: '60px 40px',
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            borderRadius: 16,
            border: '2px dashed #d1d5db',
          }}
        >
          <div
            style={{
              fontSize: 48,
              color: '#9ca3af',
              marginBottom: 16,
            }}
          >
            📭
          </div>
          <div
            style={{
              color: '#6b7280',
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            No transactions found
          </div>
          <div
            style={{
              color: '#9ca3af',
              fontSize: 14,
            }}
          >
            {dateRange[0] && dateRange[1]
              ? 'Try adjusting your date range filter'
              : 'No transactions available for this pocket cash account'}
          </div>
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
        Showing {Math.min(displayCount, filteredTransactions.length)} of{' '}
        {filteredTransactions.length} transactions
        {dateRange[0] && dateRange[1] && ' (filtered)'}
      </div>
    </div>
  );
};

export default PocketCashTransactions;
