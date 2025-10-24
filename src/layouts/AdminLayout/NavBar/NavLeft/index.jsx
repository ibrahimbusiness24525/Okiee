// import React, { useState } from 'react';
// import { ListGroup } from 'react-bootstrap';
// import useWindowSize from '../../../../hooks/useWindowSize';
// import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
// import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
// import Modal from 'components/Modal/Modal';

// const NavLeft = () => {
//   const [companyName, setCompanyName] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       await api.post('/api/company/create', {
//         name: companyName,
//       });
//       handleModalClose();
//       setCompanyName('');
//     } catch (error) {
//       console.error('Failed to add company:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const windowSize = useWindowSize();
//   const [showAddPhoneModal, setShowAddPhoneModal] = React.useState(false);
//   const [showPurchasePhoneModal, setShowPurchasePhoneModal] =
//     React.useState(false);

//   const handleAddPhoneShow = () => setShowAddPhoneModal(true);
//   const handleAddPhoneClose = () => setShowAddPhoneModal(false);

//   const handlePurchasePhoneShow = () => setShowPurchasePhoneModal(true);
//   const handlePurchasePhoneClose = () => setShowPurchasePhoneModal(false);

//   // Button styles dynamically based on screen size
//   const buttonStyles = {
//     base: {
//       background: 'linear-gradient(to right, #50b5f4, #b8bee2)',
//       color: '#fff',
//       border: 'none',
//       borderRadius: '5px',
//       cursor: 'pointer',
//       transition: 'all 0.3s ease',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     largeScreen: {
//       height: '50px',
//       width: '200px',
//       marginLeft: '50px',
//       marginTop: '0px',
//     },
//     mediumScreen: {
//       height: '45px',
//       width: '180px',
//       marginLeft: '20px',
//       marginTop: '5px',
//     },
//     smallScreen: {
//       height: '40px',
//       width: '100%',
//       marginLeft: '5px',
//       marginTop: '10px',
//     },
//   };

//   const hoverStyle = {
//     background: 'linear-gradient(to right, #3a97d4, #9ea9d2)',
//   };

//   // Apply styles based on screen size
//   let dynamicStyles = {};
//   if (windowSize.width > 1200) {
//     dynamicStyles = buttonStyles.largeScreen;
//   } else if (windowSize.width > 768) {
//     dynamicStyles = buttonStyles.mediumScreen;
//   } else {
//     dynamicStyles = buttonStyles.smallScreen;
//   }

//   return (
//     <React.Fragment>
//       <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
//         <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
//           <button
//             style={{
//               ...buttonStyles.base,
//               ...dynamicStyles,
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.background = hoverStyle.background;
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.background = buttonStyles.base.background;
//             }}
//             onClick={handlePurchasePhoneShow}
//           >
//             Purchase Phone
//           </button>
//         </ListGroup.Item>
//         <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
//           <button
//             style={{
//               ...buttonStyles.base,
//               ...dynamicStyles,
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.background = hoverStyle.background;
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.background = buttonStyles.base.background;
//             }}
//           >
//             Add Company
//           </button>
//         </ListGroup.Item>
//         <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
//           <button
//             style={{
//               ...buttonStyles.base,
//               ...dynamicStyles,
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.background = hoverStyle.background;
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.background = buttonStyles.base.background;
//             }}
//           >
//             Add Model
//           </button>
//         </ListGroup.Item>
//       </ListGroup>
//       <AddPhone
//         modal={showAddPhoneModal}
//         handleModalClose={handleAddPhoneClose}
//       />
//       <PurchasePhone
//         modal={showPurchasePhoneModal}
//         handleModalClose={handlePurchasePhoneClose}
//       />
//       <Modal size="sm">
//         <h2 style={{ marginBottom: 24 }}>Add Company</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//             placeholder="Company Name"
//             required
//             style={{ padding: 12, width: '100%', marginBottom: 20 }}
//           />
//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Adding...' : 'Add Company'}
//           </button>
//         </form>
//       </Modal>
//     </React.Fragment>
//   );
// };

// export default NavLeft;

import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  FormControl,
  ListGroup,
  Modal,
  Col,
} from 'react-bootstrap';
import ModalComponent from '../../../../components/Modal/Modal';
import useWindowSize from '../../../../hooks/useWindowSize';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
import { api, getAllImeis } from '../../../../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useGetAccessories } from 'hooks/accessory';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
import CustomSelect from 'components/CustomSelect';
import { FaFileAlt, FaPhone, FaPlus, FaUser } from 'react-icons/fa';

const NavLeft = () => {
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [showPurchasePhoneModal, setShowPurchasePhoneModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [modelName, setModelName] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const { data } = useGetAccessories();
  const [imei, setImei] = useState('');
  const [showWalletTransactionModal, setShowWalletTransactionModal] =
    useState(false);
  const [walletTransaction, setWalletTransaction] = useState({
    bankAccountUsed: '',
    amountFromBank: '',
    amountFromPocket: '',
  });
  const [formData, setFormData] = useState({
    imei: '',
    imeiList: [],
    search: '',
    bankName: '',
    payableAmountNow: '',
    payableAmountLater: '',
    payableAmountLaterDate: '',
    exchangePhoneDetail: '',
    type: '',
    cnicFrontPic: '',
    cnicBackPic: '',
    sellingType: '',
    accessoryName: '',
    accessoryPrice: 0,
    accessories: [{ name: '', quantity: 1, price: '' }],
    customerNumber: '',
    searchTerm: '',
    editMobile: null,
    soldMobile: null,
    saleDate: new Date().toISOString().split('T')[0], // Set today's date as default
    customerName: '',
    finalPrice: '',
    warranty: '12 months',
    deleteMobileId: null,
    dispatchMobile: null,
    shopName: '',
    id: '',
    personName: '',
    imeiInput: '',
    addedImeis: [],
    showAmount: false,
    showPrices: false,
    selectedMobile: null,
    imeis: [],
    scanning: false,
    barcodeScan: 'No Barcode Scanned',
    list: true,
    showSoldModal: false,
    // Add new fields for IMEI prices
    imeiPrice: '',
    imeiPrices: [], // Array to store {imei: '', price: ''} objects
  });

  // Add missing state variables
  const [sellingType, setSellingType] = useState('');
  const [showNewEntityForm, setShowNewEntityForm] = useState(true);
  const [newEntity, setNewEntity] = useState({
    name: '',
    number: '',
  });
  const [entityData, setEntityData] = useState({
    name: '',
    number: '',
    _id: '',
  });

  // Add state variables for IMEI functionality
  const [allImeis, setAllImeis] = useState([]);
  const [filteredImeis, setFilteredImeis] = useState([]);
  const [loadingImeis, setLoadingImeis] = useState(false);
  const [showImeiDropdown, setShowImeiDropdown] = useState(false);
  const [getAllEntities, setGetAllEntities] = useState([]);
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [createPersonData, setCreatePersonData] = useState({
    name: '',
    number: '',
    reference: '',
  });

  const [isCreatingEntity, setIsCreatingEntity] = useState(false);
  const handleCreatePerson = async (e) => {
    e.preventDefault();
    if (
      !createPersonData.name ||
      !createPersonData.number ||
      !createPersonData.reference
    ) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsCreatingEntity(true);
      await api.post('/api/person/create', {
        name: createPersonData.name,
        number: Number.parseInt(createPersonData.number),
        reference: createPersonData.reference,
      });

      setShowCreateModal(false);
      setCreatePersonData({ name: '', number: '', reference: '' });
      alert('Person created successfully!');
    } catch (error) {
      console.error('Error creating person:', error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          error?.data?.message ||
          'Error creating person'
      );
    } finally {
      setIsCreatingEntity(false);
    }
  };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // For select multiple (like IMEI selection)
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For nested objects like accessories
  const handleAccessoryChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedAccessories = [...prev.accessories];
      updatedAccessories[index][field] = value;
      return {
        ...prev,
        accessories: updatedAccessories,
      };
    });
  };
  const handleSellPhone = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/purchase/general-mobile-sale', {
        imei: Number(imei),
      });

      toast.success('Phone sold successfully!');
      setImei(''); // Clear the IMEI after successful sale
    } catch (error) {
      console.log('Error selling phone:', error);
    }
  };
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/api/company/all-companies');
        setCompanies(response?.data?.companies || []);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    if (showAddModelModal) {
      fetchCompanies();
    }
  }, [showAddModelModal]);

  // Add useEffect to fetch all entities
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        console.log('Fetching entities...');
        const response = await api.get('/api/person/all');
        console.log('Entities response:', response);
        console.log('Response data:', response?.data);
        console.log('Response data.persons:', response?.data?.persons);

        // Try different response structures
        let entities = [];
        if (response?.data?.persons) {
          entities = response.data.persons;
        } else if (response?.data) {
          entities = response.data;
        } else if (Array.isArray(response)) {
          entities = response;
        }

        console.log('Final entities data:', entities);
        setGetAllEntities(entities);
      } catch (error) {
        console.error('Failed to fetch entities:', error);
        // Try fallback endpoint
        try {
          console.log('Trying fallback endpoint /api/person/nameAndId...');
          const fallbackResponse = await api.get('/api/person/nameAndId');
          console.log('Fallback response:', fallbackResponse);
          console.log('Fallback data:', fallbackResponse?.data);

          let entities = [];
          if (fallbackResponse?.data?.persons) {
            entities = fallbackResponse.data.persons;
          } else if (fallbackResponse?.data) {
            entities = fallbackResponse.data;
          } else if (Array.isArray(fallbackResponse)) {
            entities = fallbackResponse;
          }

          console.log('Fallback entities data:', entities);
          setGetAllEntities(entities);
        } catch (fallbackError) {
          console.error('Fallback endpoint also failed:', fallbackError);
        }
      }
    };

    fetchEntities();
  }, []);

  // Also fetch entities when the modal opens
  useEffect(() => {
    if (showSoldModal) {
      const fetchEntities = async () => {
        try {
          console.log('Fetching entities when modal opens...');
          const response = await api.get('/api/person/all');
          console.log('Modal entities response:', response);
          console.log('Modal response data:', response?.data);
          console.log('Modal response data.persons:', response?.data?.persons);

          // Try different response structures
          let entities = [];
          if (response?.data?.persons) {
            entities = response.data.persons;
          } else if (response?.data) {
            entities = response.data;
          } else if (Array.isArray(response)) {
            entities = response;
          }

          console.log('Modal final entities data:', entities);
          setGetAllEntities(entities);
        } catch (error) {
          console.error('Failed to fetch entities when modal opens:', error);
          // Try fallback endpoint
          try {
            console.log(
              'Modal: Trying fallback endpoint /api/person/nameAndId...'
            );
            const fallbackResponse = await api.get('/api/person/nameAndId');
            console.log('Modal fallback response:', fallbackResponse);
            console.log('Modal fallback data:', fallbackResponse?.data);

            let entities = [];
            if (fallbackResponse?.data?.persons) {
              entities = fallbackResponse.data.persons;
            } else if (fallbackResponse?.data) {
              entities = fallbackResponse.data;
            } else if (Array.isArray(fallbackResponse)) {
              entities = fallbackResponse;
            }

            console.log('Modal fallback entities data:', entities);
            setGetAllEntities(entities);
          } catch (fallbackError) {
            console.error(
              'Modal fallback endpoint also failed:',
              fallbackError
            );
          }
        }
      };

      fetchEntities();
    }
  }, [showSoldModal]);

  // Debug useEffect to monitor getAllEntities state
  useEffect(() => {
    console.log('getAllEntities state changed:', getAllEntities);
  }, [getAllEntities]);

  // Add useEffect to fetch all IMEIs
  useEffect(() => {
    const fetchImeis = async () => {
      try {
        setLoadingImeis(true);
        const response = await getAllImeis();
        console.log('IMEIs response:', response);
        const imeis = response?.data?.data?.imeis || [];
        console.log('Loaded IMEIs:', imeis);
        setAllImeis(imeis);
        // Don't show dropdown initially - keep it closed
        setFilteredImeis([]);
      } catch (error) {
        console.error('Error fetching IMEIs:', error);
        toast.error('Error fetching IMEIs');
      } finally {
        setLoadingImeis(false);
      }
    };

    fetchImeis();
  }, []);

  // Add useEffect to handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown
      if (
        showImeiDropdown &&
        !event.target.closest('.imei-dropdown-container')
      ) {
        setShowImeiDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showImeiDropdown]);
  console.log('allImeis', allImeis);
  console.log('====================================');
  console.log('getAllEntities', getAllEntities);
  console.log('====================================');

  const handleAddPhoneShow = () => setShowAddPhoneModal(true);
  const handleAddPhoneClose = () => setShowAddPhoneModal(false);

  const handlePurchasePhoneShow = () => setShowPurchasePhoneModal(true);
  const handlePurchasePhoneClose = () => setShowPurchasePhoneModal(false);

  const handleAddCompanyShow = () => setShowAddCompanyModal(true);
  const handleAddCompanyClose = () => setShowAddCompanyModal(false);

  const handleAddModelShow = () => setShowAddModelModal(true);
  const handleAddModelClose = () => setShowAddModelModal(false);
  console.log('====================================');
  console.log('Companies:', companies);
  console.log('All Entities:', getAllEntities);
  console.log('====================================');
  const handleAddCompany = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/api/company/create-company', { name: companyName });
      toast.success('Company added successfully!');
      setCompanyName('');
      handleAddCompanyClose();
    } catch (error) {
      console.error('Failed to add company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddModel = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/api/company/create-model', {
        name: modelName,
        companyId: selectedCompanyId,
      });
      setModelName('');
      toast.success('Model added successfully!');
      setSelectedCompanyId('');
      handleAddModelClose();
    } catch (error) {
      console.error('Failed to add model:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonStyles = {
    base: {
      background: 'linear-gradient(to right, #50b5f4, #b8bee2)',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    largeScreen: {
      height: '40px',
      width: '120px',
      marginLeft: '40px',
      marginTop: '0px',
    },
    mediumScreen: {
      height: '45px',
      width: '180px',
      marginLeft: '20px',
      marginTop: '5px',
    },
    smallScreen: {
      height: '40px',
      width: '100%',
      marginLeft: '5px',
      marginTop: '10px',
    },
  };

  const hoverStyle = {
    background: 'linear-gradient(to right, #3a97d4, #9ea9d2)',
  };

  let dynamicStyles = {};
  if (windowSize.width > 1200) {
    dynamicStyles = buttonStyles.largeScreen;
  } else if (windowSize.width > 768) {
    dynamicStyles = buttonStyles.mediumScreen;
  } else {
    dynamicStyles = buttonStyles.smallScreen;
  }
  console.log('formdata imei', formData?.addedImeis);
  return (
    <>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <button
            style={{ ...buttonStyles.base, ...dynamicStyles }}
            onMouseEnter={(e) =>
              (e.target.style.background = hoverStyle.background)
            }
            onMouseLeave={(e) =>
              (e.target.style.background = buttonStyles.base.background)
            }
            onClick={handlePurchasePhoneShow}
          >
            Purchase Phone
          </button>
        </ListGroup.Item>

        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <button
            className="sale-mobile-btn"
            style={{
              ...buttonStyles.base,
              ...dynamicStyles,
              backgroundColor: '#4285F4', // Google blue
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3367D6';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4285F4';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(1px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => setShowSoldModal(true)}
          >
            Sale Mobile
          </button>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <button
            style={{
              ...buttonStyles.base,
              ...dynamicStyles,
              background: '#4CAF50', // Simple green
            }}
            onMouseEnter={(e) => (e.target.style.background = '#45a049')} // Darker green
            onMouseLeave={(e) => (e.target.style.background = '#4CAF50')}
            onClick={handleAddCompanyShow}
          >
            Add Company
          </button>
        </ListGroup.Item>

        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <button
            style={{
              ...buttonStyles.base,
              ...dynamicStyles,
              background: '#2196F3', // Simple blue
            }}
            onMouseEnter={(e) => (e.target.style.background = '#1976D2')} // Darker blue
            onMouseLeave={(e) => (e.target.style.background = '#2196F3')}
            onClick={handleAddModelShow}
          >
            Add Model
          </button>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <button
            style={{
              ...buttonStyles.base,
              ...dynamicStyles,
              background: '#4CAF50', // Simple blue
            }}
            onMouseEnter={(e) => (e.target.style.background = '#1976D2')} // Darker blue
            onMouseLeave={(e) => (e.target.style.background = '#2196F3')}
            onClick={() => setShowCreateModal(true)}
          >
            Create Entity
          </button>
        </ListGroup.Item>
      </ListGroup>

      <AddPhone
        modal={showAddPhoneModal}
        handleModalClose={handleAddPhoneClose}
      />
      <PurchasePhone
        modal={showPurchasePhoneModal}
        handleModalClose={handlePurchasePhoneClose}
      />

      <Modal
        show={showAddCompanyModal}
        onHide={handleAddCompanyClose}
        size="sm"
        centered
      >
        <div style={{ padding: '24px' }}>
          <h2
            style={{
              marginBottom: '24px',
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            Add Company
          </h2>
          <form onSubmit={handleAddCompany}>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              required
              style={{
                padding: '12px',
                width: '100%',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px',
                width: '100%',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) =>
                !isSubmitting && (e.target.style.backgroundColor = '#45a049')
              }
              onMouseOut={(e) =>
                !isSubmitting && (e.target.style.backgroundColor = '#4CAF50')
              }
            >
              {isSubmitting ? 'Adding...' : 'Add Company'}
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        show={showAddModelModal}
        onHide={handleAddModelClose}
        size="sm"
        centered
      >
        <div style={{ padding: '24px' }}>
          <h2
            style={{
              marginBottom: '24px',
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            Add Model
          </h2>
          <form onSubmit={handleAddModel}>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              required
              style={{
                padding: '12px',
                width: '100%',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white',
                appearance: 'none',
              }}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Model Name"
              required
              style={{
                padding: '12px',
                width: '100%',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px',
                width: '100%',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) =>
                !isSubmitting && (e.target.style.backgroundColor = '#45a049')
              }
              onMouseOut={(e) =>
                !isSubmitting && (e.target.style.backgroundColor = '#4CAF50')
              }
            >
              {isSubmitting ? 'Adding...' : 'Add Model'}
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        show={showSoldModal}
        onHide={() => setShowSoldModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          {/* <Modal.Title>Sell Mobile</Modal.Title> */}
        </Modal.Header>

        <Modal.Body>
          <div>
            <Col>
              {console.log(
                'Rendering entity section, sellingType:',
                formData.sellingType
              )}
              {formData.sellingType !== 'none' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <label style={{ fontWeight: '600' }}>Entity *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowNewEntityForm(false)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: !showNewEntityForm
                            ? '#e5e7eb'
                            : 'transparent',
                          border: '1px solid #d1d5db',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        Select Existing
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewEntityForm(true)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: showNewEntityForm
                            ? '#e5e7eb'
                            : 'transparent',
                          border: '1px solid #d1d5db',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        New Customer
                      </button>
                    </div>
                  </div>

                  {showNewEntityForm ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#4b5563',
                          }}
                        >
                          Entity Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newEntity.name}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter entity name"
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#4b5563',
                          }}
                        >
                          Entity Number *
                        </label>
                        <input
                          name="number"
                          type="text"
                          value={newEntity.number}
                          onChange={(e) =>
                            setNewEntity({
                              ...newEntity,
                              number: e.target.value,
                            })
                          }
                          placeholder="Enter entity number"
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {console.log(
                        'Rendering CustomSelect with options:',
                        getAllEntities.map((entity) => ({
                          value: entity._id,
                          label: `${entity.name} || ${entity.number}`,
                        }))
                      )}
                      <div style={{}}>
                        <CustomSelect
                          key={`custom-select-${getAllEntities.length}`} // Force re-render when entities change
                          value={entityData._id}
                          onChange={(selectedOption) => {
                            console.log('Selected option:', selectedOption);
                            const selectedEntity = getAllEntities.find(
                              (entity) => entity._id === selectedOption?.value
                            );
                            console.log('Selected entity:', selectedEntity);
                            setEntityData(
                              selectedEntity || {
                                name: '',
                                number: '',
                                _id: '',
                              }
                            );
                          }}
                          options={[
                            ...getAllEntities.map((entity) => ({
                              value: entity._id,
                              label: `${entity.name} || ${entity.number}`,
                            })),
                            // Add a test option to see if component works
                            {
                              value: 'test',
                              label: 'Test Option - Component Working',
                            },
                          ]}
                        />
                      </div>
                      {/* Debug info */}
                    </>
                  )}
                </div>
              )}
            </Col>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="saleDate">
                  <Form.Label>Sale Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="saleDate"
                    value={formData.saleDate}
                    onChange={handleChange}
                    placeholder="Enter Sale Date"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Selling Type</Form.Label>
                  <Form.Select
                    name="sellingType"
                    value={formData.sellingType}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select Selling Type</option>
                    <option value="Exchange">Exchange</option>
                    <option value="Full Payment">Full Payment</option>
                    <option value="Credit">Credit</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            {/* <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Customer Number</Form.Label>
                <Form.Control
                  type="text"
                  name="customerNumber"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  placeholder="Enter customer number"
                  required
                />
              </Form.Group> */}

            <div>
              {formData.accessories.map((accessory, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <Form.Group>
                    <Form.Label>Accessory Name</Form.Label>
                    <Form.Select
                      value={accessory.name}
                      onChange={(e) =>
                        handleAccessoryChange(index, 'name', e.target.value)
                      }
                    >
                      <option value="">Select accessory</option>
                      {data?.data?.map((item, index) => (
                        <option key={item._id} value={item._id}>
                          {item.accessoryName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={accessory.quantity}
                      onChange={(e) =>
                        handleAccessoryChange(index, 'quantity', e.target.value)
                      }
                      min="1"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Accessory Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={accessory.price}
                      onChange={(e) =>
                        handleAccessoryChange(index, 'price', e.target.value)
                      }
                      placeholder="Enter price"
                    />
                  </Form.Group>

                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={() => {
                      const updatedAccessories = formData.accessories.filter(
                        (_, i) => i !== index
                      );
                      setFormData((prev) => ({
                        ...prev,
                        accessories: updatedAccessories,
                      }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                variant="primary"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    accessories: [
                      ...prev.accessories,
                      { name: '', quantity: 1, price: '' },
                    ],
                  }));
                }}
                style={{ marginBottom: '20px' }}
              >
                Add Another Accessory
              </Button>
              <Form.Group className="mb-3 imei-dropdown-container">
                <Form.Label>Select Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.imei}
                  name="imei"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      imei: e.target.value,
                    }));
                    // Filter IMEIs based on input
                    let filteredImeis;
                    if (e.target.value.trim() === '') {
                      // Show first 10 IMEIs when input is empty
                      filteredImeis = allImeis.slice(0, 10);
                    } else {
                      filteredImeis = allImeis.filter((phone) =>
                        phone.imei1
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      );
                    }
                    console.log('Filtered IMEIs:', filteredImeis);
                    setFilteredImeis(filteredImeis);
                    setShowImeiDropdown(true);
                  }}
                  onFocus={() => {
                    // Show first 10 IMEIs when input is focused
                    if (allImeis.length > 0) {
                      setFilteredImeis(allImeis.slice(0, 10));
                      setShowImeiDropdown(true);
                    }
                  }}
                  onClick={() => {
                    // Show first 10 IMEIs when input is clicked
                    if (allImeis.length > 0) {
                      setFilteredImeis(allImeis.slice(0, 10));
                      setShowImeiDropdown(true);
                    }
                  }}
                  placeholder="Type IMEI to search"
                />
                {console.log(
                  'Should show dropdown:',
                  showImeiDropdown && filteredImeis.length > 0,
                  'filteredImeis:',
                  filteredImeis.length
                )}
                {showImeiDropdown && filteredImeis.length > 0 && (
                  <div
                    className="imei-dropdown-container"
                    style={{
                      position: 'absolute',
                      zIndex: 1000,
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      width: '100%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {filteredImeis.map((phone, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                        }}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            imei: phone.imei1,
                            selectedPhone: phone,
                          }));
                          setFilteredImeis([]);
                          setShowImeiDropdown(false);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{phone.imei1}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Price</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.imeiPrice}
                  name="imeiPrice"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imeiPrice: e.target.value,
                    }))
                  }
                  placeholder="Enter price for this phone"
                />
              </Form.Group>

              <Button
                onClick={() => {
                  if (!formData.imei || !formData.imeiPrice) {
                    alert('Please enter both IMEI and price');
                    return;
                  }
                  console.log(
                    'Adding IMEI:',
                    formData.imei,
                    'with price:',
                    formData.imeiPrice
                  );

                  const newImeiPrice = {
                    imei: formData.imei,
                    price: parseFloat(formData.imeiPrice),
                  };

                  setFormData((prev) => {
                    const updatedImeiPrices = [
                      ...(prev.imeiPrices || []),
                      newImeiPrice,
                    ];
                    const totalPrice = updatedImeiPrices.reduce(
                      (sum, item) => sum + (item.price || 0),
                      0
                    );

                    return {
                      ...prev,
                      addedImeis: [...(prev.addedImeis || []), prev.imei],
                      imeiPrices: updatedImeiPrices,
                      finalPrice: totalPrice.toString(), // Update total sold price
                      imei: '', // clear IMEI input
                      imeiPrice: '', // clear price input
                    };
                  });
                }}
              >
                Add This Phone
              </Button>

              <div style={{ marginTop: '10px' }}>
                <h6
                  style={{
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Added Phones with Prices:
                </h6>
                {formData.imeiPrices && formData.imeiPrices.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {formData.imeiPrices.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px',
                          border: '1px solid #dee2e6',
                        }}
                      >
                        <span style={{ fontWeight: '500', minWidth: '80px' }}>
                          Phone: {item.imei}
                        </span>
                        <span style={{ fontWeight: '500', minWidth: '80px' }}>
                          Price: {item.price}
                        </span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value) || 0;
                            setFormData((prev) => {
                              const updatedImeiPrices = prev.imeiPrices.map(
                                (priceItem, index) =>
                                  index === idx
                                    ? { ...priceItem, price: newPrice }
                                    : priceItem
                              );
                              const totalPrice = updatedImeiPrices.reduce(
                                (sum, priceItem) =>
                                  sum + (priceItem.price || 0),
                                0
                              );

                              return {
                                ...prev,
                                imeiPrices: updatedImeiPrices,
                                finalPrice: totalPrice.toString(),
                              };
                            });
                          }}
                          style={{
                            width: '80px',
                            padding: '4px 8px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                          placeholder="Price"
                        />
                        <button
                          onClick={() => {
                            setFormData((prev) => {
                              const updatedImeiPrices = prev.imeiPrices.filter(
                                (_, index) => index !== idx
                              );
                              const updatedAddedImeis = prev.addedImeis.filter(
                                (_, index) => index !== idx
                              );
                              const totalPrice = updatedImeiPrices.reduce(
                                (sum, priceItem) =>
                                  sum + (priceItem.price || 0),
                                0
                              );

                              return {
                                ...prev,
                                imeiPrices: updatedImeiPrices,
                                addedImeis: updatedAddedImeis,
                                finalPrice: totalPrice.toString(),
                              };
                            });
                          }}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#e7f3ff',
                        borderRadius: '6px',
                        border: '1px solid #b3d9ff',
                      }}
                    >
                      <strong>Total Price: {formData.finalPrice || '0'}</strong>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#888', fontStyle: 'italic' }}>
                    No phones added yet
                  </span>
                )}
              </div>
            </div>

            {formData.sellingType === 'Credit' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Payable Amount Now</Form.Label>
                  <Form.Control
                    type="number"
                    name="payableAmountNow"
                    value={formData.payableAmountNow}
                    onChange={handleChange}
                    placeholder="Enter amount payable now"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payable Amount Later</Form.Label>
                  <Form.Control
                    type="number"
                    name="payableAmountLater"
                    value={formData.payableAmountLater}
                    onChange={handleChange}
                    placeholder="Enter amount payable later"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  {/* <Form.Label>When will it be paid?<x/Form.Label> */}
                  <Form.Control
                    type="date"
                    name="payableAmountLaterDate"
                    value={formData.payableAmountLaterDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            {formData.sellingType === 'Exchange' && (
              <Form.Group className="mb-3">
                <Form.Label>Exchange Phone Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="exchangePhoneDetail"
                  value={formData.exchangePhoneDetail}
                  onChange={handleChange}
                  placeholder="Enter exchange phone details"
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              {/* <Form.Label>Total Sold Price (Auto-calculated)</Form.Label> */}
              <Form.Control
                type="number"
                hidden
                name="finalPrice"
                value={formData.finalPrice}
                onChange={handleChange}
                placeholder="Total price will be calculated automatically"
                readOnly
                style={{
                  backgroundColor: '#f8f9fa',
                  cursor: 'not-allowed',
                }}
                disabled={loading}
              />
              {/* <small className="text-muted">
                This field is automatically calculated based on the IMEI prices
                above
              </small> */}
            </Form.Group>
          </div>

          {formData.type === 'bulk' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>IMEI Number</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    name="imeiInput"
                    value={formData.imeiInput}
                    onChange={handleChange}
                    placeholder="Enter IMEI number"
                    disabled={loading}
                  />
                  <Button
                    variant="success"
                    onClick={() => {
                      if (
                        formData.imeiInput.trim() !== '' &&
                        !formData.imeis.includes(formData.imeiInput)
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          imeis: [...prev.imeis, prev.imeiInput],
                          imeiInput: '',
                        }));
                      }
                    }}
                    className="ms-2"
                    disabled={loading}
                  >
                    Add
                  </Button>
                </div>
              </Form.Group>

              {formData.imeis.length > 0 && (
                <div className="mt-3">
                  <h6>Added IMEIs:</h6>
                  <ul className="list-group">
                    {formData.imeis.map((imei, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {imei}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              imeis: prev.imeis.filter((i) => i !== imei),
                            }));
                          }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <Button
              variant="secondary"
              onClick={() =>
                setShowWalletTransactionModal(!showWalletTransactionModal)
              }
              disabled={loading}
            >
              Submit Sold Phone
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setFormData((prev) => ({ ...prev, showSoldModal: false }))
            }
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              setLoading(true);
              if (
                !formData.finalPrice ||
                !formData.warranty ||
                !(entityData.name || newEntity.name || customerName) ||
                !(entityData.number || newEntity.number || customerNumber) ||
                !formData.saleDate ||
                formData.sellingType === ''
              ) {
                alert('Please fill all fields');
                setLoading(false);
                return;
              }

              const updatedMobile = {
                ...formData.soldMobile,
                finalPrice: formData.finalPrice,
                imei1: formData.imei,
                sellingType: formData.sellingType,
                warranty: formData.warranty,
                writtenImeis: formData.addedImeis || 'not added',
                saleDate: formData.saleDate,
                cnicBackPic: formData.cnicBackPic,
                cnicFrontPic: formData.cnicFrontPic,
                customerName:
                  entityData.name || newEntity.name || customerName || '',
                addedImeis: formData.addedImeis || [],
                imeiPrices: formData.imeiPrices || [], // Array of {imei: '', price: ''} objects
                bankAccountUsed: walletTransaction.bankAccountUsed,
                accountCash: walletTransaction.amountFromBank,
                pocketCash: walletTransaction.amountFromPocket,
                accessories: formData.accessories,
                bankName: formData.bankName,
                payableAmountNow: formData.payableAmountNow,
                payableAmountLater: formData.payableAmountLater,
                payableAmountLaterDate: formData.payableAmountLaterDate,
                exchangePhoneDetail: formData.exchangePhoneDetail,
                customerNumber:
                  entityData.number || newEntity.number || customerNumber || '',
                manual: true,
                entityData: showNewEntityForm ? newEntity : entityData,
              };
              setShowSoldModal(false);

              navigate('/invoice/shop', { state: updatedMobile });
              setFormData((prev) => ({
                ...prev,
                finalPrice: '',
                showSoldModal: false,
                imeis: [],
                imeiInput: '',
                imeiPrices: [],
                addedImeis: [],
                imei: '',
                imeiPrice: '',
              }));
              setLoading(false);
            }}
            disabled={loading}
          >
            Submit
          </Button>
        </Modal.Footer>
        <WalletTransactionModal
          show={showWalletTransactionModal}
          toggleModal={() =>
            setShowWalletTransactionModal(!showWalletTransactionModal)
          }
          singleTransaction={walletTransaction}
          setSingleTransaction={setWalletTransaction}
        />
      </Modal>
      <ModalComponent
        show={showCreateModal}
        size="sm"
        onClick={() => setShowCreateModal(false)}
      >
        <h2
          style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          Create New Person
        </h2>

        <form onSubmit={handleCreatePerson}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Name *
            </label>
            <div style={{ position: 'relative' }}>
              <FaUser
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}
              />
              <input
                type="text"
                value={createPersonData.name}
                onChange={(e) =>
                  setCreatePersonData({
                    ...createPersonData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter person name"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Phone Number *
            </label>
            <div style={{ position: 'relative' }}>
              <FaPhone
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}
              />
              <input
                type="tel"
                value={createPersonData.number}
                onChange={(e) =>
                  setCreatePersonData({
                    ...createPersonData,
                    number: e.target.value,
                  })
                }
                placeholder="Enter phone number"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Reference *
            </label>
            <div style={{ position: 'relative' }}>
              <FaFileAlt
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                }}
              />
              <input
                type="text"
                value={createPersonData.reference}
                onChange={(e) =>
                  setCreatePersonData({
                    ...createPersonData,
                    reference: e.target.value,
                  })
                }
                placeholder="Enter reference"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              style={{
                padding: '12px 24px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#f9fafb')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'white')
              }
            >
              Cancel
            </button>
            <button
              // type="submit"
              disabled={isCreatingEntity}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: isCreatingEntity ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isCreatingEntity ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isCreatingEntity)
                  e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseOut={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              {isCreatingEntity ? 'Creating...' : 'Create Person'}
            </button>
          </div>
        </form>
      </ModalComponent>
    </>
  );
};

export default NavLeft;
