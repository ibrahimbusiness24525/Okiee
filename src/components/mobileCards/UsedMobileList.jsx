import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
import { api } from '../../../api/api';

const UsedMobilesList = () => {
  const [mobiles, setMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMobile, setEditMobile] = useState(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldMobile, setSoldMobile] = useState(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [warranty, setWarranty] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMobileId, setDeleteMobileId] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchMobile, setDispatchMobile] = useState(null);
  const [shopName, setShopName] = useState('');
  const [personName, setPersonName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerCNIC, setCustomerCNIC] = useState('');


  

  const navigate = useNavigate();

  useEffect(() => {
    getMobiles();
  }, []);

  const getMobiles = async () => {
    try {
      // Retrieve user and shop data from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const shop = JSON.parse(localStorage.getItem('shop'));
  
      // Check if shop and shop.id exist and are valid
      if (!shop || !shop.shopId) {
        console.error("Shop ID is missing or invalid:", shop);
        return;
      }
  
      console.log("Shop ID being sent:", shop.shopId);
  
      // Make the API call with the valid shopid
      const response = await api.get("/api/Purchase/purchase-phone")
      // const response = await axios.get(BASE_URL + `api/purchase/purchase-phone?shopid=${shop.shopId}`);
      console.log(response, 'responce')
      // Update state with the response data
      setMobiles(response.data.phones);
    } catch (error) {
      // Log error details for debugging
      console.error("Error fetching mobiles:", error.response?.data || error.message);
    }
  };
  
  

  console.log(mobiles, 'single mobiles')


  const deletePhone = async () => {
    try {
     await api.delete(`/api/Purchase/purchase-phone/delete/${deleteMobileId}`);
      // await axios.delete(`${BASE_URL}api/Purchase/purchase-phone/${deleteMobileId}`);
      setMobiles((prevMobiles) => prevMobiles.filter((mobile) => mobile._id !== deleteMobileId));
      console.log('Phone deleted successfully');
    } catch (error) {
      console.error('Error deleting phone:', error);
    } finally {
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
    console.log('Dispatch Details:', dispatchDetails);
  
    setShopName('');
    setPersonName('');
    setShowDispatchModal(false);
  };
  

  const handleEdit = (mobile) => {
    setEditMobile(mobile);
    setShowModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSoldClick = (mobile) => {
    setSoldMobile(mobile);
    setShowSoldModal(true);
  };

  const handleSoldSubmit = async () => {
    if (!finalPrice || !warranty || !customerName || !customerNumber) {
      alert('Please fill all fields');
      return;
    }

    const updatedMobile = {
      ...soldMobile,
      finalPrice,
      warranty,
      customerNumber,
      customerName,
      customerCNIC,
    };

    navigate('/invoice/shop', { state: updatedMobile });
    setFinalPrice('');
    setWarranty('');
    setCustomerNumber('');
    setCustomerName('');
    setCustomerCNIC('');
    setShowSoldModal(false);
  };

  const confirmDelete = (mobileId) => {
    setDeleteMobileId(mobileId);
    setShowDeleteModal(true);
  };

  const handleShareInventory = () => {
    const doc = new jsPDF();
    doc.text('Mobile Inventory', 10, 10);

    mobiles.forEach((mobile, index) => {
      const { phonePicture, companyName, modelSpecifications , specs, color } = mobile;
      const imgData = `data:image/jpeg;base64,${phonePicture}`;
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
  // const filteredMobiles = mobiles?.filter((mobile) => {
  //   // Split the search term into words
  //   const searchWords = searchTerm?.toLowerCase()?.split(/\s+/);
  
  //   return searchWords.every((word) =>
  //     // Check if each word exists in any of the searchable fields
  //     mobile.companyName?.toLowerCase()?.includes(word) ||
  //     mobile.modelSpecifications?.toLowerCase()?.includes(word) ||
  //     mobile.specs?.toLowerCase()?.includes(word) ||
  //     mobile.color?.toLowerCase()?.includes(word) || // Example: Searching by color if needed
  //     String(mobile.purchasePrice)?.includes(word)  // Example: Searching by price if needed
  //   );
  // });
  const filteredMobiles = mobiles.filter(mobile => mobile.phoneCondition === "Used");
  
  console.log("all mobiles", mobiles);
  console.log("all filtereed", filteredMobiles);
  return (
    <>
      {/* Search bar */}
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

      <div className="d-flex justify-content-between align-items-center mb-3">
  {/* Total Stock Amount */}
  <div>
    <h5 style={{fontSize: 30}}>
      Total Stock Amount: 
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


      {/* <Row xs={1} md={2} lg={3} className="g-4">
        {filteredMobiles.length > 0 || filteredMobiles  ? (
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

                /> */}
             {/* {mobile.phonePicture &&  <Card.Img
                  variant="top"
                  src={`${mobile.phonePicture}`}
                  alt={mobile.modelName}
                  style={{ height: '400px', objectFit: 'cover' }}
                />} */}

                {/* <Card.Body style={{ padding: '1rem', flexDirection: 'column' }}>
                  <Card.Title style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', width: '100%' }}>
                    {mobile.companyName} {mobile.modelName}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', width: '100%' }}>
                  <div>
                  <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                    Ram/Memory:
                  </strong>{' '}
                  {mobile.ramMemory}{' '}
                  <span
                    style={{
                      backgroundColor: mobile.specifications === 'PTA' ? 'green' : 'red',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '5px',
                      fontSize: '0.8rem',
                      marginLeft: mobile.specifications === 'PTA' ? '160px' : '113px',
                    }}
                  >
                    {mobile.specifications}
                  </span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                    Color:
                  </strong>{' '}
                  {mobile.color}{' '}
                  <span
                    style={{
                      backgroundColor: mobile.isApprovedFromEgadgets ? 'green' : 'red',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '5px',
                      fontSize: '0.8rem',
                      marginLeft:  mobile.isApprovedFromEgadgets ? '93px' : '70px',
                    }}
                  >
                  E-Gadget status: {mobile.isApprovedFromEgadgets ? 'Approved' : 'Not Approved'}
                  </span>
                </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>{mobile.imei2 ? "imei 1" : "imei"}</strong>{' '}
                      {mobile.imei1}
                    </div>
                    {mobile.imei2 && <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>imei 2</strong>{' '}
                      {mobile.imei2}
                    </div> */}
                    {/* <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Purchase Price:</strong>{' '}
                      {mobile.price.purchasePrice}
                    </div> */}
                    {/* <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Demand Price:</strong>{' '}
                      {mobile.price.demandPrice}
                    </div> */}
                    {/* <div>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Final Price:</strong>{' '}
                      {mobile.price.finalPrice || 'Not Sold'}
                    </div> */}
                  {/* </Card.Text>
                  <div style={{ textAlign: 'right', width: '100%' }}>


                  <Button
                 onClick={() => handleDispatchClick(mobile)}
               style={{
                backgroundColor: '#FFD000',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem',
               }}
              >
             Dispatch
                 </Button>
                    <Button
                      onClick={() => handleSoldClick(mobile)}
                      style={{
                        backgroundColor: '#007bff',
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
      </Row> */}
<Row xs={1} md={2} lg={3} className="g-4">
  {filteredMobiles.length > 0 ? (
    filteredMobiles.map((mobile) => (
      <Col key={mobile._id}>
        <Card className="h-100 shadow border-0" style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
          {/* <FaEdit
            onClick={() => handleEdit(mobile)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '50px',
              color: '#28a745',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          /> */}
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
          <Card.Body style={{ padding: '1rem', flexDirection: 'column' }}>
            <Card.Title style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', width: '100%' }}>
              {mobile.companyName} {mobile.modelSpecifications}
            </Card.Title>
            {/* <Card.Title style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', width: '100%' }}>
              {mobile.warranty}
            </Card.Title> */}
            <Card.Text style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', width: '100%' }}>
              {/* <div>
                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                  Specs:
                </strong>{' '}
                {mobile.specs}
              </div> */}
              <div>
                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                  Color:
                </strong>{' '}
                {mobile.color}
              </div>
              <div>
                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                  IMEI:
                </strong>{' '}
                {mobile.imei}
              </div>
              {mobile.imei2 && (
                <div>
                  <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                    IMEI 2:
                  </strong>{' '}
                  {mobile.imei2}
                </div>
              )}
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
                }}
              >
                Dispatch
              </Button> */}
               <Button
                // onClick={() => handleSoldClick(mobile)}
                style={{
                  backgroundColor: '#DE970B',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
              {mobile.warranty}
              </Button>
                 <Button
                // onClick={() => handleSoldClick(mobile)}
                style={{
                  backgroundColor: 'green',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
            {mobile.specs}
              </Button>
              <Button
                onClick={() => handleSoldClick(mobile)}
                style={{
                  backgroundColor: '#007bff',
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
          <Card.Text>No used mobiles found</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )}
</Row>;

      <PurchasePhone modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} />

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


      <Modal show={showSoldModal} onHide={() => setShowSoldModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Sell Mobile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Customer Name</Form.Label>
        <Form.Control
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter Customer Name"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Customer Number</Form.Label>
        <Form.Control
          type="tel"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
          placeholder="Enter Customer Number"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Customer CNIC</Form.Label>
        <Form.Control
          type="tel"
          value={customerCNIC}
          onChange={(e) => setCustomerCNIC(e.target.value)}
          placeholder="Enter Customer CNIC"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Sold Price</Form.Label>
        <Form.Control
          type="number"
          value={finalPrice}
          onChange={(e) => setFinalPrice(e.target.value)}
          placeholder="Enter Sold Price"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Company Warranty</Form.Label>
        <Form.Select value={warranty} onChange={(e) => setWarranty(e.target.value)}>
          <option value="">Select Warranty</option>
          <option value="No Warranty">No Warranty</option>
          <option value="1 Month">1 Month</option>
          <option value="2 Months">2 Months</option>
          <option value="3 Months">3 Months</option>
          <option value="4 Months">4 Months</option>
          <option value="5 Months">5 Months</option>
          <option value="6 Months">6 Months</option>
          <option value="7 Months">7 Months</option>
          <option value="8 Months">8 Months</option>
          <option value="9 Months">9 Months</option>
          <option value="10 Months">10 Months</option>
          <option value="11 Months">11 Months</option>
          <option value="12 Months">12 Months</option>
        </Form.Select>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowSoldModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSoldSubmit}>
      Sold
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default UsedMobilesList;
