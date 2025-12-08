import React, { useState } from 'react';
import { BASE_URL } from 'config/constant';
import axios from 'axios';

const ForSupport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    description: [],
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Button click handler for opening modal with issue-specific details
  const handleButtonClick = (issue) => {
    const issueDescriptions = {
      'Shop Profile Setup': {
        title: 'Shop Profile Setup',
        description: [
          'Access Shop Profile Settings: Navigate to "Shop Setup" in the main menu to start setting up.',
          'Entering Shop Details: Add your shop name, contact info (phone and email), and address. This information will be visible to customers.',
          'Setting Terms & Conditions: Define policies, warranties, or any specific terms for sales. This will help customers understand your policies.',
          'Saving Changes: Click "Save" after entering all details to finalize your shop profile. These details will be displayed on your online shop page.',
        ],
      },
      'Inventory Management': {
        title: 'Inventory Management',
        description: [
          'Access Inventory Section: Go to "Mobile Phone List" under "Mobile Phone" in the main menu',
          'Adding New Mobile: Click “Add New Phone” and fill in details like model, brand, price, and specifications..',
          'Uploading Photos: Add clear images of each phone to make listings more attractive to customers.',
          'Updating Phone Details: To edit an existing phone, select it from the list, make changes, and save. This is useful for updating prices or availability.',
          'Deleting a Phone Listing: If a model is out of stock or discontinued, you can delete it to keep the inventory current.',
        ],
      },
      'Sales Dashboard': {
        title: 'Sales Dashboard',
        description: [
          'Access the Dashboard: Click on "Dashboard" from the main menu to view your shop’s performance metrics.',
          'Daily Sales Overview: Check the "Daily Sales" section to see today’s sales totals and trends.',
          'Monthly & Yearly Sales Trends: Monitor your monthly and yearly sales to analyze your shop’s performance over time.',
        ],
      },
      'Invoices Generation': {
        title: 'Invoices Generation',
        description: [
          'Creating a New Invoice: Go to "Sale Invoices" under "Sales" and select "Create Invoice" after a sale',
          'Adding Sale Details: Fill in information like the mobile model, price, and date of sale for each invoice.',
          'Saving the Invoice: Save the invoice to keep a digital record',
          'Downloading and Printing Invoices: For customer receipts, click "Download" to save a copy or "Print" for a hard copy.',
          'Accessing Past Invoices: Search for past invoices by date or customer details to provide duplicates if needed.',
        ],
      },
      'Payment Methods': {
        title: 'Payment Methods',
        description: [
          'FNavigate to Payment Settings: Go to "Payment Methods" under "Subscription" in the menu.',
          'Adding JazzCash Account: Enter your JazzCash details for customers to pay directly through JazzCash',
          'Setting Up Bank Transfer: Provide your bank details to allow customers to transfer payments directly to your bank.',
          'Configuring EasyPaisa: Enter your EasyPaisa number to offer this as a payment option',
          'Testing Payment Methods: Complete a small test transaction to ensure each payment method works smoothly.',
          'Troubleshooting Payment Issues: If customers experience payment issues, contact support for assistance.',
        ],
      },
      'Support and Troubleshooting': {
        title: 'Support and Troubleshooting',
        description: [
          'Password Reset: If you can’t log in, click “Forgot Password” on the login screen and follow the instructions..',
          'Fixing Data Entry Errors: For issues while adding inventory or invoices, double-check details or reload the page.',
          'Resolving Slow App Performance: If the app is slow, try clearing cache or refreshing your browser.',
          'Contact Support Team: For additional help, click "Contact Support" to submit your issue',
          'Tracking a Support Request: If you have an existing support ticket, enter the tracking number in the support section to view updates',
        ],
      },
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
      [e.target.name]: e.target.value,
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
      console.error('Failed to send support request:', error);
      alert(
        'There was an error sending your support request. Please try again.'
      );
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        padding: '20px',
      }}
    >
      {/* Main Support Section */}
      <div
        style={{
          padding: '40px 0',
          backgroundColor: '#ffffff',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          margin: '30px 0',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#2c3e50',
          }}
        >
          How Okiiee can help you?
        </h2>

        {/* Button Layout with Flexbox */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            'Shop Profile Setup',
            'Inventory Management',
            'Sales Dashboard',
            'Invoices Generation',
            'Payment Methods',
            'Support and Troubleshooting',
          ].map((issue, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(issue)}
              style={{
                flex: '1 1 30%', // Take up 30% of the row, shrink or grow as needed
                padding: '15px',
                margin: '10px',
                backgroundColor: [
                  '#3498db',
                  '#e67e22',
                  '0#27ae6',
                  '#8e44ad',
                  '#f39c12',
                  '#34495e',
                ][index],
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                minWidth: '200px', // Minimum width for smaller screens
                maxWidth: '300px', // Maximum width for larger screens
                boxSizing: 'border-box',
              }}
            >
              {issue}
            </button>
          ))}
        </div>
      </div>

      {/* Support Form Section */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ textAlign: 'center', color: '#2c3e50' }}>
          Submit Your Mail To Okiiee
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="name"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="subject"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Subject:
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="message"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Message:
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '150px',
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
                fontSize: '16px',
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90%', // Ensure modal is responsive
            }}
          >
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
                cursor: 'pointer',
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
