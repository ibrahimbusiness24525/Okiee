import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import { api } from '../../../api/api';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';

const DispachMobilesList = () => {
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
  const[singleDispatches,setSingleDispatches] = useState([])
  

  const navigate = useNavigate();

  useEffect(() => {
    getSingleDispatches();
  }, []);

  const getSingleDispatches = async () => {
    try{
      const response = await api.get(`/api/Purchase/single-dispatch`)
      setSingleDispatches(response.data.dispatches);
      console.log("dispatches response", response);
    }catch(error){
      console.log("error",error)
    }
  };

  const deletePhone = async () => {
    try {
      await axios.delete(`${BASE_URL}api/phone/deletePhone/${deleteMobileId}`);
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
    if (!finalPrice || !warranty) {
      alert('Please fill all fields');
      return;
    }

    const updatedMobile = {
      ...soldMobile,
      finalPrice,
      warranty,
    };

    navigate('/invoice/shop', { state: updatedMobile });
    setFinalPrice('');
    setWarranty('');
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



  return (
    <>
      {/* Search bar */}
      

      <div className="d-flex justify-content-between align-items-center mb-3">
  

  {/* Share Inventory Button */}
 
</div>

<StyledHeading>Single  phones</StyledHeading>
<Row
 xs={1} md={2} lg={3} 
>
  {singleDispatches.length > 0 ? (
    singleDispatches.map((dispatch) => {
      const phone = dispatch.purchasePhoneId;
      return (
        <Col key={dispatch._id} style={{ marginTop:"1rem"}}>
          <Card
            style={{
              height: '100%',
              borderRadius: '12px',
              border: 'none',
             
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Card.Body style={{ padding: '1.25rem',display:"flex" ,flexDirection:"column",}}>
              {/* Title */}
              <Card.Title
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  marginBottom: '1rem',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '0.5rem',
                }}
              >
                {phone.companyName} {phone.modelName}
              </Card.Title>

              {/* Detail Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem 1.25rem',
                  fontSize: '0.95rem',
                  color: '#444',
                }}
              >
                <div><strong>Shop:</strong> {dispatch.shopName}</div>
                <div><strong>Receiver:</strong> {dispatch.receiverName}</div>
                <div><strong>Battery Health:</strong> {phone.batteryHealth}%</div>
                <div><strong>Warranty:</strong> {phone.warranty}</div>
                <div><strong>Color:</strong> {phone.color}</div>
                <div><strong>IMEI 1:</strong> {phone.imei1}</div>
                {phone.imei2 && <div><strong>IMEI 2:</strong> {phone.imei2}</div>}
                <div><strong>RAM / Storage:</strong> {phone.ramMemory}</div>
                <div><strong>Condition:</strong> {phone.phoneCondition}</div>
                <div><strong>Specifications:</strong> {phone.specifications}</div>
                <div><strong>Purchase Price:</strong> {phone.price?.purchasePrice}</div>
                <div><strong>Demand Price:</strong> S{phone.price?.demandPrice}</div>
                <div>
                  <strong>Final Price:</strong>{' '}
                  {phone.price?.finalPrice || 'Not Sold'}
                </div>
                <div>
                  <strong>Dispatch Date:</strong>{' '}
                  {new Date(dispatch.dispatchDate).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '1.5rem',
                  gap: '0.75rem',
                }}
              >
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleReturn(dispatch)}
                  style={{ fontWeight: '500' }}
                >
                  Return
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSoldClick(phone)}
                  style={{
                    backgroundColor: '#28a745',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '500',
                  }}
                >
                  Sold
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      );
    })
  ) : (
    <Col>
      <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
        <Card.Body>
          <Card.Text>No dispatches found</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )}
</Row>



      <AddPhone modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} />

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
            <Form.Group className="mb-3">
              <Form.Label>Sold Price</Form.Label>
              <Form.Control
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder="Enter Sold price"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company Warranty</Form.Label>
              <Form.Select value={warranty} onChange={(e) => setWarranty(e.target.value)}>
                <option value="">Select warranty</option>
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
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DispachMobilesList;
