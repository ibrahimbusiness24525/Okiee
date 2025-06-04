import React, { useState } from "react";
import Modal from "components/Modal/Modal";
import { FaTools, FaHashtag, FaDollarSign } from "react-icons/fa";

const AddAccessory = () => {
  const [showModal, setShowModal] = useState(false);
  const [accessoryData, setAccessoryData] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  const [accessoryList, setAccessoryList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAccessoryList([...accessoryList, accessoryData]);
    setAccessoryData({ name: "", quantity: "", price: "" });
    setShowModal(false);
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ fontSize: "30px", fontWeight: "700", marginBottom: "24px", color: "#111827" }}>
        🎯 Accessories Manager
      </h2>

      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: "14px 28px",
          background: "linear-gradient(to right, #2563eb, #3b82f6)",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
          marginBottom: "30px",
        }}
      >
        + Add Accessory
      </button>

      {/* Modal */}
      <Modal size="sm" show={showModal} toggleModal={() => setShowModal(false)}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px", color: "#111827" }}>
          Add New Accessory
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            <label style={labelStyle}>Accessory Name *</label>
            {/* <FaTools style={iconStyle} /> */}
            <input
              type="text"
              value={accessoryData.name}
              onChange={(e) => setAccessoryData({ ...accessoryData, name: e.target.value })}
              placeholder="Enter accessory name"
              required
              style={inputStyle}
            />
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            <label style={labelStyle}>Quantity *</label>
            {/* <FaHashtag style={iconStyle} /> */}
            <input
              type="number"
              value={accessoryData.quantity}
              onChange={(e) => setAccessoryData({ ...accessoryData, quantity: e.target.value })}
              placeholder="Enter quantity"
              required
              min="1"
              style={inputStyle}
            />
          </div>

          {/* Price */}
          <div style={{ marginBottom: "32px", position: "relative" }}>
            <label style={labelStyle}>Per Piece Price *</label>
            {/* <FaDollarSign style={iconStyle} /> */}
            <input
              type="number"
              value={accessoryData.price}
              onChange={(e) => setAccessoryData({ ...accessoryData, price: e.target.value })}
              placeholder="Enter price"
              required
              min="0"
              step="0.01"
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "14px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
            <button type="submit" style={submitButtonStyle}>
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* List Display */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px" }}>
          📋 Accessory List
        </h3>
        {accessoryList.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No accessories added yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {accessoryList.map((item, index) => (
              <li
                key={index}
                style={{
                  padding: "16px 20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  backgroundColor: "#f3f4f6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: "14px", color: "#4b5563" }}>
                    {item.quantity} pcs × ${item.price}
                  </div>
                </div>
                <span
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  ${item.quantity * item.price}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddAccessory;

// 🔧 Inline Style Definitions
const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "15px",
  fontWeight: "600",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "12px 12px 12px 42px",
  border: "2px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const iconStyle = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#9ca3af",
  fontSize: "18px",
};

const cancelButtonStyle = {
  padding: "12px 24px",
  border: "2px solid #d1d5db",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const submitButtonStyle = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(to right, #10b981, #059669)",
  color: "white",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background 0.3s ease-in-out",
};
