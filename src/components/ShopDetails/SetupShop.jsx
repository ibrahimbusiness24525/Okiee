import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from 'config/constant';

const SetupShop = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    ownerName: '',
    contactNumbers: [''],
    terms: [],
    shopId: null, // Track shop ID for update calls
  });
  const [isEditing, setIsEditing] = useState(false); // Controls whether the form is editable
  const [hasShop, setHasShop] = useState(false); // Tracks if the user has a shop

  useEffect(() => {
    const fetchShopData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?._id) {
        try {
          const response = await axios.get(`${BASE_URL}api/shop/getshop/${user._id}`);
          const shop = response.data?.shop;

          if (shop) {
            localStorage.setItem('shop', JSON.stringify(shop));
            setFormData({
              shopName: shop.shopName || '',
              address: shop.address || '',
              ownerName: shop.name || '',
              contactNumbers: shop.contactNumber || [''],
              terms: shop.termsCondition || [],
              shopId: shop._id || null,
            });
            setHasShop(true); // User has shop data
          } else {
            setHasShop(false); // No shop data found
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to fetch shop data');
        }
      } else {
        toast.error('User ID not found');
      }
    };

    fetchShopData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?._id) {
      toast.error('User ID not found');
      return;
    }

    const payload = {
      name: formData.ownerName,
      shopName: formData.shopName,
      termsCondition: formData.terms,
      address: formData.address,
      contactNumber: formData.contactNumbers,
      shopId: user._id,
    };

    try {
      if (hasShop && formData.shopId) {
        // Update existing shop
        await axios.put(`${BASE_URL}api/shop/updateShop/${formData.shopId}`, payload);
        toast.success('Shop updated successfully');
      } else {
        // Create new shop
        await axios.post(`${BASE_URL}api/shop/addshop`, payload);
        toast.success('Shop created successfully');
        setHasShop(true); // Mark that user has a shop after creation
      }
      setIsEditing(false); // Disable editing after submitting
    } catch (error) {
      console.error(error);
      toast.error('Failed to save shop data');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, id } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData };

      if (name === 'terms' || name === 'contactNumbers') {
        const index = parseInt(id, 10);
        updatedData[name][index] = type === 'number' ? value.replace(/\D/g, '') : value;
      } else {
        updatedData[name] = value;
      }

      return updatedData;
    });
  };

  const addField = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ''],
    }));
  };

  const removeField = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  const renderField = (field, index, placeholder) => (
    <div key={index} style={styles.inputGroup}>
      <Form.Control
        type="text"
        id={index.toString()}
        name={field}
        value={formData[field][index] || ''}
        onChange={handleChange}
        placeholder={`${placeholder} ${index + 1}`}
        disabled={!isEditing && hasShop} // Apply the condition here
        className="mb-2"
      />
      {isEditing && formData[field]?.length > 1 && (
        <Button
          variant="danger"
          onClick={() => removeField(field, index)}
          style={styles.removeButton}
        >
          🗑️
        </Button>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Setup Your Shop</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Shop Name</Form.Label>
          <Form.Control
            type="text"
            name="shopName"
            value={formData.shopName || ''}
            onChange={handleChange}
            disabled={!isEditing && hasShop} // Apply the condition here
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Owner Name</Form.Label>
          <Form.Control
            type="text"
            name="ownerName"
            value={formData.ownerName || ''}
            onChange={handleChange}
            disabled={!isEditing && hasShop} // Apply the condition here
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contact Numbers</Form.Label>
          {formData?.contactNumbers?.map((_, index) =>
            renderField('contactNumbers', index, 'Contact')
          )}
          {isEditing || !hasShop ?
         ( <>
          {formData?.contactNumbers?.map((_, index) =>
            renderField('contactNumbers', index, 'Contact')
          )}
            <Button style={{ display: 'block' }} variant="secondary" onClick={() => addField('contactNumbers')}>
              + Add Contact
            </Button>
            </>
         ):
           ( <ul>
             {formData?.contactNumbers?.map((contactNumbers, index) => (
                <li key={index}>{contactNumbers}</li>
              ))}
          </ul>)
          }
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            disabled={!isEditing && hasShop} // Apply the condition here
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Terms and Conditions</Form.Label>
          {isEditing || !hasShop ? (
            <>
              {formData.terms.map((_, index) =>
                renderField('terms', index, 'Condition')
              )}
              <Button style={{ display: 'block' }} variant="secondary" onClick={() => addField('terms')}>
                + Add Condition
              </Button>
            </>
          ) : (
            <ul>
              {formData?.terms?.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          )}
        </Form.Group>

        {hasShop ? (
          isEditing ? (
            <Button variant="primary" type="submit">
              Update Shop
            </Button>
          ) : (
            <div
              style={styles.editButton}
              onClick={() => setIsEditing(true)} // Toggles edit mode
            >
              Edit
            </div>
          )
        ) : (
          <Button variant="primary" type="submit">
            Create Shop
          </Button>
        )}
      </Form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#333',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  removeButton: {
    padding: '0 8px',
  },
  editButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#f39c12',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '15px',
    textDecoration: 'none',
  },
  editButtonHover: {
    backgroundColor: '#e67e22',
  },
};

export default SetupShop;
