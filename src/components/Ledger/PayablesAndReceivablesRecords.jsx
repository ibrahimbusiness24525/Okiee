import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";

const PayablesAndReceivablesRecords = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonDetail = async () => {
      try {
        const response = await api.get(`/api/person/${id}`);
        setPerson(response.data.person);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Failed to fetch person detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!person) return <p>Person not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        {person.name}'s Credit Summary
      </h2>

      <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <p><strong>Phone:</strong> {person.number}</p>
        <p><strong>Reference:</strong> {person.reference}</p>
        <p><strong>Status:</strong> {person.status}</p>

        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          <div style={{ background: "#fef2f2", padding: "10px", borderRadius: "6px" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#b91c1c" }}>Taking Credit</p>
            <p style={{ margin: 0, fontWeight: "bold", color: "#b91c1c" }}>
              {person.takingCredit.toLocaleString()} PKR
            </p>
          </div>
          <div style={{ background: "#ecfdf5", padding: "10px", borderRadius: "6px" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#047857" }}>Giving Credit</p>
            <p style={{ margin: 0, fontWeight: "bold", color: "#047857" }}>
              {person.givingCredit.toLocaleString()} PKR
            </p>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
          {transactions.map((tx, idx) => (
            <div
              key={tx._id}
              style={{
                padding: "12px",
                border: "1px solid #eee",
                marginBottom: "10px",
                borderRadius: "6px",
                backgroundColor: "#f9fafb",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px" }}>
                <strong>Taking:</strong> {tx.takingCredit.toLocaleString()} PKR
              </p>
              <p style={{ margin: 0, fontSize: "14px" }}>
                <strong>Giving:</strong> {tx.givingCredit.toLocaleString()} PKR
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayablesAndReceivablesRecords;
