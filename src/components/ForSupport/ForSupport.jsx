import React, { useState } from 'react';
import { BASE_URL } from 'config/constant';
import axios from 'axios';

const ForSupport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: [] });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Button click handler for opening modal with issue-specific details
  const handleButtonClick = (issue) => {
    const issueDescriptions = {
      'Order & Purchases': {
        title: 'Order & Purchases',
        description: [
          'View and modify your purchase history.',
          'Track your shipping status.',
          'Cancel or modify your order.'
        ]
      },
      'My Account': {
        title: 'My Account',
        description: [
          'Update your personal information.',
          'Change account password.',
          'Manage linked payment methods.'
        ]
      },
      'My Membership': {
        title: 'My Best Buy Membership',
        description: [
          'Check your membership perks.',
          'Manage reward points and offers.',
          'Upgrade or cancel your membership.'
        ]
      },
      'Product Repair & Support': {
        title: 'Product Repair & Support',
        description: [
          'Request product repairs.',
          'Check warranty details.',
          'Find troubleshooting guides.'
        ]
      },
      'Store Locations': {
        title: 'Store Locations',
        description: [
          'Find nearby store locations.',
          'Check store hours and services.',
          'Get directions to a store.'
        ]
      },
      'Other Inquiries': {
        title: 'Other Inquiries',
        description: [
          'Contact customer support for general inquiries.',
          'Submit feedback or report issues.',
          'Request information on other services.'
        ]
      }
    };

    setModalContent(issueDescriptions[issue]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Make a POST request to send email with form data
    try {
      await axios.post(`${BASE_URL}api/admin/send-email`, {
        name: formData.name,
        recipientEmail: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      // Clear form after submission
      // alert('Support request submitted!');
        setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
        console.error("Failed to send support request:", error);
        alert("There was an error sending your support request. Please try again.");
    }
};

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8f9fa', padding: '20px' }}>
      
      {/* Main Support Section */}
      <div style={{
        padding: '40px 0',
        backgroundColor: '#ffffff',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        margin: '30px 0'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>How Okiee can help you?</h2>
        
        {/* Button Layout with Flexbox */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center' 
        }}>
          {['Order & Purchases', 'My Account', 'My Membership', 'Product Repair & Support', 'Store Locations', 'Other Inquiries'].map((issue, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(issue)}
              style={{
                flex: '1 1 30%', // Take up 30% of the row, shrink or grow as needed
                padding: '15px',
                margin: '10px',
                backgroundColor: ['#3498db', '#e67e22', '#27ae60', '#8e44ad', '#f39c12', '#34495e'][index],
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                minWidth: '200px', // Minimum width for smaller screens
                maxWidth: '300px', // Maximum width for larger screens
                boxSizing: 'border-box'
              }}
            >
              {issue}
            </button>
          ))}
        </div>
      </div>

      {/* Support Form Section */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ textAlign: 'center', color: '#2c3e50' }}>Submit a Support Request</h3>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '5px' }}>Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '150px'
              }}
              required
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '12px 30px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%' // Ensure modal is responsive
          }}>
            <h3>{modalContent.title}</h3>
            <ul>
              {modalContent.description.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForSupport;
