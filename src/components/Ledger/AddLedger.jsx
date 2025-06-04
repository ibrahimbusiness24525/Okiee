
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { api } from "../../../api/api"

const AddLedger = () => {
  const [entities, setAllEntities] = useState([])
  const [allEntitiesRecords, setAllEntitiesRecords] = useState([])
  const [entitiesWithLedger, setEntitiesWithLedger] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showCashPaidModal, setShowCashPaidModal] = useState(false)
  const [showCashReceivedModal, setShowCashReceivedModal] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    reference: "",
  })

  const [expenseData, setExpenseData] = useState({
    entityId: "",
    expense: "",
    description: "",
  })

  const [cashPaidData, setCashPaidData] = useState({
    entityId: "",
    cashPaid: "",
    description: "",
  })

  const [cashReceivedData, setCashReceivedData] = useState({
    entityId: "",
    cashReceived: "",
    description: "",
  })

  const createEntity = async () => {
    try {
      const payload = {
        name: formData.name,
        reference: formData.reference,
      }

      const response = await api.post("/api/entity/add", payload)
      console.log("Creating entity:", payload)
      setShowModal(false)
      setFormData({ name: "", reference: "" })
      getAllEntities() // Refresh entities list
      toast.success("Entity created successfully!")
    } catch (error) {
      toast.error("Entity creation failed. Please try again.")
      console.log("Error in creating entity:", error)
    }
  }

  const createExpense = async () => {
    try {
      const payload = {
        expense: Number.parseFloat(expenseData.expense),
      }

      const response = await api.post(`/api/entity/expense/${expenseData?.entityId}`, payload)
      console.log("Creating expense:", payload)
      setShowExpenseModal(false)
      setExpenseData({ entityId: "", expense: "", description: "" })
      toast.success("Expense recorded successfully!")
    } catch (error) {
      toast.error("Failed to record expense. Please try again.")
      console.log("Error in creating expense:", error)
    }
  }

  const createCashPaid = async () => {
    try {
      const payload = {
        cashPaid: Number.parseFloat(cashPaidData.cashPaid),
      }

      const response = await api.post(`/api/entity/cash-payment/${cashPaidData?.entityId}`, payload)
      console.log("Creating cash paid:", payload)
      setShowCashPaidModal(false)
      setCashPaidData({ entityId: "", cashPaid: "", description: "" })
      toast.success("Cash payment recorded successfully!")
    } catch (error) {
      toast.error("Failed to record cash payment. Please try again.")
      console.log("Error in creating cash paid:", error)
    }
  }

  const createCashReceived = async () => {
    try {
      const payload = {
        receiveCash: Number.parseFloat(cashReceivedData.cashReceived),
      }

      const response = await api.post(`/api/entity/cash-receive/${cashReceivedData?.entityId}`, payload)
      console.log("Creating cash received:", payload)
      setShowCashReceivedModal(false)
      setCashReceivedData({ entityId: "", cashReceived: "", description: "" })
      toast.success("Cash receipt recorded successfully!")
    } catch (error) {
      toast.error("Failed to record cash receipt. Please try again.")
      console.log("Error in creating cash received:", error)
    }
  }

  const getAllEntities = async () => {
    try {
      const response = await api.get("/api/entity/all")
      setAllEntities(response?.data)
    } catch (error) {
      console.log("Error in getting entity:", error)
    }
  }
  const getAllEntitiesRecords = async() =>{
    try {
      const response = await api.get("/api/entity/records/all")
      setAllEntitiesRecords(response?.data)
    } catch (error) {
      console.log("Error in getting entity records:", error)
    }
}
  useEffect(() => {
    getAllEntities()
    getAllEntitiesRecords()
  }, [])

  console.log("====================================")
  console.log("these are all entities", allEntitiesRecords)
  console.log("====================================")

  const getTotalsByType = () => {
    const totals = { CashPaid: 0, CashReceived: 0, Expense: 0 }
    entitiesWithLedger.forEach((entity) => {
      entity.entries.forEach((entry) => {
        totals[entry.type] = (totals[entry.type] || 0) + entry.amount
      })
    })
    return totals
  }

  const totals = getTotalsByType()

  // Icon components as SVGs
  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )

  const DollarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )

  const TrendingUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )

  const TrendingDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  )

  const ReceiptIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  )

  const UsersIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )

  const ArrowUpRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )

  const ArrowDownRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 7l10 10" />
      <path d="M17 7v10H7" />
    </svg>
  )

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )

  const ChevronDownIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
console.log("entities", entities);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 8px 0",
            }}
          >
          Expenses          
        </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              margin: "0",
            }}
          >
            Track expenses, payments, and receipts across all your business entities
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            border: "none",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            transition: "all 0.2s ease",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)"
            e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)"
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)"
            e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"
          }}
        >
          <PlusIcon />
          Create New Entity
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
          marginBottom: "48px",
        }}
      >
        {/* Cash Paid Card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ padding: "24px 24px 16px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    padding: "12px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <ArrowUpRightIcon />
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", margin: "0" }}>Cash Paid</h3>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
                    Outgoing payments and advances
                  </p>
                </div>
              </div>
              <span
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "4px 12px",
                  borderRadius: "12px",
                }}
              >
                ${totals.CashPaid?.toLocaleString() || 0}
              </span>
            </div>
          </div>
          <div style={{ padding: "0 24px 24px 24px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: "1.5",
                marginBottom: "16px",
              }}
            >
              Record payments made to suppliers, vendors, or advance payments for services and goods.
            </p>
            <button
              onClick={() => setShowCashPaidModal(true)}
              style={{
                width: "100%",
                borderColor: "#ef4444",
                color: "#ef4444",
                fontWeight: "600",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ef4444",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#ef4444"
                e.target.style.color = "white"
              }}
              onMouseOut={(e) => {
                e.target.style.background = "white"
                e.target.style.color = "#ef4444"
              }}
            >
              <DollarIcon />
              Record Payment
            </button>
          </div>
        </div>

        {/* Cash Received Card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ padding: "24px 24px 16px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    padding: "12px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <ArrowDownRightIcon />
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", margin: "0" }}>Cash Received</h3>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
                    Incoming payments and receipts
                  </p>
                </div>
              </div>
              <span
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "4px 12px",
                  borderRadius: "12px",
                }}
              >
                ${totals.CashReceived?.toLocaleString() || 0}
              </span>
            </div>
          </div>
          <div style={{ padding: "0 24px 24px 24px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: "1.5",
                marginBottom: "16px",
              }}
            >
              Track money received from customers, refunds, or any incoming cash transactions.
            </p>
            <button
              onClick={() => setShowCashReceivedModal(true)}
              style={{
                width: "100%",
                borderColor: "#10b981",
                color: "#10b981",
                fontWeight: "600",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #10b981",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#10b981"
                e.target.style.color = "white"
              }}
              onMouseOut={(e) => {
                e.target.style.background = "white"
                e.target.style.color = "#10b981"
              }}
            >
              <TrendingUpIcon />
              Record Receipt
            </button>
          </div>
        </div>

        {/* Expenses Card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ padding: "24px 24px 16px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    padding: "12px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <ReceiptIcon />
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", margin: "0" }}>
                     Expenses
                  </h3>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
                    Operating costs and expenditures
                  </p>
                </div>
              </div>
              <span
                style={{
                  background: "#fffbeb",
                  color: "#d97706",
                  border: "1px solid #fed7aa",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "4px 12px",
                  borderRadius: "12px",
                }}
              >
                ${totals.Expense?.toLocaleString() || 0}
              </span>
            </div>
          </div>
          <div style={{ padding: "0 24px 24px 24px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: "1.5",
                marginBottom: "16px",
              }}
            >
              Log business expenses including materials, services, utilities, and operational costs.
            </p>
            <button
              onClick={() => setShowExpenseModal(true)}
              style={{
                width: "100%",
                borderColor: "#f59e0b",
                color: "#f59e0b",
                fontWeight: "600",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #f59e0b",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#f59e0b"
                e.target.style.color = "white"
              }}
              onMouseOut={(e) => {
                e.target.style.background = "white"
                e.target.style.color = "#f59e0b"
              }}
            >
              <TrendingDownIcon />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Entities Section */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ color: "#3b82f6" }}>
            <UsersIcon />
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0",
            }}
          >
            Business Entities & Transactions
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {entities.map((entity) => (
            <div
              key={entity._id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                background: "#fafafa",
              }}
            >
              <div style={{ padding: "20px 24px 12px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", margin: "0" }}>
                      {entity.name}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
                      Reference: {entity.reference}
                    </p>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
                      Status: {entity.status}
                    </p>
                  </div>
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#475569",
                      fontSize: "12px",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    Total: ${(Number(entity.cashPaid) + Number(entity.expense) + Number(entity.receiveCash)).toLocaleString()}
                  </span>
                </div>
              </div>
              <div style={{ padding: "0 24px 24px 24px" }}>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "500" }}>Cash Paid</div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>${Number(entity.cashPaid).toLocaleString()}</div>
                  </div>
                  <div
                    style={{
                      background: "#fffbeb",
                      color: "#d97706",
                      border: "1px solid #fed7aa",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "500" }}>Expense</div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>${Number(entity.expense).toLocaleString()}</div>
                  </div>
                  <div
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "500" }}>Cash Received</div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>${Number(entity.receiveCash).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: "0 0 8px 0",
                  }}
                >
                  Create New Business Entity
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: "1.5",
                    margin: "0",
                  }}
                >
                  Add a new entity to track financial transactions. This could be a supplier, customer, or business
                  partner.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#64748b",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#f1f5f9"
                  e.target.style.color = "#1e293b"
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "none"
                  e.target.style.color = "#64748b"
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label
                    htmlFor="entity-name"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Entity Name
                  </label>
                  <input
                    id="entity-name"
                    type="text"
                    placeholder="e.g., ABC Suppliers Ltd."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      padding: "12px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="reference"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Reference Code
                  </label>
                  <input
                    id="reference"
                    type="text"
                    placeholder="e.g., SUP001"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      padding: "12px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "24px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  border: "1px solid #d1d5db",
                  background: "white",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#f9fafb"
                  e.target.style.borderColor = "#9ca3af"
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "white"
                  e.target.style.borderColor = "#d1d5db"
                }}
              >
                Cancel
              </button>
              <button
                onClick={createEntity}
                disabled={!formData.name || !formData.reference}
                style={{
                  background:
                    !formData.name || !formData.reference
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  color: "white",
                  cursor: !formData.name || !formData.reference ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  if (formData.name && formData.reference) {
                    e.target.style.transform = "translateY(-1px)"
                    e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)"
                  }
                }}
                onMouseOut={(e) => {
                  if (formData.name && formData.reference) {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "none"
                  }
                }}
              >
                Create Entity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowExpenseModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: "0 0 8px 0",
                  }}
                >
                  Record Business Expense
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: "1.5",
                    margin: "0",
                  }}
                >
                  Add a new expense transaction for the selected entity.
                </p>
              </div>
              <button
                onClick={() => setShowExpenseModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Select Entity
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={expenseData.entityId}
                      onChange={(e) => setExpenseData({ ...expenseData, entityId: e.target.value })}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        padding: "12px",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        boxSizing: "border-box",
                        appearance: "none",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Choose an entity...</option>
                      {entities.map((entity) => (
                        <option key={entity._id} value={entity._id}>
                          {entity.name} ({entity.reference})
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#64748b",
                      }}
                    >
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Expense Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={expenseData.expense}
                    onChange={(e) => setExpenseData({ ...expenseData, expense: e.target.value })}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      padding: "12px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

              </div>
            </div>

            <div
              style={{
                padding: "24px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowExpenseModal(false)}
                style={{
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  border: "1px solid #d1d5db",
                  background: "white",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Cancel
              </button>
              <button
                onClick={createExpense}
                disabled={!expenseData.entityId || !expenseData.expense }
                style={{
                  background:
                    !expenseData.entityId || !expenseData.expense 
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  color: "white",
                  cursor:
                    !expenseData.entityId || !expenseData.expense 
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Record Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Paid Modal */}
      {showCashPaidModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCashPaidModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: "0 0 8px 0",
                  }}
                >
                  Record Cash Payment
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: "1.5",
                    margin: "0",
                  }}
                >
                  Record a cash payment made to the selected entity.
                </p>
              </div>
              <button
                onClick={() => setShowCashPaidModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Select Entity
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={cashPaidData.entityId}
                      onChange={(e) => setCashPaidData({ ...cashPaidData, entityId: e.target.value })}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        padding: "12px",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        boxSizing: "border-box",
                        appearance: "none",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Choose an entity...</option>
                      {entities.map((entity) => (
                        <option key={entity._id} value={entity._id}>
                          {entity.name} ({entity.reference})
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#64748b",
                      }}
                    >
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Cash Paid Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={cashPaidData.cashPaid}
                    onChange={(e) => setCashPaidData({ ...cashPaidData, cashPaid: e.target.value })}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      padding: "12px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                
              </div>
            </div>

            <div
              style={{
                padding: "24px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowCashPaidModal(false)}
                style={{
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  border: "1px solid #d1d5db",
                  background: "white",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Cancel
              </button>
              <button
                onClick={createCashPaid}
                disabled={!cashPaidData.entityId || !cashPaidData.cashPaid }
                style={{
                  background:
                    !cashPaidData.entityId || !cashPaidData.cashPaid 
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  color: "white",
                  cursor:
                    !cashPaidData.entityId || !cashPaidData.cashPaid 
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Received Modal */}
      {showCashReceivedModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCashReceivedModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: "0 0 8px 0",
                  }}
                >
                  Record Cash Receipt
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: "1.5",
                    margin: "0",
                  }}
                >
                  Record cash received from the selected entity.
                </p>
              </div>
              <button
                onClick={() => setShowCashReceivedModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Select Entity
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={cashReceivedData.entityId}
                      onChange={(e) => setCashReceivedData({ ...cashReceivedData, entityId: e.target.value })}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        padding: "12px",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        boxSizing: "border-box",
                        appearance: "none",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Choose an entity...</option>
                      {entities.map((entity) => (
                        <option key={entity._id} value={entity._id}>
                          {entity.name} ({entity.reference})
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#64748b",
                      }}
                    >
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Cash Received Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={cashReceivedData.cashReceived}
                    onChange={(e) => setCashReceivedData({ ...cashReceivedData, cashReceived: e.target.value })}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      padding: "12px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

               
              </div>
            </div>

            <div
              style={{
                padding: "24px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowCashReceivedModal(false)}
                style={{
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  border: "1px solid #d1d5db",
                  background: "white",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Cancel
              </button>
              <button
                onClick={createCashReceived}
                disabled={!cashReceivedData.entityId || !cashReceivedData.cashReceived }
                style={{
                  background:
                    !cashReceivedData.entityId || !cashReceivedData.cashReceived 
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  color: "white",
                  cursor:
                    !cashReceivedData.entityId || !cashReceivedData.cashReceived 
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Record Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddLedger
