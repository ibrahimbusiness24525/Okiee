import React, { useEffect, useState } from "react";
import { api } from "../../../../api/api";

const PurchaseDetail = () => {
  const [todayBookData, setTodayBookData] = useState({});

  const getTodayBook = async () => {
    try {
      const response = await api.get(`/api/dayBook/todayBook`);
      setTodayBookData(response?.data?.data || {});
    } catch (error) {
    }
  };

  useEffect(() => {
    getTodayBook();
  }, []);

  // Calculations
  const totalPurchasePrice =
    (todayBookData?.purchasedSinglePhone?.reduce(
      (acc, phone) =>
        acc +
        (Number(phone.price?.purchasePrice) ||
          Number(phone.purchasePrice) ||
          0),
      0
    ) || 0) +
    (todayBookData?.purchaseBulkPhone?.reduce(
      (price, phone) => price + (Number(phone.prices?.buyingPrice) || 0),
      0
    ) || 0);

  const totalInvoices =
    (todayBookData?.soldSinglePhone?.reduce(
      (acc, phone) => acc + (phone.totalInvoice || 0),
      0
    ) || 0) +
    (todayBookData?.soldBulkPhone?.reduce(
      (acc, phone) => acc + (phone.totalInvoice || 0),
      0
    ) || 0);

  const totalBulkInvoices =
    todayBookData?.soldBulkPhone?.reduce(
      (acc, phone) => acc + (phone.totalInvoice || 0),
      0
    ) || 0;

  // Ledger calculations (iterate over all ledger entries)
  const totalCashPaid =
    todayBookData?.ledger?.reduce((acc, entry) => acc + (entry.cashPaid || 0), 0) || 0;
  const totalCashReceived =
    todayBookData?.ledger?.reduce((acc, entry) => acc + (entry.cashReceived || 0), 0) || 0;
  const totalOpeningCash =
    todayBookData?.ledger?.reduce((acc, entry) => acc + (entry.openingCash || 0), 0) || 0;
  const totalClosingCash =
    todayBookData?.ledger?.reduce((acc, entry) => acc + (entry.closingCash || 0), 0) || 0;
  const totalExpenses =
    todayBookData?.ledger?.reduce((acc, entry) => acc + (entry.expense || 0), 0) || 0;

  const profit = totalInvoices - totalPurchasePrice - totalExpenses;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
        📊 Purchase Detail Summary
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Card title="🛒 Total Purchase Price" value={totalPurchasePrice} />
        <Card title="📄 Total Invoices" value={totalInvoices} />
        <Card title="🧾 Bulk Invoices" value={totalBulkInvoices} />
        
        {/* Ledger-related Cards */}
        <Card title="💸 Total Cash Paid" value={totalCashPaid} />
        <Card title="💰 Total Cash Received" value={totalCashReceived} />
        <Card title="🔓 Total Opening Cash" value={totalOpeningCash} />
        <Card title="🔒 Total Closing Cash" value={totalClosingCash} />
        
        <Card title="💧 Total Expenses" value={totalExpenses} />
        
        <Card
          title="📈 Profit / Loss"
          value={profit}
          style={{ color: profit >= 0 ? "green" : "red" }}
        />
      </div>
    </div>
  );
};

// Card Component for reuse
const Card = ({ title, value, style = {} }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 0 8px rgba(0,0,0,0.05)",
      }}
    >
      <h4 style={{ margin: "0 0 0.5rem 0", color: "#555" }}>{title}</h4>
      <p
        style={{
          fontSize: "1.3rem",
          fontWeight: "bold",
          margin: 0,
          ...style,
        }}
      >
        {value.toLocaleString()}
      </p>
     </div>
  );
};

export default PurchaseDetail;
