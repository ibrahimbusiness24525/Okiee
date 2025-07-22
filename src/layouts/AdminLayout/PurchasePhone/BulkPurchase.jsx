// import { text } from 'd3';
// import React, { useEffect, useState } from 'react';
// import { Modal, Form, Button, Row, Col, Table, Image } from 'react-bootstrap';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { BASE_URL } from 'config/constant';
// import { FaBarcode } from 'react-icons/fa';
// import { api } from '../../../../api/api';
// import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';

// const BulkPurchaseModal = ({
//   handleBulkPhoneModalclose,
//   handleSubmit,
//   showBulkModal,
//   modal,
//   type = 'purchase',
//   editMobile,

//   handleModalClose,
//   bulkData,
//   setBulkData,
//   handleAddMorePhones,
// }) => {
//   const [showTextBox, setShowTextBox] = useState(false);
//   const [partyNames, setPartyNames] = useState([]);
//   const [showWalletTransactionModal, setShowWalletTransactionModal] =
//     useState(false);
//   const handleShowTextBox = () => {
//     setBulkData((prev) => ({
//       ...prev,
//       ramSimDetails: [
//         ...prev.ramSimDetails,
//         {
//           companyName: '',
//           modelName: '',
//           batteryHealth: '',
//           ramMemory: '',
//           simOption: '',
//           priceOfOne: '',
//           imeiNumbers: [],
//         },
//       ],
//     }));
//     setShowTextBox(true);
//   };

//   const handleRemoveTextBox = (indexToRemove) => {
//     setBulkData((prev) => ({
//       ...prev,
//       ramSimDetails: prev.ramSimDetails.filter(
//         (_, idx) => idx !== indexToRemove
//       ),
//     }));
//   };

//   const getAllPartyNames = async () => {
//     try {
//       const response = await api.get('/api/partyLedger/getAllNames');
//       setPartyNames(response?.data?.data);
//     } catch (error) { }
//   };

//   useEffect(() => {
//     getAllPartyNames();
//   }, []);

//   return (
//     <Modal
//       show={showBulkModal}
//       onHide={handleBulkPhoneModalclose}
//       centered
//       size="lg"
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>Bulk Phone Purchase</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           {/* Party Name and Date */}
//           <Row>
//             <Col>
//               <Form.Group controlId="bulkPartyName">
//                 <Form.Label>Party Name</Form.Label>
//                 <Form.Select
//                   as="select"
//                   value={bulkData.partyName}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, partyName: e.target.value })
//                   }
//                   required
//                 >
//                   <option value="">Select Party Name</option>
//                   {partyNames.map((name, index) => (
//                     <option key={index} value={name}>
//                       {name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col>
//               <Form.Group controlId="bulkDate">
//                 <Form.Label>Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={bulkData.date}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, date: e.target.value })
//                   }
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {bulkData.ramSimDetails.map((detail, idx) => {
//             return (
//               <div key={idx}>
//                 <Row className="mt-4">
//                   <Col>
//                     <Form.Group controlId={`companyName-${idx}`}>
//                       <Form.Label>Company Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter Company Name"
//                         value={detail.companyName}
//                         onChange={(e) =>
//                           setBulkData((prev) => ({
//                             ...prev,
//                             ramSimDetails: prev.ramSimDetails.map((item, i) =>
//                               i === idx
//                                 ? { ...item, companyName: e.target.value }
//                                 : item
//                             ),
//                           }))
//                         }
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col>
//                     <Form.Group controlId={`modelName-${idx}`}>
//                       <Form.Label>Model Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter Model Name"
//                         value={detail.modelName}
//                         onChange={(e) =>
//                           setBulkData((prev) => ({
//                             ...prev,
//                             ramSimDetails: prev.ramSimDetails.map((item, i) =>
//                               i === idx
//                                 ? { ...item, modelName: e.target.value }
//                                 : item
//                             ),
//                           }))
//                         }
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col>
//                     <Form.Group controlId={`ramMemory-${idx}`}>
//                       <Form.Label>RAM/Memory</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter RAM/Memory"
//                         value={detail.ramMemory}
//                         onChange={(e) =>
//                           setBulkData((prev) => ({
//                             ...prev,
//                             ramSimDetails: prev.ramSimDetails.map((item, i) =>
//                               i === idx
//                                 ? { ...item, ramMemory: e.target.value }
//                                 : item
//                             ),
//                           }))
//                         }
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col>
//                     <Form.Group controlId={`simOption-${idx}`}>
//                       <Form.Label>SIM Option</Form.Label>
//                       <Form.Select
//                         value={detail.simOption}
//                         onChange={(e) => {
//                           const simOption = e.target.value;
//                           const quantity = detail.quantity || 0;
//                           const imeiFields = Array(quantity).fill(
//                             simOption === 'Dual SIM'
//                               ? { imei1: '', imei2: '', color: '' }
//                               : { imei1: '', color: '' }
//                           );
//                           setBulkData((prev) => ({
//                             ...prev,
//                             ramSimDetails: prev.ramSimDetails.map((item, i) =>
//                               i === idx
//                                 ? {
//                                   ...item,
//                                   simOption,
//                                   imeiNumbers: imeiFields,
//                                 }
//                                 : item
//                             ),
//                           }));
//                         }}
//                       >
//                         <option value="">Select SIM Option</option>
//                         <option value="Single SIM">Single SIM</option>
//                         <option value="Dual SIM">Dual SIM</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   <Col>
//                     <Form.Group controlId={`quantity-${idx}`}>
//                       <Form.Label>Number of Quantity</Form.Label>
//                       <Form.Control
//                         type="number"
//                         placeholder="Enter Quantity"
//                         value={detail.quantity || ''}
//                         onChange={(e) => {
//                           const quantity = parseInt(e.target.value) || 0;
//                           const simOption = detail.simOption || 'Single SIM';
//                           const imeiFields = Array(quantity).fill(
//                             simOption === 'Dual SIM'
//                               ? { imei1: '', imei2: '', color: '' }
//                               : { imei1: '', color: '' }
//                           );
//                           setBulkData((prev) => ({
//                             ...prev,
//                             ramSimDetails: prev.ramSimDetails.map((item, i) =>
//                               i === idx
//                                 ? { ...item, quantity, imeiNumbers: imeiFields }
//                                 : item
//                             ),
//                           }));
//                         }}
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {detail.imeiNumbers.length > 0 && (
//                   <>
//                     <Table striped bordered hover className="mt-3">
//                       <thead>
//                         <tr>
//                           <th>#</th>
//                           <th>IMEI 1</th>
//                           {detail.simOption === 'Dual SIM' && <th>IMEI 2</th>}
//                           <th>Color</th>
//                           <th>Battery Health</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {detail.imeiNumbers.map((phone, i) => (
//                           <tr key={i}>
//                             <td>{i + 1}</td>
//                             <td>
//                               <Form.Control
//                                 type="text"
//                                 value={phone.imei1}
//                                 onChange={(e) => {
//                                   const newIMEIs = detail.imeiNumbers.map(
//                                     (p, j) =>
//                                       j === i
//                                         ? { ...p, imei1: e.target.value }
//                                         : p
//                                   );
//                                   setBulkData((prev) => ({
//                                     ...prev,
//                                     ramSimDetails: prev.ramSimDetails.map(
//                                       (item, k) =>
//                                         k === idx
//                                           ? { ...item, imeiNumbers: newIMEIs }
//                                           : item
//                                     ),
//                                   }));
//                                 }}
//                               />
//                             </td>
//                             {detail.simOption === 'Dual SIM' && (
//                               <td>
//                                 <Form.Control
//                                   type="text"
//                                   value={phone.imei2}
//                                   onChange={(e) => {
//                                     const newIMEIs = detail.imeiNumbers.map(
//                                       (p, j) =>
//                                         j === i
//                                           ? { ...p, imei2: e.target.value }
//                                           : p
//                                     );
//                                     setBulkData((prev) => ({
//                                       ...prev,
//                                       ramSimDetails: prev.ramSimDetails.map(
//                                         (item, k) =>
//                                           k === idx
//                                             ? { ...item, imeiNumbers: newIMEIs }
//                                             : item
//                                       ),
//                                     }));
//                                   }}
//                                 />
//                               </td>
//                             )}

//                             <td>
//                               <Form.Control
//                                 type="text"
//                                 value={phone.color || ''}
//                                 onChange={(e) => {
//                                   const newIMEIs = detail.imeiNumbers.map(
//                                     (p, j) =>
//                                       j === i
//                                         ? { ...p, color: e.target.value }
//                                         : p
//                                   );
//                                   setBulkData((prev) => ({
//                                     ...prev,
//                                     ramSimDetails: prev.ramSimDetails.map(
//                                       (item, k) =>
//                                         k === idx
//                                           ? { ...item, imeiNumbers: newIMEIs }
//                                           : item
//                                     ),
//                                   }));
//                                 }}
//                               />
//                             </td>

//                             <td>
//                               <Form.Control
//                                 type="text"
//                                 value={phone.batteryHealth}
//                                 onChange={(e) => {
//                                   const newIMEIs = detail.imeiNumbers.map(
//                                     (p, j) =>
//                                       j === i
//                                         ? {
//                                           ...p,
//                                           batteryHealth: e.target.value,
//                                         }
//                                         : p
//                                   );
//                                   setBulkData((prev) => ({
//                                     ...prev,
//                                     ramSimDetails: prev.ramSimDetails.map(
//                                       (item, k) =>
//                                         k === idx
//                                           ? { ...item, imeiNumbers: newIMEIs }
//                                           : item
//                                     ),
//                                   }));
//                                 }}
//                               />
//                             </td>
//                             <td>
//                               <Button
//                                 variant="danger"
//                                 onClick={() => {
//                                   const newIMEIs = detail.imeiNumbers.filter(
//                                     (_, j) => j !== i
//                                   );
//                                   setBulkData((prev) => ({
//                                     ...prev,
//                                     ramSimDetails: prev.ramSimDetails.map(
//                                       (item, k) =>
//                                         k === idx
//                                           ? { ...item, imeiNumbers: newIMEIs }
//                                           : item
//                                     ),
//                                   }));
//                                 }}
//                               >
//                                 Remove
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>

//                     <Button
//                       className="mt-2"
//                       onClick={() => {
//                         const newRow = {
//                           imei1: '',
//                           imei2:
//                             detail.simOption === 'Dual SIM' ? '' : undefined,
//                           color: '',
//                         };
//                         const updatedList = [...detail.imeiNumbers, newRow];
//                         setBulkData((prev) => ({
//                           ...prev,
//                           ramSimDetails: prev.ramSimDetails.map((item, k) =>
//                             k === idx
//                               ? { ...item, imeiNumbers: updatedList }
//                               : item
//                           ),
//                         }));
//                       }}
//                     >
//                       Add Row
//                     </Button>
//                   </>
//                 )}

//                 <Form.Group controlId="priceOfOne">
//                   <Form.Label>Mobile Price (one piece)</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Mobile Price"
//                     value={detail.priceOfOne}
//                     onChange={(e) =>
//                       setBulkData((prev) => ({
//                         ...prev,
//                         ramSimDetails: prev.ramSimDetails.map((item, i) =>
//                           i === idx
//                             ? { ...item, priceOfOne: e.target.value }
//                             : item
//                         ),
//                       }))
//                     }
//                     required
//                   />
//                 </Form.Group>
//                 <Button
//                   variant="danger"
//                   className="mt-2 mb-3"
//                   onClick={() => handleRemoveTextBox(idx)}
//                 >
//                   Remove
//                 </Button>
//                 <hr />
//               </div>
//             );
//           })}

//           <Button
//             variant="secondary"
//             className="mt-3"
//             onClick={handleShowTextBox}
//           >
//             Add Another Quantity
//           </Button>

//           <Row>
//             <Col>
//               <Form.Group controlId="bulkBuyingPrice">
//                 <Form.Label>Buying Price</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter Buying Price"
//                   value={bulkData.buyingPrice}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, buyingPrice: e.target.value })
//                   }
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col>
//               <Form.Group controlId="bulkDealerPrice">
//                 <Form.Label>Dealer Price (Optional)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter DP%"
//                   value={bulkData.dealerPrice}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, dealerPrice: e.target.value })
//                   }
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//           <Row>
//             <Col>
//               <Form.Group controlId="bulkLP">
//                 <Form.Label>LP (Optional)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter LP"
//                   value={bulkData.lp}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, lp: e.target.value })
//                   }
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col>
//               <Form.Group controlId="bulkLifting">
//                 <Form.Label>Lifting (Optional)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter Lifting"
//                   value={bulkData.lifting}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, lifting: e.target.value })
//                   }
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//           <Row>
//             <Col>
//               <Form.Group controlId="bulkActivation">
//                 <Form.Label>Activation (Optional)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter Activation"
//                   value={bulkData.activation}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, activation: e.target.value })
//                   }
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col>
//               <Form.Group controlId="bulkPromo">
//                 <Form.Label>Promo (Optional)</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter Promo"
//                   value={bulkData.promo}
//                   onChange={(e) =>
//                     setBulkData({ ...bulkData, promo: e.target.value })
//                   }
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//           <Col style={{ marginTop: '10px' }}>
//             <Form.Group controlId="bulkPayment">
//               <Form.Label>Payment Type</Form.Label>
//               <Form.Select
//                 value={bulkData.paymentType}
//                 onChange={(e) =>
//                   setBulkData({ ...bulkData, paymentType: e.target.value })
//                 }
//                 required
//               >
//                 <option value="">Select Payment Type</option>
//                 <option value="full-payment">Full Payment</option>
//                 <option value="credit">Credit</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           {bulkData.paymentType === 'credit' && (
//             <Row style={{ marginTop: '10px' }}>
//               <Col>
//                 <Form.Group controlId="payableAmountNow">
//                   <Form.Label>Payable Amount Now</Form.Label>
//                   <Form.Control
//                     type="number"
//                     placeholder="Enter Payable Amount Now"
//                     value={bulkData.payableAmountNow}
//                     onChange={(e) =>
//                       setBulkData({
//                         ...bulkData,
//                         payableAmountNow: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group controlId="payableAmountLater">
//                   <Form.Label>Payable Amount Later</Form.Label>
//                   <Form.Control
//                     type="number"
//                     placeholder="Enter Payable Amount Now"
//                     value={bulkData.payableAmountLater}
//                     onChange={(e) =>
//                       setBulkData({
//                         ...bulkData,
//                         payableAmountLater: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group controlId="payableAmountLater">
//                   <Form.Label>First Payment Date/Payment Date</Form.Label>
//                   <Form.Control
//                     type="Date"
//                     placeholder="Enter Payment Date"
//                     value={bulkData.paymentDate}
//                     onChange={(e) =>
//                       setBulkData({ ...bulkData, paymentDate: e.target.value })
//                     }
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           )}
//           {type !== 'edit' && (
//             <>
//               <Button
//                 style={{ marginTop: '20px' }}
//                 variant="secondary"
//                 onClick={() =>
//                   setShowWalletTransactionModal(!showWalletTransactionModal)
//                 }
//               >
//                 Proceed To Pay
//               </Button>
//             </>
//           )}
//           <WalletTransactionModal
//             show={showWalletTransactionModal}
//             toggleModal={() =>
//               setShowWalletTransactionModal(!showWalletTransactionModal)
//             }
//             singleTransaction={bulkData}
//             setSingleTransaction={setBulkData}
//           />
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleBulkPhoneModalclose}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleSubmit}>
//           Save
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default BulkPurchaseModal;
import { text } from 'd3';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Table, Image } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'config/constant';
import { FaBarcode } from 'react-icons/fa';
import { api } from '../../../../api/api';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
import CustomSelect from 'components/CustomSelect';

const BulkPurchaseModal = ({
  handleBulkPhoneModalclose,
  handleSubmit,
  showBulkModal,
  modal,
  type = 'purchase',
  editMobile,

  handleModalClose,
  bulkData,
  setBulkData,
  handleAddMorePhones,
}) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [partyNames, setPartyNames] = useState([]);
  const [showWalletTransactionModal, setShowWalletTransactionModal] =
    useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [modelsList, setModelsList] = useState({}); // { [idx]: [models] }
  const [entityData, setEntityData] = useState({
    name: '',
    number: '',
    _id: '',
  });
  const [showNewEntityForm, setShowNewEntityForm] = useState(false);
  const [getAllEntities, setGetAllEntities] = useState([]);
  const [newEntity, setNewEntity] = useState({
    name: '',
    number: '',
  });

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/api/company/all-companies');
      setCompanies(response?.data?.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };
  const handleShowTextBox = () => {
    setBulkData((prev) => ({
      ...prev,
      ramSimDetails: [
        ...prev.ramSimDetails,
        {
          companyName: '',
          modelName: '',
          batteryHealth: '',
          ramMemory: '',
          simOption: '',
          priceOfOne: '',
          imeiNumbers: [],
        },
      ],
    }));
    setShowTextBox(true);
  };

  const getAllEnityNameAndId = async () => {
    try {
      const response = await api.get('/api/person/nameAndId');
      setGetAllEntities(response?.data || []);
      console.log('Entity data:', response);
    } catch (error) {
      console.error('Error fetching entity names and ids:', error);
    }
  };
  console.log('getAllEntities:', getAllEntities);
  console.log('entityData:', entityData);

  useEffect(() => {
    getAllEnityNameAndId();
  }, []);
  const handleRemoveTextBox = (indexToRemove) => {
    setBulkData((prev) => ({
      ...prev,
      ramSimDetails: prev.ramSimDetails.filter(
        (_, idx) => idx !== indexToRemove
      ),
    }));
  };

  const getAllPartyNames = async () => {
    try {
      const response = await api.get('/api/partyLedger/getAllNames');
      setPartyNames(response?.data?.data);
    } catch (error) {}
  };
  const handleFinalSubmit = () => {
    const entityPayload = showNewEntityForm
      ? { name: newEntity.name, number: newEntity.number }
      : {
          _id: entityData._id,
          name: entityData.name,
          number: entityData.number,
        };

    const finalData = {
      ...bulkData,
      entityData: entityPayload, // Consistent spelling
    };
    handleSubmit(finalData);
  };

  useEffect(() => {
    getAllPartyNames();
    fetchCompanies();
  }, []);

  return (
    <Modal
      show={showBulkModal}
      onHide={handleBulkPhoneModalclose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Bulk Phone Purchase</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Party Name and Date */}
          <Row>
            <Col>
              <Form.Group controlId="bulkPayment">
                <Form.Label>Payment Type</Form.Label>
                <Form.Select
                  value={bulkData.paymentType}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, paymentType: e.target.value })
                  }
                  required
                >
                  <option value="">Select Payment Type</option>
                  <option value="full-payment">Full Payment</option>
                  <option value="credit">Credit</option>
                </Form.Select>
              </Form.Group>

              {bulkData.paymentType === 'credit' && (
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
                        Create New
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
                            setNewEntity({ ...newEntity, name: e.target.value })
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
                      <CustomSelect
                        value={entityData._id}
                        onChange={(selectedOption) => {
                          const selectedEntity = getAllEntities.find(
                            (entity) => entity._id === selectedOption?.value
                          );
                          setEntityData(
                            selectedEntity || { name: '', number: '', _id: '' }
                          );
                        }}
                        options={getAllEntities.map((entity) => ({
                          value: entity._id,
                          label: `${entity.name} || ${entity.number}`,
                        }))}
                      />
                    </>
                  )}
                </div>
              )}
              {/* <Form.Group controlId="bulkPartyName">
                <Form.Label>Party Name</Form.Label>
                <Form.Select
                  as="select"
                  value={bulkData.partyName}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, partyName: e.target.value })
                  }
                  required
                >
                  <option value="">Select Party Name</option>
                  {partyNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group> */}
            </Col>
            <Col>
              <Form.Group controlId="bulkDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={bulkData.date}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, date: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {bulkData.ramSimDetails.map((detail, idx) => (
            <div key={idx} className="mb-4 p-3 border rounded">
              {/* Company, Model, RAM Section */}
              <Row className="g-3 mb-3">
                <Col md={4}>
                  <Form.Group controlId={`companyName-${idx}`}>
                    <Form.Label>Company Name</Form.Label>
                    <Form.Select
                      value={detail.companyName}
                      onChange={async (e) => {
                        const companyId = e.target.value;
                        try {
                          const response = await api.get(
                            `/api/company/models/${companyId}`
                          );
                          setModelsList((prev) => ({
                            ...prev,
                            [idx]: response?.data.models || [],
                          }));
                        } catch (error) {
                          setModelsList((prev) => ({ ...prev, [idx]: [] }));
                        }
                        // Find the selected company object to get its name
                        const selectedCompany = companies.find(
                          (c) => c._id === companyId
                        );
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  companyName: selectedCompany
                                    ? selectedCompany.name
                                    : '',
                                  modelName: '',
                                }
                              : item
                          ),
                        }));
                      }}
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId={`modelName-${idx}`}>
                    <Form.Label>Model Name</Form.Label>
                    <Form.Select
                      value={detail.modelName}
                      onChange={(e) =>
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, i) =>
                            i === idx
                              ? { ...item, modelName: e.target.value }
                              : item
                          ),
                        }))
                      }
                      disabled={!detail.companyName}
                    >
                      <option value="">Select Model</option>
                      {(modelsList[idx] || []).map((model) => (
                        <option key={model._id} value={model.name}>
                          {model.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId={`ramMemory-${idx}`}>
                    <Form.Label>RAM/Memory</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter RAM/Memory"
                      value={detail.ramMemory}
                      onChange={(e) =>
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, i) =>
                            i === idx
                              ? { ...item, ramMemory: e.target.value }
                              : item
                          ),
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* SIM Option and Quantity Section */}
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId={`simOption-${idx}`}>
                    <Form.Label>SIM Option</Form.Label>
                    <Form.Select
                      value={detail.simOption}
                      onChange={(e) => {
                        const simOption = e.target.value;
                        const quantity = detail.quantity || 0;
                        const imeiFields = Array(quantity).fill(
                          simOption === 'Dual SIM'
                            ? { imei1: '', imei2: '', color: '' }
                            : { imei1: '', color: '' }
                        );
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, i) =>
                            i === idx
                              ? { ...item, simOption, imeiNumbers: imeiFields }
                              : item
                          ),
                        }));
                      }}
                    >
                      <option value="">Select SIM Option</option>
                      <option value="Single SIM">Single SIM</option>
                      <option value="Dual SIM">Dual SIM</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId={`quantity-${idx}`}>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Quantity"
                      value={detail.quantity || ''}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 0;
                        const simOption = detail.simOption || 'Single SIM';
                        const imeiFields = Array(quantity).fill(
                          simOption === 'Dual SIM'
                            ? { imei1: '', imei2: '', color: '' }
                            : { imei1: '', color: '' }
                        );
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, i) =>
                            i === idx
                              ? { ...item, quantity, imeiNumbers: imeiFields }
                              : item
                          ),
                        }));
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* IMEI Table Section */}
              {detail.imeiNumbers.length > 0 && (
                <>
                  <Table striped bordered hover className="mt-3">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>IMEI 1</th>
                        {detail.simOption === 'Dual SIM' && <th>IMEI 2</th>}
                        <th>Color</th>
                        <th>Battery Health</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.imeiNumbers.map((phone, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <Form.Control
                              type="text"
                              value={phone.imei1}
                              onChange={(e) => {
                                const newIMEIs = detail.imeiNumbers.map(
                                  (p, j) =>
                                    j === i
                                      ? { ...p, imei1: e.target.value }
                                      : p
                                );
                                setBulkData((prev) => ({
                                  ...prev,
                                  ramSimDetails: prev.ramSimDetails.map(
                                    (item, k) =>
                                      k === idx
                                        ? { ...item, imeiNumbers: newIMEIs }
                                        : item
                                  ),
                                }));
                              }}
                            />
                          </td>
                          {detail.simOption === 'Dual SIM' && (
                            <td>
                              <Form.Control
                                type="text"
                                value={phone.imei2}
                                onChange={(e) => {
                                  const newIMEIs = detail.imeiNumbers.map(
                                    (p, j) =>
                                      j === i
                                        ? { ...p, imei2: e.target.value }
                                        : p
                                  );
                                  setBulkData((prev) => ({
                                    ...prev,
                                    ramSimDetails: prev.ramSimDetails.map(
                                      (item, k) =>
                                        k === idx
                                          ? { ...item, imeiNumbers: newIMEIs }
                                          : item
                                    ),
                                  }));
                                }}
                              />
                            </td>
                          )}

                          <td>
                            <Form.Control
                              type="text"
                              value={phone.color || ''}
                              onChange={(e) => {
                                const newIMEIs = detail.imeiNumbers.map(
                                  (p, j) =>
                                    j === i
                                      ? { ...p, color: e.target.value }
                                      : p
                                );
                                setBulkData((prev) => ({
                                  ...prev,
                                  ramSimDetails: prev.ramSimDetails.map(
                                    (item, k) =>
                                      k === idx
                                        ? { ...item, imeiNumbers: newIMEIs }
                                        : item
                                  ),
                                }));
                              }}
                            />
                          </td>

                          <td>
                            <Form.Control
                              type="text"
                              value={phone.batteryHealth}
                              onChange={(e) => {
                                const newIMEIs = detail.imeiNumbers.map(
                                  (p, j) =>
                                    j === i
                                      ? {
                                          ...p,
                                          batteryHealth: e.target.value,
                                        }
                                      : p
                                );
                                setBulkData((prev) => ({
                                  ...prev,
                                  ramSimDetails: prev.ramSimDetails.map(
                                    (item, k) =>
                                      k === idx
                                        ? { ...item, imeiNumbers: newIMEIs }
                                        : item
                                  ),
                                }));
                              }}
                            />
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => {
                                const newIMEIs = detail.imeiNumbers.filter(
                                  (_, j) => j !== i
                                );
                                setBulkData((prev) => ({
                                  ...prev,
                                  ramSimDetails: prev.ramSimDetails.map(
                                    (item, k) =>
                                      k === idx
                                        ? { ...item, imeiNumbers: newIMEIs }
                                        : item
                                  ),
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Button
                    className="mt-2"
                    onClick={() => {
                      const newRow = {
                        imei1: '',
                        imei2: detail.simOption === 'Dual SIM' ? '' : undefined,
                        color: '',
                      };
                      const updatedList = [...detail.imeiNumbers, newRow];
                      setBulkData((prev) => ({
                        ...prev,
                        ramSimDetails: prev.ramSimDetails.map((item, k) =>
                          k === idx
                            ? { ...item, imeiNumbers: updatedList }
                            : item
                        ),
                      }));
                    }}
                  >
                    Add Row
                  </Button>
                </>
              )}

              {/* Price and Remove Section */}
              <Row className="g-3 align-items-center">
                <Col md={6}>
                  <Form.Group controlId={`priceOfOne-${idx}`}>
                    <Form.Label>Price Per Unit</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Mobile Price"
                      value={detail.priceOfOne}
                      onChange={(e) =>
                        setBulkData((prev) => ({
                          ...prev,
                          ramSimDetails: prev.ramSimDetails.map((item, i) =>
                            i === idx
                              ? { ...item, priceOfOne: e.target.value }
                              : item
                          ),
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="text-end">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveTextBox(idx)}
                  >
                    Remove This Entry
                  </Button>
                </Col>
              </Row>
            </div>
          ))}

          <Button
            variant="secondary"
            className="mt-3"
            onClick={handleShowTextBox}
          >
            Add Another Quantity
          </Button>

          <Row>
            <Col>
              <Form.Group controlId="bulkBuyingPrice">
                <Form.Label>Buying Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Buying Price"
                  value={bulkData.buyingPrice}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, buyingPrice: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="bulkDealerPrice">
                <Form.Label>Dealer Price (Optional)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter DP%"
                  value={bulkData.dealerPrice}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, dealerPrice: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="bulkLP">
                <Form.Label>LP (Optional)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter LP"
                  value={bulkData.lp}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, lp: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="bulkLifting">
                <Form.Label>Lifting (Optional)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Lifting"
                  value={bulkData.lifting}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, lifting: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="bulkActivation">
                <Form.Label>Activation (Optional)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Activation"
                  value={bulkData.activation}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, activation: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="bulkPromo">
                <Form.Label>Promo (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Promo"
                  value={bulkData.promo}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, promo: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {bulkData.paymentType === 'credit' && (
            <Row style={{ marginTop: '10px' }}>
              <Col>
                <Form.Group controlId="payableAmountNow">
                  <Form.Label>Payable Amount Now</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Payable Amount Now"
                    value={bulkData.payableAmountNow}
                    onChange={(e) =>
                      setBulkData({
                        ...bulkData,
                        payableAmountNow: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="payableAmountLater">
                  <Form.Label>Payable Amount Later</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Payable Amount Now"
                    value={bulkData.payableAmountLater}
                    onChange={(e) =>
                      setBulkData({
                        ...bulkData,
                        payableAmountLater: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="payableAmountLater">
                  <Form.Label>First Payment Date/Payment Date</Form.Label>
                  <Form.Control
                    type="Date"
                    placeholder="Enter Payment Date"
                    value={bulkData.paymentDate}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, paymentDate: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          {type !== 'edit' && (
            <>
              <Button
                style={{ marginTop: '20px' }}
                variant="secondary"
                onClick={() =>
                  setShowWalletTransactionModal(!showWalletTransactionModal)
                }
              >
                Proceed To Pay
              </Button>
            </>
          )}
          <WalletTransactionModal
            show={showWalletTransactionModal}
            toggleModal={() =>
              setShowWalletTransactionModal(!showWalletTransactionModal)
            }
            singleTransaction={bulkData}
            setSingleTransaction={setBulkData}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleBulkPhoneModalclose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFinalSubmit}>
          {/* <Button variant="primary" onClick={handleSubmit}> */}
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkPurchaseModal;
