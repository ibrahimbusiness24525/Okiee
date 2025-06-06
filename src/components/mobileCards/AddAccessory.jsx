import React, { useState, useEffect } from "react";
import Modal from "components/Modal/Modal";
import { api } from "../../../api/api";
import { toast } from "react-toastify";
import { useGetAccessories } from "hooks/accessory";

const AddAccessory = () => {
  const [showModal, setShowModal] = useState(false);
  const { data } = useGetAccessories();
  const [accessoryData, setAccessoryData] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  const [accessoryList, setAccessoryList] = useState([]);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const res = await api.get("/api/accessory");
        setAccessoryList(res.data);
      } catch (error) {
        console.error("Error fetching accessories", error);
      }
    };

    fetchAccessories();
  }, []);
console.log('====================================');
console.log("Accessories list", accessoryList);
console.log('====================================');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalPrice = Number(accessoryData.quantity) * Number(accessoryData.price);
      const res = await api.post("/api/accessory/create", {
        accessoryName: accessoryData.name,
        quantity: Number(accessoryData.quantity),
        perPiecePrice: Number(accessoryData.price),
        totalPrice,
        stock: Number(accessoryData.quantity),
      });

      setAccessoryList([...accessoryList, res.data]);
      toast.success("Accessory added successfully!");
      setAccessoryData({ name: "", quantity: "", price: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding accessory", error);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        maxWidth: "1000px",
        margin: "0 auto",
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
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Accessory Name *
            </label>
            <input
              type="text"
              value={accessoryData.name}
              onChange={(e) => setAccessoryData({ ...accessoryData, name: e.target.value })}
              placeholder="Enter accessory name"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Quantity *
            </label>
            <input
              type="number"
              value={accessoryData.quantity}
              onChange={(e) => setAccessoryData({ ...accessoryData, quantity: e.target.value })}
              placeholder="Enter quantity"
              required
              min="1"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Per Piece Price *
            </label>
            <input
              type="number"
              value={accessoryData.price}
              onChange={(e) => setAccessoryData({ ...accessoryData, price: e.target.value })}
              placeholder="Enter price"
              required
              min="0"
              step="0.01"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: "12px 24px",
                border: "2px solid #d1d5db",
                borderRadius: "8px",
                backgroundColor: "white",
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: "linear-gradient(to right, #10b981, #059669)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* Layout */}
      <div
  style={{
    flex: "1",
    minWidth: "280px",
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
    height: "fit-content",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: "2px solid #f1f5f9",
    }}
  >
    <span style={{ fontSize: "24px", marginRight: "12px" }}>🗂</span>
    <h3
      style={{
        fontSize: "24px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
      }}
    >
      Accessory Categories
    </h3>
  </div>

  {data?.data?.length > 0 ? (
    <div style={{ display: "grid", gap: "16px" }}>
      {data.data.map((accessory, index) => (
        <div
          key={index}
          style={{
            padding: "20px",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            backgroundColor: "#fefefe",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gradient accent */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              height: "4px",
              background: "linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)",
            }}
          />

          <div style={{ marginBottom: "12px" }}>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1e293b",
                margin: "0 0 4px 0",
              }}
            >
              {accessory.accessoryName}
            </h4>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#475569",
              }}
            >
              Category ID: {accessory.id}
            </div>
          </div>

          {/* Optional Stock Info if applicable */}
          {accessory.stock !== undefined && (
            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Stock Available
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color:
                      accessory.stock < 10 ? "#ef4444" : "#059669",
                  }}
                >
                  {accessory.stock} units
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      accessory.stock < 10 ? "#ef4444" : "#10b981",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color:
                      accessory.stock < 10 ? "#ef4444" : "#059669",
                  }}
                >
                  {accessory.stock < 10 ? "Low Stock" : "In Stock"}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "#64748b",
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>❌</div>
      <p style={{ fontSize: "16px", fontStyle: "italic" }}>
        No categories found.
      </p>
    </div>
  )}
</div>

    </div>
  );
};

export default AddAccessory;
  