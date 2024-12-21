import React, { useState } from 'react';
import { Modal, Button, Row, Col, Image, Table, Form } from 'react-bootstrap';
import axios from 'axios';

const MobileInvoice = ({ showModal, data, handleClose }) => {
  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSoldMobile = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/create-invoice`, {
        mobileId: data._id,
        finalPrice: data.finalPrice,
        // Add other relevant fields if necessary
      });
      console.log('Invoice created:', response.data);
      handleClose(); // Close the invoice modal after creating the invoice
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleDispatchMobile = async () => {
    // Implement logic to dispatch the mobile (e.g., API call)
    // Update UI or display a success message after dispatching
    console.log('Dispatching mobile...');
    setDispatchModalVisible(false); // Close the dispatch modal
  };

  const handleOpenDispatchModal = () => {
    setDispatchModalVisible(true);
  };

  const handleDispatchModalClose = () => {
    setDispatchModalVisible(false);
    setShopName(''); // Clear form fields on close
    setOwnerName('');
    setPhoneNumber('');
  };

  const handleShopNameChange = (event) => {
    setShopName(event.target.value);
  };

  const handleOwnerNameChange = (event) => {
    setOwnerName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose} centered size="lg" className="custom-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">Mobile Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4} className="text-center">
              <Image
                src={
                  "https://garmade.com/cdn/shop/products/MPD0107MN.jpg?height=720&v=1688628753" ||
                  '/placeholder-image.png'
                }
                fluid
                rounded
              />
            </Col>
            <Col md={8}>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>Company Name</td>
                    <td>{data?.companyName}</td>
                  </tr>
                  <tr>
                    <td>Model Specifications</td>
                    <td>{data?.modelSpecifications}</td>
                  </tr>
                  <tr>
                    <td>IMEI</td>
                    <td>{data?.imei}</td>
                  </tr>
                  {data?.imei2 && (
                    <tr>
                      <td>IMEI2</td>
                      <td>{data?.imei2}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Demand Price</td>
                    <td>${data?.demandPrice}</td>
                  </tr>
                  <tr>
                    <td>Final Price</td>
                    <td>${data?.finalPrice}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="success" onClick={handleOpenDispatchModal}>
            Dispatch
          </Button>
          <Button variant="success" onClick={handleSoldMobile}>
            Sold Mobile
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={dispatchModalVisible} onHide={handleDispatchModalClose} centered size="md">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">Dispatch Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="shopName">
                  <Form.Label>Shop Name</Form.Label>
                  <Form.Control type="text" value={shopName} onChange={handleShopNameChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="ownerName">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control type="text" value={ownerName} onChange={handleOwnerNameChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="secondary" onClick={handleDispatchModalClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleDispatchMobile}>
            Add to Dispatch
          </Button>
        </Modal.Footer>
      </Modal>  
    </>
  );
};

export default MobileInvoice;