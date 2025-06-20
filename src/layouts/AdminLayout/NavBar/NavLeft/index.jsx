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
import { ListGroup } from 'react-bootstrap';
import useWindowSize from '../../../../hooks/useWindowSize';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
import Modal from 'components/Modal/Modal';
import { api } from '../../../../../api/api';
import { toast } from 'react-toastify';

const NavLeft = () => {
  const windowSize = useWindowSize();
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [showPurchasePhoneModal, setShowPurchasePhoneModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [show, setShow] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [modelName, setModelName] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imei, setImei] = useState('');

  const handleSellPhone = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/purchase/general-mobile-sale', { imei: Number(imei) });

      toast.success('Phone sold successfully!');

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

  const handleAddPhoneShow = () => setShowAddPhoneModal(true);
  const handleAddPhoneClose = () => setShowAddPhoneModal(false);

  const handlePurchasePhoneShow = () => setShowPurchasePhoneModal(true);
  const handlePurchasePhoneClose = () => setShowPurchasePhoneModal(false);

  const handleAddCompanyShow = () => setShowAddCompanyModal(true);
  const handleAddCompanyClose = () => setShowAddCompanyModal(false);

  const handleAddModelShow = () => setShowAddModelModal(true);
  const handleAddModelClose = () => setShowAddModelModal(false);
  console.log('====================================');
  console.log(companies);
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
      // height: '50px',
      // width: '200px',
      // marginLeft: '50px',
      height: '40px',
      width: '150px',
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
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
            onClick={() => setShow(true)}
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
        toggleModal={handleAddCompanyClose}
        size="sm"
      >
        <h2 style={{ marginBottom: 24 }}>Add Company</h2>
        <form onSubmit={handleAddCompany}>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            required
            style={{ padding: 12, width: '100%', marginBottom: 20 }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: 10, width: '100%' }}
          >
            {isSubmitting ? 'Adding...' : 'Add Company'}
          </button>
        </form>
      </Modal>

      <Modal
        show={showAddModelModal}
        toggleModal={handleAddModelClose}
        size="sm"
      >
        <h2 style={{ marginBottom: 24 }}>Add Model</h2>
        <form onSubmit={handleAddModel}>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            required
            style={{ padding: 12, width: '100%', marginBottom: 20 }}
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
            style={{ padding: 12, width: '100%', marginBottom: 20 }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: 10, width: '100%' }}
          >
            {isSubmitting ? 'Adding...' : 'Add Model'}
          </button>
        </form>
      </Modal>
      <Modal show={show} toggleModal={() => setShow(!show)} onHide={() => setShow(false)} size="sm">
        <h2>Sell Phone</h2>
        <form onSubmit={handleSellPhone}>
          <div className="mb-3">
            <label htmlFor="imei" className="form-label">
              Enter IMEI Number
            </label>
            <input
              type="text"
              id="imei"
              className="form-control"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="IMEI number"
              required
            />
          </div>



          <button
            type="submit"
            className="btn btn-primary w-100"
          >

            Sell Phone
          </button>
        </form>
      </Modal>

    </>
  );
};

export default NavLeft;
