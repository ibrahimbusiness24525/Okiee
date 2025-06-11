import { text } from "d3";
import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Table , Image } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'config/constant';
import { FaBarcode } from "react-icons/fa";
import { api } from "../../../../api/api";
import WalletTransactionModal from "components/WalletTransaction/WalletTransactionModal";

const SingalPurchaseModal = ({handleSinglePhoneModalclose,type="purchase", setSinglePurchase, showSingleModal, modal,editMobile,handleAccessoriesCheck, handleImageChange, handleModalClose , handleSubmit , handleChange , singlePurchase , today }) => {
  const [banks, setBanks] = useState([]);
  const[showWalletTransactionModal, setShowWalletTransactionModal] = useState(false)
  const[showBankModal, setShowBankModal] = useState(false)
  const[showPocketCashModal,setShowPocketCashModal] = useState(false)
       const [showWarranty, setShowWarranty] = useState(false);
        const [loading, setLoading] = useState(false);
        // const todayDate = new Date().toISOString().split("T")[0]; 
        const getAllBanks = async () => {
          try {
            const response = await api.get('/api/banks/getAllBanks'); // your get all banks endpoint
 
            setBanks(response?.data?.banks); // Set the banks state with the fetched data
          } catch (error) {
            console.error('Error fetching banks:', error);
          }
        }
      
        useEffect(() => {
          getAllBanks(); // Fetch all banks when the component mounts
        }
        , []);
      
    

    return(
         
           <>

                <Modal show={showSingleModal} onHide={handleSinglePhoneModalclose} centered size="lg">
                <Modal.Header closeButton>
                  <Modal.Title style={{ textAlign: "center", width: "100%" }}>{type==="edit" ? "Edit Phone": "Purchase Phone Slip"}</Modal.Title>
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
                      {/* <Form.Group controlId="purchasePhoneFatherName" style={{ width: "48%" }}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Father Name</Form.Label>
                        <Form.Control type="text" placeholder="Father Name" value={singlePurchase.fatherName}
                         name="fatherName"
                            onChange={handleChange}  />
                      </Form.Group> */}
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
                      <Form.Group controlId="purchasePhoneModel" style={{ width: "48%" ,marginTop:"10px"}}>
                        <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Battery Health (optional)</Form.Label>
                        <Form.Control value={singlePurchase.batteryHealth}
                         name="batteryHealth"
                            onChange={handleChange} type="text" placeholder="Enter Battery Health"  />
                      </Form.Group>
                   
        
                    {/* Accessories Section */}
                    <div style={{ marginTop: "10px" }}>
  <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>
    Accessories (optional)
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
        required
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
          <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Color (optional)</Form.Label>
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
            Phone Picture (optional)
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
            Person Picture (optional)
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
            E-Gadget Status Picture (optional)
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
                    <div style={{marginTop:"1rem"}}>

     </div>
      {type === "purchase" &&
      <>
            
          <Button variant="secondary" onClick={()=> setShowWalletTransactionModal(!showWalletTransactionModal)}>Proceed To Pay</Button>
            {/* <Button variant="secondary" onClick={()=> setShowBankModal(!showBankModal)}>Pay Through Wallet (optional)</Button>
            <Button variant="secondary" onClick={()=> setShowPocketCashModal(!showPocketCashModal)}>Pay Through Pocket (optional)</Button> */}
      </>
      }
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

                    <WalletTransactionModal
                      show={showWalletTransactionModal}
                      toggleModal={() => setShowWalletTransactionModal(!showWalletTransactionModal)}
                      singleTransaction={singlePurchase}
                      setSingleTransaction={setSinglePurchase}
                    />
                    
                    <Modal.Footer>
                  <Button variant="secondary" onClick={handleSinglePhoneModalclose}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                      {type === "edit" ? "Update" : "Save"}
                    </Button>
                </Modal.Footer>
                  </Form>
                </Modal.Body>

              </Modal>
              <Modal toggleModal={() => setShowBankModal(!showBankModal)} size="md" show={showBankModal}>
  <div style={{ padding: '30px', textAlign: 'center' }}>
    <h2 style={{ marginBottom: '10px', fontSize: '26px', fontWeight: 'bold' }}>Select Bank</h2>
    <p style={{ marginBottom: '25px', fontSize: '16px', color: '#555' }}>
      The cash will be deducted from your selected bank.
    </p>

    <div style={{ marginBottom: '0px', maxWidth: '400px', margin: '0 auto' }}>
      <Form.Group controlId="purchasePhoneBank">
        <Form.Label style={{ fontWeight: 'bold', marginBottom: '8px' }}>Bank Account</Form.Label>
        <Form.Select
          value={singlePurchase.bankAccountUsed || ""}
          onChange={(e) =>
            setSinglePurchase({ ...singlePurchase, bankAccountUsed: e.target.value })
          }
          style={{ padding: '10px', borderRadius: '6px', fontSize: '15px' }}
        >
          <option value="">-- Select Bank --</option>
          {Array.isArray(banks) &&
            banks.map((bank) => (
              <option key={bank._id} value={bank._id}>
                {bank.bankName} - {bank.accountType}
              </option>
            ))}
        </Form.Select>
      <Form.Control
        value={singlePurchase.amountFromBank}
        name="amountFromBank"
        onChange={handleChange}
        type="number"
        placeholder="Enter amount to pay from bank"
        required
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginTop: '5px',
          fontSize: '14px',
        }}
      />
      </Form.Group>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setShowBankModal(false)}
        style={{ minWidth: '100px', padding: '8px 0', fontSize: '14px', borderRadius: '6px' }}
      >
        Save
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => {
          setSinglePurchase((prevState) => ({
            ...prevState,
            amountFromBank: "",
            bankAccountUsed:"", // Clear the purchase value
          }));
          setShowBankModal(false)
        }
        }
        style={{ minWidth: '100px', padding: '8px 0', fontSize: '14px', borderRadius: '6px' }}
      >
        Cancel
      </Button>
    </div>
  </div>
</Modal>
<Modal 
  toggleModal={() => setShowPocketCashModal(!showPocketCashModal)} 
  size="md" 
  show={showPocketCashModal}
  
>
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
      Enter amount to pay from pocket cash
    </p>
    <Form.Group controlId="purchasePhoneFinalPrice" style={{ marginBottom: '20px' }}>
      <Form.Control
        value={singlePurchase.amountFromPocket}
        name="amountFromPocket"
        onChange={handleChange}
        type="number"
        placeholder="Final Price"
        required
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginTop: '5px',
          fontSize: '14px',
        }}
      />
    </Form.Group>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setShowPocketCashModal(false)}
        style={{ minWidth: '100px', padding: '8px 0', fontSize: '14px', borderRadius: '6px' }}
      >
        Save
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => {
          setSinglePurchase((prevState) => ({
            ...prevState,
            amountFromPocket: "", // Clear the purchase value
          }));
          setShowPocketCashModal(false)
        }}
        style={{ minWidth: '100px', padding: '8px 0', fontSize: '14px', borderRadius: '6px' }}
      >
        Cancel
      </Button>
    </div>
  </div>
  
</Modal>

           </>
              
              
              
              )}
    



export default SingalPurchaseModal;