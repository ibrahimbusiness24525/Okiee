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
    imei: '',
    demandPrice: '',
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
        imei: editMobile.imei || '',
        demandPrice: editMobile.demandPrice || '',
        imei2: editMobile.imei2 || '',
        finalPrice: editMobile.finalPrice || '',
        color: editMobile.color || ''
      });
      setIsDualSim(!!editMobile.imei2);
    }
  }, [modal, editMobile]);

  const companyOptions = ['Apple', 'Samsung', 'Huawei', 'Xiaomi'];
  const modelOptions = ['iPhone 13', 'Galaxy S21', 'P40 Pro', 'Mi 11'];
  const specsOptions = ['128GB/4GB RAM', '256GB/8GB RAM'];
  const colorOptions = ['Black', 'White', 'Blue', 'Red'];

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

    // Prepare FormData for file upload
    const formData = new FormData();

    // Append image files
    if (newPhone.images && newPhone.images.length > 0) {
      newPhone.images.forEach((image) => {
        formData.append('images', image); // Appending the image as file, not Base64
      });
    }

    // Append other fields
    formData.append('coverImage', newPhone.coverImage);
    formData.append('companyName', newPhone.companyName);
    formData.append('modelSpecifications', newPhone.modelSpecifications);
    formData.append('imei', newPhone.imei);
    formData.append('demandPrice', Number(newPhone.demandPrice));
    formData.append('imei2', newPhone.imei2);
    formData.append('finalPrice', Number(newPhone.finalPrice));
    formData.append('shopid', user._id);
    formData.append('color', newPhone.color);

    try {
      let response;
      if (editMobile) {
        // Edit mode - Update existing phone
        response = await axios.put(`${BASE_URL}api/phone/updatePhone/${editMobile._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast('Mobile Phone Record Updated Successfully');
      } else {
        // Add mode - Add new phone
        response = await axios.post(BASE_URL+'api/phone/addPhone', formData, {
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

  const toBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });

  const resetForm = () => {
    setNewPhone({
      images: [],
      coverImage: '',
      companyName: '',
      modelSpecifications: '',
      imei: '',
      demandPrice: '',
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
                  <Form.Label>Upload Images (Max 5)</Form.Label>
                  <Form.Control type="file" multiple onChange={handleImageChange} />
                  <div className="mt-3 d-flex flex-wrap">
                    {newPhone?.images?.map((image, index) => {
                      let imageUrl;

                      // Check if image is a Base64 string (since you saved it as Base64 in the backend)
                      if (typeof image === 'string') {
                        imageUrl = `data:image/jpeg;base64,${image}`; // Add the correct MIME type (e.g., image/jpeg, image/png)
                      }

                      return (
                        <Image
                          key={index}
                          src={imageUrl}
                          alt={`image-${index + 1}`}
                          rounded
                          style={{
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover',
                            marginRight: '10px'
                          }}
                        />
                      );
                    })}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formCompanyName" className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control as="select" name="companyName" value={newPhone.companyName} onChange={handleChange} required>
                    <option>Select Company</option>
                    {companyOptions.map((company, index) => (
                      <option key={index} value={company}>
                        {company}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formModelSpecifications" className="mb-3">
                  <Form.Label>Model Name</Form.Label>
                  <Form.Control
                    as="select"
                    name="modelSpecifications"
                    value={newPhone.modelSpecifications}
                    onChange={handleChange}
                    required
                  >
                    <option>Select Model</option>
                    {modelOptions.map((model, index) => (
                      <option key={index} value={model}>
                        {model}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formSpecs" className="mb-3">
                  <Form.Label>Specifications</Form.Label>
                  <Form.Control as="select" name="specs" value={newPhone.specs} onChange={handleChange} required>
                    <option>Select Specifications</option>
                    {specsOptions.map((spec, index) => (
                      <option key={index} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formColor" className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control as="select" name="color" value={newPhone.color} onChange={handleChange} required>
                    <option>Select Color</option>
                    {colorOptions.map((color, index) => (
                      <option key={index} value={color}>
                        {color}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formIMEI" className="mb-3">
                  <Form.Label>IMEI 1</Form.Label>
                  <Form.Control type="text" placeholder="Enter IMEI 1" name="imei" value={newPhone.imei} onChange={handleChange} required />
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
            </Row>
            {isDualSim && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formIMEI2" className="mb-3">
                    <Form.Label>IMEI 2</Form.Label>
                    <Form.Control type="text" placeholder="Enter IMEI 2" name="imei2" value={newPhone.imei2} onChange={handleChange} />
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
                <Form.Check type="checkbox" label="Add Dual SIM?" checked={isDualSim} onChange={handleAddDualSim} />
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
