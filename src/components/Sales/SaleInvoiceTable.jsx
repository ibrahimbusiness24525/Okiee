import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api/api';
import { toast } from 'react-toastify';
import { dateFormatter } from 'utils/dateFormatter';

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
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv._id} onClick={() => handleRowClick(inv)}>
                    <td style={styles.td}>{inv.invoiceNumber || '—'}</td>
                    <td style={styles.td}>{renderSaleType(inv.saleType)}</td>
                    <td style={styles.td}>
                      {inv.saleDate ? dateFormatter(inv.saleDate) : '—'}
                    </td>
                    <td style={styles.td}>{inv.customerName || '—'}</td>
                    <td style={styles.td}>{inv.customerNumber || '—'}</td>
                    <td style={styles.td}>
                      {inv.pricing?.totalInvoice != null
                        ? Number(inv.pricing.totalInvoice).toLocaleString()
                        : inv.pricing?.finalPrice != null
                          ? Number(inv.pricing.finalPrice).toLocaleString()
                          : '—'}
                    </td>
                    <td style={styles.td}>{renderPaymentType(inv.payment)}</td>
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
    </div>
  );
};

export default SaleInvoiceTable;
