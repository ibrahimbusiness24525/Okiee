import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
  Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import bulkMobileImage from '../../assets/images/phoneBoxes.jpg';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import useScanDetection from 'use-scan-detection';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';
import List from '../List/List';
import Table from 'components/Table/Table';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
import { toast } from 'react-toastify';
import { MoonLoader } from 'react-spinners';
import { useGetAccessories } from 'hooks/accessory';
import { Eye, EyeOff } from 'lucide-react';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
import CustomSelect from 'components/CustomSelect';
import { set } from 'immutable';
const NewMobilesList = () => {
  const [showAmount, setShowAmount] = useState(false);
  const { data } = useGetAccessories();
  const [imei, setImei] = useState([]);
  const [imeiList, setImeiList] = useState([]);
  const [search, setSearch] = useState('');
  const [mobiles, setMobiles] = useState([]);
  const [bankName, setBankName] = useState('');
  const [payableAmountNow, setPayableAmountNow] = useState('');
  const [payableAmountLater, setPayableAmountLater] = useState('');
  const [payableAmountLaterDate, setPayableAmountLaterDate] = useState('');
  const [exchangePhoneDetail, setExchangePhoneDetail] = useState('');
  const [type, setType] = useState('');
  const [cnicFrontPic, setCnicFrontPic] = useState('');
  const [cnicBackPic, setCnicBackPic] = useState('');
  const [sellingType, setSellingType] = useState('');
  const [accessoryName, setAccessoryName] = useState('');
  const [accessoryPrice, setAccessoryPrice] = useState(0);
  const [accessories, setAccessories] = useState([
    { id: '', name: '', quantity: 1, price: '' },
  ]);
  const [addedImeis, setAddedImeis] = useState([]);
  const [imeiPrices, setImeiPrices] = useState({}); // Use object to store IMEI-price pairs
  const handleAddedImei = (newImei) => {
    setAddedImeis((prev) => [...prev, newImei]);
    setImeiPrices((prev) => ({ ...prev, [newImei]: '' }));
  };

  const handleImeiPriceChange = (imei, price) => {
    setImeiPrices((prev) => ({
      ...prev,
      [imei]: price,
    }));
  };

  const handleRemoveAddedImei = (imeiToRemove) => {
    setAddedImeis((prev) => prev.filter((imei) => imei !== imeiToRemove));
    setImeiPrices((prev) => {
      const newPrices = { ...prev };
      delete newPrices[imeiToRemove];
      return newPrices;
    });
  };
  console.log('addedImeis:', addedImeis);
  console.log('imeiPrices:', imeiPrices);
  const [showWalletTransactionModal, setShowWalletTransactionModal] =
    useState(false);
  const [walletTransaction, setWalletTransaction] = useState({
    bankAccountUsed: '',
    amountFromBank: '',
    amountFromPocket: '',
  });
  const [customerNumber, setCustomerNumber] = useState('');
  const [bulkMobile, setBulkMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMobile, setEditMobile] = useState(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldMobile, setSoldMobile] = useState(null);
  const [saleDate, setSaleDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [warranty, setWarranty] = useState('12 months');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMobileId, setDeleteMobileId] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchMobile, setDispatchMobile] = useState(null);
  const [shopName, setShopName] = useState('');
  const [id, setId] = useState('');
  const [personName, setPersonName] = useState('');
  const [imeiInput, setImeiInput] = useState(''); // Input field for new IMEI
  const [bulkData, setBulkData] = useState([]);
  const [list, setList] = useState(true);
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

  const navigate = useNavigate();

  const handleAddImei = () => {
    if (imeiInput.trim() !== '' && !imeis.includes(imeiInput)) {
      setAddedImeis([...addedImeis, imeiInput]);
      setImeiInput(''); // Clear input after adding
    }
  };

  const handleRemoveImei = (imeiToRemove) => {
    setAddedImeis(imeis.filter((imei) => imei !== imeiToRemove));
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
    getMobiles();
  }, []);

  const getMobiles = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // const response = await axios.get(BASE_URL + `api/phone/getAllPhones/${user._id}`);
    const response = await api.get('/api/Purchase/purchase-phone');
    setMobiles(response.data.phones);
  };
  const getActualPrice = (prices) => {
    if (!prices || !prices.buyingPrice) return 0;

    const { buyingPrice, dealerPrice, lp, lifting, promo, activation } = prices;

    const dealerDiscount = buyingPrice * (Number(dealerPrice) / 100 || 0);

    const actualPrice =
      Number(buyingPrice) -
      dealerDiscount -
      (Number(lp) || 0) -
      (Number(lifting) || 0) -
      (Number(promo) || 0) -
      (Number(activation) || 0);

    return parseInt(Math.abs(actualPrice));
  };

  const deletePhone = async () => {
    try {
      if (type === 'bulk') {
        await api.delete(
          `/api/Purchase/purchase-bulk/delete/${deleteMobileId}`
        );
      } else {
        await api.delete(
          `/api/Purchase/purchase-phone/delete/${deleteMobileId}`
        );
      }
      setMobiles((prevMobiles) =>
        prevMobiles.filter((mobile) => mobile._id !== deleteMobileId)
      );
    } catch (error) {
      console.error('Error deleting phone:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDispatchClick = (mobile) => {
    const imeiList =
      mobile?.ramSimDetails
        ?.filter(
          (ramSim) =>
            ramSim.imeiNumbers &&
            ramSim.imeiNumbers.some((imei) => imei.isDispatched === false) // Only include if any IMEI is not dispatched
        )
        .flatMap((ramSim) => {
          if (!ramSim.imeiNumbers) return [];
          return ramSim.imeiNumbers
            .filter((imei) => imei.isDispatched === false) // Only keep IMEIs where isDispatched is false
            .map(
              (imei) =>
                imei.imei2
                  ? `${imei.imei1} / ${imei.imei2}` // Show both if imei2 exists
                  : imei.imei1 // Otherwise, just imei1
            );
        }) || [];
    setImeiList(imeiList); //
    setId(mobile._id);
    setDispatchMobile(mobile);
    setShowDispatchModal(true);
  };

  const handleDispatchSubmit = async () => {
    try {
      if (!shopName || !personName) {
        alert('Please fill all fields');
        return;
      }
      const response = await api.patch(
        `/api/Purchase/bulk-purchase-dispatch/${id}`,
        {
          shopName,
          receiverName: personName,
          ...(imei.length > 0 && {
            imeiArray: imei.map((i) => {
              const [imei1, imei2] = i.split(' / ').map((part) => part.trim());
              return { imei1, imei2 };
            }),
          }),
        }
      );

      setShopName('');
      setPersonName('');
      setShowDispatchModal(false);
      getBulkPhones();
      toast.success('Dispatch is created successfully');
    } catch (error) {
      console.error('Error in creating a dispatch', error);
    }
  };

  const handleEdit = (mobile) => {
    setEditMobile(mobile);
    setShowModal(true);
  };
  const getBulkPhones = async () => {
    try {
      const response = await api.get('/api/Purchase/bulk-phone-purchase');
      setBulkData(response.data);
      setBulkMobiles(
        response.data.filter((item) =>
          item.ramSimDetails?.some((ramSim) =>
            ramSim.imeiNumbers?.some(
              (imei) =>
                imei.imei1?.includes(searchTerm) ||
                imei.imei2?.includes(searchTerm)
            )
          )
        )
      );
    } catch (error) {
      console.error('error in getting bulk mobiles', error);
    }
  };
  useEffect(() => {
    setBulkMobiles(
      bulkData.filter((item) =>
        item.ramSimDetails?.some((ramSim) =>
          ramSim.imeiNumbers?.some(
            (imei) =>
              imei.imei1?.includes(searchTerm) ||
              imei.imei2?.includes(searchTerm)
          )
        )
      )
    );
  }, [searchTerm]);
  console.log('bulkMobile:', bulkMobile);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSoldClick = (mobile, type) => {
    if (type === 'bulk') {
      setType('bulk');
      const imeiList =
        mobile?.ramSimDetails
          ?.filter(
            (ramSim) =>
              ramSim.imeiNumbers &&
              ramSim.imeiNumbers.some((imei) => imei.isDispatched === false) // Only include if any IMEI is not dispatched
          )
          .flatMap((ramSim) => {
            if (!ramSim.imeiNumbers) return [];
            return ramSim.imeiNumbers
              .filter((imei) => imei.isDispatched === false) // Only keep IMEIs where isDispatched is false
              .map(
                (imei) =>
                  imei.imei2
                    ? `${imei.imei1} / ${imei.imei2} ` // Show both if imei2 exists
                    : imei.imei1 // Otherwise, just imei1
              );
          }) || [];

      setImeiList(imeiList); //
    }
    if (type === 'single') {
      setType('single');
    }

    setSoldMobile(mobile);
    setShowSoldModal(true);
  };
  const groupedByPerson = bulkMobile.reduce((acc, mobile) => {
    const personId = mobile.personId?._id || 'unknown';
    if (!acc[personId]) {
      acc[personId] = [];
    }
    acc[personId].push(mobile);
    return acc;
  }, {});
  console.log('finalprice:', finalPrice);
  const handleSoldSubmit = async () => {
    console.log(finalPrice, warranty, saleDate, sellingType);

    if (
      !finalPrice ||
      !warranty ||
      // !customerName ||
      // !customerNumber ||
      !saleDate ||
      sellingType === ''
    ) {
      alert('Please fill all fields');
      return;
    }

    const updatedMobile = {
      ...soldMobile,
      walletTransaction,
      finalPrice,
      entityData: showNewEntityForm ? newEntity : entityData,
      sellingType,
      warranty,
      saleDate,
      addedImeis,
      cnicBackPic,
      cnicFrontPic,
      customerName: entityData.name || newEntity.name || customerName || '',
      accessories,
      bankName,
      payableAmountNow,
      payableAmountLater,
      payableAmountLaterDate,
      exchangePhoneDetail,
      imeisWithPrices: imeiPrices,
      customerNumber:
        entityData.number || newEntity.number || customerNumber || '',
    };

    navigate('/invoice/shop', { state: updatedMobile });
    setFinalPrice('');
    setShowSoldModal(false);
  };

  const confirmDelete = (mobileId) => {
    setDeleteMobileId(mobileId);
    setShowDeleteModal(true);
    setType('single');
  };

  // const handleShareInventory = () => {
  //   const doc = new jsPDF();
  //   doc.text('Mobile Inventory', 10, 10);

  //   mobiles.forEach((mobile, index) => {
  //     const { images, companyName, modelSpecifications , specs, color } = mobile;
  //     const imgData = `data:image/jpeg;base64,${images[0]}`;
  //     const y = 20 + index * 50;

  //     if (imgData) {
  //       doc.addImage(imgData, 'JPEG', 10, y, 30, 30);
  //     }
  //     doc.text(`Company: ${companyName}`, 50, y + 5);
  //     doc.text(`Model: ${modelSpecifications}`, 50, y + 15);
  //     doc.text(`Specification: ${specs}`, 50, y + 25);
  //     doc.text(`Color: ${color}`, 50, y + 35);
  //   });

  //   doc.save('Mobile_Inventory.pdf');
  // };

  // const handleShareInventory = () => {
  //   const doc = new jsPDF();
  //   doc.text('Mobile Inventory', 10, 10);

  //   let y = 20;

  //   mobiles.forEach((mobile, index) => {
  //     const { images, companyName, modelSpecifications, specs, color } = mobile;
  //     const imgData = `data:image/jpeg;base64,${images[0]}`;

  //     // Check if next item will exceed page height
  //     if (y + 50 > 280) {
  //       // 280 leaves a margin from the bottom of A4
  //       doc.addPage();
  //       y = 20; // reset y for new page
  //     }

  //     if (imgData) {
  //       doc.addImage(imgData, 'JPEG', 10, y, 30, 30);
  //     }
  //     doc.text(`Company: ${companyName}`, 50, y + 5);
  //     doc.text(`Model: ${modelSpecifications}`, 50, y + 15);
  //     doc.text(`Specification: ${specs}`, 50, y + 25);
  //     doc.text(`Color: ${color}`, 50, y + 35);

  //     y += 50; // move y for the next entry
  //   });

  //   doc.save('Mobile_Inventory.pdf');
  // };
  console.log(bulkMobile);
  const handleShareInventory = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Mobile Inventory Summary', 105, 15, { align: 'center' });
    doc.setFontSize(12);

    let y = 30; // Starting Y position

    bulkMobile.forEach((mobile, index) => {
      const { companyName, modelName, ramSimDetails } = mobile;

      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 30;
      }

      // Count number of mobiles based on IMEI entries
      let totalMobiles = 0;
      ramSimDetails?.forEach((detail) => {
        totalMobiles += detail.imeiNumbers?.length || 0;
      });

      doc.setFont(undefined, 'bold');
      doc.text(`Item ${index + 1}`, 15, y);
      doc.setFont(undefined, 'normal');

      doc.text(`Company: ${companyName || 'N/A'}`, 15, y + 10);
      doc.text(`Model: ${modelName || 'N/A'}`, 15, y + 20);
      doc.text(`No. of Mobiles: ${totalMobiles}`, 15, y + 30);

      y += 45;

      // Add separator line if not last item
      if (index < bulkMobile.length - 1) {
        doc.line(15, y, 195, y);
        y += 15;
      }
    });

    doc.save('Mobile_Inventory_Summary.pdf');
  };

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const filteredMobiles = mobiles?.filter((mobile) => {
    // Exclude sold phones
    if (mobile.isSold) return false;
    if (mobile.phoneCondition === 'Used') return false;
    if (mobile.imei1.includes(searchTerm) || mobile.imei2.includes(searchTerm))
      return true;

    // Split the search term into words
    const searchWords = searchTerm?.toLowerCase()?.split(/\s+/);

    return searchWords.every(
      (word) =>
        // Check if each word exists in any of the searchable fields
        mobile.companyName?.toLowerCase()?.includes(word) ||
        mobile.modelSpecifications?.toLowerCase()?.includes(word) ||
        mobile.specs?.toLowerCase()?.includes(word) ||
        mobile.color?.toLowerCase()?.includes(word) || // Example: Searching by color if needed
        String(mobile.purchasePrice)?.includes(word) // Example: Searching by price if needed
    );
  });

  useEffect(() => {
    getBulkPhones();
  }, []);
  const [showPrices, setShowPrices] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState(null);
  const [imeis, setImeis] = useState([]);
  const [scanning, setScanning] = useState(false);
  const handleScan = (err, result) => {
    if (result) {
      if (!imeis.includes(result.text)) {
        setImeis((prev) => [...prev, result.text]); // Add IMEI if not duplicated
      }
      setScanning(false); // Stop scanning after reading
    }
  };
  const [barcodeScan, setBarcodeScan] = useState('No Barcode Scanned');
  useScanDetection({
    onComplete: setBarcodeScan,
    minLength: 3,
  });

  const handleShowPrices = (mobile) => {
    setSelectedMobile(mobile);
    setShowPrices(true);
  };

  const handleClosePrices = () => {
    setShowPrices(false);
    setSelectedMobile(null);
  };
  const handleBulkDelete = (id) => {
    setDeleteMobileId(id);
    setType('bulk');
    setShowDeleteModal(true);
  };
  const handleAccessoryChange = (index, field, value) => {
    const updatedAccessories = [...accessories];
    updatedAccessories[index][field] = value;
    setAccessories(updatedAccessories);
  };

  // Add New Accessory
  const addAccessory = () => {
    setAccessories([...accessories, { name: '', quantity: 1, price: '' }]);
  };

  // Remove Accessory
  const removeAccessory = (index) => {
    const updatedAccessories = accessories.filter((_, i) => i !== index);
    setAccessories(updatedAccessories);
  };
  const totalBulkStockAmount = bulkMobile.reduce(
    (total, mobile) => total + (Number(mobile?.prices?.buyingPrice) || 0),
    0
  );

  const handleChange = (event) => {
    const selectedImeis = event.target.value;
    setImei(selectedImeis);

    setAddedImeis((prevImeis) =>
      Array.from(new Set([...prevImeis, ...selectedImeis]))
    ); // Ensure uniqueness
  };

  const totalImeisArray = bulkData.map((bulk) => {
    // Sum the length of imeiNumbers for each ramSimDetails in the bulk data
    return bulk.ramSimDetails.reduce((total, ramSim) => {
      return total + ramSim.imeiNumbers.length; // Adds the number of imei entries for each ramSim
    }, 0); // Starts the count from 0
  });

  const groupedByParty = bulkMobile.reduce((acc, curr) => {
    const partyName = curr.partyName || 'Unknown';
    if (!acc[partyName]) {
      acc[partyName] = [];
    }
    acc[partyName].push(curr);
    return acc;
  }, {});

  // Calculate payable amounts
  const calculatePayables = (entries) => {
    let now = 0;
    let later = 0;

    entries.forEach((entry) => {
      if (entry.purchasePaymentType === 'credit' && entry.creditPaymentData) {
        now += Number(entry.prices.buyingPrice || 0);
        later += Number(entry.creditPaymentData.payableAmountLater || 0);
      } else if (entry.purchasePaymentType === 'full-payment') {
        now += Number(entry.prices?.buyingPrice || 0);
      }
    });

    return { now, later };
  };
  useEffect(() => {
    const total = Object.values(imeiPrices).reduce(
      (sum, price) => sum + (Number(price) || 0),
      0
    );
    setFinalPrice(total); // Auto-update when imeiPrices change
  }, [imeiPrices, addedImeis, imeiList, imei]);

  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by name or company"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>
      {/* Search bar */}

      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid #dee2e6',
        }}
      >
        {/* Total Stock Amount Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            padding: '20px 25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,123,255,0.1)',
            border: '2px solid #e3f2fd',
            minWidth: '350px',
          }}
        >
          <div>
            <h5
              style={{
                fontSize: 28,
                margin: 0,
                color: '#2c3e50',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              Total Stock Amount :
              <span
                style={{
                  fontWeight: 'bold',
                  color: '#007bff',
                  fontSize: 32,
                  marginLeft: '8px',
                  textShadow: '0 2px 4px rgba(0,123,255,0.2)',
                }}
              >
                {showAmount ? totalBulkStockAmount : '••••••'}
              </span>
            </h5>
          </div>
          <button
            onClick={() => setShowAmount(!showAmount)}
            style={{
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              padding: '12px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
              width: '45px',
              height: '45px',
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                'linear-gradient(135deg, #0056b3 0%, #004085 100%)';
              e.target.style.transform = 'scale(1.15) rotate(5deg)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,123,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                'linear-gradient(135deg, #007bff 0%, #0056b3 100%)';
              e.target.style.transform = 'scale(1) rotate(0deg)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
            }}
            title={showAmount ? 'Hide amount' : 'Show amount'}
          >
            {showAmount ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Stock Count Box */}

        {/* Share Inventory Button */}
        <Button
          variant="primary"
          onClick={handleShareInventory}
          style={{
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            border: 'none',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1.1rem',
            boxShadow: '0 6px 20px rgba(40,167,69,0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              'linear-gradient(135deg, #218838 0%, #1e7e34 100%)';
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.boxShadow = '0 10px 30px rgba(40,167,69,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.3)';
          }}
        >
          Share Inventory
        </Button>
      </div>
      <button
        onClick={() => setList(!list)}
        style={{
          padding: '14px 28px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          color: 'white',
          marginBottom: '24px',
          fontWeight: '600',
          fontSize: '14px',
          letterSpacing: '0.5px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          boxShadow:
            '0 8px 25px rgba(59, 130, 246, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transform: 'translateY(0)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            '0 12px 35px rgba(59, 130, 246, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 8px 25px rgba(59, 130, 246, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(1px)';
          e.currentTarget.style.boxShadow =
            '0 4px 15px rgba(59, 130, 246, 0.4), 0 2px 5px rgba(0, 0, 0, 0.2)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            '0 12px 35px rgba(59, 130, 246, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15)';
        }}
      >
        {/* Icon for visual enhancement */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: '4px' }}
        >
          <path d="M3 3h18v18H3zM9 9h6v6H9z" />
        </svg>

        <span style={{ position: 'relative', zIndex: 1 }}>
          Change Record Design
        </span>

        {/* Subtle shine effect overlay */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.6s ease',
            zIndex: 0,
          }}
          className="shine-effect"
        />
      </button>

      {/* Optional: Add this CSS for the shine animation on hover */}
      <style jsx>{`
        button:hover .shine-effect {
          left: 100%;
        }
      `}</style>

      <h3 style={{ marginTop: 'rem', marginBottom: '1rem' }}>
        New Bulk Phones
      </h3>
      {/* {!bulkMobile.length > 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <MoonLoader size={60} color="#4f46e5" />
        </div>
      ) : list ? (
        <>
          {Object.entries(groupedByParty).map(([partyName, partyData]) => {
            const { now, later } = calculatePayables(partyData);

            return (
              <div key={partyName} style={{ marginBottom: '2rem' }}>
                <StyledHeading>{partyName}</StyledHeading>
                <p
                  style={{
                    margin: '0 0 1.5rem 0',
                    color: '#444',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                  }}
                >
                  <strong style={{ fontSize: '1.2rem' }}>Paid Amount:</strong>{' '}
                  <span
                    style={{
                      color: 'green',
                      fontWeight: '700',
                      fontSize: '1.2rem',
                    }}
                  >
                    {now.toLocaleString()} PKR
                  </span>{' '}
                  |{' '}
                  <strong style={{ fontSize: '1.2rem' }}>
                    Remaining Amount:
                  </strong>{' '}
                  <span
                    style={{
                      color: 'red',
                      fontWeight: '700',
                      fontSize: '1.2rem',
                    }}
                  >
                    {later.toLocaleString()} PKR
                  </span>
                </p>
                <Table
                  routes={['/app/dashboard/bulkPhoneDetail']}
                  array={partyData.filter(
                    (record) => record.dispatch === false
                  )}
                  keysToDisplay={[
                    'partyName',
                    'actualBuyingPrice',
                    'prices',
                    'creditPaymentData',
                    'status',
                    'ramSimDetails',
                    'purchasePaymentType',
                  ]}
                  label={[
                    'Party Name',
                    'Buying Price',
                    'Payable Amount',
                    'Remaining Amount',
                    'Status',
                    'Quantity',
                    'Payment Type',
                    'Actions',
                  ]}
                  customBlocks={[
                    {
                      index: 1,
                      component: (buyingPrice) => {
                        return <span>{buyingPrice || 'Not mentioned'}</span>;
                      },
                    },
                    {
                      index: 2,
                      component: (prices) => {
                        return (
                          <span
                            style={{
                              backgroundColor: '#d1fae5', // light green
                              color: '#065f46', // dark green
                              padding: '4px 12px',
                              borderRadius: '8px',
                              fontWeight: '500',
                              fontSize: '14px',
                              display: 'inline-block',
                            }}
                          >
                            {prices?.buyingPrice || 'Not mentioned'}
                          </span>
                        );
                      },
                    },
                    {
                      index: 3,
                      component: (creditPaymentData) => {
                        const hasAmount = creditPaymentData?.payableAmountLater;

                        const style = {
                          backgroundColor: hasAmount ? '#fee2e2' : '#d1fae5', // red or green background
                          color: hasAmount ? '#991b1b' : '#065f46', // red or green text
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontWeight: '500',
                          fontSize: '14px',
                          display: 'inline-block',
                        };

                        return (
                          <span style={style}>
                            {hasAmount || 'Not Remaining'}
                          </span>
                        );
                      },
                    },

                    {
                      index: 5,
                      component: (ramSimDetails) => {
                        const totalImeiNumbers = ramSimDetails.reduce(
                          (total, ramSim) => {
                            const imeis = Array.isArray(ramSim.imeiNumbers)
                              ? ramSim.imeiNumbers.filter(
                                  (imei) => imei.isDispatched === false
                                )
                              : [];
                            return total + imeis.length;
                          },
                          0
                        );

                        return <span>{totalImeiNumbers}</span>;
                      },
                    },

                    {
                      index: 6,
                      component: (purchasePaymentType) => {
                        return (
                          <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                            {purchasePaymentType === 'full-payment' ? (
                              <span style={{ color: 'green' }}>
                                Full Payment
                              </span>
                            ) : (
                              <span style={{ color: 'orange' }}>
                                Partial Payment
                              </span>
                            )}
                          </span>
                        );
                      },
                    },
                  ]}
                  extraColumns={[
                    (obj) => (
                      <>
                        <div></div>
                        <Button
                          onClick={() => handleSoldClick(obj, 'bulk')}
                          style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Sold
                        </Button>
                        <Button
                          onClick={() => handleEdit(obj)}
                          style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDispatchClick(obj)}
                          style={{
                            backgroundColor: '#FFD000',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginRight: '5px',
                          }}
                        >
                          Dispatch
                        </Button>
                      </>
                    ),
                  ]}
                />
              </div>
            );
          })}
        </>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {bulkMobile.length > 0 ? (
              bulkMobile
                .filter((record) => record.dispatch === false)
                .map((mobile) => (
                  <Col key={mobile._id}>
                    <Card
                      className="h-100 shadow border-0"
                      style={{
                        borderRadius: '15px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <FaEdit
                        onClick={() => handleEdit(mobile)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '50px',
                          color: '#28a745',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                        }}
                      />
                      <FaTrash
                        onClick={() => handleBulkDelete(mobile._id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          color: 'red',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                        }}
                      />

                   

                      <Card.Body
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          justifyContent: 'left',
                          alignItems: 'start',
                          flexDirection: 'column',
                          width: '100%',
                        }}
                      >
                        <Card.Title
                          style={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            color: '#333',
                          }}
                        >
                          {mobile?.companyName || 'No Company Name'}{' '}
                          {mobile?.modelName || 'No Model Name'}
                        </Card.Title>

                        <Card.Text
                          style={{
                            fontSize: '1rem',
                            color: '#666',
                            lineHeight: '1.6',
                          }}
                        >
                          <div>
                            <strong
                              style={{
                                color: '#333',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                              }}
                            >
                              Party Name:
                            </strong>{' '}
                            {mobile?.partyName || 'Not Available'}
                          </div>
                          <div>
                            <strong
                              style={{
                                color: '#333',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                              }}
                            >
                              Date:
                            </strong>{' '}
                            {mobile?.date
                              ? new Date(mobile?.date).toLocaleDateString()
                              : 'Not Available'}
                          </div>

                          <div>
                            <strong
                              style={{
                                color: '#333',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                              }}
                            >
                              Price:
                            </strong>
                            <p>
                              Total Buying Price :{mobile.prices?.buyingPrice}
                            </p>
                            <Button
                              onClick={() => handleShowPrices(mobile)}
                              style={{
                                backgroundColor: '#3f4d67',
                                color: '#fff',
                                border: 'none',
                                width: '100%',
                                padding: '6px 14px', // Smaller padding
                                borderRadius: '3px', // Slightly smaller border radius
                                cursor: 'pointer',
                                fontSize: '0.9rem', // Smaller font size
                                transition: 'background-color 0.3s ease',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
                                margin: '5px', // Slight margin to separate buttons
                              }}
                            >
                              View All Prices
                            </Button>
                          </div>

                          {mobile?.ramSimDetails?.length > 0 ? (
                            <div>
                              <div style={{ marginBottom: '20px' }}></div>
                              <strong
                                style={{
                                  color: '#333',
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                }}
                              >
                                RAM and SIM Options:
                              </strong>
                              <div style={{ marginBottom: '10px' }}></div>
                              {mobile?.ramSimDetails?.map((ramSim) => (
                                <div
                                  key={ramSim._id}
                                  style={{
                                    border: '1px solid #ddd',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                      marginBottom: '5px',
                                    }}
                                  >
                                    RAM Memory:{' '}
                                    {ramSim?.ramMemory || 'Not Available'} GB
                                  </div>

                                  <div
                                    style={{
                                      fontSize: '14px',
                                      marginBottom: '5px',
                                    }}
                                  >
                                    <strong>SIM Option:</strong>{' '}
                                    {ramSim?.simOption || 'Not Available'}
                                  </div>

                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      fontSize: '14px',
                                      marginBottom: '5px',
                                    }}
                                  >
                                    <strong style={{ marginRight: '5px' }}>
                                      Quantity:
                                    </strong>
                                    <span>
                                      {ramSim?.imeiNumbers?.length > 0
                                        ? `${ramSim.imeiNumbers.length}`
                                        : 'No stock available'}
                                    </span>
                                  </div>

                                  {ramSim.priceOfOne && (
                                    <div
                                      style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                      }}
                                    >
                                      Per Piece Price:{' '}
                                      <span style={{ color: '#007bff' }}>
                                        {ramSim.priceOfOne}
                                      </span>
                                    </div>
                                  )}
                                  {ramSim.priceOfOne && (
                                    <div
                                      style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                      }}
                                    >
                                      Total Amount:{' '}
                                      <span style={{ color: '#007bff' }}>
                                        {ramSim.priceOfOne *
                                          ramSim.imeiNumbers.length}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>RAM and SIM Options: Not Available</div>
                          )}
                        </Card.Text>

                      </Card.Body>
                      <div
                        style={{
                          textAlign: 'right',
                          width: '100%',
                          padding: '1.5rem',
                        }}
                      >
                        <Button
                          onClick={() => handleDispatchClick(mobile)}
                          style={{
                            backgroundColor: '#FFD000',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginRight: '5px',
                          }}
                        >
                          Dispatch
                        </Button>
                        <Button
                          onClick={() => handleSoldClick(mobile, 'bulk')}
                          style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Sold
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))
            ) : (
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Text>No mobiles found</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )}

   
            <Modal show={showPrices} onHide={handleClosePrices}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Prices for {selectedMobile?.companyName}{' '}
                  {selectedMobile?.modelName}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ul>
                  <li>
                    <strong>Buying Price:</strong>{' '}
                    {selectedMobile?.prices?.buyingPrice || 'Not Available'}
                  </li>
                  <li>
                    <strong>Dealer Price:</strong>{' '}
                    {selectedMobile?.prices?.dealerPrice || 'Not Available'}
                  </li>
                  <li>
                    <strong>LP:</strong>{' '}
                    {selectedMobile?.prices?.lp || 'Not Available'}
                  </li>
                  <li>
                    <strong>Lifting:</strong>{' '}
                    {selectedMobile?.prices?.lifting || 'Not Available'}
                  </li>
                  <li>
                    <strong>Promo:</strong>{' '}
                    {selectedMobile?.prices?.promo || 'Not Available'}
                  </li>
                  <li>
                    <strong>Activation:</strong>{' '}
                    {selectedMobile?.prices?.activation || 'Not Available'}
                  </li>
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClosePrices}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </>
      )} */}
      {!bulkMobile.length > 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <MoonLoader size={60} color="#4f46e5" />
        </div>
      ) : list ? (
        <>
          {Object.entries(groupedByPerson).map(([personId, personData]) => {
            const personName =
              personData[0]?.personId?.name || 'Unknown Person';
            const personNumber = personData[0]?.personId?.number || 'No Number';
            const { now, later } = calculatePayables(personData);
            console.log('person Data', personData);

            return (
              <div key={personId} style={{ marginBottom: '2rem' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <StyledHeading>{personName}</StyledHeading>
                  <span
                    style={{
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    {personNumber}
                  </span>
                </div>
                <p
                  style={{
                    margin: '0.5rem 0 1.5rem 0',
                    color: '#444',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                  }}
                >
                  <strong style={{ fontSize: '1.2rem' }}>Paid Amount:</strong>{' '}
                  <span
                    style={{
                      color: 'green',
                      fontWeight: '700',
                      fontSize: '1.2rem',
                    }}
                  >
                    {now.toLocaleString()} PKR
                  </span>{' '}
                  |{' '}
                  <strong style={{ fontSize: '1.2rem' }}>
                    Remaining Amount:
                  </strong>{' '}
                  <span
                    style={{
                      color: 'red',
                      fontWeight: '700',
                      fontSize: '1.2rem',
                    }}
                  >
                    {later.toLocaleString()} PKR
                  </span>
                </p>
                <Table
                  routes={['/app/dashboard/bulkPhoneDetail']}
                  array={personData.filter(
                    (record) => record.dispatch === false
                  )}
                  keysToDisplay={[
                    // 'companyName',
                    // 'modelName',
                    'actualBuyingPrice',
                    'prices',
                    'creditPaymentData',
                    'status',
                    'ramSimDetails',
                    'purchasePaymentType',
                  ]}
                  label={[
                    // 'Company',
                    // 'Model',
                    'Buying Price',
                    'Payable Amount',
                    'Remaining Amount',
                    'Status',
                    'Quantity',
                    'Payment Type',
                    'Actions',
                  ]}
                  customBlocks={[
                    // {
                    //   index: 0,
                    //   component: (companyName) => {
                    //     return (
                    //       <span style={{ fontWeight: '600' }}>
                    //         {companyName || 'N/A'}
                    //       </span>
                    //     );
                    //   },
                    // },
                    // {
                    //   index: 1,
                    //   component: (modelName) => {
                    //     return <span>{modelName || 'N/A'}</span>;
                    //   },
                    // },
                    // {
                    //   index: 2,
                    //   component: (buyingPrice) => {
                    //     return (
                    //       <span>
                    //         {buyingPrice ? `${buyingPrice} PKR` : 'N/A'}
                    //       </span>
                    //     );
                    //   },
                    // },
                    {
                      index: 1,
                      component: (prices) => {
                        return (
                          <span
                            style={{
                              backgroundColor: '#d1fae5',
                              color: '#065f46',
                              padding: '4px 12px',
                              borderRadius: '8px',
                              fontWeight: '500',
                              fontSize: '14px',
                              display: 'inline-block',
                            }}
                          >
                            {prices?.buyingPrice
                              ? `${prices.buyingPrice} PKR`
                              : 'N/A'}
                          </span>
                        );
                      },
                    },
                    {
                      index: 2,
                      component: (creditPaymentData) => {
                        const hasAmount = creditPaymentData?.payableAmountLater;

                        const style = {
                          backgroundColor: hasAmount ? '#fee2e2' : '#d1fae5',
                          color: hasAmount ? '#991b1b' : '#065f46',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontWeight: '500',
                          fontSize: '14px',
                          display: 'inline-block',
                        };

                        return (
                          <span style={style}>
                            {hasAmount ? `${hasAmount} PKR` : 'Paid'}
                          </span>
                        );
                      },
                    },
                    {
                      index: 4,
                      component: (ramSimDetails) => {
                        const totalImeiNumbers = ramSimDetails.reduce(
                          (total, ramSim) => {
                            const imeis = Array.isArray(ramSim.imeiNumbers)
                              ? ramSim.imeiNumbers.filter(
                                  (imei) => imei.isDispatched === false
                                )
                              : [];
                            return total + imeis.length;
                          },
                          0
                        );

                        return (
                          <span
                            style={{
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              padding: '4px 12px',
                              borderRadius: '8px',
                              fontWeight: '500',
                              display: 'inline-block',
                            }}
                          >
                            {totalImeiNumbers}
                          </span>
                        );
                      },
                    },
                    {
                      index: 5,
                      component: (purchasePaymentType) => {
                        return (
                          <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                            {purchasePaymentType === 'full-payment' ? (
                              <span
                                style={{
                                  color: 'green',
                                  backgroundColor: '#dcfce7',
                                  padding: '4px 12px',
                                  borderRadius: '8px',
                                  display: 'inline-block',
                                }}
                              >
                                Full Payment
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: '#ea580c',
                                  backgroundColor: '#ffedd5',
                                  padding: '4px 12px',
                                  borderRadius: '8px',
                                  display: 'inline-block',
                                }}
                              >
                                Partial Payment
                              </span>
                            )}
                          </span>
                        );
                      },
                    },
                  ]}
                  extraColumns={[
                    (obj) => (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          onClick={() => handleSoldClick(obj, 'bulk')}
                          style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Sold
                        </Button>
                        <Button
                          onClick={() => handleEdit(obj)}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDispatchClick(obj)}
                          style={{
                            backgroundColor: '#FFD000',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Dispatch
                        </Button>
                      </div>
                    ),
                  ]}
                />
              </div>
            );
          })}
        </>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {bulkMobile.length > 0 ? (
              bulkMobile
                .filter((record) => record.dispatch === false)
                .map((mobile) => (
                  <Col key={mobile._id}>
                    <Card
                      className="h-100 shadow border-0"
                      style={{
                        borderRadius: '15px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <FaEdit
                        onClick={() => handleEdit(mobile)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '50px',
                          color: '#28a745',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                        }}
                      />
                      <FaTrash
                        onClick={() => handleBulkDelete(mobile._id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          color: 'red',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                        }}
                      />

                      <Card.Body
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          justifyContent: 'left',
                          alignItems: 'start',
                          flexDirection: 'column',
                          width: '100%',
                        }}
                      >
                        <Card.Text
                          style={{
                            fontSize: '1rem',
                            color: '#666',
                            lineHeight: '1.6',
                          }}
                        >
                          <div>
                            <strong
                              style={{
                                color: '#333',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                              }}
                            >
                              Person:
                            </strong>{' '}
                            {mobile?.personId?.name || 'Not Available'}
                            {mobile?.personId?.number && (
                              <span
                                style={{
                                  marginLeft: '8px',
                                  backgroundColor: '#e0e7ff',
                                  color: '#4f46e5',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {mobile.personId.number}
                              </span>
                            )}
                          </div>
                          <div>
                            <strong
                              style={{
                                color: '#333',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                              }}
                            >
                              Date:
                            </strong>{' '}
                            {mobile?.date
                              ? new Date(mobile?.date).toLocaleDateString()
                              : 'Not Available'}
                          </div>

                          <div>
                            <strong
                              style={{
                                color: '#333',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                              }}
                            >
                              Price:
                            </strong>
                            <p>
                              Total Buying Price:{' '}
                              {mobile.prices?.buyingPrice || 'N/A'} PKR
                            </p>
                            <Button
                              onClick={() => handleShowPrices(mobile)}
                              style={{
                                backgroundColor: '#3f4d67',
                                color: '#fff',
                                border: 'none',
                                width: '100%',
                                padding: '6px 14px',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'background-color 0.3s ease',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                margin: '5px',
                              }}
                            >
                              View All Prices
                            </Button>
                          </div>

                          {mobile?.ramSimDetails?.length > 0 ? (
                            <div>
                              <div style={{ marginBottom: '20px' }}></div>
                              <strong
                                style={{
                                  color: '#333',
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                }}
                              >
                                RAM and SIM Options:
                              </strong>
                              <div style={{ marginBottom: '10px' }}></div>
                              {mobile?.ramSimDetails?.map((ramSim) => (
                                <div
                                  key={ramSim._id}
                                  style={{
                                    border: '1px solid #ddd',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                      marginBottom: '5px',
                                    }}
                                  >
                                    RAM Memory: {ramSim?.ramMemory || 'N/A'} GB
                                  </div>

                                  <div
                                    style={{
                                      fontSize: '14px',
                                      marginBottom: '5px',
                                    }}
                                  >
                                    <strong>SIM Option:</strong>{' '}
                                    {ramSim?.simOption || 'N/A'}
                                  </div>

                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      fontSize: '14px',
                                      marginBottom: '5px',
                                    }}
                                  >
                                    <strong style={{ marginRight: '5px' }}>
                                      Quantity:
                                    </strong>
                                    <span>
                                      {ramSim?.imeiNumbers?.length > 0
                                        ? `${ramSim.imeiNumbers.length}`
                                        : 'No stock'}
                                    </span>
                                  </div>

                                  {ramSim.priceOfOne && (
                                    <>
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 'bold',
                                          color: '#333',
                                        }}
                                      >
                                        Per Piece:{' '}
                                        <span style={{ color: '#007bff' }}>
                                          {ramSim.priceOfOne} PKR
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 'bold',
                                          color: '#333',
                                        }}
                                      >
                                        Total:{' '}
                                        <span style={{ color: '#007bff' }}>
                                          {ramSim.priceOfOne *
                                            ramSim.imeiNumbers.length}{' '}
                                          PKR
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>RAM and SIM Options: Not Available</div>
                          )}
                        </Card.Text>
                      </Card.Body>
                      <div
                        style={{
                          textAlign: 'right',
                          width: '100%',
                          padding: '1.5rem',
                        }}
                      >
                        <Button
                          onClick={() => handleDispatchClick(mobile)}
                          style={{
                            backgroundColor: '#FFD000',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginRight: '5px',
                          }}
                        >
                          Dispatch
                        </Button>
                        <Button
                          onClick={() => handleSoldClick(mobile, 'bulk')}
                          style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Sold
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))
            ) : (
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Text>No mobiles found</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )}

            <Modal show={showPrices} onHide={handleClosePrices}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Prices for {selectedMobile?.companyName}{' '}
                  {selectedMobile?.modelName}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li
                    style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                  >
                    <strong>Buying Price:</strong>{' '}
                    {selectedMobile?.prices?.buyingPrice || 'N/A'} PKR
                  </li>
                  <li
                    style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                  >
                    <strong>Dealer Price:</strong>{' '}
                    {selectedMobile?.prices?.dealerPrice || 'N/A'} PKR
                  </li>
                  <li
                    style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                  >
                    <strong>LP:</strong> {selectedMobile?.prices?.lp || 'N/A'}{' '}
                    PKR
                  </li>
                  <li
                    style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                  >
                    <strong>Lifting:</strong>{' '}
                    {selectedMobile?.prices?.lifting || 'N/A'} PKR
                  </li>
                  <li
                    style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                  >
                    <strong>Promo:</strong>{' '}
                    {selectedMobile?.prices?.promo || 'N/A'} PKR
                  </li>
                  <li style={{ padding: '8px 0' }}>
                    <strong>Activation:</strong>{' '}
                    {selectedMobile?.prices?.activation || 'N/A'} PKR
                  </li>
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClosePrices}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </>
      )}

      {/* <AddPhone modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} /> */}
      <PurchasePhone
        type="edit"
        bulkEdit={true}
        modal={showModal}
        editMobile={editMobile}
        handleModalClose={() => setShowModal(false)}
      />
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this phone?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deletePhone}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDispatchModal}
        onHide={() => setShowDispatchModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Dispatch Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter Shop Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Receiver Person Name</Form.Label>
              <Form.Control
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Receiver Person Name"
              />
            </Form.Group>
            <Form.Group style={{ width: '100%' }}>
              <InputLabel>IMEI</InputLabel>
              <Select
                value={imei}
                onChange={handleChange}
                displayEmpty
                multiple
                fullWidth
                placeholder={'Select Mobile imeis'}
              >
                {imeiList
                  .filter((item) =>
                    item.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDispatchModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDispatchSubmit}>
            Dispatch
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sold Modal */}
      <Modal
        size="lg"
        show={showSoldModal}
        onHide={() => setShowSoldModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sell Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <Form.Group controlId="bulkPayment">
                <Form.Label>Payment Type</Form.Label>
                <Form.Select
                  value={sellingType}
                  onChange={(e) => setSellingType(e.target.value)}
                  required
                >
                  <option value="">Select Payment Type</option>
                  <option value="Full Payment">Full Payment</option>
                  <option value="Credit">Credit</option>
                </Form.Select>
              </Form.Group>
              <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col>
                  {sellingType !== 'none' && (
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
                          <CustomSelect
                            value={entityData._id}
                            onChange={(selectedOption) => {
                              const selectedEntity = getAllEntities.find(
                                (entity) => entity._id === selectedOption?.value
                              );
                              setEntityData(
                                selectedEntity || {
                                  name: '',
                                  number: '',
                                  _id: '',
                                }
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
                </Col>
                <Col>
                  <Form.Group controlId="saleDate">
                    <Form.Label>Sale Date</Form.Label>
                    <Form.Control
                      type="Date"
                      style={{ marginTop: '20px' }}
                      placeholder="Enter Sale Date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter Customer Name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Customer Number</Form.Label>
                <Form.Control
                  type="text"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  placeholder="Enter number in +923XXXXXXXXX format"
                />
              </Form.Group> */}

              <div>
                <div>
                  {accessories.map((accessory, index) => (
                    <div key={index} className="mb-3 p-3 border rounded">
                      <Form.Group>
                        <Form.Label>Accessory Name</Form.Label>
                        <Form.Select
                          value={accessory.name} // holds ID
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedName =
                              data?.data?.find(
                                (item) => item._id === selectedId
                              )?.accessoryName || '';

                            const updatedAccessories = [...accessories];
                            updatedAccessories[index] = {
                              ...updatedAccessories[index],
                              name: selectedId, // keep sending this as ID
                              id: selectedName, // store actual name in "id"
                            };
                            setAccessories(updatedAccessories);
                          }}
                        >
                          <option value="">Select accessory</option>
                          {data?.data?.map((item) => (
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
                          onChange={(e) => {
                            const updated = [...accessories];
                            updated[index].quantity = e.target.value;
                            setAccessories(updated);
                          }}
                          min="1"
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Accessory Price</Form.Label>
                        <Form.Control
                          type="number"
                          value={accessory.price}
                          onChange={(e) => {
                            const updated = [...accessories];
                            updated[index].price = e.target.value;
                            setAccessories(updated);
                          }}
                          placeholder="Enter price"
                        />
                      </Form.Group>

                      <Button
                        variant="secondary"
                        className="mt-2"
                        onClick={() => {
                          const updated = accessories.filter(
                            (_, i) => i !== index
                          );
                          setAccessories(updated);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="primary"
                    onClick={() =>
                      setAccessories((prev) => [
                        ...prev,
                        { id: '', name: '', quantity: 1, price: '' },
                      ])
                    }
                  >
                    Add Another Accessory
                  </Button>
                </div>

                {/* <InputLabel
                  style={{
                    background:
                      'linear-gradient(90deg, #fef9c3 0%, #fde68a 100%)',
                    border: '2px solid #f59e42',
                    borderRadius: '12px',
                    padding: '24px 18px',
                    margin: '24px 0',
                    boxShadow: '0 4px 18px rgba(245, 158, 66, 0.15)',
                  }}
                >
                  Select Imei is compulsory
                </InputLabel> */}
                <FormControl fullWidth variant="outlined" className="mb-3">
                  <InputLabel>IMEI</InputLabel>
                  <Select
                    value={imei}
                    onChange={handleChange}
                    displayEmpty
                    multiple
                  >
                    {imeiList
                      .filter((item) =>
                        item.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              {sellingType === 'Bank' && (
                <Form.Group>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </Form.Group>
              )}

              {sellingType === 'Credit' && (
                <>
                  <Form.Group>
                    <Form.Label>Payable Amount Now</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter amount payable now"
                      value={payableAmountNow}
                      onChange={(e) => setPayableAmountNow(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Payable Amount Later</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter amount payable later"
                      value={payableAmountLater}
                      onChange={(e) => setPayableAmountLater(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>When will it be paid?</Form.Label>
                    <Form.Control
                      type="date"
                      value={payableAmountLaterDate}
                      onChange={(e) =>
                        setPayableAmountLaterDate(e.target.value)
                      }
                    />
                  </Form.Group>
                </>
              )}

              {sellingType === 'Exchange' && (
                <Form.Group>
                  <Form.Label>Exchange Phone Details</Form.Label>
                  <Form.Control
                    as={'textarea'}
                    rows={4} //
                    type="text"
                    placeholder="Enter exchange phone details"
                    value={exchangePhoneDetail}
                    onChange={(e) => setExchangePhoneDetail(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                {/* <Form.Label>Sold Price</Form.Label> */}
                <Form.Control
                  type="number"
                  hidden={true}
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="Enter Sold price"
                />
              </Form.Group>
            </div>
            {/* <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#4b5563',
                }}
                htmlFor=""
              >
                Select Imei Mobiles Model
              </label>
              <span>{}</span>
            </div> */}
            {type === 'bulk' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>IMEI Number</Form.Label>

                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={imeiInput}
                      onChange={(e) => setImeiInput(e.target.value)}
                      placeholder="Enter IMEI number"
                    />
                    <Button
                      variant="success"
                      onClick={() => handleAddedImei(imeiInput)}
                      backgroundColor="linear-gradient(to right, #50b5f4, #b8bee2)"
                      className="ms-2"
                    >
                      Add
                    </Button>
                  </div>
                </Form.Group>

                {/* {addedImeis.length > 0 && (
                  <div className="mt-3">
                    <h6>Added IMEIs:</h6>
                    <ul className="list-group">
                      {addedImeis.map((imei, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {imei}
                          <input
                            type="number"
                            value={imeiPrices[imei] || ''}
                            onChange={(e) =>
                              handleImeiPriceChange(imei, e.target.value)
                            }
                            placeholder="Price"
                            style={{
                              width: '100px',
                              marginRight: '10px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              padding: '5px',
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveImei(imei)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )} */}

                {addedImeis.length > 0 && (
                  <div className="mt-3">
                    <h6>Added IMEIs:</h6>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        maxHeight: '400px',
                        overflowY: 'auto',
                      }}
                    >
                      {addedImeis.map((imei, index) => (
                        <li
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 15px',
                            borderBottom: '1px solid #e0e0e0',
                            backgroundColor: '#fff',
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '14px',
                              color: '#333',
                            }}
                          >
                            {imei}
                          </span>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                              }}
                            >
                              <label
                                style={{
                                  fontSize: '12px',
                                  color: '#666',
                                  marginBottom: '2px',
                                }}
                              >
                                Purchase Price
                              </label>
                              <input
                                type="text"
                                value={
                                  bulkData.reduce((price, bulkItem) => {
                                    for (const detail of bulkItem.ramSimDetails) {
                                      const hasImei = detail.imeiNumbers.some(
                                        (imeiObj) => imeiObj.imei1 === imei
                                      );
                                      if (hasImei) return detail.priceOfOne;
                                    }
                                    return price;
                                  }, '') || ''
                                }
                                style={{
                                  width: '120px',
                                  padding: '6px 8px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                }}
                                readOnly
                              />
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                              }}
                            >
                              <label
                                style={{
                                  fontSize: '12px',
                                  color: '#666',
                                  marginBottom: '2px',
                                }}
                              >
                                Selling Price
                              </label>
                              <input
                                type="number"
                                value={imeiPrices[imei] || ''}
                                onChange={(e) =>
                                  handleImeiPriceChange(imei, e.target.value)
                                }
                                placeholder="Enter price"
                                style={{
                                  width: '120px',
                                  padding: '6px 8px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                }}
                              />
                            </div>

                            <button
                              onClick={() => handleRemoveAddedImei(imei)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                height: '32px',
                                alignSelf: 'flex-end',
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  '#c82333')
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  '#dc3545')
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </Form>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              marginTop: '20px',
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                setShowWalletTransactionModal(!showWalletTransactionModal)
              }
            >
              Proceed To Pay
            </Button>
            <WalletTransactionModal
              show={showWalletTransactionModal}
              toggleModal={() =>
                setShowWalletTransactionModal(!showWalletTransactionModal)
              }
              singleTransaction={walletTransaction}
              setSingleTransaction={setWalletTransaction}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSoldModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSoldSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewMobilesList;
