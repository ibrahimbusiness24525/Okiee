import { text } from "d3";
import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Table , Image } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'config/constant';
import { FaBarcode } from "react-icons/fa";

const BulkPurchaseModal = ({ handleBulkPhoneModalclose, handleSubmit,showBulkModal, modal,editMobile, handleModalClose , bulkData , setBulkData , handleAddMorePhones }) => {

const[showTextBox,setShowTextBox]= useState(false)
const handleShowTextBox = () =>{
  setShowTextBox(true)
}

return(
     <Modal show={showBulkModal} onHide={handleBulkPhoneModalclose} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Bulk Phone Purchase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Party Name and Date */}
                <Row>
                  <Col>
                    <Form.Group controlId="bulkPartyName">
                      <Form.Label>Party Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Party Name"
                        value={bulkData.partyName}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, partyName: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="bulkDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={bulkData.date}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, date: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
          
                {/* Company Name and Model Name */}
                <Row>
                  <Col>
                    <Form.Group controlId="bulkCompanyName">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Company Name"
                        value={bulkData.companyName}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, companyName: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="bulkModel">
                      <Form.Label>Model Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Model Name"
                        value={bulkData.model}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, model: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
          
                {/* RAM/Memory, SIM Option, and Quantity */}
                <Row>
                  <Col>
                    <Form.Group controlId="bulkRamMemory">
                      <Form.Label>RAM/Memory</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter RAM/Memory"
                        value={bulkData.ramSimDetails[0]?.ramMemory || ""}
                        onChange={(e) =>
                          setBulkData({
                            ...bulkData,
                            ramSimDetails: bulkData.ramSimDetails.map((item, index) =>
                              index === 0 ? { ...item, ramMemory: e.target.value } : item
                            )
                          })
                        }
                        required
                      />

                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="bulkSimOption">
                      <Form.Label>SIM Option</Form.Label>
                      <Form.Select
                      value={bulkData.ramSimDetails[0]?.simOption || ""}
                      onChange={(e) =>
                        setBulkData({
                          ...bulkData,
                          ramSimDetails: bulkData.ramSimDetails.map((item, index) =>
                            index === 0 ? { ...item, simOption: e.target.value } : item
                          )
                        })
                      }
                      required
                      >
                    <option value="">Select SIM Option</option>
                     <option value="Single SIM">Single SIM</option>
                    <option value="Dual SIM">Dual SIM</option>
                    </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="bulkQuantity">
                      <Form.Label>Number of Quantity</Form.Label>
                      <Form.Control
  type="number"
  placeholder="Enter Quantity"
  value={bulkData.quantity}
  onChange={(e) => {
    const quantity = parseInt(e.target.value, 10) || 0; // Ensure it's always a number
    const imeiFields = Array.from({ length: quantity }, () =>
      bulkData.simOption === "Dual SIM"
        ? { imei1: "", imei2: "" }
        : { imei1: "" }
    );

    setBulkData((prev) => ({
      ...prev,
      quantity,
      ramSimDetails: prev.ramSimDetails.map((item, index) =>
        index === 0 ? { ...item, imeiNumbers: imeiFields } : item
      ),
    }));
  }}
  required
/>

                    </Form.Group>
                  </Col>
                </Row>
          
                {/* IMEI Fields */}
                <Table striped bordered hover className="mt-3">
  <thead>
    <tr>
      <th>#</th>
      <th>IMEI 1</th>
      {bulkData.simOption === "Dual SIM" && <th>IMEI 2</th>}
      <th>Color</th>
    </tr>
  </thead>
  <tbody>
    {bulkData.ramSimDetails[0]?.imeiNumbers?.map((phone, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <Form.Control
            type="number"
            placeholder="Enter IMEI 1"
            value={phone.imei1}
            onChange={(e) => {
              const updatedImeis = [...bulkData.ramSimDetails[0].imeiNumbers];
              updatedImeis[index] = { ...updatedImeis[index], imei1: e.target.value };
              setBulkData((prev) => ({
                ...prev,
                ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                  idx === 0 ? { ...item, imeiNumbers: updatedImeis } : item
                ),
              }));
            }}
            required
          />
        </td>
        {bulkData.simOption === "Dual SIM" && (
          <td>
            <Form.Control
              type="number"
              placeholder="Enter IMEI 2"
              value={phone.imei2 || ""}
              onChange={(e) => {
                const updatedImeis = [...bulkData.ramSimDetails[0].imeiNumbers];
                updatedImeis[index] = { ...updatedImeis[index], imei2: e.target.value };
                setBulkData((prev) => ({
                  ...prev,
                  ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                    idx === 0 ? { ...item, imeiNumbers: updatedImeis } : item
                  ),
                }));
              }}
              required
            />
          </td>
        )}
        <td>
          <Form.Control
            type="text"
            placeholder="Enter Color"
            value={phone.color || ""}
            onChange={(e) => {
              const updatedImeis = [...bulkData.ramSimDetails[0].imeiNumbers];
              updatedImeis[index] = { ...updatedImeis[index], color: e.target.value };
              setBulkData((prev) => ({
                ...prev,
                ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                  idx === 0 ? { ...item, imeiNumbers: updatedImeis } : item
                ),
              }));
            }}
          />
        </td>
      </tr>
    ))}
  </tbody>
</Table>

          
                {/* Additional Fields */}
<Button
  variant="secondary"
  className="mt-3"
  onClick={handleShowTextBox}
>
  Add Same Phone More Quantity with Another GB
</Button>

{showTextBox && (
        <>
          <Row>
            <Col>
              <Form.Group controlId="bulkRamMemory">
                <Form.Label>RAM/Memory</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter RAM/Memory"
                  value={bulkData.ramSimDetails[1]?.ramMemory || ""}
                  onChange={(e) =>
                    setBulkData((prev) => ({
                      ...prev,
                      ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                        idx === 1 ? { ...item, ramMemory: e.target.value } : item
                      ),
                    }))
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="bulkSimOption">
                <Form.Label>SIM Option</Form.Label>
                <Form.Select
                  value={bulkData.ramSimDetails[1]?.simOption || ""}
                  onChange={(e) =>
                    setBulkData((prev) => ({
                      ...prev,
                      ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                        idx === 1 ? { ...item, simOption: e.target.value } : item
                      ),
                    }))
                  }
                  required
                >
                  <option value="">Select SIM Option</option>
                  <option value="single">Single SIM</option>
                  <option value="dual">Dual SIM</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="bulkQuantity">
                <Form.Label>Number of Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Quantity"
                  value={bulkData.quantity}
                  onChange={(e) => {
                    const quantity = parseInt(e.target.value) || 0;
                    const simOption = bulkData.ramSimDetails[1]?.simOption || "single";
                    const imeiFields = Array(quantity).fill(
                      simOption === "dual"
                        ? { imei1: "", imei2: "", color: "" }
                        : { imei1: "", color: "" }
                    );

                    setBulkData((prev) => ({
                      ...prev,
                      quantity,
                      ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                        idx === 1 ? { ...item, imeiNumbers: imeiFields } : item
                      ),
                    }));
                  }}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* IMEI Fields Table */}
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>IMEI 1</th>
                {bulkData.ramSimDetails[1]?.simOption === "dual" && <th>IMEI 2</th>}
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {bulkData.ramSimDetails[1]?.imeiNumbers?.map((phone, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Form.Control
                      type="number"
                      placeholder="Enter IMEI 1"
                      value={phone.imei1} 
                      onChange={(e) => {
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                            idx === 1
                              ? {
                                  ...item,
                                  imeiNumbers: item.imeiNumbers.map((imei, i) =>
                                    i === index ? { ...imei, imei1: e.target.value } : imei
                                  ),
                                }
                              : item
                          ),
                        }));
                      }}
                      required
                    />
                  </td>
                  {bulkData.ramSimDetails[1]?.simOption === "dual" && (
                    <td>
                      <Form.Control
                        type="number"
                        placeholder="Enter IMEI 2"
                        value={phone.imei2}
                        onChange={(e) => {
                          setBulkData((prev) => ({
                            ...prev,
                            ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                              idx === 1
                                ? {
                                    ...item,
                                    imeiNumbers: item.imeiNumbers.map((imei, i) =>
                                      i === index ? { ...imei, imei2: e.target.value } : imei
                                    ),
                                  }
                                : item
                            ),
                          }));
                        }}
                        required
                      />
                    </td>
                  )}
                  <td>
                    <Form.Control
                      type="text"
                      placeholder="Enter Color"
                      value={phone.color}
                      onChange={(e) => {
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, idx) =>
                            idx === 1
                              ? {
                                  ...item,
                                  imeiNumbers: item.imeiNumbers.map((imei, i) =>
                                    i === index ? { ...imei, color: e.target.value } : imei
                                  ),
                                }
                              : item
                          ),
                        }));
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

                
                <Row>
                  <Col>
                    <Form.Group controlId="bulkBuyingPrice">
                      <Form.Label>Buying Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Buying Price"
                        value={bulkData.buyingPrice}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, buyingPrice: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="bulkDealerPrice">
                      <Form.Label>Dealer Price (DP%)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter DP%"
                        value={bulkData.dealerPrice}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, dealerPrice: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="bulkLP">
                      <Form.Label>LP</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter LP"
                        value={bulkData.lp}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, lp: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="bulkLifting">
                      <Form.Label>Lifting</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Lifting"
                        value={bulkData.lifting}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, lifting: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="bulkActivation">
                      <Form.Label>Activation</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Activation"
                        value={bulkData.activation}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, activation: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="bulkPromo">
                      <Form.Label>Promo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Promo"
                        value={bulkData.promo}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, promo: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                
                </Row>
          
                
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleBulkPhoneModalclose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                // onClick={() => {
                //   if (bulkData.imeis.length < bulkData.quantity) {
                //     alert(
                //       `Please add IMEIs for all ${bulkData.quantity} phones before saving.`
                //     );
                //     return;
                //   }
                //   alert("Bulk Purchase Saved!");
                // }}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
)

};

export default BulkPurchaseModal;