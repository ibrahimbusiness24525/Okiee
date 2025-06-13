import { useEffect, useState } from "react";
import { api } from "../../../api/api";

const PocketCashTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    try {
      const response = await api.get('/api/pocketCash/get');
      setTransactions(response?.data?.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }
  useEffect(() => {
    getTransactions();
  }, []);

  console.log('Transactions:', transactions);

  // Static data for demonstration
  const staticTransactions = [
    {
      "_id": "684bae0642865f0ab676a35c",
      "userId": "6773f7840a3a7a3ba3fed833",
      "accountCash": 1200,
      "pocketCashId": {
        "_id": "6832e30beadced8e99463d85",
        "accountCash": 10033600
      },
      "amountAdded": 1200,
      "remainingAmount": 10033600,
      "sourceOfAmountAddition": "ARSHMAN",
      "createdAt": "2025-06-13T04:50:14.854Z",
      "updatedAt": "2025-06-13T04:50:14.854Z",
      "__v": 0
    },
    {
      "_id": "684bae0542865f0ab676a357",
      "userId": "6773f7840a3a7a3ba3fed833",
      "accountCash": 1200,
      "pocketCashId": {
        "_id": "6832e30beadced8e99463d85",
        "accountCash": 10033600
      },
      "amountAdded": 1200,
      "remainingAmount": 10032400,
      "sourceOfAmountAddition": "ARSHMAN",
      "createdAt": "2025-06-13T04:50:13.924Z",
      "updatedAt": "2025-06-13T04:50:13.924Z",
      "__v": 0
    },
    {
      "_id": "684b57448382d5f56057b272",
      "userId": "6773f7840a3a7a3ba3fed833",
      "accountCash": 10031200,
      "pocketCashId": {
        "_id": "6832e30beadced8e99463d85",
        "accountCash": 10033600
      },
      "reasonOfAmountDeduction": "sale of mobile from company: company 2, model: new",
      "amountDeducted": 30000,
      "remainingAmount": 10031200,
      "sourceOfAmountAddition": "Payment for mobile sale",
      "createdAt": "2025-06-12T22:40:04.726Z",
      "updatedAt": "2025-06-12T22:40:04.726Z",
      "__v": 0
    },
    {
      "_id": "684a87318a0a32dc4bd78b34",
      "userId": "6773f7840a3a7a3ba3fed833",
      "accountCash": -1200,
      "pocketCashId": {
        "_id": "6832e30beadced8e99463d85",
        "accountCash": 10033600
      },
      "amountDeducted": 1200,
      "remainingAmount": 10001200,
      "createdAt": "2025-06-12T07:52:17.042Z",
      "updatedAt": "2025-06-12T07:52:17.042Z",
      "__v": 0
    },
    {
      "_id": "684a87258a0a32dc4bd78b2f",
      "userId": "6773f7840a3a7a3ba3fed833",
      "accountCash": 1200,
      "pocketCashId": {
        "_id": "6832e30beadced8e99463d85",
        "accountCash": 10033600
      },
      "amountAdded": 1200,
      "remainingAmount": 10002400,
      "sourceOfAmountAddition": "arshman",
      "createdAt": "2025-06-12T07:52:05.407Z",
      "updatedAt": "2025-06-12T07:52:05.407Z",
      "__v": 0
    }
  ];

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  // Helper to get transaction type and amount
  const getType = (txn) => {
    if (txn.amountAdded) return { type: "Credit", amount: txn.amountAdded, color: "#27ae60" };
    if (txn.amountDeducted) return { type: "Debit", amount: txn.amountDeducted, color: "#c0392b" };
    return { type: txn.accountCash >= 0 ? "Credit" : "Debit", amount: Math.abs(txn.accountCash), color: txn.accountCash >= 0 ? "#27ae60" : "#c0392b" };
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #eee", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Pocket Cash Transactions</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Date</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Type</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Amount</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Source/Reason</th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {staticTransactions.map(txn => {
              const { type, amount, color } = getType(txn);
              return (
                <tr key={txn._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: 10, fontSize: 13 }}>{formatDate(txn.createdAt)}</td>
                  <td style={{ padding: 10, color, fontWeight: 600 }}>{type}</td>
                  <td style={{ padding: 10, color, fontWeight: 600 }}>{amount}</td>
                  <td style={{ padding: 10, fontSize: 13 }}>
                    {txn.sourceOfAmountAddition || txn.reasonOfAmountDeduction || "-"}
                  </td>
                  <td style={{ padding: 10, fontWeight: 500 }}>{txn.remainingAmount ?? txn.accountCash}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
        Showing {staticTransactions.length} of your latest transactions.
      </div>
    </div>
  );
}
export default PocketCashTransactions;