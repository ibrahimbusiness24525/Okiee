import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Tab, Modal, Button, Form, Toast } from 'react-bootstrap';
import {api} from '../../../api/api'
import { toast } from 'react-toastify';
import EntityListBox from 'components/EntitylListBox';


const AddLedger = () => {
  const [entitiesWithLedger, setEntitiesWithLedger] = useState([
  {
    _id: "1",
    name: "Entity One",
    reference: "REF001",
    entries: [
      {
        type: "Expense",
        amount: 5000,
        description: "Purchased materials"
      },
      {
        type: "CashPaid",
        amount: 3000,
        description: "Advance payment"
      },
      {
        type: "CashReceived",
        amount: 2000,
        description: "Refund from supplier"
      }
    ]
  },
  {
    _id: "2",
    name: "Entity Two",
    reference: "REF002",
    entries: [
      {
        type: "Expense",
        amount: 1500,
        description: "Service charges"
      }
    ]
  },
  {
    _id: "3",
    name: "Entity Three",
    reference: "REF003",
    entries: []
  }
]);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', name: '', amount: '' ,source:"",recipient:"",purpose:""});
  const [formData,setFormData]= useState({
    name:"",
    reference:"",
    type:"",
    amount:0,
    description:"",
    cashPaid:0,
    cashReceived:0,
    expense:0,

  })
  const handleModalShow = (type) => {
    setModalData({ ...modalData, type });
    setShowModal(true);
  };


  
  
 
  

  

    const createEntity = async() =>{
    try{

        const payload = {
            name:formData.name,
            reference: formData.reference,
        }

        const response = await api.post("/api/entity/create",payload);
        console.log("This is the response", response)
        Toast.success("Entity added successfully")
        setShowModal(false)
      }catch(error){
        console.log("Error in creating entity,",error)
        // setShowModal(false)
        Toast.error(error?.response?.data?.message || "Error in creating entity")
    }
  }

  return (
    <React.Fragment>
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
                Create Entity
              </Button>
            </div>
      <Row  style={{ marginTop: 20 }} >
     

        <Col md={6} xl={4}>
          <button
            onClick={() => handleModalShow('cashPaid')}
            style={{
              flex: '1 1 30%',
              padding: '15px',
              margin: '10px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              minWidth: '200px',
              maxWidth: '300px',
              boxSizing: 'border-box',
            }}
          >
            Cash Paid
          </button>
          <Card className="card-event"
          style={{
            borderRadius: "12px", 
            margin: "auto", 
            background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" 
        }}
          >
            <Card.Body className="border-bottom">
            <h5 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
           Cash Paid
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />
            </Card.Body>
            
           
          </Card>
        </Col>

        <Col md={6} xl={4}>
          <button
            onClick={() => handleModalShow('cashReceived')}
            style={{
              flex: '1 1 30%',
              padding: '15px',
              margin: '10px',
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              minWidth: '200px',
              maxWidth: '300px',
              boxSizing: 'border-box',
            }}
          >
            Cash Received
          </button>
          <Card className="card-event"
          style={{
            borderRadius: "12px", 
            margin: "auto", 
            background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" 
        }}
          >
            <Card.Body className="border-bottom">
            <h5 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
         Today Cash Received
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />

                </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={4}>
          <button
            onClick={() => handleModalShow('todayExpense')}
            style={{
              flex: '1 1 30%',
              padding: '15px',
              margin: '10px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              minWidth: '200px',
              maxWidth: '300px',
              marginTop:"22px",
              boxSizing: 'border-box',
            }}
          >
             Expense
          </button>
          <Card className="card-event"
          style={{
            borderRadius: "12px", 
            margin: "auto", 
            background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" // Soft shadow effect
        }}
          >
            <Card.Body className="border-bottom">
            <h5 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
           Expense
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />
            </Card.Body>
           
           
          </Card>
        </Col>


      
      </Row>
    <div style={{ padding: '20px',marginTop:"150px" }}>
      <h2 style={{ marginBottom: '20px', }}>Entities with Transactions</h2>
      <EntityListBox entitiesWithLedger={entitiesWithLedger} />
    </div>

      {/* Modal for entering record data */}
    
   <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Entity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="entity">
              <Form.Label>Entity Name</Form.Label>
             <Form.Control
                type="text"
                placeholder="Enter Entity Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

            </Form.Group>
            <Form.Group controlId="reference">
              <Form.Label>Reference Name</Form.Label>
             <Form.Control
                type="text"
                placeholder="Enter Reference Name"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                required
              />

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={createEntity}>
            Save Entity
          </Button>
        </Modal.Footer>
      </Modal>



    </React.Fragment>
  );
};

export default AddLedger;
