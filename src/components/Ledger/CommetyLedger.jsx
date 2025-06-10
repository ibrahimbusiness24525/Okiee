"use client"

import { useState } from "react"
import { api } from "../../../api/api"
import { toast } from "react-toastify"

const CommetyLedger = () => {
  const [formData, setFormData] = useState({
    committeeName: "",
    totalAmount: 0,
    numberOfMembers: 0,
    myComitteeNameNumber: 0,
    headName: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]:
        name === "totalAmount" || name === "numberOfMembers" || name === "myComitteeNameNumber" ? Number(value) : value,
    })
  }

  const createCommittee = async () => {
    const payload = {
      committeeName: formData.committeeName,
      totalAmount: formData.totalAmount,
      numberOfMembers: formData.numberOfMembers,
      myComitteeNameNumber: formData.myComitteeNameNumber,
      headName: formData.headName,
    }
    console.log("Committee payload", payload)
    try {
      const response = await api.post("/api/committee/createCommittee", payload)
      console.log("Committee created", response)
      toast.success("Committee Created Successfully")
    } catch (error) {
      console.log("Error in creating committee", error)
    }
  }

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  }

  const formStyle = {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    width: "100%",
    maxWidth: "480px",
    border: "1px solid #e5e7eb",
  }

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: "32px",
    letterSpacing: "-0.025em",
  }

  const fieldStyle = {
    marginBottom: "24px",
  }

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
    lineHeight: "1.25",
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  }

  const inputFocusStyle = {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  }

  const buttonStyle = {
    width: "100%",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    marginTop: "8px",
  }

  const buttonHoverStyle = {
    backgroundColor: "#2563eb",
    transform: "translateY(-1px)",
  }

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={titleStyle}>Create Committee</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Committee Name</label>
          <input
            type="text"
            name="committeeName"
            value={formData.committeeName}
            onChange={handleChange}
            placeholder="Enter committee name"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: "#d1d5db", boxShadow: "none" })}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Total Amount</label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            placeholder="0"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: "#d1d5db", boxShadow: "none" })}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Number of Members</label>
          <input
            type="number"
            name="numberOfMembers"
            value={formData.numberOfMembers}
            onChange={handleChange}
            placeholder="0"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: "#d1d5db", boxShadow: "none" })}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>My Committee Number</label>
          <input
            type="number"
            name="myComitteeNameNumber"
            value={formData.myComitteeNameNumber}
            onChange={handleChange}
            placeholder="0"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: "#d1d5db", boxShadow: "none" })}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Head Name</label>
          <input
            type="text"
            name="headName"
            value={formData.headName}
            onChange={handleChange}
            placeholder="Enter head name"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: "#d1d5db", boxShadow: "none" })}
          />
        </div>

        <button
          onClick={createCommittee}
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#3b82f6", transform: "none" })}
        >
          Create Committee
        </button>
      </div>
    </div>
  )
}

export default CommetyLedger
