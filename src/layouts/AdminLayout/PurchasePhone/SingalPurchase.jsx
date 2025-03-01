import { text } from "d3";
import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Table , Image } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'config/constant';
import { FaBarcode } from "react-icons/fa";

const SingalPurchaseModal = ({handleSinglePhoneModalclose, setSinglePurchase, showSingleModal, modal,editMobile,handleAccessoriesCheck, handleImageChange, handleModalClose , handleSubmit , handleChange , singlePurchase , today }) => {

      const [showWarranty, setShowWarranty] = useState(false);
        const [loading, setLoading] = useState(false);
        // const todayDate = new Date().toISOString().split("T")[0]; 
        

    return(
         
                <Modal show={showSingleModal} onHide={handleSinglePhoneModalclose} centered size="lg">
                <Modal.Header closeButton>
                  <Modal.Title style={{ textAlign: "center", width: "100%" }}>Purchase Phone Slip</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
        
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
        
                    <Form.Group controlId="purchasePhoneName" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name" value={singlePurchase.name}
                         name="name"
                            onChange={handleChange} required />
                      </Form.Group>
        
                      <Form.Group controlId="purchasePhoneDate" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Date</Form.Label>
                        <Form.Control type="date"
                         defaultValue={singlePurchase.date} 
                         value={singlePurchase.date}
                        //  defaultValue={todayDate} 
                        //  value={todayDate}
                          // readOnly

                            name="date"
                            onChange={handleChange}  required />
                      </Form.Group>
                     
                    </div>
              
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                      <Form.Group controlId="purchasePhoneFatherName" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Father Name</Form.Label>
                        <Form.Control type="text" placeholder="Father Name" value={singlePurchase.fatherName}
                         name="fatherName"
                            onChange={handleChange}  />
                      </Form.Group>
                      <Form.Group controlId="purchasePhoneCNIC" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>CNIC No#</Form.Label>
                        <Form.Control value={singlePurchase.cnic}
                         name="cnic"
                            onChange={handleChange} type="text" placeholder="---- ---- ---- ----" required />
                      </Form.Group>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                      <Form.Group controlId="purchasePhoneCompany" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Company</Form.Label>
                        <Form.Control value={singlePurchase.companyName}
                         name="companyName"
                            onChange={handleChange} type="text" placeholder="Enter Company Name" required />
                      </Form.Group>
                      <Form.Group controlId="purchasePhoneModel" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Model</Form.Label>
                        <Form.Control value={singlePurchase.modelName}
                         name="modelName"
                            onChange={handleChange} type="text" placeholder="Enter Model Name" required />
                      </Form.Group>
                    </div>
                   
        
                    {/* Accessories Section */}
                    <div style={{ marginTop: "10px" }}>
  <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>
    Accessories
  </Form.Label>
  <Row>
    {["charger", "handFree", "box"].map((item) => (
      <Form.Group key={item} style={{ width: "30%" }}>
        <Form.Check
          type="checkbox"
          id={item}
          name={item}
          label={item}
          value={item}
          checked={singlePurchase.accessories[item]} // Bind state
          onChange={handleAccessoriesCheck}
        />
      </Form.Group>
    ))}
  </Row>
</div>
              
                    {/* Phone Condition Section */}
                    <div style={{ marginTop: "10px" }}>
  <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>
    Phone Condition
  </Form.Label>
  <Row>
    <Form.Group style={{ width: "30%" }}>
      <Form.Check
        type="radio"
        id="phoneNew"
        name="phoneCondition"
        label="New"
        value="New"
        checked={singlePurchase.phoneCondition === "New"} // Bind state
        onChange={(e) => {
          handleChange(e);
          setShowWarranty(false);
        }}
      />
    </Form.Group>
    <Form.Group style={{ width: "30%" }}>
      <Form.Check
        type="radio"
        id="phoneUsed"
        name="phoneCondition"
        label="Used"
        value="Used"
        checked={singlePurchase.phoneCondition === "Used"} // Bind state
        onChange={(e) => {
          handleChange(e);
          setShowWarranty(true);
        }}
      />
    </Form.Group>
  </Row>
</div>

{/* Conditional Warranty Field */}
{showWarranty && (
  <div style={{ marginTop: "10px" }}>
    <Form.Group controlId="purchasePhoneWarranty">
      <Form.Label>Remaining Company Warranty</Form.Label>
      <Form.Select
        value={singlePurchase.warranty} // Bind state
        onChange={(e) =>
          setSinglePurchase({ ...singlePurchase, warranty: e.target.value })
        }
      >
        <option value="">Select warranty</option>
        <option value="No Warranty">No warranty</option>
        {[...Array(12).keys()].map((month) => (
          <option key={month} value={`${month + 1} Month${month + 1 > 1 ? "s" : ""}`}>
            {month + 1} Month{month + 1 > 1 ? "s" : ""}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </div>
)}
        
              
                    {/* E-Gadget Status Pic Field */}
              
                    {/* Specifications Section */}
                    <div style={{ marginTop: "15px" }}>
  <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>
    Specifications
  </Form.Label>
  <Row style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
    {["PTA", "Non-PTA FU", "Non-PTA JV","CPID","Patch Approval","Other"].map((spec) => (
      <Form.Group key={spec} style={{ width: "30%" }}>
        <Col>
          <Form.Check
            value={spec}
            type="radio"
            id={spec.toLowerCase().replace(/\s+/g, "-")}
            name="specifications"
            label={spec}
            checked={singlePurchase.specifications === spec} // Bind state
            onChange={handleChange}
          />
        </Col>
      </Form.Group>
    ))}
  </Row>
</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        
        <Form.Group controlId="Ram/Memory" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Ram/Memory</Form.Label>
          <Form.Control value={singlePurchase.ramMemory}
           name="ramMemory"
                            onChange={handleChange} type="text" placeholder="Enter Ram/Memory" required />
        </Form.Group>
        
        <Form.Group controlId="Color" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Color</Form.Label>
          <Form.Control value={singlePurchase.color}
           name="color"
                            onChange={handleChange} type="text" placeholder="Enter Color" />
        </Form.Group>
        
        </div>
        
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        
        <Form.Group controlId="purchasePhoneIMEI1" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>IMEI #1</Form.Label>
          <Form.Control value={singlePurchase.imei1}
           name="imei1"
                            onChange={handleChange} type="text" placeholder="Enter IMEI #1" required />
        </Form.Group>
        
        <Form.Group controlId="purchasePhoneIMEI2" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>IMEI #2</Form.Label>
          <Form.Control value={singlePurchase.imei2}
           name="imei2"
                            onChange={handleChange} type="text" placeholder="Enter IMEI #2" />
        </Form.Group>
        
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        
        {/* Phone Pic Field */}
        <Form.Group controlId="purchasePhonePic" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>
            Phone Picture
          </Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "phonePicture")}
          />
          {singlePurchase.phonePicture && (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(singlePurchase.phonePicture)}
                alt="Phone Picture"
                rounded
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </Form.Group>
        
        <Form.Group controlId="purchasePersonPic" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>
            Person Picture
          </Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "personPicture")}
          />
          {singlePurchase.personPicture && (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(singlePurchase.personPicture)}
                alt="Person Picture"
                rounded
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </Form.Group>
        
        </div>
                    <div style={{ marginTop: "15px", lineHeight: "2.0" }}>
                      <p style={{ fontSize: "17px" }}>
                        جو کہ میری ذاتی ملکیت ہے۔ میں نے اپنے ماڈل کے تمام فنکشنز کو خود چیک کر لیا ہے۔
                        میں نے تصدیق کی ہے کہ یہ چوری شدہ یا غیر قانونی نہیں ہے۔ اگر ایسا پایا گیا تو
                        اس کا میں خود ذمہ دار ہوں گا اور اس سے ہونے والے تمام نقصانات کا ازالہ خود
                        کروں گا۔
                      </p>
                      <p style={{ fontSize: "17px" }}>
                        میں نے اس بات کی مکمل وضاحت کر دی ہے۔ میں نے اس موبائل کو بغیر کسی
                        دباو کے اپنی مرضی سے فروخت کیا ہے۔
                      </p>
                    </div>
              
                    {/* Approval Checkbox */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                      
                      <Form.Group controlId="purchasePhoneMobileNumber" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Mobile Number</Form.Label>
                        <Form.Control value={singlePurchase.mobileNumber}
                         name="mobileNumber"
                            onChange={handleChange} type="text" placeholder="Enter Mobile Number" required />
                      </Form.Group>
                      <Form.Group controlId="purchasePhonePrice" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Purchase Price</Form.Label>
          <Form.Control
            value={singlePurchase.purchasePrice}
            name="purchasePrice"
            onChange={handleChange}
            type="number"
            placeholder="Enter Purchase Price"
            required
          />
        </Form.Group>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
        
        
                    <Form.Check
                        type="checkbox"
                        id="approvedByEgadget"
                        label="Approved from E-gadget"
                        style={{ width: "48%", fontWeight: "bold", fontSize: "20px", marginTop: "25px" }}
                        value={singlePurchase.isApprovedFromEgadgets}
                         name="isApprovedFromEgadgets"
                            onChange={handleChange}
                      />
        
        <Form.Group controlId="eGadgetStatusPic" style={{ width: "48%" }}>
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>
            E-Gadget Status Picture
          </Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "eGadgetStatusPicture")}
          />
          {singlePurchase.eGadgetStatusPicture && (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(singlePurchase.eGadgetStatusPicture)}
                alt="E-Gadget Status"
                rounded
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </Form.Group>
                    </div>
        
                    <div style={{ marginTop: "15px" }}>
                      <Form.Label style={{ fontWeight: "bold", fontSize: "15px" }}>To Show on Available Phones (Optional)</Form.Label>
                      <Row>
          <Col>
            <Form.Group controlId="purchasePhoneDemandPrice">
              <Form.Label>Demand Price</Form.Label>
              <Form.Control
                value={singlePurchase.demandPrice}
                name="demandPrice"
                onChange={handleChange}
                type="number"
                placeholder="Demand Price"
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="purchasePhoneFinalPrice">
              <Form.Label>Final Price</Form.Label>
              <Form.Control
                value={singlePurchase.finalPrice}
                name="finalPrice"
                onChange={handleChange}
                type="number"
                placeholder="Final Price"
                required
              />
            </Form.Group>
          </Col>
        </Row>
                    </div>
              
                    <div
                      style={{
                        marginTop: "20px",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      نوٹ: ادارہ ہذا نے یہ موبائل سمیت نیک نیتی کی بنیاد پر خریدا کیا ہے۔
                    </div>
                    <Modal.Footer>
                  <Button variant="secondary" onClick={handleSinglePhoneModalclose}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (editMobile ? 'Updating...' : 'Adding...') : editMobile ? 'Update Phone' : 'Add Phone'}
                    </Button>
                </Modal.Footer>
                  </Form>
                </Modal.Body>
                
              </Modal>
              
              
              )}
    



export default SingalPurchaseModal;