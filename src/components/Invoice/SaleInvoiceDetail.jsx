import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../api/api';
import { toast } from 'react-toastify';
import { dateFormatter } from 'utils/dateFormatter';
import { BASE_URL } from 'config/constant';

const SaleInvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [shop, setShop] = useState(null);
  const [selectedColor] = useState('#004B87');

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

  // Load shop from localStorage + fetch logo (same as SoldInvoice style)
  useEffect(() => {
    try {
      const shopData = localStorage.getItem('shop');
      if (shopData) {
        setShop(JSON.parse(shopData));
      }
    } catch {
      // ignore
    }

    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/api/shop/logo');
        if (!mounted) return;
        if (res?.data?.success && res?.data?.logo) {
          const path = String(res.data.logo);
          if (
            path &&
            path !== '{}' &&
            path !== 'null' &&
            path !== 'undefined'
          ) {
            const full = `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
            setLogoUrl(full);
          }
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !invoice) {
    return (
      <div style={{ padding: 24 }}>
        {loading ? 'Loading invoice...' : 'Invoice not found'}
      </div>
    );
  }

  const pricing = invoice?.pricing || {};
  const payment = invoice?.payment || {};
  const accessories = Array.isArray(invoice?.accessories)
    ? invoice.accessories
    : [];
  const metadata = invoice?.metadata || {};
  const entityData = invoice?.entityData || {};
  const entityCore = entityData?._id || {};

  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const splitMaybeList = (raw) => {
    if (raw == null) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
    const str = String(raw).trim();
    if (!str) return [];
    // split by comma/newline or pipe
    if (/[,\n|]/.test(str)) {
      return str
        .split(/[,|\n]/g)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [str];
  };

  // metadata.imeiPrices can be array [{imei, price}] OR object map {imei: price}
  const imeiPriceMap = (() => {
    const raw = metadata?.imeiPrices;
    if (Array.isArray(raw)) {
      return raw.reduce((acc, row) => {
        const k = row?.imei != null ? String(row.imei).trim() : '';
        if (!k) return acc;
        acc[k] = toNumber(row?.price);
        return acc;
      }, {});
    }
    if (raw && typeof raw === 'object') {
      return Object.entries(raw).reduce((acc, [k, v]) => {
        const key = String(k).trim();
        if (!key) return acc;
        acc[key] = toNumber(v);
        return acc;
      }, {});
    }
    return {};
  })();

  const normalizePhones = () => {
    const rawPhoneDetails = invoice?.phoneDetails;
    const detailsArray = Array.isArray(rawPhoneDetails)
      ? rawPhoneDetails
      : rawPhoneDetails && typeof rawPhoneDetails === 'object'
        ? [rawPhoneDetails]
        : [];

    const phones = [];

    detailsArray.forEach((detail) => {
      const companyName =
        detail?.companyName ||
        detail?.mobileCompany ||
        detail?.company ||
        invoice?.companyName ||
        '';
      const modelName =
        detail?.modelName ||
        detail?.mobileName ||
        detail?.modelSpecifications ||
        detail?.model ||
        invoice?.modelName ||
        '';

      const imeis = [
        ...splitMaybeList(detail?.imei1 ?? detail?.imei ?? detail?.imeis),
      ];
      const imei2List = splitMaybeList(detail?.imei2);

      // If there are no imeis, still show a single line item
      const count = Math.max(imeis.length, 1);
      for (let i = 0; i < count; i++) {
        const imei = imeis[i] || '';
        const imei2 = imei2List[i] || '';
        const fallbackUnit =
          toNumber(detail?.salePrice) ||
          toNumber(detail?.finalPrice) ||
          toNumber(detail?.price) ||
          0;
        const salePrice = imei
          ? imeiPriceMap[imei] ?? fallbackUnit
          : fallbackUnit;

        phones.push({
          companyName,
          modelName,
          imei,
          imei2,
          ramMemory: detail?.ramMemory || '',
          color: detail?.color || '',
          phoneCondition: detail?.phoneCondition || '',
          warranty: detail?.warranty || '',
          salePrice: toNumber(salePrice),
        });
      }
    });

    return phones;
  };

  const phones = normalizePhones();

  const phonesTotalComputed = phones.reduce(
    (sum, p) => sum + toNumber(p.salePrice),
    0
  );
  const accessoriesTotalComputed = accessories.reduce((sum, acc) => {
    const unit =
      acc?.price != null
        ? toNumber(acc.price)
        : acc?.perPiecePrice != null
          ? toNumber(acc.perPiecePrice)
          : 0;
    const qty = toNumber(acc?.quantity || 1);
    const total =
      acc?.totalPrice != null ? toNumber(acc.totalPrice) : unit * qty;
    return sum + total;
  }, 0);

  const phonesTotal =
    phonesTotalComputed ||
    toNumber(pricing?.salePrice) ||
    toNumber(pricing?.finalPrice) ||
    0;

  const grandTotal =
    toNumber(pricing?.totalInvoice) ||
    toNumber(pricing?.totalAmount) ||
    toNumber(pricing?.finalPrice) ||
    phonesTotal + accessoriesTotalComputed;

  const allSameModel =
    phones.length > 0 &&
    phones.every(
      (p) =>
        String(p.companyName || '')
          .trim()
          .toLowerCase() ===
          String(phones[0].companyName || '')
            .trim()
            .toLowerCase() &&
        String(p.modelName || '')
          .trim()
          .toLowerCase() ===
          String(phones[0].modelName || '')
            .trim()
            .toLowerCase()
    );

  const paidNow = (() => {
    // Prefer payableAmountNow if provided for credit flows, otherwise bank+pocket cash
    const byCredit =
      payment?.payableAmountNow != null
        ? toNumber(payment.payableAmountNow)
        : 0;
    const byWallet =
      toNumber(payment?.accountCash) + toNumber(payment?.pocketCash);
    return byCredit || byWallet;
  })();

  const creditAfterSale = (() => {
    // Prefer payableAmountLater if provided, otherwise compute from totals
    if (payment?.payableAmountLater != null)
      return toNumber(payment.payableAmountLater);
    const computed = grandTotal - paidNow;
    return computed > 0 ? computed : 0;
  })();

  const previousBalanceRaw =
    metadata?.previousBalance ??
    invoice?.previousBalance ??
    metadata?.prevBalance ??
    null;

  const previousBalance =
    previousBalanceRaw != null ? toNumber(previousBalanceRaw) : null;

  const remainingAfterSale =
    (previousBalance != null ? previousBalance : 0) + creditAfterSale;

  const isCredit =
    String(payment?.sellingPaymentType || '').toLowerCase() === 'credit' ||
    creditAfterSale > 0;

  const dueDate =
    payment?.payableAmountLaterDate ||
    payment?.dateOfPayment ||
    payment?.dueDate ||
    null;

  // If backend does not provide previousBalance, we can infer it from entity credits:
  // currentNetBalance(after sale) = (givingCredit - takingCredit)
  // previousBalance(before sale) = currentNetBalance - creditAfterSale
  const currentNetBalance =
    toNumber(entityCore?.givingCredit) - toNumber(entityCore?.takingCredit);
  const previousBalanceFinal =
    previousBalance != null
      ? previousBalance
      : isCredit &&
          (entityCore?.givingCredit != null || entityCore?.takingCredit != null)
        ? currentNetBalance - creditAfterSale
        : 0;
  const remainingAfterSaleFinal =
    isCredit &&
    (entityCore?.givingCredit != null || entityCore?.takingCredit != null)
      ? currentNetBalance
      : previousBalanceFinal + creditAfterSale;

  const styles = {
    container: {
      width: '210mm',
      minHeight: 'auto',
      margin: '20px auto',
      padding: '26px',
      background: '#f9f9f9',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      fontFamily: "'Poppins', sans-serif",
      color: '#111827',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '18px',
      paddingBottom: '10px',
      borderBottom: `3px solid ${selectedColor}`,
    },
    section: {
      marginBottom: '14px',
      padding: '16px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.06)',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '10px',
      color: selectedColor,
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '6px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: 6,
      fontSize: 13,
    },
    label: {
      fontWeight: 600,
      color: '#6b7280',
      minWidth: 160,
    },
    value: {
      fontWeight: 600,
      color: '#111827',
      textAlign: 'right',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: 8,
    },
    th: {
      padding: '12px',
      backgroundColor: selectedColor,
      color: '#fff',
      textAlign: 'left',
      fontWeight: 700,
      fontSize: 13,
    },
    td: {
      padding: '10px 12px',
      textAlign: 'left',
      backgroundColor: '#fafafa',
      borderBottom: '1px solid #eee',
      color: '#111827',
      fontSize: 13,
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 800,
      fontSize: 14,
      paddingTop: 8,
    },
    footer: {
      marginTop: '14px',
      paddingTop: '10px',
      borderTop: `3px solid ${selectedColor}`,
      textAlign: 'center',
      fontSize: '12px',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header (Shop details first) */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="logo"
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #fff',
                boxShadow: '0 8px 25px rgba(0,0,0,0.18)',
              }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <div>
            <div
              style={{ fontSize: 22, fontWeight: 800, color: selectedColor }}
            >
              {shop?.shopName || 'Shop'}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {shop?.address || '—'}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {Array.isArray(shop?.contactNumber)
                ? shop.contactNumber.join(' | ')
                : shop?.contactNumber || '—'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: selectedColor }}>
            INVOICE
          </div>
          <div style={{ fontSize: 13, color: '#111827', fontWeight: 700 }}>
            Invoice #: {invoice?.invoiceNumber || '—'}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            Date: {invoice?.saleDate ? dateFormatter(invoice.saleDate) : '—'}
          </div>
        </div>
      </header>

      {/* Customer details */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Customer Details</div>
        <div style={styles.row}>
          <span style={styles.label}>Customer Name</span>
          <span style={styles.value}>{invoice?.customerName || '—'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Customer Number</span>
          <span style={styles.value}>{invoice?.customerNumber || '—'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Sale Type</span>
          <span style={styles.value}>{invoice?.saleType || '—'}</span>
        </div>
        {(entityData?.name || entityCore?.name) && (
          <div style={styles.row}>
            <span style={styles.label}>Entity</span>
            <span style={styles.value}>
              {(entityData?.name || entityCore?.name || '—') +
                (entityData?.number || entityCore?.number
                  ? ` (${entityData?.number || entityCore?.number})`
                  : '')}
            </span>
          </div>
        )}
      </div>

      {/* Phone Summary (one row if same model) */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Phones</div>

        {phones.length === 0 ? (
          <div style={{ fontSize: 13, color: '#6b7280' }}>No phone data</div>
        ) : (
          <>
            {allSameModel && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Model</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>{phones[0].companyName || '—'}</td>
                    <td style={styles.td}>{phones[0].modelName || '—'}</td>
                    <td style={styles.td}>{phones.length}</td>
                    <td style={styles.td}>{phonesTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Per-phone details (company / model / IMEIs only – no per-phone total) */}
            <table style={{ ...styles.table, marginTop: 12 }}>
              <thead>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Model</th>
                  <th style={styles.th}>IMEI</th>
                </tr>
              </thead>
              <tbody>
                {phones.map((p, idx) => (
                  <tr key={`${p.imei || 'row'}-${idx}`}>
                    <td style={styles.td}>{p.companyName || '—'}</td>
                    <td style={styles.td}>{p.modelName || '—'}</td>
                    <td style={styles.td}>
                      {p.imei || '—'}
                      {p.imei2 ? ` / ${p.imei2}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
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
                const rawName = acc?.name || acc?.accessoryName;
                const resolvedName =
                  typeof rawName === 'string'
                    ? rawName
                    : rawName?.accessoryName ||
                      rawName?.name ||
                      rawName?._id ||
                      '—';
                const unit =
                  acc?.price != null
                    ? toNumber(acc.price)
                    : acc?.perPiecePrice != null
                      ? toNumber(acc.perPiecePrice)
                      : 0;
                const qty = toNumber(acc?.quantity || 1);
                const total =
                  acc?.totalPrice != null
                    ? toNumber(acc.totalPrice)
                    : unit * qty;

                return (
                  <tr key={idx}>
                    <td style={styles.td}>{resolvedName}</td>
                    <td style={styles.td}>{qty}</td>
                    <td style={styles.td}>{unit.toLocaleString()}</td>
                    <td style={styles.td}>{total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Totals */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Totals</div>
        <div style={styles.row}>
          <span style={styles.label}>Phones Total</span>
          <span style={styles.value}>{phonesTotal.toLocaleString()}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Accessories Total</span>
          <span style={styles.value}>
            {accessoriesTotalComputed.toLocaleString()}
          </span>
        </div>
        <div style={{ ...styles.totalRow, marginTop: 6 }}>
          <span>Total Invoice</span>
          <span>{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment / Credit section (only for credit scenario) */}
      {isCredit && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Credit Summary</div>

          <div style={styles.row}>
            <span style={styles.label}>Person to pay before invoice</span>
            <span style={styles.value}>
              {previousBalanceFinal.toLocaleString()}
            </span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Now Paid Amount</span>
            <span style={styles.value}>{paidNow.toLocaleString()}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Credit after sale (this invoice)</span>
            <span style={styles.value}>{creditAfterSale.toLocaleString()}</span>
          </div>

          <div style={{ ...styles.totalRow, marginTop: 6 }}>
            <span>Remaining</span>
            <span>{remainingAfterSaleFinal.toLocaleString()}</span>
          </div>

          {dueDate && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
              Due Date: {dueDate}
            </div>
          )}
        </div>
      )}

      <footer style={styles.footer}>
        {shop?.shopName || 'Shop'} | {shop?.address || '—'} |{' '}
        {Array.isArray(shop?.contactNumber)
          ? shop.contactNumber.join(' | ')
          : shop?.contactNumber || '—'}
      </footer>
    </div>
  );
};

export default SaleInvoiceDetail;
