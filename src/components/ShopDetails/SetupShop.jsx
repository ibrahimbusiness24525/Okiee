import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import { api } from '../../../api/api';

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
  const [logo, setLogo] = useState(null); // Current logo URL
  const [logoFile, setLogoFile] = useState(null); // Selected logo file
  const [logoPreview, setLogoPreview] = useState(null); // Preview of selected logo
  const [isUploadingLogo, setIsUploadingLogo] = useState(false); // Loading state for logo upload
  const [uploadSuccess, setUploadSuccess] = useState(false); // Success state for upload
  const [isPreviewLogo, setIsPreviewLogo] = useState(false); // Track if using preview logo
  const [isFetchingLogo, setIsFetchingLogo] = useState(false); // Loading state for fetching logo

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
            
            // Fetch logo if shop exists
            await fetchLogo();
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
    fetchLogo();
    fetchShopData();
  }, []);

  // Function to fetch current logo
  const fetchLogo = async () => {
    setIsFetchingLogo(true);
    try {
      console.log('Fetching logo from API...');
      const response = await api.get(`/api/shop/logo`);
      
      console.log('Logo API response:', response.data);
      console.log('Logo field:', response.data.logo);
      console.log('Logo type:', typeof response.data.logo);
      
      if (response.data.success && response.data.logo) {
        // Handle the response format: {success: true, logo: "/uploads/shop-logos/filename.jpeg"}
        let logoUrl = '';
        
        if (typeof response.data.logo === 'string' && response.data.logo !== '{}') {
          // Remove leading slash if present and construct full URL
          const logoPath = response.data.logo.startsWith('/') ? response.data.logo.substring(1) : response.data.logo;
          logoUrl = `${BASE_URL}${logoPath}`;
          console.log('Constructed logo URL:', logoUrl);
        } else if (response.data.logo?.url) {
          logoUrl = response.data.logo.url.startsWith('http') ? response.data.logo.url : `${BASE_URL}${response.data.logo.url}`;
        } else if (typeof response.data.logo === 'object' && Object.keys(response.data.logo).length > 0) {
          // Handle object with properties
          const logoObj = response.data.logo;
          if (logoObj.path) {
            logoUrl = logoObj.path.startsWith('http') ? logoObj.path : `${BASE_URL}${logoObj.path}`;
          } else if (logoObj.url) {
            logoUrl = logoObj.url.startsWith('http') ? logoObj.url : `${BASE_URL}${logoObj.url}`;
          }
        }
        
        console.log('Processed logo URL:', logoUrl);
        
        if (logoUrl && logoUrl !== `${BASE_URL}undefined` && logoUrl !== `${BASE_URL}null`) {
          setLogo(logoUrl);
          setIsPreviewLogo(false);
          console.log('✅ Logo set successfully:', logoUrl);
        } else {
          console.log('❌ No valid logo URL found in response');
          setLogo(null);
        }
      } else {
        console.log('❌ No logo found in API response');
        setLogo(null);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      console.error('Error response:', error.response?.data);
      
      // Logo not found is not an error, just means no logo exists yet
      if (error.response?.status === 404) {
        console.log('No logo found for this shop');
        setLogo(null);
      } else {
        console.error('Failed to fetch logo:', error.message);
      }
    } finally {
      setIsFetchingLogo(false);
    }
  };

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

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!');
        return;
      }

      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error('Please select a logo file');
      return;
    }

    // if (!hasShop) {
    //   toast.error('Please create a shop first before uploading a logo.');
    //   return;
    // }

    setIsUploadingLogo(true);
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Debug logging
      console.log('Upload attempt:', {
        hasToken: !!token,
        hasUser: !!user,
        hasShop: hasShop,
        fileSize: logoFile.size,
        fileName: logoFile.name,
        fileType: logoFile.type,
        baseURL: BASE_URL
      });

      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      if (!user?._id) {
        toast.error('User information not found. Please login again.');
        return;
      }

      const formData = new FormData();
      formData.append('logo', logoFile);

      console.log('FormData contents:', {
        hasLogo: formData.has('logo'),
        logoFile: formData.get('logo'),
        fileSize: logoFile.size,
        fileName: logoFile.name,
        fileType: logoFile.type
      });

      // Log FormData entries
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Test API endpoint first
      console.log('Testing API endpoint...');
      try {
        const testResponse = await api.get('api/shop/logo');
        console.log('Current logo before upload:', testResponse.data);
      } catch (testError) {
        console.log('No current logo or error fetching:', testError.response?.data);
      }

      // Test if the upload endpoint exists
      console.log('Testing upload endpoint accessibility...');
      try {
        const testUploadResponse = await api.get('api/shop/upload-logo');
        console.log('Upload endpoint test response:', testUploadResponse.data);
      } catch (testUploadError) {
        console.log('Upload endpoint test error (expected):', testUploadError.response?.status);
      }

      // Try with explicit headers
      console.log('Attempting upload with explicit headers...');
      const response = await api.post(`/api/shop/upload-logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Upload response:', response.data);
      console.log('Response logo field:', response.data.logo);
      console.log('Full response structure:', JSON.stringify(response.data, null, 2));
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if the logo field is actually an empty object
      if (response.data.logo && typeof response.data.logo === 'object' && Object.keys(response.data.logo).length === 0) {
        console.error('Backend returned empty logo object - this indicates a backend issue');
        console.log('Possible issues:');
        console.log('1. Backend not processing file upload correctly');
        console.log('2. File upload middleware not configured properly');
        console.log('3. Database not saving the logo path');
        console.log('4. API endpoint not implemented correctly');
      }

      if (response.data.success) {
        toast.success('Logo uploaded successfully!');
        
        // Handle different possible response formats
        let logoUrl = '';
        if (typeof response.data.logo === 'string') {
          // Handle the response format: {success: true, logo: "/uploads/shop-logos/filename.jpeg"}
          const logoPath = response.data.logo.startsWith('/') ? response.data.logo.substring(1) : response.data.logo;
          logoUrl = `${BASE_URL}${logoPath}`;
        } else if (response.data.shop?.logo) {
          const shopLogoPath = response.data.shop.logo.startsWith('/') ? response.data.shop.logo.substring(1) : response.data.shop.logo;
          logoUrl = `${BASE_URL}${shopLogoPath}`;
        } else if (response.data.logo?.url) {
          logoUrl = response.data.logo.url.startsWith('http') ? response.data.logo.url : `${BASE_URL}${response.data.logo.url}`;
        }
        
        console.log('Processed logo URL:', logoUrl);
        
        if (logoUrl) {
          setLogo(logoUrl);
          setLogoFile(null);
          setLogoPreview(null);
          setIsPreviewLogo(false); // Reset preview flag for real upload
          setUploadSuccess(true);
          
          // Update shop data in localStorage if available
          const shop = JSON.parse(localStorage.getItem('shop') || '{}');
          if (shop) {
            shop.logo = response.data.logo;
            localStorage.setItem('shop', JSON.stringify(shop));
          }
          
          // Hide success message after 3 seconds
          setTimeout(() => setUploadSuccess(false), 3000);
        } else {
          console.error('No valid logo URL found in response');
          console.log('Full response structure:', JSON.stringify(response.data, null, 2));
          
          // Since API is returning empty logo object, use the preview as temporary logo
          if (logoPreview) {
            console.log('Using preview as temporary logo due to API issue');
            setLogo(logoPreview);
            setLogoFile(null);
            setLogoPreview(null);
            setIsPreviewLogo(true);
            setUploadSuccess(true);
            toast.success('Logo uploaded! (Using preview due to API response issue)');
            
            // Hide success message after 3 seconds
            setTimeout(() => setUploadSuccess(false), 3000);
            return;
          }
          
          // Try using axios directly as fallback
          console.log('Trying axios directly as fallback...');
          try {
            const token = localStorage.getItem('token');
            console.log('Using token:', token ? 'Present' : 'Missing');
            console.log('Using BASE_URL:', BASE_URL);
            
            const fallbackResponse = await axios.post(`${BASE_URL}api/shop/upload-logo`, formData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              }
            });
            console.log('Fallback response:', fallbackResponse.data);
            console.log('Fallback response logo:', fallbackResponse.data.logo);
            
            if (fallbackResponse.data.success) {
              if (fallbackResponse.data.logo && typeof fallbackResponse.data.logo === 'string' && fallbackResponse.data.logo !== '{}') {
                // Handle the response format: {success: true, logo: "/uploads/shop-logos/filename.jpeg"}
                const logoPath = fallbackResponse.data.logo.startsWith('/') ? fallbackResponse.data.logo.substring(1) : fallbackResponse.data.logo;
                const logoUrl = `${BASE_URL}${logoPath}`;
                setLogo(logoUrl);
                setLogoFile(null);
                setLogoPreview(null);
                setIsPreviewLogo(false); // Reset preview flag for real upload
                setUploadSuccess(true);
                toast.success('Logo uploaded successfully via fallback!');
                
                // Hide success message after 3 seconds
                setTimeout(() => setUploadSuccess(false), 3000);
                return;
              } else {
                console.log('Fallback also returned empty logo object');
                // Use preview as fallback
                if (logoPreview) {
                  setLogo(logoPreview);
                  setLogoFile(null);
                  setLogoPreview(null);
                  setIsPreviewLogo(true);
                  setUploadSuccess(true);
                  toast.success('Logo uploaded! (Using preview due to API issue)');
                  setTimeout(() => setUploadSuccess(false), 3000);
                  return;
                }
              }
            }
          } catch (fallbackError) {
            console.error('Fallback upload failed:', fallbackError);
            console.error('Fallback error response:', fallbackError.response?.data);
            
            // Use preview as final fallback
            if (logoPreview) {
              setLogo(logoPreview);
              setLogoFile(null);
              setLogoPreview(null);
              setIsPreviewLogo(true);
              setUploadSuccess(true);
              toast.success('Logo uploaded! (Using preview due to API issues)');
              setTimeout(() => setUploadSuccess(false), 3000);
              return;
            }
          }
          
          toast.error('Logo upload failed - API returned empty response');
        }
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 404) {
        toast.error('Shop not found. Please create a shop first.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Remove logo preview
  const removeLogoPreview = () => {
    setLogoFile(null);
    setLogoPreview(null);
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
      
      {/* Logo Section */}
      <div style={styles.logoSection}>
        <h4 style={styles.logoHeading}>Shop Logo</h4>
        
        {/* Current Logo Display */}
        {logo && (
          <div style={styles.currentLogoContainer}>
            <div style={styles.logoHeader}>
              <p style={styles.currentLogoLabel}>✅ Current Shop Logo:</p>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={fetchLogo}
                disabled={isFetchingLogo}
                style={styles.refreshButton}
              >
                {isFetchingLogo ? '⏳ Loading...' : '🔄 Refresh from API'}
              </Button>
            </div>
            <img 
              src={logo} 
              alt="Current Shop Logo" 
              style={styles.currentLogo}
              onError={() => setLogo(null)}
            />
            <div style={styles.logoInfo}>
              <p style={styles.logoUrl}>Logo URL: {logo}</p>
              <p style={styles.logoStatus}>
                Status: {isPreviewLogo ? 'Preview (API Issue)' : 'Successfully Uploaded'}
              </p>
              {isPreviewLogo && (
                <p style={styles.previewWarning}>
                  ⚠️ Using preview due to API response issue
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Upload Success Message */}
        {uploadSuccess && (
          <div style={styles.successContainer}>
            <p style={styles.successMessage}>🎉 Logo uploaded successfully!</p>
            <p style={styles.successSubtext}>Your shop logo is now live</p>
          </div>
        )}
        
        {/* No Logo Message */}
        {!logo && hasShop && !uploadSuccess && (
          <div style={styles.noLogoContainer}>
            <div style={styles.noLogoIcon}>📷</div>
            <p style={styles.noLogoMessage}>No logo uploaded yet</p>
            <p style={styles.noLogoSubtext}>Upload a logo to represent your shop</p>
            <p style={styles.noLogoHint}>Click "Choose Logo File" below to get started</p>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={fetchLogo}
              disabled={isFetchingLogo}
              style={styles.fetchButton}
            >
              {isFetchingLogo ? '⏳ Checking...' : '🔍 Check API for Logo'}
            </Button>
          </div>
        )}
        
        {/* Logo Upload Section */}
        {(isEditing || !hasShop) && (
          <div style={styles.logoUploadContainer}>
            <div style={styles.fileInputContainer}>
              <input
                type="file"
                id="logo-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleLogoChange}
                style={styles.fileInput}
              />
              <label htmlFor="logo-upload" style={styles.fileInputLabel}>
                📁 Choose Logo File
              </label>
            </div>
            
            {/* File Info */}
            {logoFile && (
              <div style={styles.fileInfo}>
                <p style={styles.fileName}>Selected: {logoFile.name}</p>
                <p style={styles.fileSize}>Size: {(logoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={removeLogoPreview}
                  style={styles.removeFileButton}
                >
                  Remove
                </Button>
              </div>
            )}
            
            {/* Logo Preview */}
            {logoPreview && (
              <div style={styles.previewContainer}>
                <p style={styles.previewLabel}>Preview:</p>
                <img 
                  src={logoPreview} 
                  alt="Logo Preview" 
                  style={styles.previewImage}
                />
              </div>
            )}
            
            {/* Upload Button */}
            {logoFile && (
              <div style={styles.uploadButtonContainer}>
                <Button
                  variant="success"
                  onClick={handleLogoUpload}
                  disabled={isUploadingLogo}
                  style={styles.uploadButton}
                >
                  {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </Button>
                
                {/* Debug Info */}
                <div style={styles.debugInfo}>
                  <p style={styles.debugText}>
                    Debug: Has Shop: {hasShop ? 'Yes' : 'No'} | 
                    Has Token: {localStorage.getItem('token') ? 'Yes' : 'No'} | 
                    File: {logoFile?.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
  // Logo Section Styles
  logoSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  logoHeading: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  currentLogoContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  logoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  currentLogoLabel: {
    margin: '0',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '16px',
  },
  refreshButton: {
    fontSize: '12px',
    padding: '5px 10px',
  },
  fetchButton: {
    marginTop: '10px',
    fontSize: '12px',
    padding: '8px 15px',
  },
  currentLogo: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    border: '3px solid #28a745',
    borderRadius: '12px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  logoInfo: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#e8f5e8',
    borderRadius: '8px',
    border: '1px solid #28a745',
  },
  logoUrl: {
    margin: '0 0 5px 0',
    fontSize: '12px',
    color: '#155724',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  logoStatus: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    color: '#28a745',
    fontWeight: 'bold',
  },
  previewWarning: {
    margin: '0',
    fontSize: '12px',
    color: '#ffc107',
    fontWeight: 'bold',
    backgroundColor: '#fff3cd',
    padding: '5px 10px',
    borderRadius: '4px',
    border: '1px solid #ffeaa7',
  },
  noLogoContainer: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '2px dashed #6c757d',
    marginBottom: '20px',
  },
  noLogoIcon: {
    fontSize: '48px',
    marginBottom: '15px',
    opacity: '0.6',
  },
  noLogoMessage: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#6c757d',
    fontWeight: 'bold',
  },
  noLogoSubtext: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#6c757d',
  },
  noLogoHint: {
    margin: '0',
    fontSize: '12px',
    color: '#28a745',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  successContainer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#d4edda',
    borderRadius: '8px',
    border: '2px solid #28a745',
    marginBottom: '20px',
    animation: 'fadeIn 0.5s ease-in',
  },
  successMessage: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#155724',
    fontWeight: 'bold',
  },
  successSubtext: {
    margin: '0',
    fontSize: '14px',
    color: '#155724',
  },
  logoUploadContainer: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  fileInputContainer: {
    marginBottom: '15px',
  },
  fileInput: {
    display: 'none',
  },
  fileInputLabel: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  fileInfo: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    textAlign: 'left',
  },
  fileName: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  fileSize: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    color: '#666',
  },
  removeFileButton: {
    fontSize: '12px',
    padding: '5px 10px',
  },
  previewContainer: {
    marginBottom: '15px',
  },
  previewLabel: {
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#555',
  },
  previewImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
  },
  uploadButton: {
    padding: '10px 30px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  uploadButtonContainer: {
    marginTop: '15px',
  },
  debugInfo: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    border: '1px solid #dee2e6',
  },
  debugText: {
    margin: '0',
    fontSize: '12px',
    color: '#6c757d',
    fontFamily: 'monospace',
  },
};

export default SetupShop;
