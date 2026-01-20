import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, returnSaleInvoice } from '../../../api/api';
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
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [selectedImeis, setSelectedImeis] = useState([]);
  const [returnAmount, setReturnAmount] = useState('');
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [returnStatus, setReturnStatus] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  const [calculatedRefund, setCalculatedRefund] = useState(0);
  const [availableImeis, setAvailableImeis] = useState([]);
  const [availableImeisFromOtherInvoices, setAvailableImeisFromOtherInvoices] =
    useState([]);
  const [availableAccessories, setAvailableAccessories] = useState([]);
  const [loadingRelatedImeis, setLoadingRelatedImeis] = useState(false);
  const [currentInvoiceImeiSearch, setCurrentInvoiceImeiSearch] = useState('');
  const [relatedImeiSearch, setRelatedImeiSearch] = useState('');
  const [showCurrentInvoiceDropdown, setShowCurrentInvoiceDropdown] =
    useState(false);
  const [showRelatedDropdown, setShowRelatedDropdown] = useState(false);

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

  const handleReturnClick = async (invoice) => {
    if (!invoice?._id) {
      toast.error('Invoice ID not found');
      return;
    }

    // Check if invoice is already fully returned
    if (invoice?.returnStatus === 'full-return') {
      toast.warning('This invoice has already been fully returned');
      return;
    }

    // Fetch full invoice details to get return status and available items
    try {
      const response = await api.get(`/api/sale-invoice/${invoice._id}`);
      if (response.data.success) {
        const invoiceData = response.data.data;
        setInvoiceDetails(invoiceData);

        // If it's a bulk sale, fetch IMEIs from related records (same bulk purchase)
        if (
          invoiceData.saleType === 'bulk' &&
          invoiceData.bulkPhonePurchaseId
        ) {
          await fetchRelatedImeis(invoiceData);
        }
      } else {
        // Use the invoice from table if fetch fails
        setInvoiceDetails(invoice);
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      // Use the invoice from table if fetch fails
      setInvoiceDetails(invoice);
    }

    // Set selected invoice and open return modal
    setSelectedInvoiceForReturn(invoice);
    setReturnReason('');
    setSelectedImeis([]);
    setReturnAmount('');
    setSelectedAccessories([]);
    setReturnStatus('');
    setCalculatedRefund(0);
    setAvailableImeisFromOtherInvoices([]);
    setShowReturnModal(true);
  };

  // Fetch IMEIs from related records (same bulk purchase)
  const fetchRelatedImeis = async (invoiceData) => {
    if (!invoiceData.bulkPhonePurchaseId) return;

    setLoadingRelatedImeis(true);
    try {
      // Fetch all sales from the same bulk purchase
      const bulkPurchaseId =
        invoiceData.bulkPhonePurchaseId?._id || invoiceData.bulkPhonePurchaseId;

      // Try to get related IMEIs - we'll need to search for other invoices with same bulkPurchaseId
      // For now, we'll extract what we can from the current invoice structure
      // The backend should handle validation, so we'll let users input IMEIs and the API will validate

      // Alternative: If there's an endpoint to get all IMEIs from a bulk purchase, use it
      // For now, we'll show current invoice IMEIs and allow manual IMEI input or let API handle it

      setLoadingRelatedImeis(false);
    } catch (error) {
      console.error('Error fetching related IMEIs:', error);
      setLoadingRelatedImeis(false);
    }
  };

  // Extract available IMEIs and accessories from invoice details
  useEffect(() => {
    if (!invoiceDetails && !selectedInvoiceForReturn) return;
    const data = invoiceDetails || selectedInvoiceForReturn;

    // Extract IMEIs from current invoice
    const imeis = [];
    const saleType = data?.saleType || 'single';

    if (saleType === 'bulk') {
      // Try multiple possible structures for bulk phones

      // Check if imei1 is directly an array on the invoice (common for bulk sales)
      if (Array.isArray(data.imei1) && data.imei1.length > 0) {
        data.imei1.forEach((imei) => {
          if (imei && typeof imei === 'string') {
            imeis.push({
              imei: imei.trim(),
              imei2: null,
              phoneInfo: {},
            });
          }
        });
      }

      // Check phoneDetails array structure
      if (Array.isArray(data.phoneDetails) && data.phoneDetails.length > 0) {
        data.phoneDetails.forEach((phoneDetail) => {
          const phoneInfo = phoneDetail?.phoneInfo || phoneDetail;

          // Check imeiDetails array
          if (phoneInfo?.imeiDetails && Array.isArray(phoneInfo.imeiDetails)) {
            phoneInfo.imeiDetails.forEach((imeiObj) => {
              const imei1 = imeiObj?.imei1 || imeiObj?.imei;
              const imei2 = imeiObj?.imei2;
              if (imei1 && typeof imei1 === 'string') {
                imeis.push({
                  imei: imei1.trim(),
                  imei2:
                    imei2 && typeof imei2 === 'string' ? imei2.trim() : null,
                  phoneInfo: phoneInfo,
                });
              }
            });
          }
          // Check if imei1 is array in phoneInfo
          else if (Array.isArray(phoneInfo?.imei1)) {
            phoneInfo.imei1.forEach((imei) => {
              if (imei && typeof imei === 'string') {
                imeis.push({
                  imei: imei.trim(),
                  imei2: null,
                  phoneInfo: phoneInfo,
                });
              }
            });
          }
          // Check single imei1
          else if (phoneInfo?.imei1 && typeof phoneInfo.imei1 === 'string') {
            imeis.push({
              imei: phoneInfo.imei1.trim(),
              imei2:
                phoneInfo.imei2 && typeof phoneInfo.imei2 === 'string'
                  ? phoneInfo.imei2.trim()
                  : null,
              phoneInfo: phoneInfo,
            });
          }
        });
      }
      // Check single phoneDetails object with phoneInfo
      else if (data.phoneDetails?.phoneInfo) {
        const phoneInfo = data.phoneDetails.phoneInfo;

        if (phoneInfo.imeiDetails && Array.isArray(phoneInfo.imeiDetails)) {
          phoneInfo.imeiDetails.forEach((imeiObj) => {
            const imei1 = imeiObj?.imei1 || imeiObj?.imei;
            const imei2 = imeiObj?.imei2;
            if (imei1 && typeof imei1 === 'string') {
              imeis.push({
                imei: imei1.trim(),
                imei2: imei2 && typeof imei2 === 'string' ? imei2.trim() : null,
                phoneInfo: phoneInfo,
              });
            }
          });
        } else if (Array.isArray(phoneInfo.imei1)) {
          phoneInfo.imei1.forEach((imei) => {
            if (imei && typeof imei === 'string') {
              imeis.push({
                imei: imei.trim(),
                imei2: null,
                phoneInfo: phoneInfo,
              });
            }
          });
        } else if (phoneInfo.imei1 && typeof phoneInfo.imei1 === 'string') {
          imeis.push({
            imei: phoneInfo.imei1.trim(),
            imei2:
              phoneInfo.imei2 && typeof phoneInfo.imei2 === 'string'
                ? phoneInfo.imei2.trim()
                : null,
            phoneInfo: phoneInfo,
          });
        }
      }
    } else {
      // Single phone sale
      const phoneInfo = data.phoneDetails?.phoneInfo || data.phoneInfo;
      if (phoneInfo?.imei1 && typeof phoneInfo.imei1 === 'string') {
        imeis.push({
          imei: phoneInfo.imei1.trim(),
          imei2:
            phoneInfo.imei2 && typeof phoneInfo.imei2 === 'string'
              ? phoneInfo.imei2.trim()
              : null,
          phoneInfo: phoneInfo,
        });
      } else if (data.imei1 && typeof data.imei1 === 'string') {
        imeis.push({
          imei: data.imei1.trim(),
          imei2:
            data.imei2 && typeof data.imei2 === 'string'
              ? data.imei2.trim()
              : null,
          phoneInfo: {},
        });
      }
    }

    // Filter out already returned IMEIs and separate by source
    const returnedImeis = data.returnedImeis || [];
    const available = imeis
      .filter((item) => !returnedImeis.includes(item.imei))
      .map((item) => ({
        ...item,
        source: 'current', // Mark as from current invoice
      }));
    setAvailableImeis(available);

    // Extract accessories
    const accessories = data.accessories || [];
    const returnedAccessories = data.returnedAccessories || [];

    // Create a map of returned accessories
    const returnedMap = {};
    returnedAccessories.forEach((ret) => {
      const key = ret.name || ret._id || ret.id;
      returnedMap[key] = (returnedMap[key] || 0) + (ret.quantity || 0);
    });

    // Calculate available accessories
    const availableAcc = accessories
      .map((acc) => {
        const accId =
          acc.name?._id || acc.name?.id || acc.name || acc._id || acc.id;
        const totalQty = acc.quantity || 1;
        const returnedQty = returnedMap[accId] || 0;
        const availableQty = totalQty - returnedQty;

        return {
          ...acc,
          accId,
          totalQty,
          returnedQty,
          availableQty,
          price: acc.price || acc.perPiecePrice || 0,
        };
      })
      .filter((acc) => acc.availableQty > 0);

    setAvailableAccessories(availableAcc);
  }, [invoiceDetails, selectedInvoiceForReturn]);

  // Calculate refund amount (only based on IMEIs from current invoice)
  useEffect(() => {
    if (!invoiceDetails && !selectedInvoiceForReturn) return;
    const data = invoiceDetails || selectedInvoiceForReturn;

    const totalInvoice = data.totalInvoice || data.pricing?.totalInvoice || 0;

    if (returnAmount) {
      // Use specified return amount (capped at total invoice)
      setCalculatedRefund(Math.min(Number(returnAmount), totalInvoice));
    } else {
      // Separate IMEIs: only count IMEIs from current invoice for refund
      // IMEIs from other invoices don't affect refund calculation
      const currentInvoiceImeis = selectedImeis.filter((imei) => {
        return availableImeis.some(
          (avail) => avail.imei === imei && avail.source === 'current'
        );
      });

      if (currentInvoiceImeis.length > 0 && availableImeis.length > 0) {
        // Calculate proportional refund based only on IMEIs from current invoice
        const totalCurrentImeis = availableImeis.filter(
          (avail) => avail.source === 'current'
        ).length;
        const returnedCurrentImeis = currentInvoiceImeis.length;
        const proportionalAmount =
          totalCurrentImeis > 0
            ? (totalInvoice / totalCurrentImeis) * returnedCurrentImeis
            : 0;
        setCalculatedRefund(proportionalAmount);
      } else if (selectedAccessories.length > 0) {
        // Calculate refund from accessories
        const accessoryTotal = selectedAccessories.reduce((sum, acc) => {
          const price = acc.price || 0;
          const qty = acc.quantity || 1;
          return sum + price * qty;
        }, 0);
        setCalculatedRefund(accessoryTotal);
      } else if (
        selectedImeis.length === 0 &&
        selectedAccessories.length === 0
      ) {
        // Full return (only if no selections made)
        setCalculatedRefund(totalInvoice);
      } else {
        // Only IMEIs from other invoices selected - no refund from current invoice
        setCalculatedRefund(0);
      }
    }
  }, [
    selectedImeis,
    selectedAccessories,
    returnAmount,
    invoiceDetails,
    selectedInvoiceForReturn,
    availableImeis,
  ]);

  const handleImeiToggle = (imei) => {
    setSelectedImeis((prev) =>
      prev.includes(imei) ? prev.filter((i) => i !== imei) : [...prev, imei]
    );
  };

  // Handle manual IMEI input for related records (IMEIs from other invoices)
  const handleManualImeiAdd = (imei) => {
    if (imei && !selectedImeis.includes(imei)) {
      setSelectedImeis((prev) => [...prev, imei]);
    }
  };

  const handleAccessoryChange = (accId, quantity) => {
    setSelectedAccessories((prev) => {
      const existing = prev.findIndex((a) => a.name === accId);
      if (existing >= 0) {
        if (quantity <= 0) {
          return prev.filter((a) => a.name !== accId);
        }
        const updated = [...prev];
        updated[existing] = {
          ...updated[existing],
          quantity: Number(quantity),
        };
        return updated;
      } else {
        const accessory = availableAccessories.find((a) => a.accId === accId);
        if (!accessory) return prev;
        return [
          ...prev,
          {
            name: accId,
            quantity: Number(quantity),
            price: accessory.price || 0,
          },
        ];
      }
    });
  };

  const handleConfirmReturn = async () => {
    if (!selectedInvoiceForReturn?._id) {
      toast.error('Invoice ID not found');
      return;
    }

    const data = invoiceDetails || selectedInvoiceForReturn;
    const saleType = data?.saleType || 'single';

    setReturnLoading(true);
    try {
      const payload = {};

      // Add return reason (optional)
      if (returnReason.trim()) {
        payload.returnReason = returnReason.trim();
      }

      // Add IMEIs for bulk sales (optional)
      if (saleType === 'bulk' && selectedImeis.length > 0) {
        payload.returnImeis = selectedImeis;
      }

      // Add return amount (optional)
      if (returnAmount) {
        payload.returnAmount = Number(returnAmount);
      }

      // Add accessories (optional)
      if (selectedAccessories.length > 0) {
        payload.returnAccessories = selectedAccessories;
      }

      // Add return status (optional, auto-determined if not provided)
      if (returnStatus) {
        payload.returnStatus = returnStatus;
      }

      const response = await returnSaleInvoice(
        selectedInvoiceForReturn._id,
        payload
      );

      if (response?.data?.success) {
        const responseData = response.data.data;

        // Show success message with note if provided
        let successMessage =
          response?.data?.message || 'Invoice returned successfully';
        if (responseData?.note) {
          successMessage += ` - ${responseData.note}`;
        }
        toast.success(successMessage);

        // Show info about IMEIs from other invoices if any
        if (
          responseData?.returnedImeisFromOtherInvoices &&
          responseData.returnedImeisFromOtherInvoices.length > 0
        ) {
          toast.info(
            `${responseData.returnedImeisFromOtherInvoices.length} IMEI(s) from related records were also processed`
          );
        }

        // Close modal and reset state
        setShowReturnModal(false);
        setSelectedInvoiceForReturn(null);
        setInvoiceDetails(null);
        setReturnReason('');
        setSelectedImeis([]);
        setReturnAmount('');
        setSelectedAccessories([]);
        setReturnStatus('');
        setCalculatedRefund(0);
        setAvailableImeisFromOtherInvoices([]);

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
        toast.warning(
          errorMessage || 'Invoice has already been fully returned'
        );
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
    setInvoiceDetails(null);
    setReturnReason('');
    setSelectedImeis([]);
    setReturnAmount('');
    setSelectedAccessories([]);
    setReturnStatus('');
    setCalculatedRefund(0);
    setAvailableImeisFromOtherInvoices([]);
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
                      opacity: inv?.returnStatus === 'full-return' ? 0.7 : 1,
                      backgroundColor:
                        inv?.returnStatus === 'full-return'
                          ? '#fef2f2'
                          : inv?.returnStatus === 'semi-return'
                            ? '#fffbeb'
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
                        {inv?.returnStatus === 'full-return' && (
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
                            Fully Returned
                          </span>
                        )}
                        {inv?.returnStatus === 'semi-return' && (
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: '#f59e0b',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                            }}
                          >
                            Partially Returned
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
                          disabled={
                            inv?.returnStatus === 'full-return' || returnLoading
                          }
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #dc2626',
                            background:
                              inv?.returnStatus === 'full-return'
                                ? '#9ca3af'
                                : '#dc2626',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor:
                              inv?.returnStatus === 'full-return'
                                ? 'not-allowed'
                                : 'pointer',
                            whiteSpace: 'nowrap',
                            opacity:
                              inv?.returnStatus === 'full-return' ? 0.6 : 1,
                          }}
                          title={
                            inv?.returnStatus === 'full-return'
                              ? 'Invoice already fully returned'
                              : inv?.returnStatus === 'semi-return'
                                ? 'Invoice partially returned - can return remaining items'
                                : 'Return invoice'
                          }
                        >
                          {inv?.returnStatus === 'full-return'
                            ? 'Fully Returned'
                            : inv?.returnStatus === 'semi-return'
                              ? 'Continue Return'
                              : 'Return'}
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

      {/* Return Invoice Modal */}
      <Modal show={showReturnModal} toggleModal={handleCancelReturn} size="lg">
        {selectedInvoiceForReturn &&
          (() => {
            const data = invoiceDetails || selectedInvoiceForReturn;
            const currentReturnStatus = data?.returnStatus;
            const isFullyReturned = currentReturnStatus === 'full-return';
            const isPartiallyReturned = currentReturnStatus === 'semi-return';
            const canReturn = !isFullyReturned;
            const saleType = data?.saleType || 'single';
            const isBulkSale = saleType === 'bulk';
            const totalInvoice =
              data.totalInvoice || data.pricing?.totalInvoice || 0;

            return (
              <div
                style={{
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '0',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '24px 30px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <i
                        className="fa fa-undo"
                        style={{ fontSize: '20px' }}
                      ></i>
                      Return Invoice
                    </h3>
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        opacity: 0.9,
                        fontSize: '14px',
                      }}
                    >
                      {data?.invoiceNumber || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={handleCancelReturn}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.3)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.2)')
                    }
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px 30px' }}>
                  {/* Invoice Info Card */}
                  <div
                    style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '24px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6c757d',
                            marginBottom: '4px',
                          }}
                        >
                          Total Invoice
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#2d3748',
                          }}
                        >
                          Rs. {totalInvoice.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6c757d',
                            marginBottom: '4px',
                          }}
                        >
                          Sale Type
                        </div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#2d3748',
                          }}
                        >
                          {isBulkSale ? 'Bulk Sale' : 'Single Sale'}
                        </div>
                      </div>
                      {currentReturnStatus && (
                        <div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6c757d',
                              marginBottom: '4px',
                            }}
                          >
                            Current Status
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              display: 'inline-block',
                              backgroundColor:
                                currentReturnStatus === 'full-return'
                                  ? '#dc3545'
                                  : '#ffc107',
                            }}
                          >
                            {currentReturnStatus === 'full-return'
                              ? 'Fully Returned'
                              : 'Partially Returned'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!canReturn && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '10px',
                        marginBottom: '24px',
                        border: '1px solid #f5c6cb',
                      }}
                    >
                      <i
                        className="fa fa-exclamation-circle"
                        style={{ marginRight: '8px' }}
                      ></i>
                      This invoice has already been fully returned and cannot be
                      returned again.
                    </div>
                  )}

                  {canReturn && (
                    <>
                      {/* Return Reason */}
                      <div style={{ marginBottom: '24px' }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '10px',
                          }}
                        >
                          Return Reason{' '}
                          <span style={{ color: '#6c757d', fontWeight: '400' }}>
                            (Optional)
                          </span>
                        </label>
                        <textarea
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          placeholder="Enter reason for return (defaults to 'Customer return' if not provided)..."
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px',
                            fontSize: '14px',
                            minHeight: '90px',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                          }}
                        />
                      </div>

                      {/* IMEI Selection for Bulk Phones */}
                      {isBulkSale && (
                        <div style={{ marginBottom: '24px' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '12px',
                            }}
                          >
                            Select IMEIs to Return{' '}
                            <span
                              style={{ color: '#6c757d', fontWeight: '400' }}
                            >
                              (Optional - Leave empty for full return)
                            </span>
                          </label>

                          {/* IMEIs from Current Invoice - Dropdown */}
                          {availableImeis.filter(
                            (item) => item.source === 'current'
                          ).length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#667eea',
                                  marginBottom: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <i
                                  className="fa fa-file-invoice"
                                  style={{ fontSize: '12px' }}
                                ></i>
                                IMEIs from Current Invoice (affects refund)
                              </div>
                              <div style={{ position: 'relative' }}>
                                <select
                                  multiple
                                  value={selectedImeis.filter((imei) =>
                                    availableImeis.some(
                                      (avail) =>
                                        avail.imei === imei &&
                                        avail.source === 'current'
                                    )
                                  )}
                                  onChange={(e) => {
                                    const selectedOptions = Array.from(
                                      e.target.selectedOptions,
                                      (option) => option.value
                                    );
                                    // Remove current invoice IMEIs from selectedImeis
                                    const otherImeis = selectedImeis.filter(
                                      (imei) =>
                                        !availableImeis.some(
                                          (avail) =>
                                            avail.imei === imei &&
                                            avail.source === 'current'
                                        )
                                    );
                                    // Add newly selected current invoice IMEIs
                                    setSelectedImeis([
                                      ...otherImeis,
                                      ...selectedOptions,
                                    ]);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #667eea',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    backgroundColor: '#f0f4ff',
                                    minHeight: '120px',
                                    fontFamily: 'inherit',
                                  }}
                                >
                                  {availableImeis
                                    .filter((item) => item.source === 'current')
                                    .map((item, idx) => (
                                      <option
                                        key={idx}
                                        value={item.imei}
                                        style={{
                                          padding: '8px',
                                          fontFamily: 'monospace',
                                        }}
                                      >
                                        {item.imei}
                                        {item.imei2
                                          ? ` (IMEI2: ${item.imei2})`
                                          : ''}
                                      </option>
                                    ))}
                                </select>
                                <div
                                  style={{
                                    marginTop: '6px',
                                    fontSize: '12px',
                                    color: '#667eea',
                                    fontStyle: 'italic',
                                  }}
                                >
                                  💡 Hold Ctrl (Windows) or Cmd (Mac) to select
                                  multiple IMEIs
                                </div>
                              </div>
                            </div>
                          )}

                          {/* IMEIs from Related Records - Dropdown with Manual Entry */}
                          {isBulkSale && (
                            <div style={{ marginBottom: '16px' }}>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#f59e0b',
                                  marginBottom: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <i
                                  className="fa fa-link"
                                  style={{ fontSize: '12px' }}
                                ></i>
                                IMEIs from Related Records (same bulk purchase -
                                updates those records, no refund)
                              </div>
                              <div
                                style={{
                                  border: '2px solid #fbbf24',
                                  borderRadius: '10px',
                                  padding: '12px',
                                  backgroundColor: '#fffbeb',
                                }}
                              >
                                {/* Manual Entry Input */}
                                <div style={{ marginBottom: '12px' }}>
                                  <input
                                    type="text"
                                    value={relatedImeiSearch}
                                    onChange={(e) =>
                                      setRelatedImeiSearch(e.target.value)
                                    }
                                    placeholder="Enter IMEI and press Enter to add..."
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const imei = relatedImeiSearch.trim();
                                        if (
                                          imei &&
                                          !selectedImeis.includes(imei)
                                        ) {
                                          handleManualImeiAdd(imei);
                                          setRelatedImeiSearch('');
                                        }
                                      }
                                    }}
                                    style={{
                                      width: '100%',
                                      padding: '10px',
                                      border: '2px solid #fbbf24',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                      fontFamily: 'monospace',
                                    }}
                                  />
                                </div>

                                {/* Selected IMEIs Display */}
                                {selectedImeis.filter((imei) => {
                                  return !availableImeis.some(
                                    (avail) =>
                                      avail.imei === imei &&
                                      avail.source === 'current'
                                  );
                                }).length > 0 && (
                                  <div>
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#92400e',
                                        marginBottom: '8px',
                                      }}
                                    >
                                      Selected IMEIs from Related Records:
                                    </div>
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        padding: '8px',
                                        backgroundColor: 'white',
                                        borderRadius: '6px',
                                        border: '1px solid #fde68a',
                                      }}
                                    >
                                      {selectedImeis
                                        .filter((imei) => {
                                          return !availableImeis.some(
                                            (avail) =>
                                              avail.imei === imei &&
                                              avail.source === 'current'
                                          );
                                        })
                                        .map((imei, idx) => (
                                          <div
                                            key={idx}
                                            style={{
                                              padding: '6px 12px',
                                              backgroundColor: '#fef3c7',
                                              border: '1px solid #fbbf24',
                                              borderRadius: '6px',
                                              fontSize: '12px',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '8px',
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontFamily: 'monospace',
                                              }}
                                            >
                                              {imei}
                                            </span>
                                            <button
                                              onClick={() => {
                                                handleImeiToggle(imei);
                                              }}
                                              style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#92400e',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                padding: '0 4px',
                                              }}
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div
                                style={{
                                  marginTop: '8px',
                                  fontSize: '11px',
                                  color: '#92400e',
                                  fontStyle: 'italic',
                                }}
                              >
                                💡 Tip: IMEIs from related records will update
                                those SoldPhone records but won't affect this
                                invoice's refund amount. Refund is calculated
                                only based on IMEIs from the current invoice.
                              </div>
                            </div>
                          )}

                          {/* Selection Summary - Show for bulk sales */}
                          {isBulkSale && (
                            <div
                              style={{
                                marginTop: '12px',
                                padding: '12px',
                                backgroundColor: '#f0f9ff',
                                borderRadius: '8px',
                                border: '1px solid #bae6fd',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#0369a1',
                                  marginBottom: '6px',
                                }}
                              >
                                Selection Summary:
                              </div>
                              <div
                                style={{ fontSize: '12px', color: '#0c4a6e' }}
                              >
                                {(() => {
                                  const currentInvoiceImeis =
                                    selectedImeis.filter((imei) => {
                                      return availableImeis.some(
                                        (avail) =>
                                          avail.imei === imei &&
                                          avail.source === 'current'
                                      );
                                    });
                                  const otherInvoiceImeis =
                                    selectedImeis.filter((imei) => {
                                      return !availableImeis.some(
                                        (avail) =>
                                          avail.imei === imei &&
                                          avail.source === 'current'
                                      );
                                    });

                                  return (
                                    <>
                                      <div>
                                        <strong>From Current Invoice:</strong>{' '}
                                        {currentInvoiceImeis.length > 0
                                          ? `${currentInvoiceImeis.length} IMEI(s) - Will affect refund`
                                          : 'None selected'}
                                      </div>
                                      {otherInvoiceImeis.length > 0 && (
                                        <div style={{ marginTop: '4px' }}>
                                          <strong>From Related Records:</strong>{' '}
                                          {otherInvoiceImeis.length} IMEI(s) -
                                          Will update those records only (no
                                          refund from current invoice)
                                        </div>
                                      )}
                                      {selectedImeis.length === 0 && (
                                        <div
                                          style={{
                                            color: '#64748b',
                                            fontStyle: 'italic',
                                          }}
                                        >
                                          No IMEIs selected - will perform full
                                          return of current invoice
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Accessories Selection */}
                      {availableAccessories.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '12px',
                            }}
                          >
                            Select Accessories to Return{' '}
                            <span
                              style={{ color: '#6c757d', fontWeight: '400' }}
                            >
                              (Optional)
                            </span>
                          </label>
                          <div
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '10px',
                              padding: '12px',
                              backgroundColor: '#fafafa',
                            }}
                          >
                            {availableAccessories.map((acc, idx) => {
                              const selected = selectedAccessories.find(
                                (a) => a.name === acc.accId
                              );
                              const selectedQty = selected?.quantity || 0;
                              const accName =
                                typeof acc.name === 'string'
                                  ? acc.name
                                  : acc.name?.accessoryName ||
                                    acc.name?.name ||
                                    'Accessory';
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '14px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    marginBottom:
                                      idx < availableAccessories.length - 1
                                        ? '10px'
                                        : '0',
                                    border:
                                      selectedQty > 0
                                        ? '2px solid #667eea'
                                        : '2px solid transparent',
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <div
                                      style={{
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        color: '#2d3748',
                                      }}
                                    >
                                      {accName}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        color: '#6c757d',
                                        marginTop: '4px',
                                      }}
                                    >
                                      Available: {acc.availableQty} | Price: Rs.{' '}
                                      {acc.price.toLocaleString()}
                                    </div>
                                  </div>
                                  <input
                                    type="number"
                                    min="0"
                                    max={acc.availableQty}
                                    value={selectedQty}
                                    onChange={(e) =>
                                      handleAccessoryChange(
                                        acc.accId,
                                        e.target.value
                                      )
                                    }
                                    placeholder="0"
                                    style={{
                                      width: '80px',
                                      padding: '8px',
                                      border: '2px solid #e5e7eb',
                                      borderRadius: '8px',
                                      textAlign: 'center',
                                      fontSize: '14px',
                                      fontWeight: '600',
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Return Amount (Optional) */}
                      <div style={{ marginBottom: '24px' }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '10px',
                          }}
                        >
                          Return Amount{' '}
                          <span style={{ color: '#6c757d', fontWeight: '400' }}>
                            (Optional - Auto-calculated if not provided)
                          </span>
                        </label>
                        <input
                          type="number"
                          value={returnAmount}
                          onChange={(e) => setReturnAmount(e.target.value)}
                          placeholder="Enter specific refund amount..."
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                          }}
                        />
                        <div
                          style={{
                            marginTop: '6px',
                            fontSize: '12px',
                            color: '#6c757d',
                          }}
                        >
                          If not specified, amount will be calculated
                          proportionally based on returned items
                        </div>
                      </div>

                      {/* Calculated Refund */}
                      <div
                        style={{
                          backgroundColor: '#e8f5e9',
                          borderRadius: '12px',
                          padding: '20px',
                          marginBottom: '24px',
                          border: '2px solid #4caf50',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#2e7d32',
                            marginBottom: '6px',
                            fontWeight: '600',
                          }}
                        >
                          ESTIMATED REFUND AMOUNT
                        </div>
                        <div
                          style={{
                            fontSize: '28px',
                            fontWeight: 'bold',
                            color: '#1b5e20',
                          }}
                        >
                          Rs. {calculatedRefund.toLocaleString()}
                        </div>
                        {(() => {
                          const currentInvoiceImeis = selectedImeis.filter(
                            (imei) => {
                              return availableImeis.some(
                                (avail) =>
                                  avail.imei === imei &&
                                  avail.source === 'current'
                              );
                            }
                          );
                          const otherInvoiceImeis = selectedImeis.filter(
                            (imei) => {
                              return !availableImeis.some(
                                (avail) =>
                                  avail.imei === imei &&
                                  avail.source === 'current'
                              );
                            }
                          );
                          if (
                            otherInvoiceImeis.length > 0 &&
                            currentInvoiceImeis.length > 0
                          ) {
                            return (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#166534',
                                  marginTop: '8px',
                                  fontStyle: 'italic',
                                }}
                              >
                                Note: Refund calculated based on{' '}
                                {currentInvoiceImeis.length} IMEI(s) from
                                current invoice only. {otherInvoiceImeis.length}{' '}
                                IMEI(s) from related records will update those
                                records but won't affect this refund.
                              </div>
                            );
                          } else if (
                            otherInvoiceImeis.length > 0 &&
                            currentInvoiceImeis.length === 0
                          ) {
                            return (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#92400e',
                                  marginTop: '8px',
                                  fontStyle: 'italic',
                                }}
                              >
                                Note: Selected IMEIs are from related records
                                only. They will update those records but no
                                refund will be issued for this invoice.
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* Return Status (for completing partial returns) */}
                      {isPartiallyReturned && (
                        <div style={{ marginBottom: '24px' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '10px',
                            }}
                          >
                            Return Type{' '}
                            <span
                              style={{ color: '#6c757d', fontWeight: '400' }}
                            >
                              (Optional - Auto-determined if not provided)
                            </span>
                          </label>
                          <select
                            value={returnStatus}
                            onChange={(e) => setReturnStatus(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontFamily: 'inherit',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="">Auto-detect (default)</option>
                            <option value="semi-return">Partial Return</option>
                            <option value="full-return">Complete Return</option>
                          </select>
                        </div>
                      )}

                      {/* Return History */}
                      {data?.returnHistory && data.returnHistory.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '12px',
                            }}
                          >
                            Return History
                          </label>
                          <div
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '10px',
                              padding: '12px',
                              maxHeight: '200px',
                              overflowY: 'auto',
                              backgroundColor: '#fafafa',
                            }}
                          >
                            {data.returnHistory.map((history, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '12px',
                                  backgroundColor: 'white',
                                  borderRadius: '8px',
                                  marginBottom:
                                    idx < data.returnHistory.length - 1
                                      ? '10px'
                                      : '0',
                                  border: '1px solid #e9ecef',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: '#6c757d',
                                    marginBottom: '6px',
                                  }}
                                >
                                  {new Date(
                                    history.returnedAt || history.timestamp
                                  ).toLocaleString()}
                                </div>
                                <div
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#2d3748',
                                    marginBottom: '4px',
                                  }}
                                >
                                  {history.returnStatus === 'full-return'
                                    ? 'Fully Returned'
                                    : 'Partially Returned'}
                                </div>
                                {history.returnReason && (
                                  <div
                                    style={{
                                      fontSize: '13px',
                                      color: '#6c757d',
                                      marginBottom: '4px',
                                    }}
                                  >
                                    Reason: {history.returnReason}
                                  </div>
                                )}
                                {history.refundAmount && (
                                  <div
                                    style={{
                                      fontSize: '13px',
                                      color: '#28a745',
                                      fontWeight: '600',
                                    }}
                                  >
                                    Refund: Rs.{' '}
                                    {history.refundAmount.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer Buttons */}
                <div
                  style={{
                    padding: '20px 30px',
                    borderTop: '1px solid #e9ecef',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                  }}
                >
                  <button
                    onClick={handleCancelReturn}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Cancel
                  </button>
                  {canReturn && (
                    <button
                      onClick={handleConfirmReturn}
                      disabled={returnLoading}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: returnLoading ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: returnLoading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {returnLoading ? (
                        <>
                          <i className="fa fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-undo"></i>
                          Return Invoice
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
      </Modal>
    </div>
  );
};

export default SaleInvoiceTable;
