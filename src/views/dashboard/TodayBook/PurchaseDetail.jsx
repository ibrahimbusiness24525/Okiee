import React from "react";

const PurchaseDetail = () => {
  // Example data
  const singlePrice = 1200; // Price of one phone
  const bulkQuantity = 10; // Number of phones in bulk purchase
  const bulkDiscount = 0.15; // 15% discount on bulk purchase

  const bulkPricePerUnit = singlePrice * (1 - bulkDiscount);
  const bulkTotalPrice = bulkPricePerUnit * bulkQuantity;
  const singleTotalPrice = singlePrice * bulkQuantity;

  // Inline styles
  const containerStyle = {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    textAlign: "center",
  };

  const cardStyle = {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "15px",
  };

  const priceText = { fontSize: "18px", fontWeight: "bold" };
  const greenText = { color: "green", fontWeight: "bold" };
  const redText = { color: "red", fontWeight: "bold" };
  const blueText = { color: "blue", fontWeight: "bold", marginTop: "10px" };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Purchase Detail</h1>

      {/* Single Purchase */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Single Phone</h2>
        <p>Price per phone:</p>
        <p style={priceText}>${singlePrice}</p>
      </div>

      {/* Bulk Purchase */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Bulk Purchase</h2>
        <p>Discounted Price per phone:</p>
        <p style={greenText}>${bulkPricePerUnit.toFixed(2)}</p>
        <p style={{ fontSize: "14px", color: "green" }}>
          ({bulkDiscount * 100}% Discount)
        </p>
      </div>

      {/* Cost Comparison */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Total Cost Comparison</h2>
        <p>Buying {bulkQuantity} phones:</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Without Bulk :</p>
          <p style={redText}>${singleTotalPrice}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>With Bulk :</p>
          <p style={greenText}>${bulkTotalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetail;
