import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { SliderMark } from '@mui/material';

const MobileDetails = () => {
  const location = useLocation();
  const { mobile } = location.state || {};

  if (!mobile) {
    return <div>No mobile details found.</div>;
  }

  const sliderSettings = {
    dots: true, // Enable dots at the bottom
    infinite: true, // Infinite scroll
    speed: 500,
    slidesToShow: 1, // Show one image at a time
    slidesToScroll: 1, // Scroll one image at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000 // Time before changing slides (3 seconds)
  };

  return (
    <div className="container mt-4">
      <Row>
        <Col md={6}>
          {/* Image Slider */}
          <SliderMark {...sliderSettings}>
            {mobile.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Mobile Image ${index + 1}`}
                  className="img-fluid"
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }} // Set standard size
                />
              </div>
            ))}
          </SliderMark>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>
                {mobile.companyName} {mobile.modelName}
              </Card.Title>
              <Card.Text>
                <strong>Price:</strong> Rs {mobile.finalPrice}{' '}
                <span style={{ textDecoration: 'line-through' }}>Rs {mobile.demandPrice}</span>{' '}
                <span className="text-success">15% OFF</span>
                <br />
                <strong>Specifications:</strong> {mobile.specifications}
                <br />
                <strong>Color:</strong> {mobile.color}
                <br />
                <strong>IMEI 1:</strong> {mobile.imei1}
                <br />
                <strong>IMEI 2:</strong> {mobile.imei2}
              </Card.Text>
              <Button variant="primary">Add to Cart</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Colors */}
      <div className="mt-4">
        {/* <h5>Available Colors:</h5>
        <Row>
          {mobile.images.map((image, index) => (
            <Col key={index} xs={2} className="text-center">
              <img
                src={image}
                alt={`Color ${index + 1}`}
                className="img-fluid"
                style={{ width: '100%', height: '50px', objectFit: 'cover' }} // Standard size for thumbnails
              />
            </Col>
          ))}
        </Row> */}

        {/* Storage Options */}
        <h5 className="mt-3">Available Storage Options:</h5>
        <div>
          <Button variant="outline-primary" className="me-2">
            128GB - 8GB RAM
          </Button>
          <Button variant="outline-primary">256GB - 8GB RAM</Button>
        </div>
      </div>
    </div>
  );
};

export default MobileDetails;
