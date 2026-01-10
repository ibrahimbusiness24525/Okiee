import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, getCreditTransactionDetails } from '../../../api/api';
import { TransactionCard } from 'components/TransactionCard';
import {
  FaArrowDown,
  FaArrowUp,
  FaDollarSign,
  FaPlus,
  FaStickyNote,
  FaTrash,
  FaEdit,
  FaFileInvoice,
  FaExchangeAlt,
  FaUser,
  FaReceipt,
  FaBox,
  FaCreditCard,
  FaComment,
} from 'react-icons/fa';
import Modal from 'components/Modal/Modal';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DatePicker } from 'antd';
import { Button } from 'react-bootstrap';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
import { toast } from 'react-toastify';
const PayablesAndReceivablesRecords = () => {
  // Add CSS animation for loading spinner
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
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

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    givingCredit: '',
    takingCredit: '',
    description: '',
    balanceAmount: '',
    date: '',
    createdAt: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

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
  // ... existing code ...
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

      // Sort transactions by date (oldest to newest)
      filteredTransactions.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      // Dynamically import jsPDF and autoTable
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      // Create new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text(`${person.name}'s Ledger Transactions`, 14, 16);

      // Add date range information after the title
      let dateRangeText = 'All Transactions';
      if (dataRange.startDate || dataRange.endDate) {
        const startStr = dataRange.startDate
          ? new Date(dataRange.startDate).toLocaleDateString()
          : 'Beginning';
        const endStr = dataRange.endDate
          ? new Date(dataRange.endDate).toLocaleDateString()
          : 'Today';
        dateRangeText = `Date Range: ${startStr} to ${endStr}`;
      }

      doc.setFontSize(12);
      doc.setTextColor(80);
      doc.text(dateRangeText, 14, 28);

      // Generate table
      autoTable(doc, {
        startY: 35,
        head: [
          ['Date', 'Type', 'Transaction', 'Description', 'Balance Amount'],
        ],
        body: filteredTransactions.map((tx) => {
          const type = tx.type === 'purchase' ? 'Purchase' : 'Sale';
          const date = new Date(tx.createdAt).toLocaleDateString();

          // Determine transaction type: Taking Credit, Giving Credit, or Payment
          let transactionType = '';
          if (tx.takingCredit && tx.takingCredit !== 0) {
            transactionType = `Taking Credit (Rs. ${tx.takingCredit.toLocaleString()})`;
          } else if (tx.givingCredit && tx.givingCredit !== 0) {
            transactionType = `Giving Credit (Rs. ${tx.givingCredit.toLocaleString()})`;
          } else {
            transactionType = 'Full Payment';
          }

          return [
            date,
            type,
            transactionType,
            tx.description || '',
            tx.balanceAmount || '',
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
          6: { cellWidth: 'auto' }, // Description
        },
      });

      // Totals summary table (after main table)
      const totalTaking = filteredTransactions.reduce(
        (sum, tx) => sum + (tx.takingCredit || 0),
        0
      );
      const totalGiving = filteredTransactions.reduce(
        (sum, tx) => sum + (tx.givingCredit || 0),
        0
      );

      // Calculate net status from total amounts (not filtered)
      let netStatus = '';
      let netAmount = 0;

      if (person.takingCredit > person.givingCredit) {
        netStatus = 'Net Taking Credit';
        netAmount = person.takingCredit - person.givingCredit;
      } else if (person.givingCredit > person.takingCredit) {
        netStatus = 'Net Giving Credit';
        netAmount = person.givingCredit - person.takingCredit;
      } else {
        netStatus = 'All Settled';
        netAmount = 0;
      }

      const summaryStartY =
        doc.lastAutoTable && doc.lastAutoTable.finalY
          ? doc.lastAutoTable.finalY + 10
          : 35;

      autoTable(doc, {
        startY: summaryStartY,
        head: [['Total Taking', 'Total Giving', 'Net Status']],
        body: [
          [
            `Rs. ${totalTaking.toLocaleString()}`,
            `Rs. ${totalGiving.toLocaleString()}`,
            `${netStatus}: Rs. ${netAmount.toLocaleString()}`,
          ],
        ],
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 11,
        },
      });

      // Add status summary at the end
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);

        // Add page number
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );

        // Add status summary on the last page
        if (i === pageCount) {
          // Calculate net status
          let netStatus = '';
          let netAmount = 0;

          if (person.takingCredit > person.givingCredit) {
            netStatus = 'Net Taking Credit';
            netAmount = person.takingCredit - person.givingCredit;
          } else if (person.givingCredit > person.takingCredit) {
            netStatus = 'Net Giving Credit';
            netAmount = person.givingCredit - person.takingCredit;
          } else {
            netStatus = 'All Settled';
            netAmount = 0;
          }

          // Add status summary
          doc.setFontSize(10);
          doc.setTextColor(40);
          doc.text('Status Summary:', 14, doc.internal.pageSize.height - 25);

          doc.setFontSize(9);
          doc.setTextColor(60);
          doc.text(
            `${netStatus}: Rs. ${netAmount.toLocaleString()}`,
            14,
            doc.internal.pageSize.height - 20
          );

          // Add date range information
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(dateRangeText, 14, doc.internal.pageSize.height - 15);
        }
      }

      // Save the PDF
      doc.save(
        `${person.name}_accessory_transactions_${new Date().toISOString().slice(0, 10)}.pdf`
      );
      setShowPDFModal(false);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
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
  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    } else {
      try {
        await api.delete(`/api/person/delete-transaction/${id}`);
        toast.success('Record deleted successfully');
      } catch (error) {
        toast.error('Failed to delete record');
        console.error('Error deleting record:', error);
      }
    }
  };

  const openEditModal = (tx) => {
    setEditingId(tx._id);
    setEditData({
      givingCredit: tx.givingCredit || 0,
      takingCredit: tx.takingCredit || 0,
      description: tx.description || '',
      balanceAmount: tx.balanceAmount || 0,
      date: tx.createdAt
        ? new Date(tx.createdAt).toISOString().split('T')[0]
        : '',
      createdAt: tx.createdAt || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setIsUpdating(true);
      const response = await api.put(
        `/api/person/update-transaction/${editingId}`,
        {
          givingCredit: Number(editData.givingCredit) || 0,
          takingCredit: Number(editData.takingCredit) || 0,
          description: editData.description || '',
          balanceAmount: Number(editData.balanceAmount) || 0,
          createdAt: editData.date || '',
          updatedAt: editData.date || '',
        }
      );
      const updatedTx = response?.data?.transaction || null;
      if (updatedTx) {
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === editingId ? updatedTx : tx))
        );
        toast.success('Transaction updated successfully');
      } else {
        toast.success('Transaction updated');
      }
      setShowEditModal(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInvoiceClick = async (transactionId) => {
    try {
      setLoadingInvoice(true);
      setSelectedTransaction(transactionId);
      setShowInvoiceModal(true);

      const response = await getCreditTransactionDetails(transactionId);
      if (response.data.success) {
        setInvoiceDetails(response.data.data);
      } else {
        toast.error('Failed to fetch invoice details');
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Failed to fetch invoice details');
    } finally {
      setLoadingInvoice(false);
    }
  };
  const handlePrint = () => {
    // Prepare table rows
    let tableRows = '';
    let totalTaking = 0;
    let totalGiving = 0;
    let totalFullPayments = 0;

    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      const type =
        tx.takingCredit !== 0
          ? 'Taking Credit'
          : tx.givingCredit !== 0
            ? 'Giving Credit'
            : 'Full Payment';
      const amount =
        tx.takingCredit !== 0
          ? tx.takingCredit
          : tx.givingCredit !== 0
            ? tx.givingCredit
            : 0;
      if (tx.takingCredit !== 0) totalTaking += tx.takingCredit;
      if (tx.givingCredit !== 0) totalGiving += tx.givingCredit;
      if (tx.takingCredit === 0 && tx.givingCredit === 0) totalFullPayments++;
      tableRows += `
        <tr>
          <td style='border:1px solid #ccc;padding:6px;'>${date}</td>
          <td style='border:1px solid #ccc;padding:6px;'>${type}</td>
          <td style='border:1px solid #ccc;padding:6px;'>${amount !== 0 ? 'Rs. ' + amount.toLocaleString() : '-'}</td>
          <td style='border:1px solid #ccc;padding:6px;'>${tx.description || '-'}</td>
          <td style='border:1px solid #ccc;padding:6px;'>${tx.balanceAmount !== undefined ? tx.balanceAmount : '-'}</td>
        </tr>
      `;
    });

    // Print window HTML
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`
      <html>
        <head>
          <title>Transaction Print</title>
          <style>
            body { font-family: sans-serif; margin: 24px; }
            h2 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background: #f3f4f6; }
            tfoot td { font-weight: bold; background: #f9fafb; }
            .summary-table { margin-top: 24px; width: 60%; }
            .summary-table td { font-size: 15px; }
          </style>
        </head>
        <body>
          <h2>${person?.name || 'Person'}'s Ledger Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Balance Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <table class='summary-table'>
            <tbody>
              <tr><td>Total Taking</td><td>Rs. ${totalTaking.toLocaleString()}</td></tr>
              <tr><td>Total Giving</td><td>Rs. ${totalGiving.toLocaleString()}</td></tr>
              <tr><td>Total Full Payments</td><td>${totalFullPayments}</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
  console.log('this is data');
  if (loading) return <p>Loading...</p>;
  if (!person) return <p>Person not found.</p>;
  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
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
            <span
              style={{
                color:
                  person.givingCredit > person.takingCredit
                    ? '#10b981' // green
                    : person.takingCredit > person.givingCredit
                      ? '#ef4444'
                      : '#4b5563', // red
              }}
            >
              {person.givingCredit > person.takingCredit
                ? 'Giving'
                : person.takingCredit > person.givingCredit
                  ? 'Taking'
                  : 'Settled'}
            </span>
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
                <FaArrowUp /> GIVING CREDIT
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
                <FaArrowDown /> TAKING CREDIT
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
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            {/* <button
            onClick={() => handlePrint()}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              backgroundColor: '#200246ff',
              color: 'white',
              border: 'none',
            }}
          >
            Print
          </button> */}
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
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: colors.bg,
                      borderLeft: `4px solid ${colors.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      width: '70%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      key={tx._id}
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      {/* Left Box (75%) - Transaction Details */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                        }}
                      >
                        {/* Date/Time Column */}
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span
                            style={{
                              fontWeight: '700',
                              fontSize: '14px',
                              color: '#334155',
                            }}
                          >
                            {new Date(tx.createdAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                              }
                            )}
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#64748b',
                              marginTop: '2px',
                            }}
                          >
                            {new Date(tx.createdAt).toLocaleTimeString(
                              'en-GB',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              }
                            )}
                          </span>
                        </div>

                        {/* Transaction Info Column */}
                        <div style={{ flex: 1, width: '100%' }}>
                          <div
                            style={{
                              fontWeight: '600',
                              fontSize: '15px',
                              color: colors.text,
                              marginBottom: '4px',
                              widowst: '100%',
                              textOverflow: 'ellipsis',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              {transactionType}
                              {` ${formattedAmount}`}
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: '#6b7280',
                                  marginLeft: '4px',
                                  color: '#6b7280',
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <FaEdit
                                  onClick={() => openEditModal(tx)}
                                  style={{
                                    cursor: 'pointer',
                                    color: '#3b82f6',
                                  }}
                                />
                                <FaTrash
                                  onClick={() => handleDeleteRecord(tx._id)}
                                  style={{
                                    cursor: 'pointer',
                                    color: '#ef4444',
                                  }}
                                />
                              </span>
                            </div>
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
                              <strong>
                                {(() => {
                                  // Filter out "||" and make the rest bold and clear
                                  return tx.description
                                    .split('||')
                                    .filter((part) => part.trim() !== '')
                                    .map((part, idx) => (
                                      <span
                                        key={idx}
                                        style={{ fontWeight: 700 }}
                                      >
                                        {part.trim()}
                                        {idx !==
                                        tx.description
                                          .split('||')
                                          .filter((p) => p.trim() !== '')
                                          .length -
                                          1
                                          ? ' | '
                                          : ''}
                                      </span>
                                    ));
                                })()}
                              </strong>{' '}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Box (25%) - Amount */}
                      <div
                      // style={{
                      //   width: '25%',
                      //   padding: '14px',
                      //   backgroundColor: '#ffffff',
                      //   border: `1px solid ${colors.border}`,
                      //   borderLeft: 'none',
                      //   display: 'flex',
                      //   flexDirection: 'column',
                      //   justifyContent: 'center',
                      //   alignItems: 'center',
                      // }}
                      >
                        {/* <span
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        marginBottom: '4px',
                      }}
                    >
                      {isPayment ? 'Amount' : 'Credit'}
                    </span> */}

                        {/* <span
                      style={{
                        fontWeight: '700',
                        fontSize: '16px',
                        color: colors.text,
                      }}
                    >
                      {formattedAmount}
                    </span> */}

                        {/* {isPayment && (
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
                    )} */}
                      </div>
                    </div>
                    <span>
                      <span
                        style={{
                          fontWeight: '700',
                        }}
                      >
                        Balance Amount:
                      </span>{' '}
                      {tx?.balanceAmount}
                    </span>
                    {tx.invoiceExist && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '12px',
                          background:
                            'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                          borderRadius: '8px',
                          border: '1px solid #0ea5e9',
                          boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <FaFileInvoice
                            style={{ color: '#0ea5e9', fontSize: '14px' }}
                          />
                          <span
                            style={{
                              fontWeight: '700',
                              color: '#0c4a6e',
                              fontSize: '13px',
                            }}
                          >
                            Invoice Details
                          </span>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gap: '6px',
                            fontSize: '12px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{ fontWeight: '600', color: '#374151' }}
                            >
                              Invoice #:
                            </span>
                            <span
                              style={{
                                fontWeight: '700',
                                color: '#0c4a6e',
                                background: '#e0f2fe',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontFamily: 'monospace',
                              }}
                            >
                              {tx.invoiceNumber || 'N/A'}
                            </span>
                          </div>

                          {/* Click to view full details */}
                          <div
                            style={{
                              marginTop: '8px',
                              paddingTop: '8px',
                              borderTop: '1px solid #bae6fd',
                              textAlign: 'center',
                            }}
                          >
                            <button
                              onClick={() => handleInvoiceClick(tx._id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0ea5e9',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  '#e0f2fe';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  'transparent';
                              }}
                            >
                              View Full Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

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

      {/* Edit Transaction Modal */}
      <Modal
        size="sm"
        show={showEditModal}
        toggleModal={() => setShowEditModal(false)}
      >
        <h2
          style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          Edit Transaction
        </h2>
        <form onSubmit={handleUpdateTransaction}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px' }}>
                Giving Credit
              </label>
              <input
                type="number"
                value={editData.givingCredit}
                onChange={(e) =>
                  setEditData({ ...editData, givingCredit: e.target.value })
                }
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px' }}>
                Taking Credit
              </label>
              <input
                type="number"
                value={editData.takingCredit}
                onChange={(e) =>
                  setEditData({ ...editData, takingCredit: e.target.value })
                }
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px' }}>
                Description
              </label>
              <input
                type="text"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Description"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px' }}>
                Balance Amount
              </label>
              <input
                type="number"
                value={editData.balanceAmount}
                onChange={(e) =>
                  setEditData({ ...editData, balanceAmount: e.target.value })
                }
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px' }}>
                Original Created Date
              </label>
              <input
                type="text"
                value={
                  editData.createdAt
                    ? new Date(editData.createdAt).toLocaleString()
                    : ''
                }
                readOnly
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#f9fafb',
                  color: '#6b7280',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px' }}>
                Update Date
              </label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                placeholder="Date"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '16px',
            }}
          >
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#6b7280',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: isUpdating ? '#9ca3af' : '#3b82f6',
                color: 'white',
                cursor: isUpdating ? 'not-allowed' : 'pointer',
              }}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
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

      {/* Invoice Details Modal */}
      <Modal
        size="lg"
        show={showInvoiceModal}
        toggleModal={() => setShowInvoiceModal(false)}
      >
        <div
          style={{
            padding: '0',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px 32px',
              borderRadius: '12px 12px 0 0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <FaFileInvoice style={{ fontSize: '24px', color: '#fbbf24' }} />
            <div>
              <h2
                style={{
                  margin: '0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'white',
                }}
              >
                Invoice Details
              </h2>
              {invoiceDetails?.invoiceInfo?.invoiceNumber && (
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '14px',
                    opacity: 0.9,
                    fontWeight: '500',
                  }}
                >
                  {invoiceDetails.invoiceInfo.invoiceNumber}
                </p>
              )}
            </div>
          </div>

          <div style={{ padding: '32px', background: 'transparent' }}>
            {loadingInvoice ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e2e8f0',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <p
                  style={{
                    color: '#64748b',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: 0,
                  }}
                >
                  Loading invoice details...
                </p>
              </div>
            ) : invoiceDetails ? (
              <div
                style={{
                  display: 'grid',
                  gap: '24px',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                }}
              >
                {/* Transaction Basic Info */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow:
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f1f5f9',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <FaExchangeAlt style={{ fontSize: '16px' }} />
                    </div>
                    <h3
                      style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1e293b',
                      }}
                    >
                      Transaction Information
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Transaction Type:
                      </span>
                      <span
                        style={{
                          fontWeight: '700',
                          color:
                            invoiceDetails.transactionType === 'taking'
                              ? '#dc2626'
                              : '#059669',
                          background:
                            invoiceDetails.transactionType === 'taking'
                              ? '#fef2f2'
                              : '#f0fdf4',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                        }}
                      >
                        {invoiceDetails.transactionType === 'taking'
                          ? 'Credit Purchase'
                          : 'Credit Sale'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Amount:
                      </span>
                      <span
                        style={{
                          fontWeight: '700',
                          color: '#1e293b',
                          fontSize: '16px',
                        }}
                      >
                        Rs.{' '}
                        {invoiceDetails.amounts?.netAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Balance Amount:
                      </span>
                      <span
                        style={{
                          fontWeight: '700',
                          color: '#1e293b',
                          fontSize: '16px',
                        }}
                      >
                        Rs. {invoiceDetails.balanceAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Date:
                      </span>
                      <span
                        style={{
                          fontWeight: '600',
                          color: '#64748b',
                          fontSize: '14px',
                        }}
                      >
                        {new Date(invoiceDetails.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Person Details */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow:
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f1f5f9',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background:
                          'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <FaUser style={{ fontSize: '16px' }} />
                    </div>
                    <h3
                      style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1e293b',
                      }}
                    >
                      Customer Details
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Name:
                      </span>
                      <span
                        style={{
                          fontWeight: '600',
                          color: '#1e293b',
                        }}
                      >
                        {invoiceDetails.personDetails?.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Phone:
                      </span>
                      <span
                        style={{
                          fontWeight: '600',
                          color: '#1e293b',
                          fontFamily: 'monospace',
                        }}
                      >
                        {invoiceDetails.personDetails?.number}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Reference:
                      </span>
                      <span
                        style={{
                          fontWeight: '600',
                          color: '#64748b',
                        }}
                      >
                        {invoiceDetails.personDetails?.reference}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#475569' }}>
                        Status:
                      </span>
                      <span
                        style={{
                          fontWeight: '700',
                          color:
                            invoiceDetails.personDetails?.status === 'Payable'
                              ? '#dc2626'
                              : invoiceDetails.personDetails?.status ===
                                  'Receivable'
                                ? '#059669'
                                : '#6b7280',
                          background:
                            invoiceDetails.personDetails?.status === 'Payable'
                              ? '#fef2f2'
                              : invoiceDetails.personDetails?.status ===
                                  'Receivable'
                                ? '#f0fdf4'
                                : '#f8fafc',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                        }}
                      >
                        {invoiceDetails.personDetails?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Invoice Information */}
                {invoiceDetails.invoiceInfo?.invoiceExist && (
                  <div
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow:
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #f1f5f9',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          background:
                            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <FaReceipt style={{ fontSize: '16px' }} />
                      </div>
                      <h3
                        style={{
                          margin: '0',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1e293b',
                        }}
                      >
                        Invoice Information
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <span style={{ fontWeight: '600', color: '#475569' }}>
                          Invoice Number:
                        </span>
                        <span
                          style={{
                            fontWeight: '700',
                            color: '#1e293b',
                            background: '#dbeafe',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                          }}
                        >
                          {invoiceDetails.invoiceInfo?.invoiceNumber}
                        </span>
                      </div>
                      {invoiceDetails.invoiceContext && (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              background: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <span
                              style={{ fontWeight: '600', color: '#475569' }}
                            >
                              Sale Type:
                            </span>
                            <span
                              style={{
                                fontWeight: '600',
                                color: '#1e293b',
                                background: '#fef3c7',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '13px',
                              }}
                            >
                              {invoiceDetails.invoiceContext?.saleType}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              background: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <span
                              style={{ fontWeight: '600', color: '#475569' }}
                            >
                              Total Invoice:
                            </span>
                            <span
                              style={{
                                fontWeight: '700',
                                color: '#059669',
                                fontSize: '16px',
                              }}
                            >
                              Rs.{' '}
                              {invoiceDetails.invoiceContext?.totalInvoice?.toLocaleString()}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              background: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <span
                              style={{ fontWeight: '600', color: '#475569' }}
                            >
                              Sale Date:
                            </span>
                            <span
                              style={{
                                fontWeight: '600',
                                color: '#64748b',
                                fontSize: '14px',
                              }}
                            >
                              {new Date(
                                invoiceDetails.invoiceContext?.saleDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              background: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <span
                              style={{ fontWeight: '600', color: '#475569' }}
                            >
                              Payment Type:
                            </span>
                            <span
                              style={{
                                fontWeight: '600',
                                color: '#7c3aed',
                                background: '#f3e8ff',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '13px',
                              }}
                            >
                              {invoiceDetails.invoiceContext?.paymentType}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Detailed Invoice Data */}
                {invoiceDetails.invoiceInfo?.invoiceDetails && (
                  <div
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow:
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #f1f5f9',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      gridColumn: '1 / -1', // Span full width
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '24px',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          background:
                            'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <FaBox style={{ fontSize: '16px' }} />
                      </div>
                      <h3
                        style={{
                          margin: '0',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#1e293b',
                        }}
                      >
                        Detailed Invoice Data
                      </h3>
                    </div>

                    {/* Pricing Information */}
                    {invoiceDetails.invoiceInfo.invoiceDetails.pricing && (
                      <div style={{ marginBottom: '24px' }}>
                        <h4
                          style={{
                            margin: '0 0 16px 0',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <FaCreditCard style={{ color: '#059669' }} />
                          Pricing Details
                        </h4>
                        x{' '}
                        <div
                          style={{
                            display: 'grid',
                            gap: '12px',
                            padding: '16px',
                            background:
                              'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                            borderRadius: '12px',
                            border: '1px solid #bbf7d0',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 0',
                            }}
                          >
                            <span
                              style={{ fontWeight: '600', color: '#166534' }}
                            >
                              Sale Price:
                            </span>
                            <span
                              style={{
                                fontWeight: '700',
                                color: '#166534',
                                fontSize: '16px',
                              }}
                            >
                              Rs.{' '}
                              {invoiceDetails.invoiceInfo.invoiceDetails.pricing.salePrice?.toLocaleString()}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 0',
                            }}
                          >
                            <span
                              style={{ fontWeight: '600', color: '#dc2626' }}
                            >
                              Purchase Price:
                            </span>
                            <span
                              style={{
                                fontWeight: '700',
                                color: '#dc2626',
                                fontSize: '16px',
                              }}
                            >
                              Rs.{' '}
                              {invoiceDetails.invoiceInfo.invoiceDetails.pricing.purchasePrice?.toLocaleString()}
                            </span>
                          </div>
                          <div
                            style={{
                              height: '2px',
                              background: '#16a34a',
                              margin: '8px 0',
                            }}
                          />
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 0',
                            }}
                          >
                            <span
                              style={{ fontWeight: '700', color: '#166534' }}
                            >
                              Profit:
                            </span>
                            <span
                              style={{
                                fontWeight: '700',
                                color: '#166534',
                                fontSize: '18px',
                                background: '#dcfce7',
                                padding: '4px 12px',
                                borderRadius: '8px',
                              }}
                            >
                              Rs.{' '}
                              {invoiceDetails.invoiceInfo.invoiceDetails.pricing.profit?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Phone Details */}
                    {invoiceDetails.invoiceInfo.invoiceDetails.phoneDetails && (
                      <div style={{ marginBottom: '24px' }}>
                        <h4
                          style={{
                            margin: '0 0 16px 0',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <FaBox style={{ color: '#7c3aed' }} />
                          Phone Details
                        </h4>
                        <div
                          style={{
                            display: 'grid',
                            gap: '12px',
                            padding: '20px',
                            background:
                              'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                            borderRadius: '12px',
                            border: '1px solid #d8b4fe',
                          }}
                        >
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '12px',
                            }}
                          >
                            <div
                              style={{
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e9d5ff',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: '600',
                                  color: '#7c3aed',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Company
                              </span>
                              <p
                                style={{
                                  margin: '4px 0 0 0',
                                  fontWeight: '700',
                                  color: '#1e293b',
                                }}
                              >
                                {
                                  invoiceDetails.invoiceInfo.invoiceDetails
                                    .phoneDetails.companyName
                                }
                              </p>
                            </div>
                            <div
                              style={{
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e9d5ff',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: '600',
                                  color: '#7c3aed',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Model
                              </span>
                              <p
                                style={{
                                  margin: '4px 0 0 0',
                                  fontWeight: '700',
                                  color: '#1e293b',
                                }}
                              >
                                {
                                  invoiceDetails.invoiceInfo.invoiceDetails
                                    .phoneDetails.modelName
                                }
                              </p>
                            </div>
                            <div
                              style={{
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e9d5ff',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: '600',
                                  color: '#7c3aed',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Color
                              </span>
                              <p
                                style={{
                                  margin: '4px 0 0 0',
                                  fontWeight: '700',
                                  color: '#1e293b',
                                }}
                              >
                                {
                                  invoiceDetails.invoiceInfo.invoiceDetails
                                    .phoneDetails.color
                                }
                              </p>
                            </div>
                            <div
                              style={{
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e9d5ff',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: '600',
                                  color: '#7c3aed',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                RAM
                              </span>
                              <p
                                style={{
                                  margin: '4px 0 0 0',
                                  fontWeight: '700',
                                  color: '#1e293b',
                                }}
                              >
                                {
                                  invoiceDetails.invoiceInfo.invoiceDetails
                                    .phoneDetails.ramMemory
                                }
                              </p>
                            </div>
                            <div
                              style={{
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e9d5ff',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: '600',
                                  color: '#7c3aed',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Battery Health
                              </span>
                              <p
                                style={{
                                  margin: '4px 0 0 0',
                                  fontWeight: '700',
                                  color: '#1e293b',
                                }}
                              >
                                {
                                  invoiceDetails.invoiceInfo.invoiceDetails
                                    .phoneDetails.batteryHealth
                                }
                              </p>
                            </div>
                            <div
                              style={{
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e9d5ff',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: '600',
                                  color: '#7c3aed',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Condition
                              </span>
                              <p
                                style={{
                                  margin: '4px 0 0 0',
                                  fontWeight: '700',
                                  color: '#1e293b',
                                }}
                              >
                                {
                                  invoiceDetails.invoiceInfo.invoiceDetails
                                    .phoneDetails.phoneCondition
                                }
                              </p>
                            </div>
                          </div>

                          {/* IMEI Section */}
                          <div
                            style={{
                              marginTop: '12px',
                              padding: '16px',
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid #e9d5ff',
                            }}
                          >
                            <h5
                              style={{
                                margin: '0 0 12px 0',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: '#7c3aed',
                              }}
                            >
                              IMEI Information
                            </h5>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '12px',
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    fontWeight: '600',
                                    color: '#64748b',
                                    fontSize: '12px',
                                  }}
                                >
                                  IMEI 1
                                </span>
                                <p
                                  style={{
                                    margin: '4px 0 0 0',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    fontFamily: 'monospace',
                                    background: '#f8fafc',
                                    padding: '8px',
                                    borderRadius: '4px',
                                  }}
                                >
                                  {
                                    invoiceDetails.invoiceInfo.invoiceDetails
                                      .phoneDetails.imei1
                                  }
                                </p>
                              </div>
                              {invoiceDetails.invoiceInfo.invoiceDetails
                                .phoneDetails.imei2 && (
                                <div>
                                  <span
                                    style={{
                                      fontWeight: '600',
                                      color: '#64748b',
                                      fontSize: '12px',
                                    }}
                                  >
                                    IMEI 2
                                  </span>
                                  <p
                                    style={{
                                      margin: '4px 0 0 0',
                                      fontWeight: '600',
                                      color: '#1e293b',
                                      fontFamily: 'monospace',
                                      background: '#f8fafc',
                                      padding: '8px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {
                                      invoiceDetails.invoiceInfo.invoiceDetails
                                        .phoneDetails.imei2
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Information */}
                    {invoiceDetails.invoiceInfo.invoiceDetails.payment && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: '16px',
                            fontWeight: '500',
                          }}
                        >
                          Payment Details
                        </h4>
                        <div
                          style={{
                            display: 'grid',
                            gap: '4px',
                            paddingLeft: '16px',
                          }}
                        >
                          <div>
                            Payment Type:{' '}
                            {
                              invoiceDetails.invoiceInfo.invoiceDetails.payment
                                .sellingPaymentType
                            }
                          </div>
                          <div>
                            Amount Paid Now: Rs.{' '}
                            {invoiceDetails.invoiceInfo.invoiceDetails.payment.payableAmountNow?.toLocaleString()}
                          </div>
                          <div>
                            Amount Due Later: Rs.{' '}
                            {invoiceDetails.invoiceInfo.invoiceDetails.payment.payableAmountLater?.toLocaleString()}
                          </div>
                          <div>
                            Due Date:{' '}
                            {new Date(
                              invoiceDetails.invoiceInfo.invoiceDetails.payment.payableAmountLaterDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Accessories */}
                    {invoiceDetails.invoiceInfo.invoiceDetails.accessories &&
                      invoiceDetails.invoiceInfo.invoiceDetails.accessories
                        .length > 0 && (
                        <div>
                          <h4
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '16px',
                              fontWeight: '500',
                            }}
                          >
                            Accessories (
                            {
                              invoiceDetails.invoiceInfo.invoiceDetails
                                .accessories.length
                            }
                            )
                          </h4>
                          <div
                            style={{
                              display: 'grid',
                              gap: '8px',
                              paddingLeft: '16px',
                            }}
                          >
                            {invoiceDetails.invoiceInfo.invoiceDetails.accessories.map(
                              (accessory, index) => (
                                <div
                                  key={index}
                                  style={{
                                    padding: '8px',
                                    border: '1px solid #f3f4f6',
                                    borderRadius: '4px',
                                    backgroundColor: '#f9fafb',
                                  }}
                                >
                                  <div>Name: {accessory.name}</div>
                                  <div>Quantity: {accessory.quantity}</div>
                                  <div>
                                    Price: Rs.{' '}
                                    {accessory.price?.toLocaleString()}
                                  </div>
                                  <div>
                                    Total: Rs.{' '}
                                    {accessory.totalPrice?.toLocaleString()}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Transaction Description */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow:
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f1f5f9',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    gridColumn: '1 / -1', // Span full width
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background:
                          'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <FaComment style={{ fontSize: '16px' }} />
                    </div>
                    <h3
                      style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1e293b',
                      }}
                    >
                      Transaction Description
                    </h3>
                  </div>
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        lineHeight: '1.6',
                        color: '#374151',
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      {invoiceDetails.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No invoice details available.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '32px',
              padding: '24px 32px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              borderRadius: '0 0 16px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFileInvoice style={{ color: '#667eea', fontSize: '16px' }} />
              <span
                style={{
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Invoice Details - {invoiceDetails?.invoiceInfo?.invoiceNumber}
              </span>
            </div>
            <button
              onClick={() => setShowInvoiceModal(false)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 12px -2px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px -1px rgba(102, 126, 234, 0.3)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PayablesAndReceivablesRecords;
