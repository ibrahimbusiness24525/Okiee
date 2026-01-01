import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api/api';
import { toast } from 'react-toastify';
import { dateFormatter } from 'utils/dateFormatter';
import Modal from 'components/Modal/Modal';

// Reusable table component for /api/sale-invoice
// mode: 'today' | 'all'
const SaleInvoiceTable = ({ mode = 'all' }) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
  });

  const [filters, setFilters] = useState({
    saleType: '',
    startDate: '',
    endDate: '',
    customerNumber: '',
  });

  const [searchInvoice, setSearchInvoice] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedInvoiceForReturn, setSelectedInvoiceForReturn] =
    useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);

  const fetchInvoices = async (page = 1, overrideFilters) => {
    setLoading(true);
    try {
      const mergedFilters = overrideFilters || filters;
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      });

      // If mode is today, constrain dates to today unless user explicitly set them
      if (
        mode === 'today' &&
        !mergedFilters.startDate &&
        !mergedFilters.endDate
      ) {
        const today = new Date().toISOString().split('T')[0];
        params.append('startDate', today);
        params.append('endDate', today);
      } else {
        if (mergedFilters.startDate)
          params.append('startDate', mergedFilters.startDate);
        if (mergedFilters.endDate)
          params.append('endDate', mergedFilters.endDate);
      }

      if (mergedFilters.saleType)
        params.append('saleType', mergedFilters.saleType);
      if (mergedFilters.customerNumber)
        params.append('customerNumber', mergedFilters.customerNumber);

      const res = await api.get(`/api/sale-invoice/?${params.toString()}`);
      if (res?.data?.success) {
        setInvoices(res.data.data?.invoices || []);
        setPagination(res.data.data?.pagination || pagination);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching sale invoices:', error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch sale invoices'
      );
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleFilterChange = (field, value) => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    fetchInvoices(1, next);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    fetchInvoices(nextPage);
    setPagination((prev) => ({ ...prev, currentPage: nextPage }));
  };

  const handleRowClick = (invoice) => {
    if (!invoice?._id) {
      toast.error('Invoice ID not found');
      return;
    }
    navigate(`/invoice/sale-invoice/${invoice._id}`);
  };

  const handleReturnClick = (invoice) => {
    if (!invoice?._id) {
      toast.error('Invoice ID not found');
      return;
    }

    // Check if invoice is already returned
    if (invoice?.isReturned) {
      toast.warning('This invoice has already been returned');
      return;
    }

    // Set selected invoice and open return modal
    setSelectedInvoiceForReturn(invoice);
    setReturnReason('');
    setShowReturnModal(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedInvoiceForReturn?._id) {
      toast.error('Invoice ID not found');
      return;
    }

    setReturnLoading(true);
    try {
      const payload = {};
      if (returnReason.trim()) {
        payload.returnReason = returnReason.trim();
      }

      const response = await api.post(
        `/api/sale-invoice/${selectedInvoiceForReturn._id}/return`,
        payload
      );

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || 'Invoice returned successfully'
        );

        // Close modal and reset state
        setShowReturnModal(false);
        setSelectedInvoiceForReturn(null);
        setReturnReason('');

        // Refresh invoice list
        await fetchInvoices(pagination.currentPage);
      } else {
        toast.error(response?.data?.message || 'Failed to return invoice');
      }
    } catch (error) {
      console.error('Error returning invoice:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to return invoice';

      // Handle specific error cases
      if (error?.response?.status === 404) {
        toast.error('Invoice not found');
      } else if (error?.response?.status === 400) {
        toast.warning(errorMessage || 'Invoice has already been returned');
        // Refresh invoice list to get updated status
        await fetchInvoices(pagination.currentPage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setReturnLoading(false);
    }
  };

  const handleCancelReturn = () => {
    setShowReturnModal(false);
    setSelectedInvoiceForReturn(null);
    setReturnReason('');
  };

  const handleAddSaleClick = (invoice) => {
    // Navigate to sales page with customer info pre-filled
    const customerInfo = {
      customerName: invoice?.customerName || '',
      customerNumber: invoice?.customerNumber || '',
      entityData: invoice?.entityData || null,
    };
    // Navigate to today sales page
    navigate('/sales/todaySales', {
      state: { prefillCustomer: customerInfo },
    });
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchInvoice.trim()) return true;
    const query = searchInvoice.toLowerCase().trim();
    return String(inv.invoiceNumber || '')
      .toLowerCase()
      .includes(query);
  });

  const renderSaleType = (saleType) => {
    if (!saleType) return '—';
    const labelMap = {
      single: 'Single',
      bulk: 'Bulk',
      generic: 'Generic',
    };
    return labelMap[saleType] || saleType;
  };

  const renderPaymentType = (payment) => {
    const type = payment?.sellingPaymentType || 'Cash';
    return type;
  };

  const styles = {
    container: {
      marginTop: '1.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 16,
      background: '#ffffff',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
      flexWrap: 'wrap',
    },
    filterRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13,
    },
    th: {
      borderBottom: '1px solid #e5e7eb',
      padding: '8px 10px',
      textAlign: 'left',
      background: '#f9fafb',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    },
    td: {
      borderBottom: '1px solid #f3f4f6',
      padding: '8px 10px',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    },
    paginationRow: {
      marginTop: 10,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 12,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h4 style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>
          Sale Invoices (New API)
        </h4>
        <input
          type="text"
          placeholder="Search by Invoice #"
          value={searchInvoice}
          onChange={(e) => setSearchInvoice(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            minWidth: 180,
          }}
        />
      </div>

      <div style={styles.filterRow}>
        <select
          value={filters.saleType}
          onChange={(e) => handleFilterChange('saleType', e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            fontSize: 13,
            minWidth: 120,
          }}
        >
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="bulk">Bulk</option>
          <option value="generic">Generic</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            fontSize: 13,
          }}
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            fontSize: 13,
          }}
        />

        <input
          type="text"
          placeholder="Customer number"
          value={filters.customerNumber}
          onChange={(e) => handleFilterChange('customerNumber', e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            fontSize: 13,
            minWidth: 180,
          }}
        />
      </div>

      {loading ? (
        <div style={{ padding: 16, textAlign: 'center', fontSize: 13 }}>
          Loading sale invoices...
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div style={{ padding: 16, textAlign: 'center', fontSize: 13 }}>
          No invoices found
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Invoice #</th>
                  <th style={styles.th}>Sale Type</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Number</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv._id}
                    style={{
                      opacity: inv?.isReturned ? 0.7 : 1,
                      backgroundColor: inv?.isReturned
                        ? '#fef2f2'
                        : 'transparent',
                    }}
                  >
                    <td style={styles.td} onClick={() => handleRowClick(inv)}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {inv.invoiceNumber || '—'}
                        {inv?.isReturned && (
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: '#dc2626',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                            }}
                          >
                            Returned
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={styles.td} onClick={() => handleRowClick(inv)}>
                      {renderSaleType(inv.saleType)}
                    </td>
                    <td style={styles.td} onClick={() => handleRowClick(inv)}>
                      {inv.saleDate ? dateFormatter(inv.saleDate) : '—'}
                    </td>
                    <td style={styles.td} onClick={() => handleRowClick(inv)}>
                      {inv.customerName || '—'}
                    </td>
                    <td style={styles.td} onClick={() => handleRowClick(inv)}>
                      {inv.customerNumber || '—'}
                    </td>
                    <td style={styles.td} onClick={() => handleRowClick(inv)}>
                      {inv.pricing?.totalInvoice != null
                        ? Number(inv.pricing.totalInvoice).toLocaleString()
                        : inv.pricing?.finalPrice != null
                          ? Number(inv.pricing.finalPrice).toLocaleString()
                          : '—'}
                    </td>
                    <td style={styles.td} onClick={() => handleRowClick(inv)}>
                      {renderPaymentType(inv.payment)}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        cursor: 'default',
                        padding: '8px 10px',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReturnClick(inv);
                          }}
                          disabled={inv?.isReturned || returnLoading}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #dc2626',
                            background: inv?.isReturned ? '#9ca3af' : '#dc2626',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: inv?.isReturned ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                            opacity: inv?.isReturned ? 0.6 : 1,
                          }}
                          title={
                            inv?.isReturned
                              ? 'Invoice already returned'
                              : 'Return invoice'
                          }
                        >
                          {inv?.isReturned ? 'Returned' : 'Return'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSaleClick(inv);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #10b981',
                            background: '#10b981',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Add Sale Another Phone
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.paginationRow}>
            <div>
              Page {pagination.currentPage} of {pagination.totalPages} ·{' '}
              {pagination.totalItems} invoices
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  background:
                    pagination.currentPage <= 1 ? '#f3f4f6' : '#ffffff',
                  cursor:
                    pagination.currentPage <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  background:
                    pagination.currentPage >= pagination.totalPages
                      ? '#f3f4f6'
                      : '#ffffff',
                  cursor:
                    pagination.currentPage >= pagination.totalPages
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Return Invoice Confirmation Modal */}
      <Modal show={showReturnModal} toggleModal={handleCancelReturn} size="md">
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#dc2626',
              }}
            >
              Return Invoice
            </h3>
            <button
              type="button"
              onClick={handleCancelReturn}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: 0,
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {selectedInvoiceForReturn && (
            <>
              <div
                style={{
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <strong>Invoice #:</strong>{' '}
                  {selectedInvoiceForReturn.invoiceNumber || '—'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Customer:</strong>{' '}
                  {selectedInvoiceForReturn.customerName || '—'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Total Amount:</strong>{' '}
                  {selectedInvoiceForReturn.pricing?.totalInvoice != null
                    ? Number(
                        selectedInvoiceForReturn.pricing.totalInvoice
                      ).toLocaleString()
                    : selectedInvoiceForReturn.pricing?.finalPrice != null
                      ? Number(
                          selectedInvoiceForReturn.pricing.finalPrice
                        ).toLocaleString()
                      : '—'}
                </div>
                <div>
                  <strong>Payment Type:</strong>{' '}
                  {renderPaymentType(selectedInvoiceForReturn.payment)}
                </div>
              </div>

              <div
                style={{
                  padding: '12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#991b1b',
                }}
              >
                <strong>⚠️ Warning:</strong> This action is irreversible. The
                following will happen:
                <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                  <li>Stock will be automatically restored</li>
                  <li>Payments will be refunded</li>
                  <li>Credit transactions will be adjusted</li>
                  <li>Invoice will be marked as returned permanently</li>
                </ul>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Return Reason (Optional)
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Enter reason for return (e.g., Customer requested return, Defective item, etc.)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={handleCancelReturn}
                  disabled={returnLoading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: '#ffffff',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: returnLoading ? 'not-allowed' : 'pointer',
                    opacity: returnLoading ? 0.6 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReturn}
                  disabled={returnLoading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: returnLoading ? '#9ca3af' : '#dc2626',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: returnLoading ? 'not-allowed' : 'pointer',
                    opacity: returnLoading ? 0.6 : 1,
                  }}
                >
                  {returnLoading ? 'Returning...' : 'Confirm Return'}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SaleInvoiceTable;
