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
import { toast } from 'react-toastify';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const DispachMobilesList = () => {
  const [mobiles, setMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMobile, setEditMobile] = useState(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldMobile, setSoldMobile] = useState(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [warranty, setWarranty] = useState('12 months');
  const [cnicFrontPic, setCnicFrontPic] = useState("");
  const [cnicBackPic, setCnicBackPic] = useState("");
  const [bankName, setBankName] = useState("");
  const [type, setType] = useState("");
  const [payableAmountNow, setPayableAmountNow] = useState("")
  const [payableAmountLater, setPayableAmountLater] = useState("");
  const [payableAmountLaterDate, setPayableAmountLaterDate] = useState("");
  const [exchangePhoneDetail, setExchangePhoneDetail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMobileId, setDeleteMobileId] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchMobile, setDispatchMobile] = useState(null);
  const [shopName, setShopName] = useState('');
  const [personName, setPersonName] = useState('');
  const [singleDispatches, setSingleDispatches] = useState([])
  const [bulkDispatches, setBulkDispatches] = useState([])
  const [imeiList, setImeiList] = useState([]);
  const [selectedImeis, setSelectedImeis] = useState([]);
  const [imeiInput, setImeiInput] = useState("");
  const [addedImeis, setAddedImeis] = useState([]);
  const [sellingType, setSellingType] = useState("")
  const [customerName, setCustomerName] = useState("");
  const [search, setSearch] = useState("");
  const [accessories, setAccessories] = useState([
    { name: "", quantity: 1, price: "" }
  ]);
  const [imei, setImei] = useState([]);
  const navigate = useNavigate();
  const [imeis, setImeis] = useState([]);

  const addAccessory = () => {
    setAccessories([...accessories, { name: "", quantity: 1, price: "" }]);
  };
  // Remove Accessory
  const removeAccessory = (index) => {
    const updatedAccessories = accessories.filter((_, i) => i !== index);
    setAccessories(updatedAccessories);
  };
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
    getSingleDispatches();
    getBulkDispatches()
  }, []);
  const handleAccessoryChange = (index, field, value) => {
    const updatedAccessories = [...accessories];
    updatedAccessories[index][field] = value;
    setAccessories(updatedAccessories);
  };

  const getSingleDispatches = async () => {
    try {
      const response = await api.get(`/api/Purchase/single-dispatch`)
      setSingleDispatches(response.data.dispatches);
    } catch (error) {
    }
  };
  const getBulkDispatches = async () => {
    try {
      const response = await api.get(`/api/Purchase/bulk-dispatch`)
      setBulkDispatches(response.data.dispatches);
    } catch (error) {
      console.error("error", error)
    }
  };
  const handleReturn = async (dispatchMobile) => {
    const confirmReturn = window.confirm("Are you sure you want to return this mobile?");

    if (!confirmReturn) return;

    try {

      const response = await api.patch(`/api/Purchase/single-dispatch-return/${dispatchMobile._id}`);
      toast.success("Mobile returned successfully");
      getSingleDispatches();
    } catch (error) {
      console.error("error", error);
      toast.error("Failed to return the mobile");
    }
  };
  const handleReturnBulkDispatch = async (dispatchMobile) => {

    setDispatchMobile(dispatchMobile)
    setShowDispatchModal(true);
    setImeiList(
      dispatchMobile.ramSimDetails.flatMap((ramSim) => {
        if (!ramSim.imeiNumbers) return [];
        return ramSim.imeiNumbers
          .filter((imei) => dispatchMobile.dispatchedImeiIds.includes(imei._id))
          .map((imei) =>
            imei.imei2 ? `${imei.imei1} / ${imei.imei2}` : imei.imei1
          );
      }) || []
    );


  }


  const deletePhone = async () => {
    try {
      await axios.delete(`${BASE_URL}api/phone/deletePhone/${dispatchMobile}`);
      setMobiles((prevMobiles) => prevMobiles.filter((mobile) => mobile._id !== deleteMobileId));
    } catch (error) {
      console.error('Error deleting phone:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };
  const handleChange = (event) => {
    const selectedImeis = event.target.value;
    setImei(selectedImeis);
    setAddedImeis((prevImeis) => Array.from(new Set([...prevImeis, ...selectedImeis])));
    // setAddedImeis((prevImeis) => Array.from(new Set([...prevImeis, ...selectedImeis]))); // Ensure uniqueness

    // setAddedImeis((prevImeis) => [...new Set([...prevImeis, ...selectedImeis])]); 
  };

  const handleDispatchClick = (mobile) => {
    setDispatchMobile(mobile);
    setShowDispatchModal(true);
  };


  const handleBulkReturnSubmit = async () => {
    try {

      const response = await api.patch(`/api/Purchase/bulk-dispatch-return/${dispatchMobile.dispatchId}`, {
        imeiArray: imei.map((imei) => {
          const [imei1, imei2] = imei.split(' / ');
          return { imei1, imei2 };
        }),
      }
        ,);
      toast.success("Bulk Mobile returned successfully");
      getBulkDispatches();
    } catch (error) {
      toast.error("Failed to return the mobile");
    }
  };



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSoldClick = (mobile, type) => {



    if (type === "bulk") {
      setType("bulk")
      setImeiList(
        mobile?.ramSimDetails.flatMap((ramSim) => {
          if (!ramSim.imeiNumbers) return [];
          return ramSim?.imeiNumbers
            .filter((imei) => soldMobile?.dispatchedImeiIds?.includes(imei._id))
            .map((imei) =>
              imei.imei2 ? `${imei.imei1} / ${imei.imei2}` : imei.imei1
            );
        }) || []
      );

    }
    if (type === "single") {
      setType("single")
    }
    if (type === "singleUsed") {
      setType("singleUsed")

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
      ...(type === "singleUsed" && { warranty }),
      addedImeis,
      cnicBackPic,
      warranty,
      cnicFrontPic,
      customerName,
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
  };





  const dispatchedImeisList = bulkDispatches.bulkPhonePurchaseId?.ramSimDetails
    ?.flatMap((record) => {
      return record.imeiNumbers
        .filter((imei) => imei.isDispatched) // Check if the IMEI is dispatched
        .map((item) => (
          <strong key={item._id}>imei1: {item.imei1} / imei2: {item.imei2}</strong>
        ));
    }) || [];


  return (
    <>
      {/* Search bar */}


      <div className="d-flex justify-content-between align-items-center mb-3">


        {/* Share Inventory Button */}

      </div>

      <StyledHeading>Single New  phones</StyledHeading>
      <Row xs={1} md={2} lg={3} className="g-4">
        {!singleDispatches.every(item => item.purchasePhoneId === null) ? (
          singleDispatches
            .filter((phone) => phone?.purchasePhoneId?.phoneCondition === "New")
            .map((dispatch) => {
              const phone = dispatch.purchasePhoneId;
              return (
                <Col key={dispatch._id}>
                  <Card className="h-100 shadow border-0" style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                    <Card.Body style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                      {/* Title */}
                      <Card.Title style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', width: '100%' }}>
                        {phone.companyName} {phone.modelName}
                      </Card.Title>

                      {/* Details */}
                      <Card.Text style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', width: '100%' }}>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Shop:</strong> {dispatch.shopName}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Receiver:</strong> {dispatch.receiverName}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Battery Health:</strong> {phone.batteryHealth}%</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Warranty:</strong> {phone.warranty}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Color:</strong> {phone.color}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>IMEI 1:</strong> {phone.imei1}</div>
                        {phone.imei2 && <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>IMEI 2:</strong> {phone.imei2}</div>}
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>RAM / Storage:</strong> {phone.ramMemory}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Condition:</strong> {phone.phoneCondition}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Specifications:</strong> {phone.specifications}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Purchase Price:</strong> {phone.price?.purchasePrice}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Demand Price:</strong> {phone.price?.demandPrice}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Final Price:</strong> {phone.price?.finalPrice || 'Not Sold'}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Dispatch Date:</strong> {new Date(dispatch.dispatchDate).toLocaleDateString()}</div>
                      </Card.Text>

                      {/* Buttons */}
                      <div style={{ textAlign: 'right', width: '100%' }}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleReturn(phone)}
                          style={{
                            marginRight: '0.5rem',
                            padding: '5px 10px',
                            fontSize: '0.8rem',
                            borderRadius: '5px',
                            fontWeight: '500',
                          }}
                        >
                          Return
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSoldClick(phone, "single")}
                          style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '0.8rem',
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
            <Card className="text-center">
              <Card.Body>
                <Card.Text>No dispatches found</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      <div style={{ marginTop: "2rem" }}></div>
      <StyledHeading>Single Used  phones</StyledHeading>
      <Row xs={1} md={2} lg={3} className="g-4">
        {!singleDispatches.every(item => item.purchasePhoneId === null) ? (
          singleDispatches
            .filter((phone) => phone.purchasePhoneId?.phoneCondition === "Used")
            .map((dispatch) => {
              const phone = dispatch.purchasePhoneId;
              return (
                <Col key={dispatch._id}>
                  <Card className="h-100 shadow border-0" style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                    <Card.Body style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                      {/* Title */}
                      <Card.Title style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', width: '100%' }}>
                        {phone.companyName} {phone.modelName}
                      </Card.Title>

                      {/* Details */}
                      <Card.Text style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', width: '100%' }}>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Shop:</strong> {dispatch.shopName}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Receiver:</strong> {dispatch.receiverName}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Battery Health:</strong> {phone.batteryHealth}%</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Warranty:</strong> {phone.warranty}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Color:</strong> {phone.color}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>IMEI 1:</strong> {phone.imei1}</div>
                        {phone.imei2 && <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>IMEI 2:</strong> {phone.imei2}</div>}
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>RAM / Storage:</strong> {phone.ramMemory}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Condition:</strong> {phone.phoneCondition}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Specifications:</strong> {phone.specifications}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Purchase Price:</strong> {phone.price?.purchasePrice}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Demand Price:</strong> {phone.price?.demandPrice}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Final Price:</strong> {phone.price?.finalPrice || 'Not Sold'}</div>
                        <div><strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Dispatch Date:</strong> {new Date(dispatch.dispatchDate).toLocaleDateString()}</div>
                      </Card.Text>

                      {/* Buttons */}
                      <div style={{ textAlign: 'right', width: '100%' }}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleReturn(phone)}
                          style={{
                            marginRight: '0.5rem',
                            padding: '5px 10px',
                            fontSize: '0.8rem',
                            borderRadius: '5px',
                            fontWeight: '500',
                          }}
                        >
                          Return
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSoldClick(phone, "singleUsed")}
                          style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '0.8rem',
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
            <Card className="text-center">
              <Card.Body>
                <Card.Text>No used phones dispatches found</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      <div style={{ marginTop: "2rem" }}></div>
      <StyledHeading>Bulk  phones</StyledHeading>
      <Row xs={1} md={2} lg={3}>
        {bulkDispatches.length > 0 ? (
          bulkDispatches.map((dispatch) => {
            const imeis =
              dispatch.ramSimDetails?.flatMap((item) =>
                item.imeiNumbers
                  ?.filter((i) => dispatch.dispatchedImeiIds.includes(i._id)) // ✅ match with dispatchedImeiIds
                  .map((i) => ({
                    imei1: i.imei1,
                    imei2: i.imei2,
                    brand: item.companyName,
                    model: item.modelName,
                    ram: item.ramMemory,
                    sim: item.simOption,
                  }))
              ) || [];

            return (
              <Col key={dispatch.dispatchId} style={{ marginTop: '1rem' }}>
                <Card
                  style={{
                    borderRadius: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Card.Body
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 16,
                      flex: 1,
                      alignItems: 'start',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#333',
                        marginBottom: 8,
                        textAlign: 'left',
                      }}
                    >
                      Bulk Dispatch - {dispatch.shopName}
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        color: '#555',
                        lineHeight: 1.6,
                        textAlign: 'left',
                      }}
                    >
                      <div>
                        <strong>Receiver:</strong> {dispatch.receiverName}
                      </div>
                      <div>
                        <strong>Date:</strong>{' '}
                        {new Date(dispatch.dispatchDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Status:</strong> {dispatch.dispatchStatus}
                      </div>
                    </div>

                    <div style={{ marginTop: 12, textAlign: 'left' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: '#222',
                          marginBottom: 6,
                        }}
                      >
                        Dispatched IMEIs ({imeis.length}):
                      </div>
                      {imeis.length > 0 ? (
                        imeis.map((i, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: 10,
                              backgroundColor: '#f9f9f9',
                              border: '1px solid #ddd',
                              borderRadius: 6,
                              marginBottom: 8,
                              fontSize: 13,
                              lineHeight: 1.4,
                            }}
                          >
                            <div>
                              <strong>Brand:</strong> {i.brand}
                            </div>
                            <div>
                              <strong>Model:</strong> {i.model}
                            </div>
                            <div>
                              <strong>IMEI 1:</strong> {i.imei1}
                            </div>
                            <div>
                              <strong>IMEI 2:</strong> {i.imei2}
                            </div>
                            <div>
                              <strong>RAM / SIM:</strong> {i.ram} / {i.sim}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#888' }}>No dispatched IMEIs</div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: 'auto',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 8,
                        width: '100%',
                      }}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleReturnBulkDispatch(dispatch)}
                        style={{
                          fontSize: 13,
                          padding: '4px 10px',
                          borderRadius: 4,
                          fontWeight: 500,
                        }}
                      >
                        Return
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSoldClick(dispatch, "bulk")}
                        style={{
                          backgroundColor: '#007bff',
                          color: '#fff',
                          border: 'none',
                          fontSize: 13,
                          padding: '4px 10px',
                          borderRadius: 4,
                          fontWeight: 500,
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
            <Card style={{ padding: 16 }}>
              <Card.Body>
                <div style={{ fontSize: 14, color: '#888', textAlign: 'left' }}>
                  No bulk dispatches found
                </div>
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
          <Modal.Title>Return Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>Make select the imeis or make overall bulk return:</Modal.Body>
          <Form>
            <FormControl fullWidth variant="outlined" className="mb-3">
              <InputLabel>IMEI</InputLabel>
              <Select value={imei} onChange={handleChange} displayEmpty multiple>
                {imeiList
                  .filter((item) => item.toLowerCase())
                  .map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDispatchModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBulkReturnSubmit}>
            Return
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
              {/* <Form.Group className="mb-3">
                    <Form.Label>CNIC Front Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCnicFrontPic(e.target.files[0]?.name)}
                    />
                  </Form.Group>
  
                  <Form.Group className="mb-3">
                    <Form.Label>CNIC Back Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCnicBackPic(e.target.files[0])?.name}
                    />
                  </Form.Group> */}

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
                <Button variant="primary" onClick={addAccessory} style={{ marginBottom: "20px" }}>
                  Add Another Accessory
                </Button>
                {type === "bulk" && (

                  <FormControl fullWidth variant="outlined" className="mb-3">
                    <InputLabel>IMEI</InputLabel>
                    <Select value={imei} onChange={handleChange} displayEmpty multiple>
                      {imeiList
                        .filter((item) => item.toLowerCase())
                        .map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}

              </div>
              {type === "singleUsed" && (
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
              )}
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
                {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                  <BarcodeReader />
                </div> */}

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

export default DispachMobilesList;
