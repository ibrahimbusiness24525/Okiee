import React from "react";

const LedgerDetail = () => {
  // Dummy data for ledger details and transactions
  const ledgerInfo = {
    accountName: "John Doe",
    balance: "$5,000",
    accountNumber: "123456789",
    lastUpdated: "Feb 12, 2025",
  };

  const transactions = [
    { id: 1, date: "2025-02-10", description: "Purchase", amount: "-$200" },
    { id: 2, date: "2025-02-08", description: "Salary Credit", amount: "+$3,000" },
    { id: 3, date: "2025-02-05", description: "Utility Bill", amount: "-$100" },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Ledger Details</h2>
      <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <p><strong>Account Name:</strong> {ledgerInfo.accountName}</p>
        <p><strong>Balance:</strong> {ledgerInfo.balance}</p>
        <p><strong>Account Number:</strong> {ledgerInfo.accountNumber}</p>
        <p><strong>Last Updated:</strong> {ledgerInfo.lastUpdated}</p>
      </div>
      <h3>Transactions</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Date</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Description</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td style={{ padding: "10px", textAlign: "center" }}>{txn.date}</td>
              <td style={{ padding: "10px" }}>{txn.description}</td>
              <td style={{ padding: "10px", textAlign: "right" }}>{txn.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerDetail;