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

  const createParty = async() =>{
    try{
        const payload = {
            partyName
        }
        const response = await api.post("/api/partyLedger/create",payload);
        console.log("This is the response", response)
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

  useEffect(()=>{
    getAllPartyLedgerRecords()
  },[])

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
      {partyLedgerRecords.map((party) => (
        <div key={party._id} style={{ marginBottom: "20px" }}>
           <StyledHeading>{party._id}</StyledHeading> {/* Party Name as Heading */}

           <Table
      array={party.purchases.map((purchase) => ({
        companyName: purchase.companyName,
        modelName: purchase.modelName,
        buyingPrice: purchase.prices.buyingPrice, // Added Buying Price
        date: purchase.date,
      }))}
      keysToDisplay={["companyName", "modelName", "buyingPrice", "date"]}
      label={["Company Name", "Model Name", "Buying Price", "Date"]}
      customBlocks={[
        {
          index: 3,
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
