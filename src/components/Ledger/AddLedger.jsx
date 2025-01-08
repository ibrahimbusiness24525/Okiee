import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Tab, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const dashSalesData = [
  { title: 'Daily Sales', amount: 'Rs249.95' },
  { title: 'Monthly Sales', amount: 'Rs2.942.32' },
  { title: 'Yearly Sales', amount: 'Rs8.638.32' },
];

const AddLedger = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', name: '', amount: '' });
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
    const { type, name, amount } = modalData;
    const newRecord = { name, amount };
  
    // Update records state
    const updatedRecords = { ...records };
    updatedRecords[type].push(newRecord);
    setRecords(updatedRecords);
    localStorage.setItem(type, JSON.stringify(updatedRecords[type]));
  
    // Handle updating Opening Cash like a parent record
    if (type === 'cashReceived' || type === 'cashPaid') {
      let updatedRemaningCash = [...records.remaningCash];
  
      // If Opening Cash doesn't exist, add it to both records and remainingCash
      if (!updatedRemaningCash.some(record => record.name === 'Opening Cash')) {
        updatedRemaningCash.push({ name: 'Opening Cash', amount: parseFloat(amount) });
      } else {
        // If Opening Cash exists, update the amount based on transaction type
        const currentRemaningCash = updatedRemaningCash.find(record => record.name === 'Opening Cash').amount;
  
        if (type === 'cashReceived') {
          updatedRemaningCash = updatedRemaningCash.map(record =>
            record.name === 'Opening Cash' ? { ...record, amount: currentRemaningCash + parseFloat(amount) } : record
          );
        } else if (type === 'cashPaid') {
          updatedRemaningCash = updatedRemaningCash.map(record =>
            record.name === 'Opening Cash' ? { ...record, amount: currentRemaningCash - parseFloat(amount) } : record
          );
        }
      }
  
      // Ensure "Opening Cash" is always in both the records and localStorage
      setRecords((prevRecords) => ({
        ...prevRecords,
        remaningCash: updatedRemaningCash,
      }));
      localStorage.setItem('remaningCash', JSON.stringify(updatedRemaningCash));
    }
  
    setShowModal(false); // Close the modal after saving
    setModalData({ type: '', name: '', amount: '' }); // Reset modal data
  };
  


  const handleChange = (e) => setModalData({ ...modalData, [e.target.name]: e.target.value });

  

  return (
    <React.Fragment>
      <Row>
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
          <Card className="card-event">
            <Card.Body className="border-bottom">
              <h5 className="m-16" style={{ fontSize: 30, fontWeight: 'bold' }}>Today Cash Paid</h5>
            </Card.Body>
            {records.cashPaid.length === 0 ? (
              <p>No records found</p>
            ) : (
              records.cashPaid.map((record, index) => (
                <Card.Body key={index} className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{record.name}</span>
                      <span className="d-block text-uppercase">{record.amount}</span>
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
          <Card className="card-event">
            <Card.Body className="border-bottom">
              <h5 className="m-16" style={{ fontSize: 30, fontWeight: 'bold' }}>Today Cash Received</h5>
            </Card.Body>
            {records.cashReceived.length === 0 ? (
              <p>No records found</p>
            ) : (
              records.cashReceived.map((record, index) => (
                <Card.Body key={index} className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{record.name}</span>
                      <span className="d-block text-uppercase">{record.amount}</span>
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
              boxSizing: 'border-box',
            }}
          >
            Today Expense
          </button>
          <Card className="card-event">
            <Card.Body className="border-bottom">
              <h5 className="m-16" style={{ fontSize: 30, fontWeight: 'bold' }}>Today Expense</h5>
            </Card.Body>
            {records.todayExpense.length === 0 ? (
              <p>No records found</p>
            ) : (
              records.todayExpense.map((record, index) => (
                <Card.Body key={index} className="border-bottom">
                  <div className="row d-flex align-items-center">
                    <div className="col">
                      <span className="d-block text-uppercase">{record.name}</span>
                      <span className="d-block text-uppercase">{record.amount}</span>
                    </div>
                  </div>
                </Card.Body>
              ))
            )}
          </Card>
        </Col>

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
          <Card className="card-event">
            <Card.Body className="border-bottom">
              <h5 className="m-16" style={{ fontSize: 30, fontWeight: 'bold' }}>Opening Cash</h5>
            </Card.Body>
            {records.openingCash.length === 0 ? (
              <p>No records found</p>
            ) : (
              records.openingCash.map((record, index) => (
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
        </Col>

        <Col md={6} xl={4} style={{marginTop:75}}>
          {/* <button
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
          </button> */}
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
        </Col>

        <Col md={6} xl={4}>
          <button
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
          </button>
          <Card className="card-event">
            <Card.Body className="border-bottom">
              <h5 className="m-16" style={{ fontSize: 30, fontWeight: 'bold' }}>Closing Cash</h5>
            </Card.Body>
            {records.closingCash.length === 0 ? (
              <p>No records found</p>
            ) : (
              records.closingCash.map((record, index) => (
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
          <Modal.Title>{modalData.type === 'cashPaid' ? 'Cash Paid' : modalData.type === 'cashReceived' ? 'Cash Received' : modalData.type === 'remaningCash' ? 'Opening Cash' : modalData.type === 'closingCash' ? 'Closing Cash' : 'Today Expense'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Title - added bold text */}
            <h5 style={{ fontWeight: 'bold' }}>
              {modalData.type === 'cashPaid' ? 'Cash Paid' : modalData.type === 'cashReceived' ? 'Cash Received' : modalData.type === 'remaningCash' ? 'Opening Cash' : modalData.type === 'closingCash' ? 'Closing Cash' : 'Today Expense'}
            </h5>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>{modalData.type === 'todayExpense' ? "Expanse Name" : "Shop/Person Name"}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={modalData.name}
                onChange={handleChange}
              />
            </Form.Group>

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
