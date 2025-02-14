import { StyledHeading } from "components/StyledHeading/StyledHeading";
import { BASE_URL } from "config/constant";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LedgerDetail = () => {
  const [ledgerDetail, setLedgerDetail] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getLedgerDetail();
  }, []);

  const getLedgerDetail = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/ledger/detail/${id}`);
      const data = await response.json();
      setLedgerDetail(data.ledger); // Ensure we store only the ledger object
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  };

  if (!ledgerDetail) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", margin: "0 auto" }}>
      <StyledHeading>Ledger Details</StyledHeading>

      {/* Ledger Summary */}
      <div style={{ border: "1px solid #ddd",marginTop:"2rem", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <p><strong>Opening Cash:</strong> ${ledgerDetail.openingCash}</p>
        <p><strong>Closing Cash:</strong> ${ledgerDetail.closingCash}</p>
        <p><strong>Total Cash Paid:</strong> ${ledgerDetail.cashPaid}</p>
        <p><strong>Total Cash Received:</strong> ${ledgerDetail.cashReceived}</p>
        <p><strong>Total Expenses:</strong> ${ledgerDetail.expense}</p>
        {/* <p><strong>Last Updated:</strong> {new Date(ledgerDetail.updatedAt).toLocaleString()}</p> */}
      </div>

      {/* Cash Paid Details */}
      <h3>Cash Paid Details</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Recipient</th>
            <th style={tableHeaderStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {ledgerDetail.cashPaidDetails.map((item) => (
            <tr key={item._id}>
              <td style={tableCellStyle}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={tableCellStyle}>{item.recipient}</td>
              <td style={tableCellStyle}>${item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cash Received Details */}
      <h3>Cash Received Details</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Source</th>
            <th style={tableHeaderStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {ledgerDetail.cashReceivedDetails.map((item) => (
            <tr key={item._id}>
              <td style={tableCellStyle}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={tableCellStyle}>{item.source}</td>
              <td style={tableCellStyle}>${item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Expense Details */}
      <h3>Expense Details</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Purpose</th>
            <th style={tableHeaderStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {ledgerDetail.expenseDetails.map((item) => (
            <tr key={item._id}>
              <td style={tableCellStyle}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={tableCellStyle}>{item.purpose}</td>
              <td style={tableCellStyle}>${item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles for table headers and cells
const tableHeaderStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
  background: "#f4f4f4",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

export default LedgerDetail;
