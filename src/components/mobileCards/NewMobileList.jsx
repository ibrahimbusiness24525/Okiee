import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import bulkMobileImage from "../../assets/images/phoneBoxes.jpg"
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import useScanDetection from 'use-scan-detection';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';
import List from '../List/List'
import Table from 'components/Table/Table';
import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
const NewMobilesList = () => {
  const [mobiles, setMobiles] = useState([]);
  const[bankName,setBankName]= useState("");
  const[payableAmountNow,setPayableAmountNow]= useState("")
  const[payableAmountLater,setPayableAmountLater]= useState("");
  const[payableAmountLaterDate,setPayableAmountLaterDate]=useState("");
  const[exchangePhoneDetail,setExchangePhoneDetail]= useState("");
  const [type, setType] = useState("");
  const[cnicFrontPic,setCnicFrontPic]= useState("");
  const[cnicBackPic,setCnicBackPic]= useState("");
  const[sellingType,setSellingType]= useState("")
  const[accessoryName,setAccessoryName] = useState("");
  const[accessoryPrice,setAccessoryPrice]= useState(0);
  const [accessories, setAccessories] = useState([
    { name: "", quantity: 1, price: "" }
  ]);
  const [bulkMobile, setBulkMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMobile, setEditMobile] = useState(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldMobile, setSoldMobile] = useState(null);
  const[customerName,setCustomerName] = useState("");
  const [finalPrice, setFinalPrice] = useState('');
  const [warranty, setWarranty] = useState('12 months');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMobileId, setDeleteMobileId] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchMobile, setDispatchMobile] = useState(null);
  const [shopName, setShopName] = useState('');
  const [personName, setPersonName] = useState('');
  const [imeiInput, setImeiInput] = useState(""); // Input field for new IMEI
  const [addedImeis, setAddedImeis] = useState([]);
  const[bulkData,setBulkData]= useState([])
    const[list,setList]= useState(false)
  const navigate = useNavigate();
 

  const handleAddImei = () => {
    if (imeiInput.trim() !== "" && !imeis.includes(imeiInput)) {
      setAddedImeis([...addedImeis, imeiInput]);
      setImeiInput(""); // Clear input after adding
    }
  };

  const handleRemoveImei = (imeiToRemove) => {
    setAddedImeis(imeis.filter(imei => imei !== imeiToRemove));
  };

  useEffect(() => {
    getMobiles();
  }, []);

  const getMobiles = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // const response = await axios.get(BASE_URL + `api/phone/getAllPhones/${user._id}`);
    const response = await api.get("/api/Purchase/purchase-phone")
    setMobiles(response.data.phones);
  };
  const getActualPrice = (prices) => {
    if (!prices || !prices.buyingPrice) return 0;
  
    const { buyingPrice, dealerPrice, lp, lifting, promo, activation } = prices;
  
    const dealerDiscount = buyingPrice * (Number(dealerPrice) / 100 || 0);
  
    const actualPrice =
      Number(buyingPrice) -
      dealerDiscount -
      (Number(lp) || 0) -
      (Number(lifting) || 0) -
      (Number(promo) || 0) -
      (Number(activation) || 0);
  
    return parseInt(Math.abs(actualPrice));
  };
  
  


  const deletePhone = async () => {

    try {
      if(type === "bulk"){
        await api.delete(`/api/Purchase/purchase-bulk/delete/${deleteMobileId}`);
      }else{
        await api.delete(`/api/Purchase/purchase-phone/delete/${deleteMobileId}`);
      }
      setMobiles((prevMobiles) => prevMobiles.filter((mobile) => mobile._id !== deleteMobileId));
    } 
    catch (error) {
      console.error('Error deleting phone:', error);
    } 
    finally {
      setShowDeleteModal(false);
    }

  };

  const handleDispatchClick = (mobile) => {
    setDispatchMobile(mobile);
    setShowDispatchModal(true);
  };
  
  const handleDispatchSubmit = () => {
    if (!shopName || !personName) {
      alert('Please fill all fields');
      return;
    }
  
    const dispatchDetails = {
      ...dispatchMobile,
      shopName,
      personName,
    };
  
    // You can navigate or perform any API call here with dispatchDetails
  
    setShopName('');
    setPersonName('');
    setShowDispatchModal(false);
  };
  

  const handleEdit = (mobile) => {
    setEditMobile(mobile);
    setShowModal(true);
  };
  const getBulkPhones = async() =>{
    try{
      const response =  await api.get("/api/Purchase/bulk-phone-purchase");
      setBulkData(response.data)
      setBulkMobiles(response.data.filter((item) => 
        item.ramSimDetails?.some((ramSim) =>
          ramSim.imeiNumbers?.some((imei) => 
            imei.imei1?.includes(searchTerm) || imei.imei2?.includes(searchTerm)
          )
        )
      ));
    }catch(error){
      console.log("error in getting bulk mobiles", error);
    }
  }
  useEffect(()=>{
    setBulkMobiles(bulkData.filter((item) => 
      item.ramSimDetails?.some((ramSim) =>
        ramSim.imeiNumbers?.some((imei) => 
          imei.imei1?.includes(searchTerm) || imei.imei2?.includes(searchTerm)
        )
      )
    ));
  },[searchTerm])
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSoldClick = (mobile,type) => {
    
    if(type==="bulk"){
      setType("bulk")
    }
    if(type==="single"){
      setType("single")
    }
 
    setSoldMobile(mobile);
    setShowSoldModal(true);
  };

  const handleSoldSubmit = async () => {
    if (!finalPrice || !warranty) {
      alert('Please fill all fields');
      return;
    }

    const updatedMobile = {
      ...soldMobile,
      finalPrice,
      sellingType,
      warranty,
      addedImeis,
      cnicBackPic,
      cnicFrontPic,
      customerName,
      // accessoryName,
      // accessoryPrice,
      accessories,
      bankName,
      payableAmountNow,
      payableAmountLater,
      payableAmountLaterDate,
      exchangePhoneDetail
    };

    navigate('/invoice/shop', { state: updatedMobile });
    setFinalPrice('');
    setShowSoldModal(false);
  };

  const confirmDelete = (mobileId) => {
    setDeleteMobileId(mobileId);
    setShowDeleteModal(true);
    setType("single");
  };

  const handleShareInventory = () => {
    const doc = new jsPDF();
    doc.text('Mobile Inventory', 10, 10);

    mobiles.forEach((mobile, index) => {
      const { images, companyName, modelSpecifications , specs, color } = mobile;
      const imgData = `data:image/jpeg;base64,${images[0]}`;
      const y = 20 + index * 50;

      if (imgData) {
        doc.addImage(imgData, 'JPEG', 10, y, 30, 30);
      }
      doc.text(`Company: ${companyName}`, 50, y + 5);
      doc.text(`Model: ${modelSpecifications}`, 50, y + 15);
      doc.text(`Specification: ${specs}`, 50, y + 25);
      doc.text(`Color: ${color}`, 50, y + 35);
    });

    doc.save('Mobile_Inventory.pdf');
  };
  const filteredMobiles = mobiles?.filter((mobile) => {
    // Exclude sold phones
    if (mobile.isSold) return false;
    if(mobile.phoneCondition==="Used") return false
    if(mobile.imei1.includes(searchTerm) || mobile.imei2.includes(searchTerm)) return true
  
    // Split the search term into words
    const searchWords = searchTerm?.toLowerCase()?.split(/\s+/);
  
    return searchWords.every((word) =>
      // Check if each word exists in any of the searchable fields
      mobile.companyName?.toLowerCase()?.includes(word) ||
      mobile.modelSpecifications?.toLowerCase()?.includes(word) ||
      mobile.specs?.toLowerCase()?.includes(word) ||
      mobile.color?.toLowerCase()?.includes(word) || // Example: Searching by color if needed
      String(mobile.purchasePrice)?.includes(word)  // Example: Searching by price if needed
    );
  });
  
  useEffect(()=>{
    getBulkPhones()
  },[])
  const [showPrices, setShowPrices] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState(null);
  const [imeis, setImeis] = useState([]);
  const [scanning, setScanning] = useState(false);
  const handleScan = (err, result) => {
    if (result) {
      if (!imeis.includes(result.text)) {
        setImeis((prev) => [...prev, result.text]); // Add IMEI if not duplicated
      }
      setScanning(false); // Stop scanning after reading
    }
  };
const[barcodeScan,setBarcodeScan] = useState("No Barcode Scanned")
useScanDetection({
  onComplete:setBarcodeScan,
  minLength:3,
})

  const handleShowPrices = (mobile) => {
    setSelectedMobile(mobile);
    setShowPrices(true);
  };

  const handleClosePrices = () => {
    setShowPrices(false);
    setSelectedMobile(null);
  };
  const handleBulkDelete = (id) =>{
    setDeleteMobileId(id);
    setType("bulk");
    setShowDeleteModal(true);
  }
  const handleAccessoryChange = (index, field, value) => {
    const updatedAccessories = [...accessories];
    updatedAccessories[index][field] = value;
    setAccessories(updatedAccessories);
  };

  // Add New Accessory
  const addAccessory = () => {
    setAccessories([...accessories, { name: "", quantity: 1, price: "" }]);
  };

  // Remove Accessory
  const removeAccessory = (index) => {
    const updatedAccessories = accessories.filter((_, i) => i !== index);
    setAccessories(updatedAccessories);
  };
  return (
    <>
     <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name or company"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
      {/* Search bar */}
      

      <div className="d-flex justify-content-between align-items-center mb-3">
   {/* Total Stock Amount */}
   <div>
    <h5 style={{fontSize: 30}}>
      {/* Total Stock Amount:  */}
      Total Stock Amount : 
      <span style={{ fontWeight: 'bold', color: '#007bff' , fontSize: 30 }}>
        {mobiles.reduce((total, mobile) => total + (mobile.purchasePrice || 0), 0)}
      </span>
    </h5>
  </div>

  {/* Share Inventory Button */}
  <Button
     variant="primary"
     onClick={handleShareInventory}
     style={{ backgroundColor: '#007bff', border: 'none' }}
   >
     Share Inventory
   </Button>

</div>
<button
  onClick={() => setList(!list)}
  style={{
    padding: "10px 16px",
    backgroundColor: "#2563EB",
    color: "white",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1E40AF")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
>
  Change Record Design
</button>
<h3 style={{marginTop:"1rem",marginBottom:"1rem"}}>New Single Phones</h3>
      {list? 
    <>
      {/* <List items={filteredMobiles}
      displayKeys={["modelSpecifications","companyName", "finalPrice","phoneCondition","warranty"]}
      descriptions={["Model Name","Company Name","Final Price","Condition","Warranty"]}
      onRowClick={"handleClick"}
      /> */}
      <Table
      // routes={["/purchase/purchaseRecords"]}
           array={filteredMobiles}
          //  search={"imei1"}
           keysToDisplay={["modelSpecifications", "companyName","finalPrice", "phoneCondition", "warranty"]}
           label={[
               "Model Name",
               "Company Name",
               "Final Price",
               "Condition",
               "Warranty",
       
               "Actions",
           ]}
           
           extraColumns={[
             (obj) =>  
             <Button
             onClick={() => handleSoldClick(obj,"single")}
             style={{
               backgroundColor: '#28a745',
               color: '#fff',
               border: 'none',
               padding: '5px 10px',
               borderRadius: '5px',
               cursor: 'pointer',
               fontSize: '0.8rem',
             }}
           >
             Sold
           </Button>
         ]}
       />
    
    </> :<>
    <Row xs={1} md={2} lg={3} className="g-4">
        {filteredMobiles.length > 0 ? (
          filteredMobiles.map((mobile) => (
            <Col key={mobile._id}>
              <Card className="h-100 shadow border-0" style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <FaEdit
                  onClick={() => handleEdit(mobile)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '50px',
                    color: '#28a745',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                  }}
                />
                <FaTrash
                  onClick={() => confirmDelete(mobile._id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'red',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                  }}
                />
                  {/* <Card.Img
                                 variant="top"
                                 src={`https://media.johnlewiscontent.com/i/JohnLewis/mobiles-nav-card-apple-v3-130924?fmt=auto`}
                                 alt={mobile.modelSpecifications}
                                 style={{ height: '400px', objectFit: 'cover' }}
                               /> */}
                 {/* {mobile.images[0] &&  <Card.Img
                                 variant="top"
                                 src={`${mobile.images[0]}`}
                                 alt={mobile.modelSpecifications}
                                 style={{ height: '400px', objectFit: 'cover' }}
                               />} */}

                <Card.Body style={{ padding: '1rem', flexDirection: 'column' }}>
                  <Card.Title style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', width: '100%' }}>
                    {mobile.companyName} {mobile.modelSpecifications}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', width: '100%' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>
                        Specifications:
                      </strong>{' '}
                      {mobile.specs}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Color:</strong>{' '}
                      {mobile.color}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>{mobile.imei2 ? "imei 1" : "imei"}</strong>{' '}
                      {mobile.imei1}
                    </div>
                    {mobile.imei2 && <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>imei 2</strong>{' '}
                      {mobile.imei2}
                    </div>}
                    <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Purchase Price:</strong>{' '}
                      {mobile.purchasePrice}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Demand Price:</strong>{' '}
                      {mobile.demandPrice}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Final Price:</strong>{' '}
                      {mobile.finalPrice || 'Not Sold'}
                    </div>
                  </Card.Text>
                  <div style={{ textAlign: 'right', width: '100%' }}>
                  {/* <Button
                     onClick={() => handleDispatchClick(mobile)}
                   style={{
                    backgroundColor: '#FFD000',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                     marginRight: '5px',
                   }}
                  >
                      Dispatch
                </Button> */}
                    <Button
                      onClick={() => handleSoldClick(mobile,"single")}
                      style={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      Sold
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card className="text-center">
              <Card.Body>
                <Card.Text>No mobiles found</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </> 
    }
      
      {/* <h3 style={{marginTop:"5rem",marginBottom:"1rem",}}>New Bulk Phones</h3>
      {list?
    <> */}
    {/* <List items={bulkMobile}
      displayKeys={["modelName","companyName", "partyName","status"]}
      descriptions={["Model Name","Company Name","Party Price","Status",]}
      onRowClick={"handleClick"}
    /> */}
      {/* <Table
      routes={["/purchase/purchaseRecords"]}
           array={bulkMobile}
           search={"imei1"}
           keysToDisplay={["modelName", "companyName","partyName", "status", ]}
           label={[
               "Model Name",
               "Company Name",
               "Parth Name",
               "Status",
       
               "Actions",
           ]}
           
           extraColumns={[
             (obj) => <Button
             onClick={() => handleSoldClick(obj,"bulk")}
             style={{
               backgroundColor: '#28a745',
               color: '#fff',
               border: 'none',
               padding: '5px 10px',
               borderRadius: '5px',
               cursor: 'pointer',
               fontSize: '0.8rem',
             }}
           >
             Sold
           </Button>
         ]}
       />

    </>  */}
    {/* : */}
    {/* <> */}
    {/* <Row xs={1} md={2} lg={3} className="g-4">
      {bulkMobile.length > 0 ? (
        bulkMobile.map((mobile) => (
          <Col key={mobile._id}>
            <Card className="h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden', position: 'relative' }}> */}
              {/* <FaEdit
                onClick={() => handleEdit(mobile)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '50px',
                  color: '#28a745',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                }}
              /> */}
              {/* <FaTrash
                onClick={() => handleBulkDelete(mobile._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                }}
              /> */}

              {/* Image handling */}
              {/* {mobile?.images?.[0] ? (
                <Card.Img
                  variant="top"
                  src={bulkMobileImage}
                  alt={`${mobile?.companyName} ${mobile?.modelName}`}
                  style={{ height: '350px', objectFit: 'cover', borderRadius: '10px' }}
                />
              ) : (
                <Card.Img
                  variant="top"
                  src={bulkMobileImage}  // Replace with your default image path
                  alt={bulkMobileImage}
                  style={{ height: '350px', objectFit: 'cover', borderRadius: '10px' }}
                />
              )} */}

              {/* <Card.Body style={{ padding: '1.5rem', display: 'flex',justifyContent:"left",alignItems:"start", flexDirection: 'column',width:"100%" }}>
                <Card.Title style={{ fontSize: '1.4rem', fontWeight: '600', color: '#333' }}>
                  {mobile?.companyName || 'No Company Name'} {mobile?.modelName || 'No Model Name'}
                </Card.Title> */}

                {/* Bulk Mobile Details */}
                {/* <Card.Text style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
                  <div>
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Party Name:</strong> {mobile?.partyName || 'Not Available'}
                  </div>
                  <div>
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Date:</strong> {mobile?.date ? new Date(mobile?.date).toLocaleDateString() : 'Not Available'}
                  </div>

                  <div >
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Prices:</strong>
                    <p>Final Price: {getActualPrice(mobile?.prices)}</p>
                    <Button
                       onClick={() => handleShowPrices(mobile)}
                       style={{
                         backgroundColor: '#3f4d67',
                         color: '#fff',
                         border: 'none',
                         padding: '6px 14px', // Smaller padding
                         borderRadius: '3px', // Slightly smaller border radius
                         cursor: 'pointer',
                         fontSize: '0.9rem', // Smaller font size
                         transition: 'background-color 0.3s ease',
                         boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
                         margin: '5px', // Slight margin to separate buttons
                       }}
                      >
                       View All Prices
                      </Button> */}

                  {/* </div> */}

                  {/* RAM & SIM Options - Dropdowns */}
                  {/* {mobile?.ramSimDetails?.length > 0 ? (
                    <div>
                      <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>RAM and SIM Options:</strong>
                      {mobile?.ramSimDetails?.map((ramSim) => (
                        <div key={ramSim._id} style={{ marginBottom: '10px' }}>
                          <div><strong>RAM Memory:</strong> {ramSim?.ramMemory || 'Not Available'} GB</div>
                          <div><strong>SIM Option:</strong> {ramSim?.simOption || 'Not Available'}</div>
                          <div className='' style={{display:"flex"}}>
                            <strong>Quantity</strong>
                            <ul> */}
                              {/* {ramSim?.imeiNumbers?.length > 0 ? 

                              (
                                ramSim?.imeiNumbers?.map((imei) => (
                                  <li key={imei._id}>IMEI 1: {imei?.imei1 || 'Not Available'}</li>
                                ))
                              )
                              : (
                                <li>No stock available</li>
                              )} */}
                              {/* <p>{ramSim?.imeiNumbers?.length > 0 ? ` ${ramSim.imeiNumbers.length}` : "No stock available"}</p>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>RAM and SIM Options: Not Available</div>
                  )}
                </Card.Text> */}

                {/* Action Buttons */}
              {/* </Card.Body>
                <div style={{ textAlign: 'right', width: '100%',padding: '1.5rem' }}> */}
                  {/* <Button
                 onClick={() => handleDispatchClick(mobile)}
               style={{
                backgroundColor: '#FFD000',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                 marginRight: '5px',
               }}
              >
             Dispatch
             </Button> */}
                    {/* <Button
                      onClick={() => handleSoldClick(mobile,"bulk")}
                      style={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      Sold
                    </Button>
                  </div>
            </Card>
          </Col>
        ))
      ) : (
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Text>No mobiles found</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      )} */}

      {/* Modal for Prices */}
      {/* <Modal show={showPrices} onHide={handleClosePrices}>
        <Modal.Header closeButton>
          <Modal.Title>Prices for {selectedMobile?.companyName} {selectedMobile?.modelName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li><strong>Buying Price:</strong> {selectedMobile?.prices?.buyingPrice || 'Not Available'}</li>
            <li><strong>Dealer Price:</strong> {selectedMobile?.prices?.dealerPrice || 'Not Available'}</li>
            <li><strong>LP:</strong> {selectedMobile?.prices?.lp || 'Not Available'}</li>
            <li><strong>Lifting:</strong> {selectedMobile?.prices?.lifting || 'Not Available'}</li>
            <li><strong>Promo:</strong> {selectedMobile?.prices?.promo || 'Not Available'}</li>
            <li><strong>Activation:</strong> {selectedMobile?.prices?.activation || 'Not Available'}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePrices}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Row> */}
    
    {/* </>  */}
    {/* } */}
      <PurchasePhone type="edit" modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} />
      {/* <AddPhone modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} /> */}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this phone?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deletePhone}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDispatchModal} onHide={() => setShowDispatchModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Dispatch Mobile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Shop Name</Form.Label>
        <Form.Control
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Enter Shop Name"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Receiver Person Name</Form.Label>
        <Form.Control
          type="text"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Receiver Person Name"
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDispatchModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleDispatchSubmit}>
      Dispach
    </Button>
  </Modal.Footer>
</Modal>


      {/* Sold Modal */}
      <Modal show={showSoldModal} onHide={() => setShowSoldModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sell Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
            <Form.Group className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter Customer Name"
                  />
                </Form.Group>
          
        

                {/* CNIC Front Picture */}
                <Form.Group className="mb-3">
                  <Form.Label>CNIC Front Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCnicFrontPic(e.target.files[0]?.name)}
                  />
                </Form.Group>

                {/* CNIC Back Picture */}
                <Form.Group className="mb-3">
                  <Form.Label>CNIC Back Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCnicBackPic(e.target.files[0])?.name}
                  />
                </Form.Group>
               
                <div>
      {accessories.map((accessory, index) => (
        <div key={index} className="mb-3 p-3 border rounded">
          <Form.Group>
            <Form.Label>Accessory Name</Form.Label>
            <Form.Control
              type="text"
              value={accessory.name}
              onChange={(e) => handleAccessoryChange(index, "name", e.target.value)}
              placeholder="Enter accessory name"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={accessory.quantity}
              onChange={(e) => handleAccessoryChange(index, "quantity", e.target.value)}
              min="1"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Accessory Price</Form.Label>
            <Form.Control
              type="number"
              value={accessory.price}
              onChange={(e) => handleAccessoryChange(index, "price", e.target.value)}
              placeholder="Enter price"
            />
          </Form.Group>

          <Button variant="secondary" className="mt-2" onClick={() => removeAccessory(index)}>
            Remove
          </Button>
        </div>
      ))}

      <Button variant="primary" onClick={addAccessory}>
        Add Another Accessory
      </Button>
    </div>
            <Form.Group>
                <Form.Label>Selling Type</Form.Label>
                <Form.Select
                  as="select"
                  value={sellingType}
                  onChange={(e) => setSellingType(e.target.value)}
                >
                  <option value="">Select Selling Type</option>
                  <option value="Bank">Bank</option>
                  <option value="Exchange">Exchange</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                </Form.Select>
              </Form.Group>

              {/* Conditional Fields Based on Selling Type */}
              {sellingType === "Bank" && (
                <Form.Group>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </Form.Group>
              )}

              {sellingType === "Credit" && (
                  <>
                    <Form.Group>
                      <Form.Label>Payable Amount Now</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount payable now"
                        value={payableAmountNow}
                        onChange={(e) => setPayableAmountNow(e.target.value)}
                      />
                    </Form.Group>
                            
                    <Form.Group>
                      <Form.Label>Payable Amount Later</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount payable later"
                        value={payableAmountLater}
                        onChange={(e) => setPayableAmountLater(e.target.value)}
                      />
                    </Form.Group>
                            
                    <Form.Group>
                      <Form.Label>When will it be paid?</Form.Label>
                      <Form.Control
                        type="date"
                        value={payableAmountLaterDate}
                        onChange={(e) => setPayableAmountLaterDate(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

              {sellingType === "Exchange" && (
                <Form.Group>
                  <Form.Label>Exchange Phone Details</Form.Label>
                  <Form.Control
                  as={"textarea"}
                  rows={4} //
                    type="text"
                    placeholder="Enter exchange phone details"
                    value={exchangePhoneDetail}
                    onChange={(e) => setExchangePhoneDetail(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                  <Form.Label>Sold Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    placeholder="Enter Sold price"
                  />
                 </Form.Group>
            </div>
          
       
        {type === "bulk" && (
            <>
               <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                <BarcodeReader />
              </div>

              <Form.Group className="mb-3">
                <Form.Label>IMEI Number</Form.Label>

                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={imeiInput}
                    onChange={(e) => setImeiInput(e.target.value)}
                    placeholder="Enter IMEI number"
                  />
                  <Button variant="success" onClick={handleAddImei} backgroundColor="linear-gradient(to right, #50b5f4, #b8bee2)" className="ms-2">
                    Add
                  </Button>
                </div>
              </Form.Group>

              {/* Display added IMEIs */}
              {addedImeis.length > 0 && (
                <div className="mt-3">
                  <h6>Added IMEIs:</h6>
                  <ul className="list-group">
                    {addedImeis.map((imei, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {imei}
                        <Button variant="danger" size="sm" onClick={() => handleRemoveImei(imei)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
   
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSoldModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSoldSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewMobilesList;
