import React, { useState } from "react";
import { api } from "../../../api/api";
import { toast } from "react-toastify";

const CommetyLedger = () => {
  const [formData, setFormData] = useState({
    committeeName: "",
    totalAmount: 0,
    numberOfMembers: 0,
    myComitteeNameNumber: 0,
    headName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "totalAmount" || name === "numberOfMembers" || name === "myComitteeNameNumber" 
        ? Number(value) 
        : value,
    });
  };

  const createCommittee = async () => {
    const payload = {
      committeeName: formData.committeeName,
      totalAmount: formData.totalAmount,
      numberOfMembers: formData.numberOfMembers,
      myComitteeNameNumber: formData.myComitteeNameNumber,
      headName: formData.headName,
    };
    console.log("Committee payload", payload);
    try {
      const response = await api.post("/api/committee/createCommittee", payload);
      console.log("Committee created", response);
      toast.success("Committee Created Successfully");
    } catch (error) {
      console.log("Error in creating committee", error);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Create Committee</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label htmlFor="">Committee Name</label>
        <input
          type="text"
          name="committeeName"
          value={formData.committeeName}
          onChange={handleChange}
          placeholder="Committee Name"
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      <label htmlFor="">Total Amount</label>
        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          placeholder="Total Amount"
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      <label htmlFor="">Number Of Members</label>
        <input
          type="number"
          name="numberOfMembers"
          value={formData.numberOfMembers}
          onChange={handleChange}
          placeholder="Number of Members"
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      <label htmlFor="">My Comittee Name Number</label>
        <input
          type="number"
          name="myComitteeNameNumber"
          value={formData.myComitteeNameNumber}
          onChange={handleChange}
          placeholder="My Committee Number"
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      <label htmlFor="">Head Name</label>
        <input
          type="text"
          name="headName"
          value={formData.headName}
          onChange={handleChange}
          placeholder="Head Name"
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          onClick={createCommittee}
          style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#5a54b4", color: "white", border: "none", cursor: "pointer" }}
        >
          Create Committee
        </button>
      </div>
    </div>
  );
};

export default CommetyLedger;
