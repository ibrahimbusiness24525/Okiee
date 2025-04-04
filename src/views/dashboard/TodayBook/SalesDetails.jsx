import React from "react";

const SalesDetail = () => {
  // Example sales data
  const singleSalePrice = 1400; // Selling price of one phone
  const bulkQuantity = 10; // Bulk sale quantity
  const bulkDiscount = 0.1; // 10% discount on bulk sale

  const bulkSalePricePerUnit = singleSalePrice * (1 - bulkDiscount);
  const bulkTotalRevenue = bulkSalePricePerUnit * bulkQuantity;
  const singleTotalRevenue = singleSalePrice * bulkQuantity;

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
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Sales Detail</h1>

      {/* Single Sale */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Single Phone Sale</h2>
        <p>Price per phone:</p>
        <p style={priceText}>${singleSalePrice}</p>
      </div>

      {/* Bulk Sale */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Bulk Sale</h2>
        <p>Discounted Price per phone:</p>
        <p style={greenText}>${bulkSalePricePerUnit.toFixed(2)}</p>
        <p style={{ fontSize: "14px", color: "green" }}>
          ({bulkDiscount * 100}% Discount)
        </p>
      </div>


      {/* Revenue Comparison */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Total Revenue Comparison</h2>
        <p>Selling {bulkQuantity} phones:</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Without Bulk Discount:</p>
          <p style={redText}>${singleTotalRevenue}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>With Bulk Discount:</p>
          <p style={greenText}>${bulkTotalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesDetail;
