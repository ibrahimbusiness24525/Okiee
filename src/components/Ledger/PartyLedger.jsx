import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { api } from "../../../api/api";
import { toast } from "react-toastify";
import Table from "components/Table/Table";
import { StyledHeading } from "components/StyledHeading/StyledHeading";
import { dateFormatter } from "utils/dateFormatter";

const PartyLedger = () => {
  const [showModal, setShowModal] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [partyLedgerRecords, setAllPartyLedgerRecords] = useState([]);
  const[amount, setAmount] = useState("");
  const[showAmountPayModal, setShowAmountPayModal] = useState(false);
  const[id, setId] = useState("");
  const handleAddPayment = (rowData) => {
    console.log("Row Data", rowData);
    setId(rowData._id);
    setShowAmountPayModal(true);
  }
  const createParty = async() =>{ 
    try{
        const payload = {
            partyName
        }
        const response = await api.post("/api/partyLedger/create",payload);
        console.log("This is the response", response)
        toast.success("Party added successfully")
    }catch(error){
        console.log("Error in creating file,",error)
        toast.error(error?.response?.data?.message || "Error in creating party")
    }
  }
  const getAllPartyLedgerRecords = async() =>{
    try{
      const response = await api.get(`/api/partyLedger/getAllPartiesRecords`)
      console.log("This is the records",response?.data?.data)
      setAllPartyLedgerRecords(response?.data?.data)
    }catch(error){
      console.log("error in getting all party ledger records", error)
    }
  }

  const groupByPartyName = (records) => {
    return records.reduce((acc, record) => {
      if (!acc[record.partyName]) {
        acc[record.partyName] = [];
      }
      acc[record.partyName].push(record);
      return acc;
    }, {});
  };
  console.log("this is id", id);
  
  const handleAddAmount = async() =>{
    try{
      const payload = {
        amountToPay:amount
      }
      const response = await api.patch(`/api/Purchase/bulk-purchase-credit-pay/${id}`,payload);
      console.log("This is the response", response)
      toast.success("Amount added successfully")
      getAllPartyLedgerRecords()
    }catch(error){
      console.log("Error in adding amount",error)
      toast.error(error?.response?.data?.message || "Error in adding amount")
  }
}
  // Group records by partyName
  const groupedRecords = groupByPartyName(partyLedgerRecords);
  useEffect(()=>{
    getAllPartyLedgerRecords()
  },[])
  console.log("party records", partyLedgerRecords);
  
  return (
    <div style={{ width: "100%", padding: "16px",  }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <Button
          style={{
            padding: "10px 16px",
            fontSize: "16px",
            fontWeight: "bold",
            background:"#007bff",
            borderRadius: "6px",
        }}
        onClick={() => setShowModal(true)}
        >
          Create Party
        </Button>
      </div>

      {/* React Bootstrap Modal */}
      <Modal show={showAmountPayModal} onHide={() => setShowAmountPayModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Amount to pay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAmountPayModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddAmount}>
            Save 
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Party</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="partyName">
              <Form.Label>Party Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Party Name"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                required
                />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={createParty}>
            Save Party
          </Button>
        </Modal.Footer>
      </Modal>
      <h3>Party Ledger Records</h3>
      <div style={{marginBottom:"50px"}}></div>
      {Object.entries(groupedRecords).map(([partyName, records]) => (
      <div key={partyName} style={{ marginBottom: "20px" }}>
        <StyledHeading>{partyName}</StyledHeading> {/* Party Name as Heading */}

        <Table
        //  routes={["/app/dashboard/partyLedger"]}
          array={records}
          keysToDisplay={["companyName", "modelName", "buyingPrice","totalPurchasedMobiles","purchasePaymentType","purchasePaymentStatus","payableAmountLater", "createdDate"]}
          label={["Company Name", "Model Name", "Buying Price","Total Mobiles","Payment Type","Payment Status","Payable Amount", "Date"]}
          customBlocks={[
            {
              index: 4,
              component: (paymentType) => paymentType || "Not Mentioned",
            },
            {
              index: 5,
              component: (paymentStatus, rowData) =>
                paymentStatus === "pending" ? (
                  <button
                  onClick={() => handleAddPayment(rowData)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#3B82F6", // Blue-500
                    color: "white",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563EB")} // Hover effect (Blue-600)
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#3B82F6")}
                >
                  Add Payment
                </button>
                
                ) : (
                  paymentStatus || "Not Mentioned"
                ),
            },
            {
              index: 6,
              component: (payableAmount) => (payableAmount ? `${payableAmount} PKR` : "0 PKR"),
            },
            {
              index: 7,
              component: (date) => dateFormatter(date), // Formatting Date
            },
          ]}
        />

      </div>
    ))}

    </div>
  );
};

export default PartyLedger;
