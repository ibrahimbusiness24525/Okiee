import React from 'react';
import { ListGroup, Button, Modal, Form, Row, Col, Image } from 'react-bootstrap';
import useWindowSize from 'hooks/useWindowSize';
import { BASE_URL } from 'config/constant';
import axios from 'axios';

const AddMobileModal = ({showModal,data,handleChange,handleClose,handleImageChange,handleSubmit}) => {
  console.log("data",data)
  return (
    <>
    <Modal show={showModal} onHide={handleClose} centered size="lg" className="custom-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">Add New Phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col xs={12}>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>Upload Images (Max 5)</Form.Label>
                  <Form.Control type="file" multiple onChange={handleImageChange} />
                  <div className="mt-3 d-flex flex-wrap">
                    {data.images.map((image, index) => (
                      <Image
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={Image + `${index + 1}`}
                        rounded
                        className="mr-2 mb-2"
                        style={{ width: '75px', height: '75px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formCompanyName" className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    as="select"
                    name="companyName"
                    value={data.companyName}
                    onChange={handleChange}
                  >
                    <option>Select Company</option>
                    {/* {companyOptions.map((company, index) => (
                      <option key={index} value={company}>
                        {company}
                      </option>
                    ))} */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formModelName" className="mb-3">
                  <Form.Label>Model Name</Form.Label>
                  <Form.Control
                    as="select"
                    name="modelName"
                    value={data.modelName}
                    onChange={handleChange}
                  >
                    <option>Select Model</option>
                    {/* {modelOptions.map((model, index) => (
                      <option key={index} value={model}>
                        {model}
                      </option>
                    ))} */}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formSpecs" className="mb-3">
                  <Form.Label>Specifications</Form.Label>
                  <Form.Control
                    as="select"
                    name="specs"
                    value={data.specs}
                    onChange={handleChange}
                  >
                    <option>Select Specifications</option>
                    {/* {specsOptions.map((spec, index) => (
                      <option key={index} value={spec}>
                        {spec}
                      </option>
                    ))} */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formColor" className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    as="select"
                    name="color"
                    value={data.color}
                    onChange={handleChange}
                  >
                    <option>Select Color</option>
                    {/* {colorOptions.map((color, index) => (
                      <option key={index} value={color}>
                        {color}
                      </option>
                    ))} */}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formImeAddress" className="mb-3">
                  <Form.Label>IME Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter IME address"
                    name="imeAddress"
                    value={data.imeAddress}
                    onChange={handleChange}
                  />
                  <Button variant="link"
                  //  onClick={handleAddImeAddress} 
                   className="p-0">
                    <i className="fas fa-plus"></i> Add IME Address 2
                  </Button>
                </Form.Group>
              </Col>
              {/* {isDualSim && (
                <Col md={6}>
                  <Form.Group controlId="formImeAddress2" className="mb-3">
                    <Form.Label>IME Address 2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter second IME address"
                      name="imeAddress2"
                      value={data.imeAddress2}
                      onChange={handleChange}
                    />
                    <Button variant="link" onClick={handleRemoveImeAddress} className="p-0">
                      <i className="fas fa-trash"></i> Remove IME Address 2
                    </Button>
                  </Form.Group>
                </Col>
              )} */}
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formDemandPrice" className="mb-3">
                  <Form.Label>Demand Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter demand price"
                    name="demandPrice"
                    value={data.demandPrice}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formFinalPrice" className="mb-3">
                  <Form.Label>Final Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter final price"
                    name="finalPrice"
                    value={data.finalPrice}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center">
              <Button variant="primary" onClick={handleSubmit}>
                Add to Shop
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddMobileModal
