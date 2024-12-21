import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const PaymentModal = ({ showModal, data, handleChange, handleClose, handleSubmit }) => {
  return (
    <>
      <Modal show={showModal} onHide={handleClose} centered size="lg" className="custom-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPhoneNumber" className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter payment description"
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formPaymentDetails" className="mb-3">
                  <Form.Label>Payment Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter payment details"
                    name="paymentDetails"
                    value={data.paymentDetails}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center">
              <Button variant="primary" onClick={handleSubmit}>
                Submit Payment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PaymentModal;
