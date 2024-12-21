import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';

const MobilesList = () => {
  const [mobiles, setMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMobile, setEditMobile] = useState(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldMobile, setSoldMobile] = useState(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [warranty, setWarranty] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMobiles();
  }, []);

  const getMobiles = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(BASE_URL + `api/phone/getAllPhones/${user._id}`);
    setMobiles(response.data.phones);
  };

  const deletePhone = async (phoneId) => {
    try {
      await axios.delete(`${BASE_URL}api/phone/deletePhone/${phoneId}`);
      setMobiles((prevMobiles) => prevMobiles.filter((mobile) => mobile._id !== phoneId));
      console.log('Phone deleted successfully');
    } catch (error) {
      console.error('Error deleting phone:', error);
    }
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
      warranty
    };

    navigate('/invoice/shop', { state: updatedMobile });
    setFinalPrice('');
    setWarranty('');
    setShowSoldModal(false);
  };

  const filteredMobiles = mobiles?.filter(
    (mobile) =>
      mobile.companyName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      mobile.modelSpecifications?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <>
      {/* Search bar */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control type="text" placeholder="Search by name or company" value={searchTerm} onChange={handleSearch} />
      </InputGroup>

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
                    fontSize: '1.2rem'
                  }}
                />
                <FaTrash
                  onClick={() => deletePhone(mobile._id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: '#28a745',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                />
                <Card.Img
                  variant="top"
                  src={`data:image/jpeg;base64,${mobile.images[0]}`} // Add 'data:image/jpeg;base64,' before the Base64 string
                  alt={mobile.modelSpecifications}
                  style={{ height: '200px', objectFit: 'cover' }}
                />

                <Card.Body style={{ padding: '1rem', flexDirection: 'column' }}>
                  <Card.Title style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', width: '100%' }}>
                    {mobile.companyName} {mobile.modelSpecifications}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', width: '100%' }}>
                    <div>
                      <strong>Specifications:</strong> {mobile.modelSpecifications}
                    </div>
                    <div>
                      <strong>Color:</strong> {mobile.color}
                    </div>
                    <div>
                      <strong>Demand Price:</strong> ${mobile.demandPrice}
                    </div>
                    <div>
                      <strong>Final Price:</strong> ${mobile.finalPrice}
                    </div>
                  </Card.Text>
                  <div style={{ textAlign: 'right', width: '100%' }}>
                    <Button
                      onClick={() => handleSoldClick(mobile)}
                      style={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
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

      <AddPhone modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} />

      {/* Sold Modal */}
      <Modal show={showSoldModal} onHide={() => setShowSoldModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sell Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Final Price</Form.Label>
              <Form.Control
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder="Enter final price"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company Warranty</Form.Label>
              <Form.Select value={warranty} onChange={(e) => setWarranty(e.target.value)}>
                <option value="">Select warranty</option>
                <option value="No Warranty">No Warranty</option>
                <option value="1 Months">1 Months</option>
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

export default MobilesList;
