import React, { useState } from "react";

const CommetyLedger = () => {
  const [commetyName, setCommetyName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [members, setMembers] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [ledger, setLedger] = useState([]);

  const handleCreateCommety = () => {
    const count = parseInt(members);
    if (!commetyName || !totalAmount || count <= 0) return;
    const perPerson = (totalAmount / count).toFixed(2);
    const newMembers = Array.from({ length: count }, (_, i) => ({ id: i + 1, name: "", paid: false, amount: perPerson }));
    setMemberList(newMembers);
  };

  const handleMemberUpdate = (id, name) => {
    setMemberList((prev) => prev.map((m) => (m.id === id ? { ...m, name } : m)));
  };

  const handleConfirm = () => {
    if (memberList.some((m) => !m.name.trim())) return;
    const commetyData = {
      id: ledger.length + 1,
      name: commetyName,
      members: memberList,
      openDate: new Date().toLocaleDateString(),
    };
    setLedger([...ledger, commetyData]);
    setCommetyName("");
    setTotalAmount("");
    setMembers("");
    setMemberList([]);
  };

  const handlePayment = (commetyId, memberId) => {
    setLedger((prev) =>
      prev.map((c) =>
        c.id === commetyId
          ? { ...c, members: c.members.map((m) => (m.id === memberId ? { ...m, paid: !m.paid } : m)) }
          : c
      )
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", backgroundColor: "#f9f9f9" }}>
        <h2>Create Commety</h2>
        <input placeholder="Commety Name" value={commetyName} onChange={(e) => setCommetyName(e.target.value)} style={{ width: "100%", margin: "5px 0", padding: "10px" }} />
        <input placeholder="Total Amount" type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} style={{ width: "100%", margin: "5px 0", padding: "10px" }} />
        <input placeholder="Number of Members" type="number" value={members} onChange={(e) => setMembers(e.target.value)} style={{ width: "100%", margin: "5px 0", padding: "10px" }} />
        <button onClick={handleCreateCommety} style={{ width: "100%", padding: "10px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Create</button>
        {memberList.length > 0 && (
          <div>
            <h3>Enter Member Names</h3>
            {memberList.map((m) => (
              <input key={m.id} placeholder={`Member ${m.id}`} value={m.name} onChange={(e) => handleMemberUpdate(m.id, e.target.value)} style={{ width: "100%", margin: "5px 0", padding: "10px" }} />
            ))}
            <button onClick={handleConfirm} style={{ width: "100%", padding: "10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Confirm</button>
          </div>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Commety Ledger</h2>
        {ledger.map((commety) => (
          <div key={commety.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px", marginTop: "10px", backgroundColor: "#fff" }}>
            <h3>{commety.name}</h3>
            <p>Opened on: {commety.openDate}</p>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Name</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Amount</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {commety.members.map((member) => (
                  <tr key={member.id}>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{member.name}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>${member.amount}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                      <button
                        onClick={() => handlePayment(commety.id, member.id)}
                        style={{ padding: "5px 10px", border: "none", borderRadius: "5px", color: "white", cursor: "pointer", backgroundColor: member.paid ? "green" : "red" }}
                      >
                        {member.paid ? "Paid" : "Unpaid"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommetyLedger;
