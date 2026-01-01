import { api } from '../../../api/api';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import Modal from 'components/Modal/Modal';
import CustomSelect from 'components/CustomSelect';
import Select from 'react-select';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';

const DashDefault = () => {
  const tabContent = (
    <React.Fragment>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar1}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3784
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar2}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Julie Vad</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3544
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar3}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            2739
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar1}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Frida Thomse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            1032
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar2}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            8750
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar3}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            8750
          </span>
        </div>
      </div>
    </React.Fragment>
  );
  const [persons, setPersons] = useState([]);
  const [isLoadingPersons, setIsLoadingPersons] = useState(true);
  const [showReceivablesTotal, setShowReceivablesTotal] = useState(false);
  const [showPayablesTotal, setShowPayablesTotal] = useState(false);
  const [showReceivablesNumbers, setShowReceivablesNumbers] = useState(false);
  const [showPayablesNumbers, setShowPayablesNumbers] = useState(false);
  const [showTotalCustomers, setShowTotalCustomers] = useState(false);
  const [showReceivables, setShowReceivables] = useState(false);
  const [showPayables, setShowPayables] = useState(false);
  const [showActiveAccounts, setShowActiveAccounts] = useState(false);
  const [showInvoiceSearchModal, setShowInvoiceSearchModal] = useState(false);
  const [invoiceSearchNumber, setInvoiceSearchNumber] = useState('');
  const [searchedInvoiceData, setSearchedInvoiceData] = useState(null);
  const [isSearchingInvoice, setIsSearchingInvoice] = useState(false);
  const [allInvoices, setAllInvoices] = useState([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const avatarsArr = [avatar1, avatar2, avatar3];

  // Print Company Data modal state
  const [showPrintCompanyModal, setShowPrintCompanyModal] = useState(false);
  const [companyReportType, setCompanyReportType] = useState(''); // 'sale' | 'purchase'
  const [companyReportCompany, setCompanyReportCompany] = useState('');
  const [companyReportModel, setCompanyReportModel] = useState('');
  const [companyReportPartyId, setCompanyReportPartyId] = useState('');
  const [companyReportStartDate, setCompanyReportStartDate] = useState('');
  const [companyReportEndDate, setCompanyReportEndDate] = useState('');
  const [companyReportParties, setCompanyReportParties] = useState([]);
  const [companyReportLoading, setCompanyReportLoading] = useState(false);
  const [companyReportMobileRows, setCompanyReportMobileRows] = useState([]);
  const [companyReportAccessoryRows, setCompanyReportAccessoryRows] = useState(
    []
  );
  const reportRef = useRef(null);

  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const toISODateOnly = (raw) => {
    if (!raw) return '';
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const isWithinRange = (dateIso, startIso, endIso) => {
    // If record has no date, include it when user has NOT applied a date filter
    if (!dateIso) {
      return !startIso && !endIso;
    }
    if (startIso && dateIso < startIso) return false;
    if (endIso && dateIso > endIso) return false;
    return true;
  };

  const normalizePartyName = (p) =>
    String(p?.partyName || p?.name || p?.personName || '').trim();

  // Load parties when modal opens
  useEffect(() => {
    if (!showPrintCompanyModal) return;
    (async () => {
      try {
        // Use same entities source as other entity sections
        const res = await api.get('/api/person/nameAndId');
        // In entities section we expect plain array: [{ _id, name, number, ... }]
        setCompanyReportParties(res?.data || []);
      } catch (e) {
        setCompanyReportParties([]);
      }
    })();
  }, [showPrintCompanyModal]);

  const companyOptions = useMemo(() => {
    const set = new Set();
    companyReportMobileRows.forEach((r) => {
      const c = String(r.companyName || '').trim();
      if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [companyReportMobileRows]);

  const modelOptions = useMemo(() => {
    const set = new Set();
    companyReportMobileRows.forEach((r) => {
      const c = String(r.companyName || '').trim();
      const m = String(r.modelName || '').trim();
      if (!m) return;
      if (companyReportCompany && c !== companyReportCompany) return;
      set.add(m);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [companyReportMobileRows, companyReportCompany]);

  const selectedParty = useMemo(() => {
    if (!companyReportPartyId) return null;
    return (
      companyReportParties.find((p) => p?._id === companyReportPartyId) || null
    );
  }, [companyReportPartyId, companyReportParties]);

  const invoiceOptions = useMemo(() => {
    return allInvoices.map((invoice) => {
      // Ensure the value is always a string
      const invoiceNumber = invoice.invoiceNumber || String(invoice._id);

      return {
        value: invoiceNumber,
        label: `${invoiceNumber} - ${invoice.customerName || 'Unknown'} - Rs. ${(invoice.totalInvoice || invoice.finalPrice || 0).toLocaleString()}`,
        invoice: invoice,
      };
    });
  }, [allInvoices]);

  const partyOptions = useMemo(() => {
    const optionsMap = new Map();

    // From party ledger
    (companyReportParties || []).forEach((p) => {
      const id = p?._id ? String(p._id) : normalizePartyName(p);
      if (!id) return;
      if (optionsMap.has(id)) return;
      optionsMap.set(id, {
        value: p?._id || id,
        label: `${normalizePartyName(p) || 'Party'}${
          p?.number ? ` || ${p.number}` : ''
        }`,
        _id: p?._id,
      });
    });

    // From sale/purchase rows (in case some parties are not in ledger API)
    [...companyReportMobileRows, ...companyReportAccessoryRows].forEach((r) => {
      const name = normalizePartyName({ partyName: r.partyName });
      const id = r.partyId ? String(r.partyId) : name;
      if (!id) return;
      if (optionsMap.has(id)) return;
      optionsMap.set(id, {
        value: r.partyId || id,
        label: name || 'Party',
        _id: r.partyId || undefined,
      });
    });

    return Array.from(optionsMap.values());
  }, [
    companyReportParties,
    companyReportMobileRows,
    companyReportAccessoryRows,
  ]);

  const fetchCompanyReportData = async (type) => {
    if (!type) return;
    setCompanyReportLoading(true);
    try {
      if (type === 'sale') {
        const [bulkSalesRes, singleSalesRes, accessoryRes] = await Promise.all([
          api.get('api/Purchase/all-sales'),
          api.get('api/Purchase/sold-single-phones'),
          api.get('api/accessory/accessoryRecord'),
        ]);

        const bulkSales = bulkSalesRes?.data?.data || [];
        const singleSales = singleSalesRes?.data?.soldPhones || [];
        const allAccessories = accessoryRes?.data || [];
        const accessorySales = Array.isArray(allAccessories)
          ? allAccessories.filter((r) => r?.type === 'sale')
          : [];

        const mobileRows = [];

        // Bulk sales
        bulkSales.forEach((sale) => {
          const dateIso =
            toISODateOnly(
              sale?.saleDate || sale?.dateSold || sale?.date || sale?.createdAt
            ) || '';
          const invoiceNumber = sale?.invoiceNumber || sale?._id || '';
          const partyId =
            sale?.personId?._id ||
            sale?.personId ||
            sale?.entityData?._id ||
            '';
          const partyName =
            sale?.personName ||
            sale?.personId?.name ||
            sale?.entityData?.name ||
            sale?.customerName ||
            '';

          const ramSimDetails = Array.isArray(sale?.ramSimDetails)
            ? sale.ramSimDetails
            : [];

          // Always process bulk sales - even if ramSimDetails is empty
          if (ramSimDetails.length > 0) {
            ramSimDetails.forEach((d) => {
              // Get company and model from multiple possible sources
              const companyName = String(
                d?.companyName ||
                  sale?.companyName ||
                  d?.mobileCompany ||
                  sale?.mobileCompany ||
                  ''
              ).trim();
              const modelName = String(
                d?.modelName ||
                  sale?.modelName ||
                  d?.modelSpecifications ||
                  sale?.modelSpecifications ||
                  d?.mobileName ||
                  sale?.mobileName ||
                  ''
              ).trim();

              // Skip rows without valid company or model name
              if (!companyName && !modelName) {
                return;
              }

              const imeis = Array.isArray(d?.imeiNumbers) ? d.imeiNumbers : [];
              const qty =
                imeis.length ||
                safeNumber(d?.totalQuantity) ||
                safeNumber(d?.quantity) ||
                1;

              // price calculation
              const imeisWithPrices =
                sale?.imeisWithPrices || sale?.imeiPrices || null;
              let total = 0;
              if (imeisWithPrices && typeof imeisWithPrices === 'object') {
                total = imeis.reduce((sum, x) => {
                  // Handle both string IMEIs and object IMEIs
                  const imeiKey =
                    typeof x === 'string'
                      ? x
                      : x?.imei1
                        ? String(x.imei1)
                        : String(x || '');
                  return (
                    sum + (imeiKey ? safeNumber(imeisWithPrices[imeiKey]) : 0)
                  );
                }, 0);
              }
              if (!total) {
                const perOne = safeNumber(
                  d?.priceOfOne || d?.salePrice || d?.price || 0
                );
                total = perOne && qty ? perOne * qty : 0;
              }
              if (!total) {
                // Distribute total invoice across ramSimDetails if available
                const totalInvoice =
                  safeNumber(sale?.totalInvoice) ||
                  safeNumber(sale?.finalPrice) ||
                  safeNumber(sale?.salePrice) ||
                  safeNumber(sale?.pricing?.totalInvoice) ||
                  0;
                total =
                  ramSimDetails.length > 0
                    ? totalInvoice / ramSimDetails.length
                    : totalInvoice;
              }

              mobileRows.push({
                source: 'bulk-sale',
                dateIso,
                invoiceNumber,
                partyId,
                partyName,
                companyName,
                modelName,
                qty: qty || 1,
                total,
              });
            });
          } else {
            // Fallback: Only include bulk sale if it has company or model
            const companyName = String(
              sale?.companyName || sale?.mobileCompany || ''
            ).trim();
            const modelName = String(
              sale?.modelName ||
                sale?.modelSpecifications ||
                sale?.mobileName ||
                ''
            ).trim();

            // Skip rows without valid company or model name
            if (!companyName && !modelName) {
              return;
            }

            // Try to get quantity from various possible fields
            const qty =
              safeNumber(sale?.totalQuantity) ||
              safeNumber(sale?.quantity) ||
              (Array.isArray(sale?.imei1) ? sale.imei1.length : 0) ||
              (Array.isArray(sale?.imeis) ? sale.imeis.length : 0) ||
              1;

            mobileRows.push({
              source: 'bulk-sale',
              dateIso,
              invoiceNumber,
              partyId,
              partyName,
              companyName,
              modelName,
              qty: qty,
              total:
                safeNumber(sale?.totalInvoice) ||
                safeNumber(sale?.finalPrice) ||
                safeNumber(sale?.salePrice) ||
                safeNumber(sale?.pricing?.totalInvoice) ||
                0,
            });
          }
        });

        // Single sales
        singleSales.forEach((s) => {
          // Get company and model from multiple possible sources
          const companyName = String(
            s?.companyName || s?.mobileCompany || ''
          ).trim();
          const modelName = String(
            s?.modelName || s?.mobileName || s?.modelSpecifications || ''
          ).trim();

          // Skip rows without valid company or model name
          if (!companyName && !modelName) {
            return;
          }

          mobileRows.push({
            source: 'single-sale',
            dateIso:
              toISODateOnly(
                s?.saleDate || s?.dateSold || s?.date || s?.createdAt
              ) || '',
            invoiceNumber: s?.invoiceNumber || s?._id || '',
            partyId:
              s?.personId?._id || s?.personId || s?.entityData?._id || '',
            partyName:
              s?.personName ||
              s?.personId?.name ||
              s?.entityData?.name ||
              s?.customerName ||
              '',
            companyName,
            modelName,
            qty: 1,
            total: safeNumber(
              s?.salePrice || s?.finalPrice || s?.totalInvoice || 0
            ),
          });
        });

        const accessoryRows = accessorySales.map((r) => ({
          source: 'accessory-sale',
          dateIso: toISODateOnly(r?.date || r?.createdAt) || '',
          invoiceNumber: r?._id || '',
          partyId: r?.personId?._id || r?.personId || '',
          partyName: r?.personId?.name || r?.personName || '',
          itemName: r?.accessoryName || r?.name || 'Accessory',
          qty: safeNumber(r?.quantity || 1),
          total:
            safeNumber(r?.totalPrice || 0) ||
            safeNumber(r?.price || 0) * safeNumber(r?.quantity || 1),
        }));

        setCompanyReportMobileRows(mobileRows);
        setCompanyReportAccessoryRows(accessoryRows);
      } else {
        // purchase
        const [purchasePhonesRes, accessoryPurchaseRes] = await Promise.all([
          api.get('api/Purchase/all-purchase-phone'),
          api.get('api/accessory/accessoryRecord/purchase'),
        ]);

        const purchaseData = purchasePhonesRes?.data?.data || {};
        const singlePhones = Array.isArray(purchaseData?.singlePhones)
          ? purchaseData.singlePhones
          : [];
        const bulkPhones = Array.isArray(purchaseData?.bulkPhones)
          ? purchaseData.bulkPhones
          : [];

        const mobileRows = [];

        singlePhones.forEach((p) => {
          // Get company and model from multiple possible sources
          const companyName = String(
            p?.companyName || p?.mobileCompany || ''
          ).trim();
          const modelName = String(
            p?.modelName || p?.mobileName || p?.modelSpecifications || ''
          ).trim();

          // Skip rows without valid company or model name
          if (!companyName && !modelName) {
            return;
          }

          mobileRows.push({
            source: 'single-purchase',
            dateIso: toISODateOnly(p?.date || p?.createdAt) || '',
            invoiceNumber: p?._id || '',
            partyId: p?.personId?._id || p?.personId || '',
            partyName: p?.personId?.name || p?.name || '',
            companyName,
            modelName,
            qty: 1,
            total:
              safeNumber(p?.price?.finalPrice) ||
              safeNumber(p?.prices?.buyingPrice) ||
              safeNumber(p?.purchasePrice) ||
              0,
          });
        });

        bulkPhones.forEach((b) => {
          const ramSimDetails = Array.isArray(b?.ramSimDetails)
            ? b.ramSimDetails
            : [];

          // Process bulk purchases similar to bulk sales - break down by ramSimDetails
          if (ramSimDetails.length > 0) {
            ramSimDetails.forEach((d) => {
              // Get company and model from multiple possible sources
              const companyName = String(
                d?.companyName ||
                  b?.companyName ||
                  d?.mobileCompany ||
                  b?.mobileCompany ||
                  ''
              ).trim();
              const modelName = String(
                d?.modelName ||
                  b?.modelName ||
                  d?.modelSpecifications ||
                  b?.modelSpecifications ||
                  d?.mobileName ||
                  b?.mobileName ||
                  ''
              ).trim();

              // Skip rows without valid company or model name
              if (!companyName && !modelName) {
                return;
              }

              const imeis = Array.isArray(d?.imeiNumbers) ? d.imeiNumbers : [];
              const qty =
                imeis.length ||
                safeNumber(d?.totalQuantity) ||
                safeNumber(d?.quantity) ||
                0;

              // Calculate price per item
              const totalInvoice =
                safeNumber(b?.prices?.buyingPrice) ||
                safeNumber(b?.totalPrice) ||
                0;
              const perItem =
                ramSimDetails.length > 0
                  ? totalInvoice / ramSimDetails.length
                  : totalInvoice;
              const total =
                perItem && qty
                  ? perItem * qty
                  : d?.priceOfOne
                    ? safeNumber(d.priceOfOne) * qty
                    : perItem;

              mobileRows.push({
                source: 'bulk-purchase',
                dateIso: toISODateOnly(b?.date || b?.createdAt) || '',
                invoiceNumber: b?._id || '',
                partyId: b?.personId?._id || b?.personId || '',
                partyName: b?.personId?.name || b?.partyName || '',
                companyName,
                modelName,
                qty: qty || 1,
                total: total || perItem || 0,
              });
            });
          } else {
            // Fallback: Only include bulk purchase if it has company or model
            const companyName = String(
              b?.companyName || b?.mobileCompany || ''
            ).trim();
            const modelName = String(
              b?.modelName || b?.modelSpecifications || b?.mobileName || ''
            ).trim();

            // Skip rows without valid company or model name
            if (!companyName && !modelName) {
              return;
            }

            const qty =
              safeNumber(b?.totalQuantity) ||
              safeNumber(b?.quantity) ||
              (Array.isArray(b?.imeiNumbers) ? b.imeiNumbers.length : 0) ||
              1;

            mobileRows.push({
              source: 'bulk-purchase',
              dateIso: toISODateOnly(b?.date || b?.createdAt) || '',
              invoiceNumber: b?._id || '',
              partyId: b?.personId?._id || b?.personId || '',
              partyName: b?.personId?.name || b?.partyName || '',
              companyName,
              modelName,
              qty: qty,
              total:
                safeNumber(b?.prices?.buyingPrice) ||
                safeNumber(b?.totalPrice) ||
                safeNumber(b?.prices?.finalPrice) ||
                0,
            });
          }
        });

        const accessoryRowsRaw = accessoryPurchaseRes?.data || [];
        const accessoryRows = Array.isArray(accessoryRowsRaw)
          ? accessoryRowsRaw.map((r) => ({
              source: 'accessory-purchase',
              dateIso: toISODateOnly(r?.date || r?.createdAt) || '',
              invoiceNumber: r?._id || '',
              partyId: r?.personId?._id || r?.personId || '',
              partyName: r?.personId?.name || r?.personName || '',
              itemName: r?.accessoryName || r?.name || 'Accessory',
              qty: safeNumber(r?.quantity || 1),
              total:
                safeNumber(r?.totalPrice || 0) ||
                safeNumber(r?.price || r?.perPiecePrice || 0) *
                  safeNumber(r?.quantity || 1),
            }))
          : [];

        setCompanyReportMobileRows(mobileRows);
        setCompanyReportAccessoryRows(accessoryRows);
      }
    } catch (e) {
      console.error('Error fetching company report data:', e);
      toast.error('Failed to load report data');
      setCompanyReportMobileRows([]);
      setCompanyReportAccessoryRows([]);
    } finally {
      setCompanyReportLoading(false);
    }
  };

  // Fetch report data when type changes (required field)
  useEffect(() => {
    if (!showPrintCompanyModal) return;
    if (!companyReportType) return;
    // Reset dependent selections
    setCompanyReportCompany('');
    setCompanyReportModel('');
    // keep party/date selection as user may already set them
    fetchCompanyReportData(companyReportType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyReportType, showPrintCompanyModal]);

  const filteredMobileRows = useMemo(() => {
    const startIso = companyReportStartDate || '';
    const endIso = companyReportEndDate || '';
    return companyReportMobileRows.filter((r) => {
      // Filter out rows with empty/dashed company and model
      const companyName = String(r.companyName || '').trim();
      const modelName = String(r.modelName || '').trim();
      if (!companyName && !modelName) return false;
      if (companyName === '—' && modelName === '—') return false;

      if (!isWithinRange(r.dateIso, startIso, endIso)) return false;
      if (companyReportCompany && companyName !== companyReportCompany)
        return false;
      if (companyReportModel && modelName !== companyReportModel) return false;
      if (selectedParty) {
        const matchId =
          String(r.partyId || '') === String(selectedParty._id || '');
        const matchName =
          normalizePartyName({ name: r.partyName }) &&
          normalizePartyName({ name: r.partyName }) ===
            normalizePartyName(selectedParty);
        if (!matchId && !matchName) return false;
      }
      return true;
    });
  }, [
    companyReportMobileRows,
    companyReportCompany,
    companyReportModel,
    companyReportStartDate,
    companyReportEndDate,
    selectedParty,
  ]);

  const filteredAccessoryRows = useMemo(() => {
    const startIso = companyReportStartDate || '';
    const endIso = companyReportEndDate || '';
    return companyReportAccessoryRows.filter((r) => {
      if (!isWithinRange(r.dateIso, startIso, endIso)) return false;
      if (selectedParty) {
        const matchId =
          String(r.partyId || '') === String(selectedParty._id || '');
        const matchName =
          normalizePartyName({ name: r.partyName }) &&
          normalizePartyName({ name: r.partyName }) ===
            normalizePartyName(selectedParty);
        if (!matchId && !matchName) return false;
      }
      return true;
    });
  }, [
    companyReportAccessoryRows,
    companyReportStartDate,
    companyReportEndDate,
    selectedParty,
  ]);

  const handleDownloadCompanyReportPdf = async () => {
    if (!companyReportType) {
      toast.error('Please select Sale / Purchase');
      return;
    }
    if (!reportRef.current) {
      toast.error('Nothing to print');
      return;
    }
    const fileName = `company-data-${companyReportType}-${new Date().toISOString().slice(0, 10)}.pdf`;
    try {
      await html2pdf()
        .from(reportRef.current)
        .set({
          margin: 10,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .save();
    } catch (e) {
      console.error('PDF export failed:', e);
      toast.error('Failed to generate PDF');
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoadingPersons(true);
        const res = await api.get('/api/person/all');
        if (mounted) {
          setPersons(res?.data || []);
        }
      } catch (e) {
        // silent
      } finally {
        if (mounted) setIsLoadingPersons(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const payables = persons.filter(
    (p) => (p.takingCredit || 0) > (p.givingCredit || 0)
  );
  const receivables = persons.filter(
    (p) => (p.givingCredit || 0) > (p.takingCredit || 0)
  );

  const totalReceivables = receivables.reduce(
    (sum, p) =>
      sum + Math.max((p.givingCredit || 0) - (p.takingCredit || 0), 0),
    0
  );
  const totalPayables = payables.reduce(
    (sum, p) =>
      sum + Math.max((p.takingCredit || 0) - (p.givingCredit || 0), 0),
    0
  );

  const handleInvoiceSearch = async (invoiceNumber = null) => {
    const searchNumber = invoiceNumber || invoiceSearchNumber.trim();

    if (!searchNumber) {
      alert('Please enter an invoice number');
      return;
    }

    setIsSearchingInvoice(true);
    setSearchedInvoiceData(null);

    try {
      const response = await api.get(
        `/api/sale-invoice/phone-details/${searchNumber}`
      );
      if (response.data.success) {
        const { invoice, phoneDetails } = response.data.data;

        // Transform the data to maintain compatibility with existing display logic
        // while providing access to the richer phoneDetails
        const transformedData = {
          ...invoice,
          phoneDetails: phoneDetails,
          // Keep backward compatibility
          customerName:
            phoneDetails?.saleInfo?.customerName || invoice.customerName,
          customerNumber:
            phoneDetails?.saleInfo?.customerNumber || invoice.customerNumber,
          saleDate: phoneDetails?.saleInfo?.saleDate || invoice.saleDate,
          totalInvoice:
            phoneDetails?.saleInfo?.totalInvoice ||
            phoneDetails?.pricing?.totalInvoice,
          salePrice:
            phoneDetails?.saleInfo?.salePrice ||
            phoneDetails?.pricing?.salePrice,
        };

        setSearchedInvoiceData(transformedData);
      } else {
        alert('Invoice not found');
      }
    } catch (error) {
      console.error('Error searching invoice:', error);
      alert(error?.response?.data?.message || 'Error searching invoice');
    } finally {
      setIsSearchingInvoice(false);
    }
  };

  const clearInvoiceSearch = () => {
    setInvoiceSearchNumber('');
    setSearchedInvoiceData(null);
  };

  const fetchAllInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      // Try without limit first to get all invoices
      const response = await api.get('/api/sale-invoice/');
      if (response.data.success) {
        const invoices = response.data.data.invoices || [];
        setAllInvoices(invoices);
      } else {
        setAllInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // If the API has issues with no limit, try with a very high limit
      try {
        const response = await api.get('/api/sale-invoice/', {
          params: {
            page: 1,
            limit: 5000, // Try a higher limit
          },
        });
        if (response.data.success) {
          const invoices = response.data.data.invoices || [];
          setAllInvoices(invoices);
        } else {
          setAllInvoices([]);
        }
      } catch (secondError) {
        console.error('Error with high limit too:', secondError);
        setAllInvoices([]);
      }
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const openInvoiceSearchModal = () => {
    setShowInvoiceSearchModal(true);
    setInvoiceSearchNumber('');
    setSearchedInvoiceData(null);
    fetchAllInvoices();
  };

  return (
    <React.Fragment>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .quick-actions-container {
            flex-direction: column !important;
          }
          .quick-action-item {
            min-width: 100% !important;
            width: 100% !important;
          }
          .payables-receivables-container {
            flex-direction: column !important;
          }
          .payables-receivables-section {
            width: 100% !important;
            margin-bottom: 20px;
          }
          .payables-receivables-section:last-child {
            margin-bottom: 0;
          }
          .section-title {
            font-size: 18px !important;
          }
          .quick-action-icon {
            width: 50px !important;
            height: 50px !important;
          }
          .quick-action-icon i {
            font-size: 20px !important;
          }
          .stats-card-icon {
            padding: 12px !important;
          }
          .stats-card-icon i {
            font-size: 18px !important;
          }
          .stats-card h4 {
            font-size: 20px !important;
          }
          .recent-activity-header {
            padding: 15px 20px !important;
          }
          .recent-activity-header > div {
            font-size: 18px !important;
          }
          .tab-content-padding {
            padding: 15px !important;
          }
          .payables-receivables-padding {
            padding: 15px !important;
          }
          .quick-action-item > div {
            padding: 20px !important;
          }
        }
        @media (max-width: 576px) {
          .section-title {
            font-size: 16px !important;
          }
          .quick-action-title {
            font-size: 16px !important;
          }
          .quick-action-desc {
            font-size: 12px !important;
          }
          .stats-card h4 {
            font-size: 18px !important;
          }
          .stats-card small {
            font-size: 11px !important;
          }
          .recent-activity-header {
            padding: 12px 15px !important;
          }
          .recent-activity-header > div {
            font-size: 16px !important;
          }
          .tab-content-padding {
            padding: 12px !important;
          }
          .payables-receivables-padding {
            padding: 12px !important;
            gap: 15px !important;
          }
          .quick-action-item > div {
            padding: 15px !important;
            gap: 15px !important;
          }
          .quick-action-icon {
            width: 45px !important;
            height: 45px !important;
          }
          .quick-action-icon i {
            font-size: 18px !important;
          }
        }
      `}</style>
      {/* Professional Stats Overview */}
      <Row className="mb-4">
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-users text-primary fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-primary"
                    style={{
                      filter: showTotalCustomers ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowTotalCustomers(!showTotalCustomers)}
                  >
                    {persons.length}
                  </h4>
                  <small className="text-muted">Total Customers</small>
                </div>
                <i
                  className={`fa ${showTotalCustomers ? 'fa-eye' : 'fa-eye-slash'} text-primary`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowTotalCustomers(!showTotalCustomers)}
                  title={showTotalCustomers ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-arrow-up text-success fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-success"
                    style={{
                      filter: showReceivables ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowReceivables(!showReceivables)}
                  >
                    Rs. {totalReceivables.toLocaleString()}
                  </h4>
                  <small className="text-muted">Receivables</small>
                </div>
                <i
                  className={`fa ${showReceivables ? 'fa-eye' : 'fa-eye-slash'} text-success`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowReceivables(!showReceivables)}
                  title={showReceivables ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-arrow-down text-danger fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-danger"
                    style={{
                      filter: showPayables ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowPayables(!showPayables)}
                  >
                    Rs. {totalPayables.toLocaleString()}
                  </h4>
                  <small className="text-muted">Payables</small>
                </div>
                <i
                  className={`fa ${showPayables ? 'fa-eye' : 'fa-eye-slash'} text-danger`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowPayables(!showPayables)}
                  title={showPayables ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-chart-line text-info fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-info"
                    style={{
                      filter: showActiveAccounts ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowActiveAccounts(!showActiveAccounts)}
                  >
                    {receivables.length + payables.length}
                  </h4>
                  <small className="text-muted">Active Accounts</small>
                </div>
                <i
                  className={`fa ${showActiveAccounts ? 'fa-eye' : 'fa-eye-slash'} text-info`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowActiveAccounts(!showActiveAccounts)}
                  title={showActiveAccounts ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <div
          className="section-title"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <i className="fa fa-bolt" style={{ color: '#667eea' }}></i>
          Quick Actions
        </div>
        <div
          className="quick-actions-container"
          style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
        >
          <Link
            to={'/todayBook'}
            className="quick-action-item"
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-book"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Today Book
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  View today's transactions and activities
                </div>
              </div>
            </div>
          </Link>

          <Link
            to={'/app/dashboard/getCustomerRecord'}
            className="quick-action-item"
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-users"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Customer Records
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  Manage and view customer data
                </div>
              </div>
            </div>
          </Link>

          <Link
            to={'/app/dashboard/balanceSheet'}
            className="quick-action-item"
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-balance-scale"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Balance Sheet
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  View financial overview and reports
                </div>
              </div>
            </div>
          </Link>

          {/* Print Company Data */}
          <div
            className="quick-action-item"
            role="button"
            tabIndex={0}
            onClick={() => setShowPrintCompanyModal(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ')
                setShowPrintCompanyModal(true);
            }}
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-print"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Print Company Data
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  Sale/Purchase record (mobiles + accessories) in PDF
                </div>
              </div>
            </div>
          </div>

          {/* Find Invoice */}
          <div
            className="quick-action-item"
            role="button"
            tabIndex={0}
            onClick={openInvoiceSearchModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openInvoiceSearchModal();
            }}
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-search"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Find Invoice
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  Search and view invoice details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Section */}
      {/* <div style={{ marginBottom: '30px' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <i className="fa fa-chart-pie" style={{ color: '#667eea' }}></i>
            Financial Overview
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}
            >
              <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#16a34a',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(22, 163, 74, 0.3)',
                  }}
                >
                  Rs. {totalReceivables.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  Total Receivables
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {receivables.length} accounts
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#dcfce7',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  Rs. {totalPayables.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  Total Payables
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {payables.length} accounts
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#fef2f2',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #dc2626, #ef4444)',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color:
                      totalReceivables > totalPayables ? '#16a34a' : '#dc2626',
                    marginBottom: '8px',
                    textShadow:
                      totalReceivables > totalPayables
                        ? '0 2px 4px rgba(22, 163, 74, 0.3)'
                        : '0 2px 4px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  Rs.{' '}
                  {Math.abs(totalReceivables - totalPayables).toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  {totalReceivables > totalPayables
                    ? 'Net Receivables'
                    : 'Net Payables'}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {totalReceivables > totalPayables
                    ? 'Positive balance'
                    : 'Outstanding amount'}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background:
                      totalReceivables > totalPayables ? '#dcfce7' : '#fef2f2',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background:
                        totalReceivables > totalPayables
                          ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                          : 'linear-gradient(90deg, #dc2626, #ef4444)',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

      <Row>
        <Col xl={12}>
          <Card
            className="Recent-Users widget-focus-lg"
            style={{
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Card.Header>
              <Card.Title
                as="h5"
                style={{ fontWeight: 800, letterSpacing: '0.2px' }}
              >
                Payables & Receivables
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div
                className="payables-receivables-container payables-receivables-padding"
                style={{
                  display: 'flex',
                  padding: '26px',
                  gap: '20px',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {/* Receivables Section */}
                <div
                  className="payables-receivables-section"
                  style={{
                    flex: '1',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    width: '50%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #86efac',
                      padding: '8px 10px',
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <h6
                        style={{ margin: 0, fontWeight: 800, color: '#166534' }}
                      >
                        Receivables
                      </h6>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#065f46',
                          backgroundColor: '#d1fae5',
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}
                      >
                        {receivables.length}
                      </span>
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span
                        onClick={() => setShowReceivablesNumbers((s) => !s)}
                        title={
                          showReceivablesNumbers
                            ? 'Hide numbers'
                            : 'Show numbers'
                        }
                        style={{
                          cursor: 'pointer',
                          color: '#065f46',
                          fontSize: 16,
                        }}
                        className={`fa ${showReceivablesNumbers ? 'fa-eye' : 'fa-eye-slash'}`}
                      />
                      <span
                        onClick={() => setShowReceivablesTotal((s) => !s)}
                        title={
                          showReceivablesTotal ? 'Hide total' : 'Show total'
                        }
                        style={{
                          cursor: 'pointer',
                          color: '#065f46',
                          fontSize: 16,
                        }}
                        className="fa fa-calculator"
                      />
                    </div>
                  </div>
                  {showReceivablesTotal && (
                    <div
                      style={{
                        marginBottom: '8px',
                        backgroundColor: '#f0fdf4',
                        border: '1px dashed #86efac',
                        padding: '8px 10px',
                        borderRadius: 8,
                        color: '#166534',
                        fontWeight: 700,
                      }}
                    >
                      Total Receivables: Rs. {totalReceivables.toLocaleString()}
                    </div>
                  )}
                  <div
                    style={{
                      maxHeight: '360px',
                      overflowY: 'auto',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  >
                    {isLoadingPersons ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        Loading…
                      </div>
                    ) : receivables.length === 0 ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        No receivables
                      </div>
                    ) : (
                      receivables.map((p, idx) => {
                        const amount =
                          (p.givingCredit || 0) - (p.takingCredit || 0);
                        return (
                          <div
                            key={p._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 12px',
                              borderBottom: '1px solid #f3f4f6',
                              gap: '10px',
                            }}
                          >
                            <img
                              src={avatarsArr[idx % avatarsArr.length]}
                              alt="avatar"
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <h6
                                  style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#14532d',
                                  }}
                                >
                                  {p.name}
                                </h6>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: '#16a34a',
                                    fontWeight: 700,
                                  }}
                                >
                                  Rs. {Math.abs(amount).toLocaleString()}
                                </span>
                              </div>
                              <div
                                style={{ fontSize: '12px', color: '#6b7280' }}
                              >
                                {showReceivablesNumbers
                                  ? p.number
                                  : '••••••••••'}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Payables Section */}
                <div
                  className="payables-receivables-section"
                  style={{
                    flex: '1',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    width: '50%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      padding: '8px 10px',
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <h6
                        style={{ margin: 0, fontWeight: 800, color: '#7f1d1d' }}
                      >
                        Payables
                      </h6>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#7f1d1d',
                          backgroundColor: '#fee2e2',
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}
                      >
                        {payables.length}
                      </span>
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span
                        onClick={() => setShowPayablesNumbers((s) => !s)}
                        title={
                          showPayablesNumbers ? 'Hide numbers' : 'Show numbers'
                        }
                        style={{
                          cursor: 'pointer',
                          color: '#7f1d1d',
                          fontSize: 16,
                        }}
                        className={`fa ${showPayablesNumbers ? 'fa-eye' : 'fa-eye-slash'}`}
                      />
                      <span
                        onClick={() => setShowPayablesTotal((s) => !s)}
                        title={showPayablesTotal ? 'Hide total' : 'Show total'}
                        style={{
                          cursor: 'pointer',
                          color: '#7f1d1d',
                          fontSize: 16,
                        }}
                        className="fa fa-calculator"
                      />
                    </div>
                  </div>
                  {showPayablesTotal && (
                    <div
                      style={{
                        marginBottom: '8px',
                        backgroundColor: '#fef2f2',
                        border: '1px dashed #fecaca',
                        padding: '8px 10px',
                        borderRadius: 8,
                        color: '#7f1d1d',
                        fontWeight: 700,
                      }}
                    >
                      Total Payables: Rs. {totalPayables.toLocaleString()}
                    </div>
                  )}
                  <div
                    style={{
                      maxHeight: '360px',
                      overflowY: 'auto',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  >
                    {isLoadingPersons ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                        }}
                      >
                        Loading…
                      </div>
                    ) : payables.length === 0 ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                        }}
                      >
                        No payables
                      </div>
                    ) : (
                      payables.map((p, idx) => {
                        const amount =
                          (p.takingCredit || 0) - (p.givingCredit || 0);
                        return (
                          <div
                            key={p._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 12px',
                              borderBottom: '1px solid #f3f4f6',
                              gap: '10px',
                            }}
                          >
                            <img
                              src={avatarsArr[idx % avatarsArr.length]}
                              alt="avatar"
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <h6
                                  style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#7f1d1d',
                                  }}
                                >
                                  {p.name}
                                </h6>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: '#dc2626',
                                    fontWeight: 700,
                                  }}
                                >
                                  Rs. {Math.abs(amount).toLocaleString()}
                                </span>
                              </div>
                              <div
                                style={{ fontSize: '12px', color: '#6b7280' }}
                              >
                                {showPayablesNumbers ? p.number : '••••••••••'}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* <Col md={6} xl={4}>
          <Card
            className="card-event"
            style={{
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Card.Body>
              <div className="row align-items-center justify-content-center">
                <div className="col">
                  <h5 className="-m-16" style={{ fontSize: 30 }}>
                    Upcoming Updates
                  </h5>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <span className="d-block text-uppercase">total ideas</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <span className="d-block text-uppercase">total ideas</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <span className="d-block text-uppercase">total ideas</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}

        <Col xl={12} className="user-activity">
          <div
            style={{
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              marginTop: '25px',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="recent-activity-header"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px 25px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <i className="fa fa-history" style={{ fontSize: '18px' }}></i>
                Recent Activity
              </div>
            </div>

            {/* Tabs */}
            <div style={{ width: '100%' }}>
              <Tabs
                defaultActiveKey="today"
                id="uncontrolled-tab-example"
                className="mb-0"
              >
                <Tab
                  eventKey="today"
                  title={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <i className="fa fa-calendar-day"></i>
                      Today
                    </span>
                  }
                >
                  <div
                    className="tab-content-padding"
                    style={{ padding: '25px' }}
                  >
                    {tabContent}
                  </div>
                </Tab>
                <Tab
                  eventKey="week"
                  title={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <i className="fa fa-calendar-week"></i>
                      This Week
                    </span>
                  }
                >
                  <div
                    className="tab-content-padding"
                    style={{ padding: '25px' }}
                  >
                    {tabContent}
                  </div>
                </Tab>
                <Tab
                  eventKey="all"
                  title={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <i className="fa fa-calendar-alt"></i>
                      All Time
                    </span>
                  }
                >
                  <div
                    className="tab-content-padding"
                    style={{ padding: '25px' }}
                  >
                    {tabContent}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Col>
      </Row>

      {/* Print Company Data Modal */}
      <Modal
        size="lg"
        show={showPrintCompanyModal}
        toggleModal={() => setShowPrintCompanyModal(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontWeight: 800 }}>Print Company Data</h3>
          <button
            type="button"
            onClick={() => setShowPrintCompanyModal(false)}
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <div>
              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Sale / Purchase <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={companyReportType}
                onChange={(e) => setCompanyReportType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  marginTop: 6,
                  outline: 'none',
                }}
                required
              >
                <option value="">Select</option>
                <option value="sale">Sale</option>
                <option value="purchase">Purchase</option>
              </select>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                Only this field is required.
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Party (Optional)
              </label>
              <div style={{ marginTop: 6 }}>
                <CustomSelect
                  value={companyReportPartyId}
                  onChange={(opt) => setCompanyReportPartyId(opt?.value || '')}
                  options={partyOptions}
                  placeholder="Select Party"
                  noOptionsMessage="No parties found"
                />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Company (Optional)
              </label>
              <div style={{ marginTop: 6 }}>
                <CustomSelect
                  value={companyReportCompany}
                  onChange={(opt) => {
                    const v = opt?.value || '';
                    setCompanyReportCompany(v);
                    setCompanyReportModel('');
                  }}
                  options={companyOptions.map((c) => ({ value: c, label: c }))}
                  placeholder="Select Company"
                  noOptionsMessage={
                    companyReportType
                      ? 'No companies found'
                      : 'Select type first'
                  }
                />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Model (Optional)
              </label>
              <div style={{ marginTop: 6 }}>
                <CustomSelect
                  value={companyReportModel}
                  onChange={(opt) => setCompanyReportModel(opt?.value || '')}
                  options={modelOptions.map((m) => ({ value: m, label: m }))}
                  placeholder="Select Model"
                  noOptionsMessage={
                    companyReportCompany
                      ? 'No models found'
                      : 'Select company first (optional)'
                  }
                />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={companyReportStartDate}
                onChange={(e) => setCompanyReportStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  marginTop: 6,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: 13 }}>
                End Date (Optional)
              </label>
              <input
                type="date"
                value={companyReportEndDate}
                onChange={(e) => setCompanyReportEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  marginTop: 6,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 14,
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (!companyReportType) {
                  toast.error('Please select Sale / Purchase');
                  return;
                }
                fetchCompanyReportData(companyReportType);
              }}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
              disabled={!companyReportType || companyReportLoading}
            >
              {companyReportLoading ? 'Loading…' : 'Refresh Data'}
            </button>
            <button
              type="button"
              onClick={handleDownloadCompanyReportPdf}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: 'none',
                background: '#111827',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 800,
              }}
              disabled={companyReportLoading}
            >
              Download PDF
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              ref={reportRef}
              style={{
                padding: 18,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>
                    Company Data Report
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    Type: <b>{companyReportType || '—'}</b>
                    {companyReportCompany
                      ? ` | Company: ${companyReportCompany}`
                      : ''}
                    {companyReportModel
                      ? ` | Model: ${companyReportModel}`
                      : ''}
                    {selectedParty
                      ? ` | Party: ${normalizePartyName(selectedParty)}`
                      : ''}
                    {companyReportStartDate || companyReportEndDate
                      ? ` | Dates: ${companyReportStartDate || '…'} to ${companyReportEndDate || '…'}`
                      : ''}
                  </div>
                </div>
                <div
                  style={{ fontSize: 12, color: '#6b7280', textAlign: 'right' }}
                >
                  Generated: {new Date().toLocaleString()}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Mobiles</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Company
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Model
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMobileRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ padding: 10, color: '#6b7280' }}
                        >
                          {companyReportType
                            ? 'No mobile records for selected filters'
                            : 'Select Sale/Purchase to load data'}
                        </td>
                      </tr>
                    ) : (
                      filteredMobileRows.map((r, idx) => (
                        <tr key={`${r.invoiceNumber}-${idx}`}>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                            }}
                          >
                            {r.dateIso}
                          </td>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                            }}
                          >
                            {r.companyName || '—'}
                          </td>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                            }}
                          >
                            {r.modelName || '—'}
                          </td>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                              textAlign: 'right',
                            }}
                          >
                            {safeNumber(r.qty).toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                              textAlign: 'right',
                            }}
                          >
                            {safeNumber(r.total).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 18,
                    marginTop: 8,
                    fontWeight: 900,
                  }}
                >
                  <div>
                    Mobiles Total:{' '}
                    {filteredMobileRows
                      .reduce((sum, r) => sum + safeNumber(r.total), 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>
                  Accessories
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: 8,
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccessoryRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          style={{ padding: 10, color: '#6b7280' }}
                        >
                          {companyReportType
                            ? 'No accessory records for selected filters'
                            : 'Select Sale/Purchase to load data'}
                        </td>
                      </tr>
                    ) : (
                      filteredAccessoryRows.map((r, idx) => (
                        <tr key={`${r.invoiceNumber}-${idx}`}>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                            }}
                          >
                            {r.dateIso}
                          </td>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                            }}
                          >
                            {r.itemName || '—'}
                          </td>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                              textAlign: 'right',
                            }}
                          >
                            {safeNumber(r.qty).toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #f3f4f6',
                              textAlign: 'right',
                            }}
                          >
                            {safeNumber(r.total).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 18,
                    marginTop: 8,
                    fontWeight: 900,
                  }}
                >
                  <div>
                    Accessories Total:{' '}
                    {filteredAccessoryRows
                      .reduce((sum, r) => sum + safeNumber(r.total), 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  borderTop: '1px dashed #e5e7eb',
                  paddingTop: 10,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontWeight: 900,
                }}
              >
                Grand Total:{' '}
                {(
                  filteredMobileRows.reduce(
                    (sum, r) => sum + safeNumber(r.total),
                    0
                  ) +
                  filteredAccessoryRows.reduce(
                    (sum, r) => sum + safeNumber(r.total),
                    0
                  )
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Invoice Search Modal */}
      {showInvoiceSearchModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                borderBottom: '1px solid #e9ecef',
                paddingBottom: '15px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: '#2d3748',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <i className="fa fa-search" style={{ color: '#667eea' }}></i>
                Find Invoice
              </h3>
              <button
                onClick={() => setShowInvoiceSearchModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6c757d',
                  padding: '5px',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Search Invoice
              </label>

              {/* Invoice Dropdown */}
              <div style={{ marginBottom: '15px' }}>
                <Select
                  value={
                    invoiceSearchNumber
                      ? invoiceOptions.find(
                          (opt) => opt.value === invoiceSearchNumber
                        ) || null
                      : null
                  }
                  onChange={(option) => {
                    if (option) {
                      setInvoiceSearchNumber(option.value);
                      // If we have the full invoice data, we can directly show it
                      if (option.invoice) {
                        setSearchedInvoiceData(option.invoice);
                      } else {
                        // Otherwise, trigger a search
                        handleInvoiceSearch(option.value);
                      }
                    } else {
                      setInvoiceSearchNumber('');
                      setSearchedInvoiceData(null);
                    }
                  }}
                  options={invoiceOptions}
                  placeholder={
                    isLoadingInvoices
                      ? 'Loading invoices...'
                      : 'Select from all invoices (search by number, customer, or amount)'
                  }
                  noOptionsMessage={() => 'No invoices found'}
                  isLoading={isLoadingInvoices}
                  isClearable
                  isSearchable
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base, state) => ({
                      ...base,
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      minHeight: '48px',
                      boxShadow: state.isFocused ? '0 0 0 1px #667eea' : 'none',
                      '&:hover': {
                        borderColor: '#667eea',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#667eea'
                        : state.isFocused
                          ? '#f8f9fa'
                          : 'white',
                      color: state.isSelected ? 'white' : '#495057',
                      cursor: 'pointer',
                      '&:active': {
                        backgroundColor: state.isSelected
                          ? '#667eea'
                          : '#e9ecef',
                      },
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#495057',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#6c757d',
                    }),
                  }}
                  formatOptionLabel={(option, { context }) => {
                    if (context === 'menu') {
                      // For menu display, show full details
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#667eea' }}>
                            {option.label.split(' - ')[0]}
                          </div>
                          <div style={{ color: '#6c757d', fontSize: '14px' }}>
                            {option.label.split(' - ').slice(1).join(' - ')}
                          </div>
                        </div>
                      );
                    }
                    // For selected value display, show just the invoice number
                    return option.label.split(' - ')[0];
                  }}
                />
              </div>

              {/* Manual Input */}
              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}
                >
                  — OR —
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Enter invoice number manually (e.g., INV-123456)"
                    value={invoiceSearchNumber}
                    onChange={(e) => setInvoiceSearchNumber(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleInvoiceSearch();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                    onBlur={(e) => (e.target.style.borderColor = '#e9ecef')}
                  />
                  <button
                    onClick={handleInvoiceSearch}
                    disabled={isSearchingInvoice || !invoiceSearchNumber.trim()}
                    style={{
                      padding: '12px 24px',
                      backgroundColor:
                        isSearchingInvoice || !invoiceSearchNumber.trim()
                          ? '#6c757d'
                          : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor:
                        isSearchingInvoice || !invoiceSearchNumber.trim()
                          ? 'not-allowed'
                          : 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    {isSearchingInvoice ? (
                      <>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid #ffffff',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        ></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-search"></i>
                        Search
                      </>
                    )}
                  </button>
                  {invoiceSearchNumber && (
                    <button
                      onClick={clearInvoiceSearch}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchedInvoiceData && (
              <div
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e9ecef',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 15px 0',
                    color: '#28a745',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fa fa-check-circle"></i>
                  Invoice Found
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    marginBottom: '20px',
                  }}
                >
                  {/* Basic Invoice Info */}
                  <div>
                    <strong style={{ color: '#495057' }}>
                      Invoice Number:
                    </strong>
                    <div
                      style={{
                        color: '#667eea',
                        fontWeight: '600',
                        marginTop: '4px',
                      }}
                    >
                      {searchedInvoiceData.invoiceNumber || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#495057' }}>Sale Type:</strong>
                    <div style={{ color: '#495057', marginTop: '4px' }}>
                      {searchedInvoiceData.phoneDetails?.saleType
                        ? searchedInvoiceData.phoneDetails.saleType
                            .charAt(0)
                            .toUpperCase() +
                          searchedInvoiceData.phoneDetails.saleType.slice(1)
                        : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#495057' }}>Customer:</strong>
                    <div style={{ color: '#495057', marginTop: '4px' }}>
                      {searchedInvoiceData.customerName || 'N/A'}
                      {searchedInvoiceData.customerNumber && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6c757d',
                            marginTop: '2px',
                          }}
                        >
                          {searchedInvoiceData.customerNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#495057' }}>Sale Date:</strong>
                    <div style={{ color: '#495057', marginTop: '4px' }}>
                      {searchedInvoiceData.saleDate
                        ? new Date(
                            searchedInvoiceData.saleDate
                          ).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>

                  {/* Phone Details */}
                  {searchedInvoiceData.phoneDetails?.phoneInfo && (
                    <>
                      <div>
                        <strong style={{ color: '#495057' }}>Phone:</strong>
                        <div style={{ color: '#495057', marginTop: '4px' }}>
                          {
                            searchedInvoiceData.phoneDetails.phoneInfo
                              .companyName
                          }{' '}
                          {searchedInvoiceData.phoneDetails.phoneInfo.modelName}
                          {searchedInvoiceData.phoneDetails.phoneInfo.color && (
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                              Color:{' '}
                              {searchedInvoiceData.phoneDetails.phoneInfo.color}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: '#495057' }}>
                          Specifications:
                        </strong>
                        <div
                          style={{
                            color: '#495057',
                            marginTop: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {searchedInvoiceData.phoneDetails.phoneInfo
                            .ramMemory && (
                            <div>
                              RAM:{' '}
                              {
                                searchedInvoiceData.phoneDetails.phoneInfo
                                  .ramMemory
                              }
                            </div>
                          )}
                          {searchedInvoiceData.phoneDetails.phoneInfo
                            .specifications && (
                            <div>
                              Storage:{' '}
                              {
                                searchedInvoiceData.phoneDetails.phoneInfo
                                  .specifications
                              }
                            </div>
                          )}
                          {searchedInvoiceData.phoneDetails.phoneInfo
                            .batteryHealth && (
                            <div>
                              Battery:{' '}
                              {
                                searchedInvoiceData.phoneDetails.phoneInfo
                                  .batteryHealth
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* IMEI Information */}
                  {(searchedInvoiceData.phoneDetails?.phoneInfo?.imei1 ||
                    searchedInvoiceData.phoneDetails?.phoneInfo
                      ?.imeiDetails) && (
                    <div>
                      <strong style={{ color: '#495057' }}>IMEI:</strong>
                      <div
                        style={{
                          color: '#495057',
                          marginTop: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {searchedInvoiceData.phoneDetails.phoneInfo
                          .imeiDetails ? (
                          // Bulk sale - multiple IMEIs
                          searchedInvoiceData.phoneDetails.phoneInfo.imeiDetails.map(
                            (imei, idx) => (
                              <div key={idx} style={{ marginBottom: '4px' }}>
                                {imei.imei1}
                                {imei.imei2 && ` / ${imei.imei2}`}
                              </div>
                            )
                          )
                        ) : (
                          // Single sale - one IMEI
                          <div>
                            {searchedInvoiceData.phoneDetails.phoneInfo.imei1}
                            {searchedInvoiceData.phoneDetails.phoneInfo.imei2 &&
                              ` / ${searchedInvoiceData.phoneDetails.phoneInfo.imei2}`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Financial Information */}
                  <div>
                    <strong style={{ color: '#495057' }}>Sale Price:</strong>
                    <div
                      style={{
                        color: '#28a745',
                        fontWeight: '600',
                        marginTop: '4px',
                      }}
                    >
                      Rs.{' '}
                      {(
                        searchedInvoiceData.salePrice ||
                        searchedInvoiceData.phoneDetails?.pricing?.salePrice ||
                        0
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#495057' }}>Total Invoice:</strong>
                    <div
                      style={{
                        color: '#28a745',
                        fontWeight: '600',
                        marginTop: '4px',
                      }}
                    >
                      Rs.{' '}
                      {(
                        searchedInvoiceData.totalInvoice ||
                        searchedInvoiceData.phoneDetails?.pricing
                          ?.totalInvoice ||
                        0
                      ).toLocaleString()}
                    </div>
                  </div>

                  {/* Profit Information */}
                  {searchedInvoiceData.phoneDetails?.saleInfo?.profit && (
                    <div>
                      <strong style={{ color: '#495057' }}>Profit:</strong>
                      <div
                        style={{
                          color:
                            searchedInvoiceData.phoneDetails.saleInfo.profit >=
                            0
                              ? '#28a745'
                              : '#dc3545',
                          fontWeight: '600',
                          marginTop: '4px',
                        }}
                      >
                        Rs.{' '}
                        {searchedInvoiceData.phoneDetails.saleInfo.profit.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <strong style={{ color: '#495057' }}>Status:</strong>
                    <div style={{ marginTop: '4px' }}>
                      <span
                        style={{
                          backgroundColor: searchedInvoiceData.isReturned
                            ? '#dc3545'
                            : '#28a745',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {searchedInvoiceData.isReturned ? 'Returned' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purchase Information (if available) */}
                {searchedInvoiceData.phoneDetails?.purchaseInfo && (
                  <div
                    style={{
                      marginTop: '20px',
                      paddingTop: '15px',
                      borderTop: '1px solid #e9ecef',
                    }}
                  >
                    <h5 style={{ color: '#495057', marginBottom: '10px' }}>
                      <i
                        className="fa fa-shopping-cart"
                        style={{ marginRight: '8px' }}
                      ></i>
                      Purchase Information
                    </h5>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                        fontSize: '13px',
                      }}
                    >
                      {searchedInvoiceData.phoneDetails.purchaseInfo
                        .purchaseDate && (
                        <div>
                          <strong>Purchase Date:</strong>
                          <div style={{ marginTop: '2px' }}>
                            {new Date(
                              searchedInvoiceData.phoneDetails.purchaseInfo.purchaseDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      {searchedInvoiceData.phoneDetails.purchaseInfo
                        .purchasePrice && (
                        <div>
                          <strong>Purchase Price:</strong>
                          <div style={{ marginTop: '2px', color: '#dc3545' }}>
                            Rs.{' '}
                            {searchedInvoiceData.phoneDetails.purchaseInfo.purchasePrice.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {searchedInvoiceData.phoneDetails.purchaseInfo
                        .fatherName && (
                        <div>
                          <strong>Supplier:</strong>
                          <div style={{ marginTop: '2px' }}>
                            {
                              searchedInvoiceData.phoneDetails.purchaseInfo
                                .fatherName
                            }
                          </div>
                        </div>
                      )}
                      {searchedInvoiceData.phoneDetails.purchaseInfo
                        .mobileNumber && (
                        <div>
                          <strong>Supplier Contact:</strong>
                          <div style={{ marginTop: '2px' }}>
                            {
                              searchedInvoiceData.phoneDetails.purchaseInfo
                                .mobileNumber
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accessories (if any) */}
                {searchedInvoiceData.phoneDetails?.accessories &&
                  searchedInvoiceData.phoneDetails.accessories.length > 0 && (
                    <div
                      style={{
                        marginTop: '20px',
                        paddingTop: '15px',
                        borderTop: '1px solid #e9ecef',
                      }}
                    >
                      <h5 style={{ color: '#495057', marginBottom: '10px' }}>
                        <i
                          className="fa fa-plug"
                          style={{ marginRight: '8px' }}
                        ></i>
                        Accessories Sold (
                        {searchedInvoiceData.phoneDetails.accessories.length})
                      </h5>
                      <div
                        style={{
                          display: 'grid',
                          gap: '8px',
                          fontSize: '13px',
                        }}
                      >
                        {searchedInvoiceData.phoneDetails.accessories.map(
                          (accessory, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                              }}
                            >
                              <div>
                                <strong>
                                  {accessory.accessoryName ||
                                    accessory.name ||
                                    'Accessory'}
                                </strong>
                                {accessory.quantity && (
                                  <span> (Qty: {accessory.quantity})</span>
                                )}
                              </div>
                              {accessory.perPiecePrice && (
                                <div
                                  style={{
                                    color: '#28a745',
                                    fontWeight: '600',
                                  }}
                                >
                                  Rs. {accessory.perPiecePrice.toLocaleString()}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      // Navigate to sales page
                      window.location.href = '/sales/sales';
                      setShowInvoiceSearchModal(false);
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <i className="fa fa-eye"></i>
                    View Full Details
                  </button>

                  {/* Show phone picture if available */}
                  {searchedInvoiceData.phoneDetails?.phoneInfo
                    ?.phonePicture && (
                    <button
                      onClick={() => {
                        window.open(
                          searchedInvoiceData.phoneDetails.phoneInfo
                            .phonePicture,
                          '_blank'
                        );
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <i className="fa fa-image"></i>
                      View Phone Image
                    </button>
                  )}

                  {/* Show CNIC images if available */}
                  {(searchedInvoiceData.phoneDetails?.saleInfo?.cnicFrontPic ||
                    searchedInvoiceData.phoneDetails?.saleInfo
                      ?.cnicBackPic) && (
                    <button
                      onClick={() => {
                        const frontPic =
                          searchedInvoiceData.phoneDetails.saleInfo
                            .cnicFrontPic;
                        const backPic =
                          searchedInvoiceData.phoneDetails.saleInfo.cnicBackPic;
                        if (frontPic) window.open(frontPic, '_blank');
                        if (backPic)
                          setTimeout(() => window.open(backPic, '_blank'), 500);
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <i className="fa fa-id-card"></i>
                      View CNIC
                    </button>
                  )}

                  {!searchedInvoiceData.isReturned && (
                    <button
                      onClick={() => {
                        // You could implement return functionality here or navigate to sales page
                        alert(
                          'Return functionality can be implemented in the sales page'
                        );
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <i className="fa fa-undo"></i>
                      Return Invoice
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Help Text */}
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#e7f3ff',
                borderRadius: '8px',
                border: '1px solid #b3d9ff',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: '#495057',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                <i
                  className="fa fa-info-circle"
                  style={{ marginRight: '8px' }}
                ></i>
                How to Search
              </div>
              <div style={{ fontSize: '13px', color: '#6c757d' }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Option 1:</strong> Search and select from all invoices
                  in the dropdown above (shows invoice number, customer, and
                  amount)
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Option 2:</strong> Enter invoice number manually below
                  (e.g., INV-123456)
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#28a745',
                    fontWeight: '500',
                  }}
                >
                  <i
                    className="fa fa-lightbulb-o"
                    style={{ marginRight: '5px' }}
                  ></i>
                  Get complete phone details, purchase history, IMEI info, and
                  images!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default DashDefault;
