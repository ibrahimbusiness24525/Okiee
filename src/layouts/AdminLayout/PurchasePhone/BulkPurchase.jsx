import { text } from "d3";
import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Table , Image } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'config/constant';
import { FaBarcode } from "react-icons/fa";
import { api } from "../../../../api/api";

const BulkPurchaseModal = ({ handleBulkPhoneModalclose, handleSubmit,showBulkModal, modal,editMobile, handleModalClose , bulkData , setBulkData , handleAddMorePhones }) => {

const[showTextBox,setShowTextBox]= useState(false)
const[partyNames,setPartyNames] =  useState([])
const handleShowTextBox = () => {
  setBulkData((prev) => ({
    ...prev,
    ramSimDetails: [
      ...prev.ramSimDetails,
      {
        companyName: "",
        modelName: "",
        batteryHealth: "",
        ramMemory: "",
        simOption: "",
        priceOfOne: "",
        imeiNumbers: [],
      },
    ],
  }));
  setShowTextBox(true);
};

const handleRemoveTextBox = (indexToRemove) => {
  setBulkData((prev) => ({
    ...prev,
    ramSimDetails: prev.ramSimDetails.filter((_, idx) => idx !== indexToRemove),
  }));
};

const getAllPartyNames = async( ) =>{
  try{
    const response =  await api.get("/api/partyLedger/getAllNames");
    setPartyNames(response?.data?.data)
  }catch(error){
    console.log("Error getting in name", error)
  }
}

useEffect(()=>{
    getAllPartyNames()
},[])


console.log("data to check",editMobile)

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
                      <Form.Select
                          as="select"
                          value={bulkData.partyName}
                          onChange={(e) =>
                            setBulkData({ ...bulkData, partyName: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Party Name</option>
                          {partyNames.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option> 
                          ))}
                        </Form.Select>
                      {/* <Form.Control
                        type="text"
                        placeholder="Enter Party Name"
                        value={bulkData.partyName}
                        onChange={(e) =>
                          setBulkData({ ...bulkData, partyName: e.target.value })
                        }
                        required
                      /> */}
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
          


                {bulkData.ramSimDetails.map((detail, idx) => (
  <div key={idx}>
    <Row className="mt-4">
      <Col>
        <Form.Group controlId={`companyName-${idx}`}>
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Company Name"
            value={detail.companyName}
            onChange={(e) =>
              setBulkData((prev) => ({
                ...prev,
                ramSimDetails: prev.ramSimDetails.map((item, i) =>
                  i === idx ? { ...item, companyName: e.target.value } : item
                ),
              }))
            }
          />
        </Form.Group>
      </Col>

      <Col>
        <Form.Group controlId={`modelName-${idx}`}>
          <Form.Label>Model Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Model Name"
            value={detail.modelName}
            onChange={(e) =>
              setBulkData((prev) => ({
                ...prev,
                ramSimDetails: prev.ramSimDetails.map((item, i) =>
                  i === idx ? { ...item, modelName: e.target.value } : item
                ),
              }))
            }
          />
        </Form.Group>
      </Col>
    </Row>

    <Row>
      <Col>
        <Form.Group controlId={`ramMemory-${idx}`}>
          <Form.Label>RAM/Memory</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter RAM/Memory"
            value={detail.ramMemory}
            onChange={(e) =>
              setBulkData((prev) => ({
                ...prev,
                ramSimDetails: prev.ramSimDetails.map((item, i) =>
                  i === idx ? { ...item, ramMemory: e.target.value } : item
                ),
              }))
            }
          />
        </Form.Group>
      </Col>

      <Col>
        <Form.Group controlId={`simOption-${idx}`}>
          <Form.Label>SIM Option</Form.Label>
          <Form.Select
            value={detail.simOption}
            onChange={(e) => {
              const simOption = e.target.value;
              const quantity = detail.quantity || 0;
              const imeiFields = Array(quantity).fill(
                simOption === "Dual SIM"
                  ? { imei1: "", imei2: "", color: "" }
                  : { imei1: "", color: "" }
              );
              setBulkData((prev) => ({
                ...prev,
                ramSimDetails: prev.ramSimDetails.map((item, i) =>
                  i === idx
                    ? { ...item, simOption, imeiNumbers: imeiFields }
                    : item
                ),
              }));
            }}
          >
            <option value="">Select SIM Option</option>
            <option value="Single SIM">Single SIM</option>
            <option value="Dual SIM">Dual SIM</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col>
        <Form.Group controlId={`quantity-${idx}`}>
          <Form.Label>Number of Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Quantity"
            value={detail.quantity || ""}
            onChange={(e) => {
              const quantity = parseInt(e.target.value) || 0;
              const simOption = detail.simOption || "Single SIM";
              const imeiFields = Array(quantity).fill(
                simOption === "Dual SIM"
                  ? { imei1: "", imei2: "", color: "" }
                  : { imei1: "", color: "" }
              );
              setBulkData((prev) => ({
                ...prev,
                ramSimDetails: prev.ramSimDetails.map((item, i) =>
                  i === idx
                    ? { ...item, quantity, imeiNumbers: imeiFields }
                    : item
                ),
              }));
            }}
          />
        </Form.Group>
      </Col>
    </Row>

    {detail.imeiNumbers.length > 0 && (
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>IMEI 1</th>
            {detail.simOption === "Dual SIM" && <th>IMEI 2</th>}
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {detail.imeiNumbers.map((phone, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <Form.Control
                  type="text"
                  value={phone.imei1}
                  onChange={(e) => {
                    const newIMEIs = detail.imeiNumbers.map((p, j) =>
                      j === i ? { ...p, imei1: e.target.value } : p
                    );
                    setBulkData((prev) => ({
                      ...prev,
                      ramSimDetails: prev.ramSimDetails.map((item, k) =>
                        k === idx ? { ...item, imeiNumbers: newIMEIs } : item
                      ),
                    }));
                  }}
                />
              </td>
              {detail.simOption === "Dual SIM" && (
                <td>
                  <Form.Control
                    type="text"
                    value={phone.imei2}
                    onChange={(e) => {
                      const newIMEIs = detail.imeiNumbers.map((p, j) =>
                        j === i ? { ...p, imei2: e.target.value } : p
                      );
                      setBulkData((prev) => ({
                        ...prev,
                        ramSimDetails: prev.ramSimDetails.map((item, k) =>
                          k === idx ? { ...item, imeiNumbers: newIMEIs } : item
                        ),
                      }));
                    }}
                  />
                </td>
              )}
              <td>
                <Form.Control
                  type="text"
                  value={phone.color}
                  onChange={(e) => {
                    const newIMEIs = detail.imeiNumbers.map((p, j) =>
                      j === i ? { ...p, color: e.target.value } : p
                    );
                    setBulkData((prev) => ({
                      ...prev,
                      ramSimDetails: prev.ramSimDetails.map((item, k) =>
                        k === idx ? { ...item, imeiNumbers: newIMEIs } : item
                      ),
                    }));
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <Col>
</Col>

      </Table>
    )}
  <Form.Group controlId="priceOfOne">
    <Form.Label>Mobile Price (one piece)</Form.Label>
    <Form.Control
      type="text"
      placeholder="Enter Mobile Price"
      value={detail.priceOfOne}
      onChange={(e) =>
        setBulkData((prev) => ({
          ...prev,
          ramSimDetails: prev.ramSimDetails.map((item, i) =>
            i === idx ? { ...item, priceOfOne: e.target.value } : item
          ),
        }))
      }
      required
    />
  </Form.Group>
  <Button
  variant="danger"
  className="mt-2 mb-3"
  onClick={() => handleRemoveTextBox(idx)}
>
  Remove
</Button>
    <hr />
  </div>
))}

      <Button
        variant="secondary"
        className="mt-3"
        onClick={handleShowTextBox}
      >
        Add Another Quantity
      </Button>


                
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
                      <Form.Label>Dealer Price (Optional)</Form.Label>
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
                      <Form.Label>LP (Optional)</Form.Label>
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
                      <Form.Label>Lifting (Optional)</Form.Label>
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
                      <Form.Label>Activation (Optional)</Form.Label>
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
                      <Form.Label>Promo (Optional)</Form.Label>
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
                <Col style={{marginTop:"10px"}}>
                <Form.Group controlId="bulkPayment">
                  <Form.Label>Payment Type</Form.Label>
                  <Form.Select
                    value={bulkData.paymentType}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, paymentType: e.target.value })
                    }
                    required>
                    <option value="">Select Payment Type</option>
                    <option value="full-payment">Full Payment</option>  
                    <option value="credit">Credit</option>  
                    </Form.Select>
                </Form.Group>
                </Col>
                {bulkData.paymentType === "credit" && (

                <Row style={{marginTop:"10px"}}>
                  <Col>
                  <Form.Group controlId="payableAmountNow">
                    <Form.Label>Payable Amount Now</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Payable Amount Now"
                      value={bulkData.payableAmountNow}
                      onChange={(e) =>
                        setBulkData({ ...bulkData, payableAmountNow: e.target.value })
                      }
                      required />

                      
                  </Form.Group>
                  </Col>
                  <Col>
                  <Form.Group controlId="payableAmountLater">
                    <Form.Label>Payable Amount Later</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Payable Amount Now"
                      value={bulkData.payableAmountLater}
                      onChange={(e) =>
                        setBulkData({ ...bulkData, payableAmountLater: e.target.value })
                      }
                      required />

                      
                  </Form.Group>
                  </Col>
                  <Col>
                  <Form.Group controlId="payableAmountLater">
                    <Form.Label>First Payment Date/Payment Date</Form.Label>
                    <Form.Control
                      type="Date"
                      placeholder="Enter Payment Date"
                      value={bulkData.paymentDate}
                      onChange={(e) =>
                        setBulkData({ ...bulkData, paymentDate: e.target.value })
                      }
                      required />
                  </Form.Group>
                  </Col>
                </Row>
                )}
          
                
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleBulkPhoneModalclose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
   
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
)

};

export default BulkPurchaseModal;