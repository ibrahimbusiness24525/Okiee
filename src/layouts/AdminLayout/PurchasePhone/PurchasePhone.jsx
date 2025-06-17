import { color, text } from 'd3';
import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Table, Image } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'config/constant';
import { FaBarcode } from 'react-icons/fa'; // Use FaBarcode or another available icon
import SingalPurchaseModal from './SingalPurchase';
import BulkPurchaseModal from './BulkPurchase';
import { useEffect } from 'react';
import { api } from '../../../../api/api';

const PurchasePhone = ({
  modal,
  editMobile,
  handleModalClose,
  type = 'purchase',
  bulkEdit = false,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [banks, setBanks] = useState([]);
  const [bulkData, setBulkData] = useState({
    partyName: '',
    date: today,
    quantity: 0,
    lp: '',
    lifting: '',
    promo: '',
    activation: '',
    dealerPrice: '',
    buyingPrice: '',
    paymentType: '',
    payableAmountNow: '',
    payableAmountLater: '',
    paymentDate: '',
    ramSimDetails: [
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
  });

  const [showSingleModal, setShowSingleModal] = useState(false); // For Single Phone Purchase Modal
  const [showBulkModal, setShowBulkModal] = useState(false); // For Bulk Purchase Modal
  const [showWarranty, setShowWarranty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singlePurchase, setSinglePurchase] = useState({
    name: '', // Matches `name` from the backend
    bankAccountUsed: '',
    amountFromBank: '',
    amountFromPocket: '',
    paymentType: '',
    payableAmountNow: '',
    payableAmountLater: '',
    paymentDate: '',
    warranty: '12 Months',
    companyName: '', // Matches `companyName`
    modelName: '', // Matches `modelName`
    batteryHealth: '', // Matches `modelName`
    date: today, // Matches `date`
    cnic: '', // Matches `cnic`
    accessories: {
      box: false,
      charger: false,
      handFree: false,
    }, // Matches `accessories` array
    phoneCondition: '', // Matches `phoneCondition`
    specifications: '', // Matches `specifications`
    ramMemory: '', // Matches `ramMemory`
    color: '', // Matches `color`
    imei1: '', // Matches `imei1`
    imei2: '', // Matches `imei2`
    phonePicture: '', // Represents `phonePicture`
    personPicture: '', // Represents `personPicture`
    mobileNumber: '', // Matches `mobileNumber`
    price: {
      purchasePrice: '', // Matches `price.purchasePrice`
      finalPrice: '', // Matches `price.finalPrice`
      demandPrice: '', // Matches `price.demandPrice`
    },
    isApprovedFromEgadgets: true, // Matches `isApprovedFromEgadgets`
    eGadgetStatusPicture: '', // Matches `eGadgetStatusPicture`
  });

  const handleAddIMEI = (imei) => {
    if (imei && !bulkData.imeis.includes(imei)) {
      setBulkData((prev) => ({
        ...prev,
        imeis: [...prev.imeis, imei],
      }));
    }
  };

  useEffect(() => {
    // setShowSingleModal(modal)
    if (editMobile && !bulkEdit) {
      setSinglePurchase({
        accessories: {
          box: editMobile.accessories || false,
          charger: editMobile.accessories || false,
          handFree: editMobile.accessories || false,
        },
        // accessories:{
        //   box: editMobile.accessories?.includes("box") || false,
        //   charger: editMobile.accessories?.includes("charger") || false,
        //   handFree: editMobile.accessories?.includes("handFree") || false,
        // },
        name: editMobile.name || '', // Matches `name`
        warranty: editMobile.warranty || '', // Matches `warranty`
        fatherName: editMobile.fatherName || '', // Matches `fatherName`
        companyName: editMobile.companyName || '', // Matches `companyName`
        modelName: editMobile.modelName || '', // Matches `modelName`
        date: editMobile.date
          ? new Date(editMobile.date).toISOString().split('T')[0]
          : '', // Matches `date`
        cnic: editMobile.cnic || '',
        batteryHealth: editMobile.batteryHealth || '', // Matches `cnic`
        // accessories: editMobile.accessories || [],
        phoneCondition: editMobile.phoneCondition || '', // Matches `phoneCondition`
        specifications: editMobile.specifications || '', // Matches `specifications`
        ramMemory: editMobile.ramMemory || '', // Matches `ramMemory`
        color: editMobile.color || '', // Matches `color`
        imei1: editMobile.imei1 || '', // Matches `imei1`
        imei2: editMobile.imei2 || '', // Matches `imei2`
        // phonePicture: editMobile.phonePicture || '', // Matches `phonePicture`
        // personPicture: editMobile.personPicture || '', // Matches `personPicture`
        mobileNumber: editMobile.mobileNumber || '', // Matches `mobileNumber`
        purchasePrice: editMobile.price?.purchasePrice || '', // Matches `price.purchasePrice`
        finalPrice: editMobile.price?.finalPrice || '', // Matches `price.finalPrice`
        demandPrice: editMobile.price?.demandPrice || '', // Matches `price.demandPrice`
        isApprovedFromEgadgets: editMobile.isApprovedFromEgadgets || false, // Matches `isApprovedFromEgadgets`
        // eGadgetStatusPicture: editMobile.eGadgetStatusPicture || '', // Matches `eGadgetStatusPicture`
      });
    }
    if (editMobile && bulkEdit) {
      setBulkData((prevData) => ({
        ...prevData,
        partyName: editMobile.partyName || '',
        date: editMobile.date || today,
        lp: editMobile.prices?.lp || '',
        lifting: editMobile.prices?.lifting || '',
        promo: editMobile.prices?.promo || '',
        activation: editMobile.prices?.activation || '',
        dealerPrice: editMobile.prices?.dealerPrice || '',
        buyingPrice: editMobile.prices?.buyingPrice || '',
        paymentType: editMobile.purchasePaymentType || '',
        payableAmountNow: editMobile.creditPaymentData?.payableAmountNow || '',
        payableAmountLater:
          editMobile.creditPaymentData?.payableAmountLater || '',
        paymentDate: editMobile.creditPaymentData?.dateOfPayment || '',
        quantity: editMobile.ramSimDetails?.length || 0,
        ramSimDetails:
          editMobile.ramSimDetails?.map((detail) => ({
            companyName: detail.companyName || '',
            modelName: detail.modelName || '',
            batteryHealth: detail.batteryHealth || '',
            ramMemory: detail.ramMemory || '',
            simOption: detail.simOption || '',
            priceOfOne: detail.priceOfOne || '',
            imeiNumbers:
              detail.imeiNumbers?.map((imei) => ({
                imei1: imei.imei1 || '',
                imei2: imei.imei2 || '',
                color: imei.color || '',
                batteryHealth: imei.batteryHealth || '',
              })) || [],
          })) || [],
      }));
    }
  }, [modal, editMobile, bulkEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setSinglePurchase((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value, // Convert to number if input is numeric
    }));
  };

  const handleClose = () => {
    showSingleModal(false);
    showBulkModal(false);
  };

  const handleSinglePhoneModalOpen = () => {
    setShowSingleModal(true);
    handleModalClose;
  };

  const handleBulkPhoneModalOpen = () => {
    setShowBulkModal(true);
    handleModalClose;
  };

  const handleBulkPhoneModalclose = () => {
    setShowBulkModal(false);
    handleModalClose;
  };

  const handleSinglePhoneModalclose = () => {
    setShowSingleModal(false);
    handleModalClose;
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0]; // Single file selection
    if (file) {
      setSinglePurchase((prevState) => ({
        ...prevState,
        [fieldName]: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();

    // Append multiple images (if any)
    if (singlePurchase.images && singlePurchase.images.length > 0) {
      singlePurchase.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Append price object as a single JSON string

    // Append individual fields
    formData.append('purchasePrice', singlePurchase.purchasePrice);
    formData.append('finalPrice', singlePurchase.finalPrice);
    formData.append('demandPrice', singlePurchase.demandPrice);
    if (!editMobile && !bulkEdit) {
      formData.append('bankAccountUsed', singlePurchase.bankAccountUsed);
      formData.append('pocketCash', singlePurchase.amountFromPocket);
      formData.append('accountCash', singlePurchase.amountFromBank);
    }

    formData.append('companyName', singlePurchase.companyName);
    formData.append('specifications', singlePurchase.specifications);
    formData.append('modelName', singlePurchase.modelName);
    formData.append('batteryHealth', singlePurchase.batteryHealth);
    formData.append('imei1', singlePurchase.imei1); // Use correct field name
    formData.append('imei2', singlePurchase.imei2);
    formData.append('color', singlePurchase.color);
    formData.append('name', singlePurchase.name);
    formData.append('fatherName', singlePurchase.fatherName);
    formData.append('date', singlePurchase.date);
    formData.append('cnic', singlePurchase.cnic);
    formData.append('warranty', singlePurchase.warranty);
    formData.append('paymentType', singlePurchase.paymentType);
    formData.append('payableAmountNow', singlePurchase.payableAmountNow);
    formData.append('payableAmountLater', singlePurchase.payableAmountLater);
    formData.append('paymentDate', singlePurchase.paymentDate);

    // Convert accessories to JSON string to maintain its array format
    formData.append('accessories', JSON.stringify(singlePurchase.accessories));

    formData.append('phoneCondition', singlePurchase.phoneCondition);
    formData.append('ramMemory', singlePurchase.ramMemory);
    formData.append('mobileNumber', singlePurchase.mobileNumber);

    // Append approval status
    formData.append(
      'isApprovedFromEgadgets',
      singlePurchase.isApprovedFromEgadgets
    );

    // Include shop ID from the logged-in user
    formData.append('shopid', user._id);

    // Append image fields (ensure they are valid File objects)
    if (singlePurchase.phonePicture) {
      formData.append('phonePicture', singlePurchase.phonePicture);
    }
    if (singlePurchase.personPicture) {
      formData.append('personPicture', singlePurchase.personPicture);
    }
    if (singlePurchase.eGadgetStatusPicture) {
      formData.append(
        'eGadgetStatusPicture',
        singlePurchase.eGadgetStatusPicture
      );
    }
    if (editMobile && !bulkEdit) {
      try {
        const response = await api.put(
          `/api/Purchase/single-purchase-phone/${editMobile._id}`,
          formData
        );
        if (response) {
          toast('Purchase Phone Record edited Successfully');
          handleSinglePhoneModalclose();
          handleModalClose();
          resetForm();
        }
      } catch (error) {
        console.error(error);

        toast('Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    if (!editMobile) {
      try {
        // const response = await axios.post(
        //   `${BASE_URL}api/Purchase/purchase-phone`,
        //   formData,
        //   {
        //     headers: { "Content-Type": "multipart/form-data" },
        //   }
        // );
        const response = await api.post(
          `/api/Purchase/purchase-phone`,
          formData
        );

        if (response) {
          toast('Purchase Phone Record Added Successfully');
          handleSinglePhoneModalclose();
          handleModalClose();
          // resetForm();
        }
      } catch (error) {
        toast('Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSinglePurchase({
      name: '',
      images: [], // For multiple images if needed
      coverImage: '', // Represents a main image or specific photo
      companyName: '', // Matches `companyName` from the backend
      modelName: '', // Matches `modelName` from the backend
      specifications: '', // Optionally include a formatted string or object
      warranty: '',
      imei1: '', // For IMEI1
      imei2: '', // For IMEI2
      color: '', // Matches `color`
      demandPrice: '', // Matches `price.demandPrice`
      purchasePrice: '', // Matches `price.purchasePrice`
      finalPrice: '', // Matches `price.finalPrice`
      name: '', // New field for `name`
      fatherName: '', // New field for `fatherName`
      date: '', // Matches `date`
      cnic: '', // Matches `cnic`
      accessories: [], // Matches `accessories`
      phoneCondition: '', // Matches `phoneCondition`
      ramMemory: '', // Matches `ramMemory`
      phonePicture: '', // Represents `phonePicture`
      personPicture: '', // Represents `personPicture`
      mobileNumber: '', // Matches `mobileNumber`
      isApprovedFromEgadgets: false, // Matches `isApprovedFromEgadgets`
      eGadgetStatusPicture: '', // Matches `eGadgetStatusPicture`
      shopid: '', // Added `shopid` field for resetting
    });
  };

  const handleScanIMEI = () => {
    // Barcode scanner logic will go here
    alert('Barcode scanning logic needs to be implemented.');
  };

  const handleAccessoriesCheck = (e) => {
    const { name, checked } = e.target;
    setSinglePurchase((prev) => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [name]: checked,
      },
    }));
  };
  const handleAddMorePhones = () => {
    setBulkData({
      ...bulkData,
      phones: [
        ...bulkData.phones,
        {
          ram: '',
          isDualSim: false,
          quantity: 0,
          imeis: [],
        },
      ],
    });
  };

  const calculateBuyingPrice = (data) => {
    return data.ramSimDetails.reduce((total, item) => {
      return (
        total + item.imeiNumbers.length * (parseFloat(item.priceOfOne) || 0)
      );
    }, 0);
  };
  const calculatePayableAmountLater = (data) => {
    return (data.payableAmountLater = data.buyingPrice - data.payableAmountNow);
  };
  useEffect(() => {
    setBulkData((prev) => ({
      ...prev,
      payableAmountLater: calculatePayableAmountLater(prev),
    }));
  }, [bulkData.buyingPrice, bulkData.payableAmountNow]);
  // Update `buyingPrice` whenever `ramSimDetails` change
  useEffect(() => {
    setBulkData((prev) => ({
      ...prev,
      buyingPrice: calculateBuyingPrice(prev),
    }));
  }, [bulkData.ramSimDetails]);

  const handleBulkRecordSubmit = async () => {
    if (bulkEdit) {
      try {
        const payload = {
          partyName: bulkData.partyName,
          date: bulkData.date,
          purchasePaymentType: bulkData.paymentType,
          purchasePaymentStatus:
            bulkData.paymentType === 'full-payment' ? 'paid' : 'pending',
          ...(bulkData.paymentType === 'credit' && {
            creditPaymentData: {
              payableAmountNow: bulkData.payableAmountNow,
              payableAmountLater: bulkData.payableAmountLater,
              dateOfPayment: bulkData.paymentDate,
            },
          }),
          prices: {
            dealerPrice: bulkData.dealerPrice,
            buyingPrice: bulkData.buyingPrice,
            lp: bulkData.lp,
            lifting: bulkData.lifting,
            promo: bulkData.promo,
            activation: bulkData.activation,
          },
          ramSimDetails: bulkData.ramSimDetails.map((item) => ({
            companyName: item.companyName,
            modelName: item.modelName,
            batteryHealth: item.batteryHealth,
            ramMemory: item.ramMemory,
            simOption: item.simOption,
            priceOfOne: item.priceOfOne,
            imeiNumbers: item.imeiNumbers,
          })),
        };

        const response = await api.put(
          `/api/Purchase/bulk-phone-update/${editMobile._id}`,
          payload
        );

        if (response) {
          toast('Purchase bulk Record is updated Successfully');
          handleBulkPhoneModalclose();
          handleModalClose();
        }
      } catch (error) {
        console.error(error);

        toast(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong!'
        );
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const payload = {
          partyName: bulkData.partyName,
          date: bulkData.date,
          purchasePaymentType: bulkData.paymentType,
          purchasePaymentStatus:
            bulkData.paymentType === 'full-payment' ? 'paid' : 'pending',
          ...(bulkData.paymentType === 'credit' && {
            creditPaymentData: {
              payableAmountNow: bulkData.payableAmountNow,
              payableAmountLater: bulkData.payableAmountLater,
              dateOfPayment: bulkData.paymentDate,
            },
          }),
          prices: {
            dealerPrice: bulkData.dealerPrice,
            buyingPrice: bulkData.buyingPrice,
            lp: bulkData.lp,
            lifting: bulkData.lifting,
            promo: bulkData.promo,
            activation: bulkData.activation,
          },
          ramSimDetails: bulkData.ramSimDetails.map((item) => ({
            companyName: item.companyName,
            modelName: item.modelName,
            batteryHealth: item.batteryHealth,
            ramMemory: item.ramMemory,
            simOption: item.simOption,
            priceOfOne: item.priceOfOne,
            imeiNumbers: item.imeiNumbers,
          })),
        };

        const response = await api.post(
          `/api/Purchase/bulk-phone-purchase`,
          payload
        );

        if (response) {
          toast('Purchase bulk Record Added Successfully');
          handleBulkPhoneModalclose();
          handleModalClose();
        }
      } catch (error) {
        console.error(error);

        toast(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong!'
        );
      } finally {
        setLoading(false);
      }
    }
  };
  const getAllBanks = async () => {
    try {
      const response = await api.get('/api/banks/getAllBanks'); // your get all banks endpoint

      setBanks(response?.data?.banks); // Set the banks state with the fetched data
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  useEffect(() => {
    getAllBanks(); // Fetch all banks when the component mounts
  }, []);

  return (
    <>
      {/* Options Modal */}
      <Modal show={modal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {type == 'edit' ? 'Edit Phone' : 'Purchase Phone'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
          >
            <Button
              variant="primary"
              style={{
                padding: '20px',
                width: '150px',
                borderRadius: '10px',
                fontSize: '16px',
              }}
              onClick={handleSinglePhoneModalOpen}
            >
              {type == 'edit' ? 'Single Phone Edit' : 'Single Phone Purchase'}
            </Button>
            <Button
              variant="secondary"
              style={{
                padding: '20px',
                width: '150px',
                borderRadius: '10px',
                fontSize: '16px',
              }}
              onClick={handleBulkPhoneModalOpen}
            >
              {type == 'edit' ? 'Bulk Edit' : 'Bulk Purchase'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Single Phone Purchase Modal */}

      {/* Bulk Purchase Modal */}

      <BulkPurchaseModal
        type
        handleBulkPhoneModalclose={handleBulkPhoneModalclose}
        handleSubmit={handleBulkRecordSubmit}
        showBulkModal={showBulkModal}
        setBulkData={setBulkData}
        bulkData={bulkData}
        handleAddMorePhones={handleAddMorePhones}
        editMobile={editMobile}
      />
      <SingalPurchaseModal
        type={type}
        handleAccessoriesCheck={handleAccessoriesCheck}
        handleSinglePhoneModalclose={handleSinglePhoneModalclose}
        setSinglePurchase={setSinglePurchase}
        showSingleModal={showSingleModal}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        singlePurchase={singlePurchase}
        handleImageChange={handleImageChange}
        today={today}
      />
    </>
  );
};

export default PurchasePhone;
