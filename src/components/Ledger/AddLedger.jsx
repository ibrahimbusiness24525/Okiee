import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Tab, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {api} from '../../../api/api'
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import { BASE_URL } from 'config/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const dashSalesData = [
  { title: 'Daily Sales', amount: 'Rs249.95' },
  { title: 'Monthly Sales', amount: 'Rs2.942.32' },
  { title: 'Yearly Sales', amount: 'Rs8.638.32' },
];

const AddLedger = () => {
  const [ledgerData,setLedgerData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', name: '', amount: '' ,source:"",recipient:"",purpose:""});
  const [records, setRecords] = useState({
    cashPaid: JSON.parse(localStorage.getItem('cashPaid')) || [],
    cashReceived: JSON.parse(localStorage.getItem('cashReceived')) || [],
    todayExpense: JSON.parse(localStorage.getItem('todayExpense')) || [],
    openingCash: JSON.parse(localStorage.getItem('openingCash')) || [],
    remaningCash: JSON.parse(localStorage.getItem('remaningCash')) || [],
    closingCash: JSON.parse(localStorage.getItem('closingCash')) || [],
  });

  const handleModalShow = (type) => {
    
    setModalData({ ...modalData, type });
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleSave = () => {
    const { type, name, amount,recipient,source,purpose } = modalData;
    const newRecord = { name, amount };
      if(type === "cashPaid"){
        updateCashPaid(recipient,amount);
      }
      if(type==="openingCash"){
        updateOpeningCash(amount);
      }
      if(type==="cashReceived"){
        updateCashReceived(source,amount);
      }
      if(type==="todayExpense"){
        updateCashExpense(purpose, amount)
      }
    
    // Update records state
    // const updatedRecords = { ...records };
    // updatedRecords[type].push(newRecord);
    // setRecords(updatedRecords);
    // localStorage.setItem(type, JSON.stringify(updatedRecords[type]));
  
    // Handle updating Opening Cash like a parent record
    // if (type === 'cashReceived' || type === 'cashPaid') {
    //   let updatedRemaningCash = [...records.remaningCash];
  
      // If Opening Cash doesn't exist, add it to both records and remainingCash
      // if (!updatedRemaningCash.some(record => record.name === 'Opening Cash')) {
      //   updatedRemaningCash.push({ name: 'Opening Cash', amount: parseFloat(amount) });
      // } else {
        // If Opening Cash exists, update the amount based on transaction type
        // const currentRemaningCash = updatedRemaningCash.find(record => record.name === 'Opening Cash').amount;
  
        // if (type === 'cashReceived') {
        //   updatedRemaningCash = updatedRemaningCash.map(record =>
        //     record.name === 'Opening Cash' ? { ...record, amount: currentRemaningCash + parseFloat(amount) } : record
        //   );
        // } else if (type === 'cashPaid') {
        //   updatedRemaningCash = updatedRemaningCash.map(record =>
        //     record.name === 'Opening Cash' ? { ...record, amount: currentRemaningCash - parseFloat(amount) } : record
        //   );
        // }
      // }
  
      // Ensure "Opening Cash" is always in both the records and localStorage
    //   setRecords((prevRecords) => ({
    //     ...prevRecords,
    //     remaningCash: updatedRemaningCash,
    //   }));
    //   localStorage.setItem('remaningCash', JSON.stringify(updatedRemaningCash));
    // }
  
    setShowModal(false); // Close the modal after saving
    setModalData({ type: '', name: '', amount: '' }); // Reset modal data
  };
  


  const handleChange = (e) => setModalData({ ...modalData, [e.target.name]: e.target.value });

  const getTodayLedger = async() =>{
    try{
        const response = await api.get(`/api/ledger/today`)
        // const response = await axios.get(`${BASE_URL}api/ledger/today`)
        console.log("ledger today data",response);
        setLedgerData(response?.data?.ledger)
    }catch(error){
      console.log("error in getting data",error);
    }
  }
  
  const updateCashPaid = async(recipient,amount) =>{
    const payload = {
      recipient,
      amount: parseInt(amount)
    }
    
    console.log("cashPaid payload",payload)
    try{
      const response = await api.post(`/api/ledger/update-cash-paid`,payload)
      console.log(response)
      toast.success("Cash Paid Updated Successfully");
    }catch(error){
      toast.error("error in updating");
      console.log("Error in updating cash paid",error)
    }
  }
  const updateCashReceived = async(source,amount) =>{
    const payload = {
      source,
      amount: parseInt(amount)
    }
    
    console.log("cash Received payload",payload)
    try{
      const response = await api.post(`/api/ledger/update-cash-received`,payload)
      console.log(response)
      toast.success("Cash Received Updated Successfully");
    }catch(error){
      toast.error("error in updating");
      console.log("Error in updating cash received",error)
    }
  }
  const updateCashExpense = async(purpose,amount) =>{
    const payload = {
      purpose,
      amount: parseInt(amount)
    }
    
    console.log("cash expense payload",payload)
    try{
      const response = await api.post(`/api/ledger/update-expense`,payload)
      console.log(response)
      toast.success("Cash expense Updated Successfully");
    }catch(error){
      toast.error("error in updating");
      console.log("Error in updating cash received",error)
    }
  }
  const updateOpeningCash = async(amount) =>{
    const payload = {
      amount: parseInt(amount)
    }
    
    console.log("opening payload",payload)
    try{
      const response = await api.put(`/api/ledger/update-opening-cash`,payload)
      console.log(response)
      toast.success("Opening Cash Updated Successfully");
    }catch(error){
      toast.error("error in updating");
      console.log("Error in updating opening cash",error)
    }
  }

  const updateEndDay = async() =>{
    try{
      const response  = await api.post(`/api/ledger/end-day`)
      console.log("End day response", response)
      toast.success("End Day Updated Successfully");
    }catch(error){
      console.log("Error in updating end day",error)
      toast.error("error in updating");
    }
  }
  useEffect(()=>{
    getTodayLedger();
  },[])
  console.log('====================================');
  console.log("ledger Data", ledgerData);
  console.log('====================================');

  return (
    <React.Fragment>
      {/* <Col md={6} xl={4} className="d-flex justify-content-end" style={{ marginTop: -10 }}>
    <button
      onClick={() => updateEndDay()}
      // onClick={() => handleEndDay()}
      style={{
        padding: '15px',
        marginRight: '-850px',
        backgroundColor: '#e74c3c', // You can choose any color
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
      End Day
    </button>
  </Col> */}
      <Row  style={{ marginTop: 20 }} >
      <Col md={6} xl={4}>
          <button
            onClick={() => handleModalShow('openingCash')}
            style={{
              flex: '1 1 30%',
              padding: '15px',
              margin: '10px',
              backgroundColor: '#9b59b6',
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
            Opening Cash
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
          Opening Cash
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />
            </Card.Body>
            {
    
                <Card.Body className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{ledgerData?.openingCash}</span>
                    </div>
                  </div>
                </Card.Body>
            }
          </Card>
        </Col>
        {/* {dashSalesData.map((data, index) => (
          <Col key={index} xl={6} xxl={4} style={{ marginBottom: 25 }}>
            <Card>
              <Card.Body>
                <h6 className="mb-1 mr-20" style={{ fontSize: 30, color: '#04a9f5' }}>{data.title}</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i className={`feather ${data.icon} f-30 m-r-20`} /> Rs50000
                    </h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))} */}

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
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" // Soft shadow effect
        }}
          >
            <Card.Body className="border-bottom">
            <h5 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
          Today Cash Paid
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />
            </Card.Body>
            {ledgerData?.cashPaidDetails?.length === 0 ? (
              <p>No records found</p>
            ) : (
              ledgerData?.cashPaidDetails?.map((record, index) => (
                <Card.Body key={index} className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{record?.recipient}</span>
                      <span className="d-block text-uppercase">{record?.amount}</span>
                    </div>
                  </div>
                </Card.Body>
              ))
            )}
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
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" // Soft shadow effect
        }}
          >
            <Card.Body className="border-bottom">
            <h5 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
         Today Cash Received
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />
            </Card.Body>
            {ledgerData?.cashReceivedDetails?.length === 0 ? (
              <p>No records found</p>
            ) : (
              ledgerData?.cashReceivedDetails?.map((record, index) => (
                <Card.Body key={index} className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{record?.source}</span>
                      <span className="d-block text-uppercase">{record?.amount}</span>
                    </div>
                  </div>
                </Card.Body>
              ))
            )}
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
            Today Expense
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
          Today Expense
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />
            </Card.Body>
            {ledgerData?.expenseDetails?.length === 0 ? (
              <p>No records found</p>
            ) : (
              ledgerData?.expenseDetails?.map((record, index) => (
                <Card.Body key={index} className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{record?.purpose}</span>
                      <span className="d-block text-uppercase">{record?.amount}</span>
                    </div>
                  </div>
                </Card.Body>
              ))
            )}
          </Card>
        </Col>

        

        {/* <Col md={6} xl={4} style={{marginTop:75}}>
          <button
            onClick={() => handleModalShow('openingCash')}
            style={{
              flex: '1 1 30%',
              padding: '15px',
              margin: '10px',
              backgroundColor: '#9b59b6',
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
            Remaning Cash
          </button>
          <Card className="card-event">
            <Card.Body className="border-bottom">
              <h5 className="m-16" style={{fontSize: 30, fontWeight: 'bold' }}>Remaning Cash</h5>
            </Card.Body>
            {records.remaningCash.length === 0 ? (
              <p>No records found</p>
            ) : (
              records.remaningCash.map((record, index) => (
                <Card.Body key={index} className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{record.amount}</span>
                    </div>
                  </div>
                </Card.Body>
              ))
            )}
          </Card>
        </Col> */}

        <Col  style={{marginTop:"5rem"}} md={6} xl={4}>
          {/* <button
            onClick={() => handleModalShow('closingCash')}
            style={{
              flex: '1 1 30%',
              padding: '15px',
              margin: '10px',
              backgroundColor: '#f39c12',
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
            Closing Cash
          </button> */}
          <Card className="card-event"
          style={{
            borderRadius: "12px", 
            margin: "auto", 
            background: "linear-gradient(135deg, #ffffff, #f3f4f6)", // Softer gradient
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" // Soft shadow effect
        }}
          >
            <Card.Body className="border-bottom">
            <h5 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
          Closing Cash
        </h5>
        <hr style={{ margin: "10px 0", borderTop: "2px solid #ddd" }} />
            </Card.Body>
            {
            // records.closingCash.length === 0 ? (
            //   <p>No records found</p>
            // ) : (
              // record?.closingCash.map((record, index) => (
                <Card.Body  className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{ledgerData?.closingCash}</span>
                    </div>
                  </div>
                </Card.Body>
              // ))
            // )
            }
          </Card>
        </Col>


        {/* <Col md={6} xl={12} className="user-activity">
          <Card style={{ marginTop: 25 }}>
            <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
              <Tab eventKey="today" title="Today">
                {tabContent}
              </Tab>
              <Tab eventKey="week" title="This Week">
                {tabContent}
              </Tab>
              <Tab eventKey="all" title="All">
                {tabContent}
              </Tab>
            </Tabs>
          </Card>
        </Col> */}
      </Row>

      {/* Modal for entering record data */}
      <Modal show={showModal} onHide={handleModalClose}>
  <Modal.Header closeButton>
    <Modal.Title>
      {modalData.type === 'TodayExpense' 
        ? 'Today Expense' 
        : modalData.type === 'openingCash' || modalData.type === 'closingCash' 
        ? 'Amount' 
        : 'Person/Shop Name'}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>

      {/* Today Expense */}
      {modalData.type === 'todayExpense' ? (
        <>
          <Form.Group className="mb-3" controlId="formBasicExpenseName">
            <Form.Label>Expense Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter expense name"
              name="purpose"
              value={modalData.purpose}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicExpenseAmount">
            <Form.Label>Expense Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter expense amount"
              name="amount"
              value={modalData.amount}
              onChange={handleChange}
            />
          </Form.Group>
        </>
      ) : modalData.type === 'openingCash'  ? (
        <>
          {/* Amount */}
          <Form.Group className="mb-3" controlId="formBasicAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={modalData.amount}
              onChange={handleChange}
            />
          </Form.Group>
        </>
      ) : (
       modalData.type === "cashReceived"? 
       <>
       <>
          {/* Person/Shop Name */}
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Person/Shop Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="source"
              value={modalData.source}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Amount */}
          <Form.Group className="mb-3" controlId="formBasicAmount">
            <Form.Label> Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={modalData.amount}
              onChange={handleChange}
            />
          </Form.Group>
        </>
       </>:
       <>
       <>
          {/* Person/Shop Name */}
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Person/Shop Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="recipient"
              value={modalData.recipient}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Amount */}
          <Form.Group className="mb-3" controlId="formBasicAmount">
            <Form.Label> Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={modalData.amount}
              onChange={handleChange}
            />
          </Form.Group>
        </>
       </>
      )}
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleModalClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSave}>
      Save
    </Button>
  </Modal.Footer>
</Modal>




    </React.Fragment>
  );
};

export default AddLedger;
