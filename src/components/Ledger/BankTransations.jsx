import { useParams } from 'react-router-dom';
import { api } from '../../../api/api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaTrash, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { dateFormatter } from 'utils/dateFormatter';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const BankTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [dateRange, setDateRange] = useState([null, null]);
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
    if (!confirm('Are you sure you want to delete this bank transaction?'))
      return;

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
    setDisplayCount((prev) => prev + 20);
  };

  useEffect(() => {
    getBankTransactions();
  }, [id]);

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
      doc.text('Bank Transactions', 14, 20);

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
        const amount = txn.accountCash;
        const description =
          txn.sourceOfAmountAddition || txn.reasonOfAmountDeduction || '-';
        const date = dayjs(txn.createdAt).format('DD/MM/YYYY HH:mm');

        return [date, amount ? amount.toLocaleString() : '-', description];
      });

      // Generate table
      autoTable(doc, {
        startY: 42,
        head: [['Date', 'Amount', 'Description']],
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
          0: { cellWidth: 40 }, // Date
          1: { cellWidth: 40, halign: 'right' }, // Amount
          2: { cellWidth: 110 }, // Description
        },
      });

      // Calculate totals
      const totalAdded = sortedTransactions.reduce((sum, txn) => {
        if (txn.sourceOfAmountAddition && txn.accountCash) {
          return sum + Math.abs(txn.accountCash);
        }
        return sum;
      }, 0);
      const totalDeducted = sortedTransactions.reduce((sum, txn) => {
        if (txn.reasonOfAmountDeduction && txn.accountCash) {
          return sum + Math.abs(txn.accountCash);
        }
        return sum;
      }, 0);

      // Add summary after table
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 42;

      autoTable(doc, {
        startY: finalY,
        head: [['Summary']],
        body: [
          [`Total Added: Rs. ${totalAdded.toLocaleString()}`],
          [`Total Deducted: Rs. ${totalDeducted.toLocaleString()}`],
          [`Net Balance: Rs. ${(totalAdded - totalDeducted).toLocaleString()}`],
        ],
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [46, 125, 50],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
        },
      });

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
      const fileName = `Bank_Transactions_${
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

  // Helper function to get background color based on transaction status
  const getRowBackgroundColor = (transaction) => {
    if (transaction.sourceOfAmountAddition) {
      return '#e8f5e8'; // Light green for incoming transactions
    } else if (
      transaction.reasonOfAmountDeduction &&
      typeof transaction.reasonOfAmountDeduction === 'string' &&
      transaction.reasonOfAmountDeduction.toLowerCase().includes('take')
    ) {
      return '#ffebee'; // Light red for outgoing transactions
    } else if (
      transaction.reasonOfAmountDeduction &&
      typeof transaction.reasonOfAmountDeduction === 'string' &&
      transaction.reasonOfAmountDeduction.toLowerCase().includes('give')
    ) {
      return '#e8f5e8'; // Light green for outgoing transactions
    } else if (transaction.reasonOfAmountDeduction) {
      return '#ffebee'; // Light red for outgoing transactions
    }
    return '#ffffff'; // Default white
  };

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
        Bank Transactions
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
            {filteredTransactions
              .slice(0, displayCount)
              .map((transaction, index) => (
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
                      onMouseEnter={(e) => (e.target.style.color = '#c0392b')}
                      onMouseLeave={(e) => (e.target.style.color = '#e74c3c')}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length > displayCount && (
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
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#2980b9')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#3498db')}
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
            padding: 40,
            color: '#7f8c8d',
            fontSize: 14,
          }}
        >
          No transactions found for the selected date range.
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
        Showing {Math.min(displayCount, filteredTransactions.length)} of{' '}
        {filteredTransactions.length} transactions
        {dateRange[0] && dateRange[1] && ' (filtered)'}
      </div>
    </div>
  );
};

export default BankTransactions;
