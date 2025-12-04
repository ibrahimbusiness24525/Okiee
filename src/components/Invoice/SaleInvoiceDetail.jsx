import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../api/api';
import { toast } from 'react-toastify';
import { dateFormatter } from 'utils/dateFormatter';

const SaleInvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/sale-invoice/${id}`);
        if (res?.data?.success) {
          setInvoice(res.data.data);
        } else {
          toast.error(res?.data?.message || 'Failed to load invoice');
        }
      } catch (error) {
        console.error('Error fetching sale invoice by id:', error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch invoice'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading || !invoice) {
    return (
      <div style={{ padding: 24 }}>
        {loading ? 'Loading invoice...' : 'Invoice not found'}
      </div>
    );
  }

  const phoneDetails = invoice.phoneDetails || {};
  const pricing = invoice.pricing || {};
  const payment = invoice.payment || {};
  const accessories = invoice.accessories || [];
  const metadata = invoice.metadata || {};
  const entityData = invoice.entityData || {};
  const entityCore = entityData._id || {};
  const imeiPrices = metadata.imeiPrices || [];

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '24px auto',
      padding: '24px',
      background: '#f9fafb',
      borderRadius: 12,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      fontFamily: "'Poppins', sans-serif",
      color: '#111827',
    },
    section: {
      background: '#ffffff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 8,
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: 6,
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6,
      fontSize: 13,
    },
    label: {
      fontWeight: 500,
      color: '#6b7280',
    },
    value: {
      fontWeight: 500,
      color: '#111827',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13,
    },
    th: {
      padding: '8px 10px',
      background: '#f3f4f6',
      borderBottom: '1px solid #e5e7eb',
      textAlign: 'left',
    },
    td: {
      padding: '8px 10px',
      borderBottom: '1px solid #f3f4f6',
    },
  };

  // Determine if there is any pricing object to show
  const hasPricing = !!pricing && Object.keys(pricing).length > 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Sale Invoice</h2>
        <div style={{ textAlign: 'right', fontSize: 13 }}>
          <div>
            <strong>Invoice #:</strong> {invoice.invoiceNumber || '—'}
          </div>
          <div>
            <strong>Date:</strong>{' '}
            {invoice.saleDate ? dateFormatter(invoice.saleDate) : '—'}
          </div>
        </div>
      </div>

      {/* Customer & Payment */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Customer & Payment</div>
        <div style={styles.row}>
          <span style={styles.label}>Customer Name</span>
          <span style={styles.value}>{invoice.customerName || '—'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Customer Number</span>
          <span style={styles.value}>{invoice.customerNumber || '—'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Sale Type</span>
          <span style={styles.value}>{invoice.saleType || '—'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Payment Type</span>
          <span style={styles.value}>
            {payment.sellingPaymentType || 'Cash'}
          </span>
        </div>
        {(payment.bankName || payment.bankAccountUsed?.bankName) && (
          <div style={styles.row}>
            <span style={styles.label}>Bank</span>
            <span style={styles.value}>
              {payment.bankName || payment.bankAccountUsed?.bankName}
            </span>
          </div>
        )}
        {(payment.payableAmountNow != null || payment.accountCash != null) && (
          <div style={styles.row}>
            <span style={styles.label}>Paid Now</span>
            <span style={styles.value}>
              {Number(
                payment.payableAmountNow ?? payment.accountCash ?? 0
              ).toLocaleString()}
            </span>
          </div>
        )}
        {(payment.payableAmountLater != null || payment.pocketCash != null) && (
          <div style={styles.row}>
            <span style={styles.label}>Payable Later</span>
            <span style={styles.value}>
              {Number(
                payment.payableAmountLater ?? payment.pocketCash ?? 0
              ).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Phone Details */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Phone Details</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Model</th>
              <th style={styles.th}>IMEI 1</th>
              <th style={styles.th}>IMEI 2</th>
              <th style={styles.th}>RAM</th>
              <th style={styles.th}>Color</th>
              <th style={styles.th}>Condition</th>
              <th style={styles.th}>Warranty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>{phoneDetails.companyName || '—'}</td>
              <td style={styles.td}>{phoneDetails.modelName || '—'}</td>
              <td style={styles.td}>
                {(() => {
                  const raw =
                    phoneDetails.imei1 ??
                    phoneDetails.imei ??
                    phoneDetails.imeis;
                  if (Array.isArray(raw)) {
                    return raw.join(', ');
                  }
                  return raw || '—';
                })()}
              </td>
              <td style={styles.td}>
                {(() => {
                  const raw = phoneDetails.imei2;
                  if (Array.isArray(raw)) {
                    return raw.join(', ');
                  }
                  return raw || '—';
                })()}
              </td>
              <td style={styles.td}>{phoneDetails.ramMemory || '—'}</td>
              <td style={styles.td}>{phoneDetails.color || '—'}</td>
              <td style={styles.td}>{phoneDetails.phoneCondition || '—'}</td>
              <td style={styles.td}>{phoneDetails.warranty || '—'}</td>
            </tr>
          </tbody>
        </table>
        {phoneDetails.specifications && (
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <strong>Specifications:</strong> {phoneDetails.specifications}
          </div>
        )}
      </div>

      {/* Accessories */}
      {accessories.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Accessories</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((acc, idx) => {
                const rawName = acc.name || acc.accessoryName;
                const resolvedName =
                  typeof rawName === 'string'
                    ? rawName
                    : rawName?.accessoryName ||
                      rawName?.name ||
                      rawName?._id ||
                      '—';

                const unitPrice =
                  acc.price != null
                    ? Number(acc.price)
                    : acc.perPiecePrice != null
                      ? Number(acc.perPiecePrice)
                      : 0;
                const qty = Number(acc.quantity || 1);
                const total =
                  acc.totalPrice != null
                    ? Number(acc.totalPrice)
                    : unitPrice * qty;

                return (
                  <tr key={idx}>
                    <td style={styles.td}>{resolvedName}</td>
                    <td style={styles.td}>{qty}</td>
                    <td style={styles.td}>{unitPrice.toLocaleString()}</td>
                    <td style={styles.td}>{total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pricing Summary (only if has meaningful values) */}
      {hasPricing && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Pricing Summary</div>
          {pricing.purchasePrice != null && (
            <div style={styles.row}>
              <span style={styles.label}>Purchase Price</span>
              <span style={styles.value}>
                {Number(pricing.purchasePrice).toLocaleString()}
              </span>
            </div>
          )}
          {pricing.salePrice != null && (
            <div style={styles.row}>
              <span style={styles.label}>Sale Price</span>
              <span style={styles.value}>
                {Number(pricing.salePrice).toLocaleString()}
              </span>
            </div>
          )}
          {pricing.finalPrice != null && (
            <div style={styles.row}>
              <span style={styles.label}>Final Price</span>
              <span style={styles.value}>
                {Number(pricing.finalPrice).toLocaleString()}
              </span>
            </div>
          )}
          {pricing.totalInvoice != null && (
            <div style={styles.row}>
              <span style={styles.label}>Total Invoice</span>
              <span style={styles.value}>
                {Number(pricing.totalInvoice).toLocaleString()}
              </span>
            </div>
          )}
          {pricing.profit != null && (
            <div style={styles.row}>
              <span style={styles.label}>Profit</span>
              <span style={styles.value}>
                {Number(pricing.profit).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Entity / Customer Account Details (from entityData) */}
      {entityData && Object.keys(entityData).length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Customer Account Summary</div>
          <div style={styles.row}>
            <span style={styles.label}>Entity Name</span>
            <span style={styles.value}>
              {entityData.name || entityCore.name || '—'}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Entity Number</span>
            <span style={styles.value}>
              {entityData.number || entityCore.number || '—'}
            </span>
          </div>
          {(entityCore.status || entityCore.reference) && (
            <>
              {entityCore.status && (
                <div style={styles.row}>
                  <span style={styles.label}>Status</span>
                  <span style={styles.value}>{entityCore.status}</span>
                </div>
              )}
              {entityCore.reference && (
                <div style={styles.row}>
                  <span style={styles.label}>Reference</span>
                  <span style={styles.value}>{entityCore.reference}</span>
                </div>
              )}
            </>
          )}
          {(entityCore.takingCredit != null ||
            entityCore.givingCredit != null) && (
            <>
              {entityCore.takingCredit != null && (
                <div style={styles.row}>
                  <span style={styles.label}>Taking Credit</span>
                  <span style={styles.value}>
                    {Number(entityCore.takingCredit).toLocaleString()}
                  </span>
                </div>
              )}
              {entityCore.givingCredit != null && (
                <div style={styles.row}>
                  <span style={styles.label}>Giving Credit</span>
                  <span style={styles.value}>
                    {Number(entityCore.givingCredit).toLocaleString()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* IMEI-wise Phone Pricing from metadata */}
      {imeiPrices.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>IMEI-wise Phone Prices</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>IMEI</th>
                <th style={styles.th}>Price</th>
              </tr>
            </thead>
            <tbody>
              {imeiPrices.map((row, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{row.imei || '—'}</td>
                  <td style={styles.td}>
                    {row.price != null
                      ? Number(row.price).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {metadata.notes && (
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <strong>Notes:</strong> {metadata.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SaleInvoiceDetail;
