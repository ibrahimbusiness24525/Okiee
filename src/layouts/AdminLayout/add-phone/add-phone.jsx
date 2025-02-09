import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'config/constant';

const AddPhone = ({ modal, editMobile, handleModalClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPhone, setNewPhone] = useState({
    images: [],
    coverImage: '',
    companyName: '',
    modelSpecifications: '',
    specs: '',
    imei: '',
    demandPrice: '',
    purchasePrice: '',
    imei2: '',
    finalPrice: '',
    color: ''
  });
  const [isDualSim, setIsDualSim] = useState(false);

  useEffect(() => {
    setShowModal(modal);
    if (editMobile) {
      setNewPhone({
        images: editMobile.images || [],
        coverImage: editMobile.images[0] || '',
        companyName: editMobile.companyName || '',
        modelSpecifications: editMobile.modelSpecifications || '',
        specs: editMobile.specs || '',
        imei: editMobile.imei || '',
        demandPrice: editMobile.demandPrice || '',
        purchasePrice: editMobile.purchasePrice || '',
        imei2: editMobile.imei2 || '',
        finalPrice: editMobile.finalPrice || '',
        color: editMobile.color || ''
      });
      setIsDualSim(!!editMobile.imei2);
    }
  }, [modal, editMobile]);

  const handleClose = () => {
    setShowModal(false);
    handleModalClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPhone((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setNewPhone((prevState) => ({ ...prevState, images: files }));
    if (files.length > 0) {
      setNewPhone((prevState) => ({
        ...prevState,
        coverImage: URL.createObjectURL(files[0])
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();

    if (newPhone.images && newPhone.images.length > 0) {
      newPhone.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    formData.append('coverImage', newPhone.coverImage);
    formData.append('companyName', newPhone.companyName);
    formData.append('modelSpecifications', newPhone.modelSpecifications);
    formData.append('specs', newPhone.specs);
    formData.append('imei', newPhone.imei);
    formData.append('demandPrice', Number(newPhone.demandPrice));
    formData.append('purchasePrice', Number(newPhone.purchasePrice));
    formData.append('imei2', newPhone.imei2);
    formData.append('finalPrice', Number(newPhone.finalPrice));
    formData.append('shopid', user._id);
    formData.append('color', newPhone.color);

    try {
      let response;
      if (editMobile) {
        response = await axios.put(`${BASE_URL}api/phone/updatePhone/${editMobile._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast('Mobile Phone Record Updated Successfully');
      } else {
        response = await axios.post(`${BASE_URL}api/phone/addPhone`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast('Mobile Phone Record Added Successfully');
      }

      if (response) {
        resetForm();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewPhone({
      images: [],
      coverImage: '',
      companyName: '',
      modelSpecifications: '',
      specs: '',
      imei: '',
      demandPrice: '',
      purchasePrice: '',
      imei2: '',
      finalPrice: '',
      color: ''
    });
    setIsDualSim(false);
  };

  const handleAddDualSim = () => {
    setIsDualSim((prev) => {
      const newDualSimStatus = !prev;
      if (!newDualSimStatus) {
        setNewPhone((prevPhone) => ({
          ...prevPhone,
          imei2: ''
        }));
      }
      return newDualSimStatus;
    });
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose} centered size="lg" className="custom-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">{editMobile ? 'Edit Phone' : 'Add New Phone'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs={12}>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>Upload Images(Only 1)</Form.Label>
                  <Form.Control type="file" multiple onChange={handleImageChange} />
                  <div className="mt-3 d-flex flex-wrap">
                    {newPhone?.images?.map((image, index) => (
                      <Image
                        key={index}
                        src={typeof image === 'string' ? `data:image/jpeg;base64,${image}` : URL.createObjectURL(image)}
                        alt={`image-${index + 1}`}
                        rounded
                        style={{
                          width: '75px',
                          height: '75px',
                          objectFit: 'cover',
                          marginRight: '10px'
                        }}
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
                    type="text"
                    placeholder="Enter Company Name"
                    name="companyName"
                    value={newPhone.companyName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formModelSpecifications" className="mb-3">
                  <Form.Label>Model Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Model Name"
                    name="modelSpecifications"
                    value={newPhone.modelSpecifications}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formspecs" className="mb-3">
                  <Form.Label>Specifications</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Specifications"
                    name="specs"
                    value={newPhone.specs}
                    onChange={handleChange}
                    
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formColor" className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Color"
                    name="color"
                    value={newPhone.color}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formIMEI" className="mb-3">
                  <Form.Label>IMEI 1</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter IMEI 1"
                    name="imei"
                    value={newPhone.imei}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDemandPrice" className="mb-3">
                  <Form.Label>Demand Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Demand Price"
                    name="demandPrice"
                    value={newPhone.demandPrice}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formpurchasePrice" className="mb-3">
                  <Form.Label>Purchase Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Demand Price"
                    name="purchasePrice"
                    value={newPhone.purchasePrice}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {isDualSim && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formIMEI2" className="mb-3">
                    <Form.Label>IMEI 2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter IMEI 2"
                      name="imei2"
                      value={newPhone.imei2}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formFinalPrice" className="mb-3">
                  <Form.Label>Final Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Final Price"
                    name="finalPrice"
                    value={newPhone.finalPrice}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Add Dual SIM?"
                  checked={isDualSim}
                  onChange={handleAddDualSim}
                />
              </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (editMobile ? 'Updating...' : 'Adding...') : editMobile ? 'Update Phone' : 'Add Phone'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddPhone;
