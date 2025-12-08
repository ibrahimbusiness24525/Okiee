import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";

const PartyLedgerDetail = () => {
  const [partyLedgerDetail, setPartyLedgerDetail] = useState(null);
  const { id } = useParams();

  const getPartyLedgerDetail = async () => {
    try {
      const response = await api.get(`/api/partyLedger/bulkPurchase/${id}`);
      setPartyLedgerDetail(response?.data?.data);
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  };

  useEffect(() => {
    getPartyLedgerDetail();
  }, []);

  if (!partyLedgerDetail) {
    return <h2 style={{ textAlign: "center", marginTop: "20px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Party Name */}
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Party - {partyLedgerDetail.partyLedgerId?.partyName}
      </h2>

      {/* Basic Details */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <p><strong>Company:</strong> {partyLedgerDetail.companyName}</p>
        <p><strong>Model:</strong> {partyLedgerDetail.modelName}</p>
        {/* <p><strong>Status:</strong> {partyLedgerDetail.status}</p> */}
        <p><strong>Date:</strong> {new Date(partyLedgerDetail.date).toLocaleDateString()}</p>
      </div>

      {/* Pricing Table */}
      {/* <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={tableHeader}>Buying Price</th>
            <th style={tableHeader}>Dealer Price</th>
            <th style={tableHeader}>LP</th>
            <th style={tableHeader}>Lifting</th>
            <th style={tableHeader}>Promo</th>
            <th style={tableHeader}>Activation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tableCell}>{partyLedgerDetail.prices.buyingPrice}</td>
            <td style={tableCell}>{partyLedgerDetail.prices.dealerPrice}</td>
            <td style={tableCell}>{partyLedgerDetail.prices.lp}</td>
            <td style={tableCell}>{partyLedgerDetail.prices.lifting}</td>
            <td style={tableCell}>{partyLedgerDetail.prices.promo}</td>
            <td style={tableCell}>{partyLedgerDetail.prices.activation}</td>
          </tr>
        </tbody>
      </table> */}

      {/* RAM/SIM Details */}
      <h3 style={{ marginBottom: "10px" }}>RAM/SIM Details</h3>
      {partyLedgerDetail.ramSimDetails.map((detail) => (
        <div key={detail._id} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "10px" }}>
          <p><strong>RAM Memory:</strong> {detail.ramMemory}</p>
          <p><strong>SIM Option:</strong> {detail.simOption}</p>
          {detail.priceOfOne && <p><strong>Price Per Unit:</strong> ${detail.priceOfOne}</p>}
          <p><strong>IMEI Numbers:</strong> {detail.imeiNumbers.join(", ")}</p>
        </div>
      ))}
    </div>
  );
};

// Inline styles
const tableHeader = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ddd"
};

const tableCell = {
  padding: "10px",
  borderBottom: "1px solid #ddd"
};

export default PartyLedgerDetail;
