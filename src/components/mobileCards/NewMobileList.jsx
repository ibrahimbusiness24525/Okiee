import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import { ClipLoader, MoonLoader, PulseLoader } from "react-spinners";
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import bulkMobileImage from "../../assets/images/phoneBoxes.jpg"
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import useScanDetection from 'use-scan-detection';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';
import List from '../List/List'
import Table from 'components/Table/Table';
import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
import { toast } from 'react-toastify';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
import { useGetAccessories } from 'hooks/accessory';
import { Eye, EyeOff } from 'lucide-react';
import { DetailRow } from 'components/DetailItem';
const NewMobilesList = () => {
  const { data } = useGetAccessories()
  const [showWalletTransactionModal, setShowWalletTransactionModal] = useState(false)
  const [walletTransaction, setWalletTransaction] = useState({
    bankAccountUsed: "",
    amountFromBank: "",
    amountFromPocket: "",
  })

  const [mobiles, setMobiles] = useState([]);
  const [bankName, setBankName] = useState("");
  const [payableAmountNow, setPayableAmountNow] = useState("")
  const [payableAmountLater, setPayableAmountLater] = useState("");
  const [payableAmountLaterDate, setPayableAmountLaterDate] = useState("");
  const [exchangePhoneDetail, setExchangePhoneDetail] = useState("");
  const [type, setType] = useState("");
  const [cnicFrontPic, setCnicFrontPic] = useState("");
  const [cnicBackPic, setCnicBackPic] = useState("");
  const [sellingType, setSellingType] = useState("")
  const [accessoryName, setAccessoryName] = useState("");
  const [accessoryPrice, setAccessoryPrice] = useState(0);
  const [saleDate, setSaleDate] = useState("")
  const [accessories, setAccessories] = useState([
    { id: "", name: "", quantity: 1, price: "" }
  ]);
  const [customerNumber, setCustomerNumber] = useState("");
  const [bulkMobile, setBulkMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMobile, setEditMobile] = useState(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldMobile, setSoldMobile] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [finalPrice, setFinalPrice] = useState('');
  const [warranty, setWarranty] = useState('12 months');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMobileId, setDeleteMobileId] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchMobile, setDispatchMobile] = useState(null);
  const [shopName, setShopName] = useState('');
  const [personName, setPersonName] = useState('');
  const [imeiInput, setImeiInput] = useState(""); // Input field for new IMEI
  const [addedImeis, setAddedImeis] = useState([]);
  const [id, setId] = useState("");
  const [bulkData, setBulkData] = useState([])
  const [list, setList] = useState(false)
  const [includeSold, setIncludeSold] = useState(false)
  const navigate = useNavigate();


  const handleAddImei = () => {
    if (imeiInput.trim() !== "" && !imeis.includes(imeiInput)) {
      setAddedImeis([...addedImeis, imeiInput]);
      setImeiInput(""); // Clear input after adding
    }
  };

  const handleRemoveImei = (imeiToRemove) => {
    setAddedImeis(imeis.filter(imei => imei !== imeiToRemove));
  };

  useEffect(() => {
    getMobiles();
  }, []);

  const getMobiles = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // const response = await axios.get(BASE_URL + `api/phone/getAllPhones/${user._id}`);
    const response = await api.get("/api/Purchase/purchase-phone")
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
      if (type === "bulk") {
        await api.delete(`/api/Purchase/purchase-bulk/delete/${deleteMobileId}`);
      } else {
        await api.delete(`/api/Purchase/purchase-phone/delete/${deleteMobileId}`);
      }
      setMobiles((prevMobiles) => prevMobiles.filter((mobile) => mobile._id !== deleteMobileId));
    }
    catch (error) {
      console.error('Error deleting phone:', error);
    }
    finally {
      setShowDeleteModal(false);
    }

  };


  const handleDispatchClick = (mobile) => {
    setId(mobile._id)
    setDispatchMobile(mobile);
    setShowDispatchModal(true);

  };

  const handleDispatchSubmit = async () => {
    try {
      if (!shopName || !personName) {
        alert('Please fill all fields');
        return;
      }
      const response = await api.patch(`/api/Purchase/single-purchase-dispatch/${id}`,
        {
          shopName,
          receiverName: personName,
        }
      )
      setShopName('');
      setPersonName('');
      setShowDispatchModal(false);
      getMobiles()
      toast.success("Dispatch is created successfully")
    } catch (error) {
    }
  };

  const handleEdit = (mobile) => {
    setEditMobile(mobile);
    setShowModal(true);
  };
  const getBulkPhones = async () => {
    try {
      const response = await api.get("/api/Purchase/bulk-phone-purchase");
      setBulkData(response.data)
      setBulkMobiles(response.data.filter((item) =>
        item.ramSimDetails?.some((ramSim) =>
          ramSim.imeiNumbers?.some((imei) =>
            imei.imei1?.includes(searchTerm) || imei.imei2?.includes(searchTerm)
          )
        )
      ));
    } catch (error) {
    }
  }
  useEffect(() => {
    setBulkMobiles(bulkData.filter((item) =>
      item.ramSimDetails?.some((ramSim) =>
        ramSim.imeiNumbers?.some((imei) =>
          imei.imei1?.includes(searchTerm) || imei.imei2?.includes(searchTerm)
        )
      )
    ));
  }, [searchTerm])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSoldClick = (mobile, type) => {

    if (type === "bulk") {
      setType("bulk")
    }
    if (type === "single") {
      setType("single")
    }

    setSoldMobile(mobile);
    setShowSoldModal(true);
  };

  const handleSoldSubmit = async () => {
    if (!warranty || !customerName || !customerNumber || !saleDate || sellingType === "" || !finalPrice) {
      alert('Please fill all fields');
      return;
    }

    const updatedMobile = {
      ...soldMobile,
      walletTransaction,
      finalPrice,
      sellingType,
      warranty,
      addedImeis,
      cnicBackPic,
      cnicFrontPic,
      saleDate,
      customerName,
      // accessoryName,
      // accessoryPrice,
      accessories,
      bankName,
      payableAmountNow,
      payableAmountLater,
      payableAmountLaterDate,
      exchangePhoneDetail,
      customerNumber,
    };

    navigate('/invoice/shop', { state: updatedMobile });
    setFinalPrice('');
    setShowSoldModal(false);
  };

  const confirmDelete = (mobileId) => {
    setDeleteMobileId(mobileId);
    setShowDeleteModal(true);
    setType("single");
  };



  const filteredMobiles = mobiles?.filter((mobile) => {
    // Respect legacy and new status flags, but allow including sold when toggled
    if (!includeSold && (mobile?.status === 'Sold' || mobile?.isSold)) return false;
    if (mobile.phoneCondition === "Used") return false
    if (mobile.imei1.includes(searchTerm) || mobile.imei2.includes(searchTerm)) return true

    // Split the search term into words
    const searchWords = searchTerm?.toLowerCase()?.split(/\s+/);

    return searchWords.every((word) =>
      // Check if each word exists in any of the searchable fields
      mobile.companyName?.toLowerCase()?.includes(word) ||
      mobile.modelSpecifications?.toLowerCase()?.includes(word) ||
      mobile.specs?.toLowerCase()?.includes(word) ||
      mobile.color?.toLowerCase()?.includes(word) || // Example: Searching by color if needed
      String(mobile.purchasePrice)?.includes(word)  // Example: Searching by price if needed
    );
  });

  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    getBulkPhones()
    // const uniqueCompaniesMap = new Map();

    //   filteredMobiles
    //     .filter((record) => record.dispatch === false)
    //     .forEach((record) => {
    //       const normalizedName = record.companyName.trim().toLowerCase();
    //       if (!uniqueCompaniesMap.has(normalizedName)) {
    //         uniqueCompaniesMap.set(normalizedName, record.companyName); // preserve original casing
    //       }
    //     });

    //   const uniqueCompanies = Array.from(uniqueCompaniesMap.values());

    //   setCompanies(uniqueCompanies);
  }, [])
  //   useEffect(() => {
  //   if (!filteredMobiles || filteredMobiles.length === 0) return;

  //   const uniqueCompaniesMap = new Map();

  //   filteredMobiles
  //     .filter((record) => record.dispatch === false)
  //     .forEach((record) => {
  //       const normalizedName = record.companyName.trim().toLowerCase();
  //       if (!uniqueCompaniesMap.has(normalizedName)) {
  //         uniqueCompaniesMap.set(normalizedName, record.companyName.trim());
  //       }
  //     });

  //   const uniqueCompanies = Array.from(uniqueCompaniesMap.values());
  //   setCompanies(uniqueCompanies);
  // }, [filteredMobiles,]);

  const updatedFilteredMobiles = useMemo(() => {
    return filteredMobiles.filter(record => includeSold ? true : record.dispatch === false);
  }, [filteredMobiles, includeSold]);
  useEffect(() => {
    if (!updatedFilteredMobiles || updatedFilteredMobiles.length === 0) return;

    const uniqueCompaniesMap = new Map();

    updatedFilteredMobiles.forEach((record) => {
      const normalizedName = record.companyName.trim().toLowerCase();
      if (!uniqueCompaniesMap.has(normalizedName)) {
        uniqueCompaniesMap.set(normalizedName, record.companyName.trim());
      }
    });

    const uniqueCompanies = Array.from(uniqueCompaniesMap.values());

    // Only update if companies have changed
    if (JSON.stringify(companies) !== JSON.stringify(uniqueCompanies)) {
      setCompanies(uniqueCompanies);
    }
  }, [filteredMobiles]);


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
  const [barcodeScan, setBarcodeScan] = useState("No Barcode Scanned")
  useScanDetection({
    onComplete: setBarcodeScan,
    minLength: 3,
  })

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
    setType("bulk");
    setShowDeleteModal(true);
  }
  const handleAccessoryChange = (index, field, value) => {
    const updatedAccessories = [...accessories];
    updatedAccessories[index][field] = value;
    setAccessories(updatedAccessories);
  };

  // Add New Accessory
  const addAccessory = () => {
    setAccessories([...accessories, { name: "", quantity: 1, price: "" }]);
  };

  // Remove Accessory
  const removeAccessory = (index) => {
    const updatedAccessories = accessories.filter((_, i) => i !== index);
    setAccessories(updatedAccessories);
  };

  const visibleMobiles = filteredMobiles
    .filter((record) => (includeSold ? true : record.dispatch === false))
    .filter((record) => {
      if (!selectedCompany) return true;
      const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '');
      return normalize(record.companyName) === normalize(selectedCompany);
    });


  const totalPurchasePrice = visibleMobiles.reduce(
    (total, mobile) => total + (Number(mobile.purchasePrice) || 0),
    0
  );


  const handleShareInventory = () => {
    const doc = new jsPDF();
    doc.text('Mobile Inventory', 10, 10);

    let y = 20;

    visibleMobiles.forEach((mobile, index) => {
      const { images, companyName, modelSpecifications, specs, color } = mobile;
      const imgData = `data:image/jpeg;base64,${images[0]}`;

      // Check if next item will exceed page height
      if (y + 50 > 280) {  // 280 leaves a margin from the bottom of A4
        doc.addPage();
        y = 20; // reset y for new page
      }

      if (imgData) {
        doc.addImage(imgData, 'JPEG', 10, y, 30, 30);
      }
      doc.text(`Company: ${companyName}`, 50, y + 5);
      doc.text(`Model: ${modelSpecifications}`, 50, y + 15);
      doc.text(`Specification: ${specs}`, 50, y + 25);
      doc.text(`Color: ${color}`, 50, y + 35);

      y += 50; // move y for the next entry
    });

    doc.save('Mobile_Inventory.pdf');
  };
  const [showAmount, setShowAmount] = useState(false)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
          <input id="includeSoldNew" type="checkbox" checked={includeSold} onChange={(e) => setIncludeSold(e.target.checked)} />
          <label htmlFor="includeSoldNew" style={{ userSelect: 'none' }}>Include Sold</label>
        </div>
      </InputGroup>
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {/* Enhanced "Show All" button */}
        <button
          onClick={() => setSelectedCompany(null)}
          style={{
            padding: "12px 24px",
            borderRadius: "25px",
            border: "none",
            background: selectedCompany === null
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            color: selectedCompany === null ? "#fff" : "#495057",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            letterSpacing: "0.5px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: selectedCompany === null
              ? "0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
            transform: selectedCompany === null ? "translateY(-2px)" : "translateY(0)",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            if (selectedCompany !== null) {
              e.target.style.background = "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.15)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCompany !== null) {
              e.target.style.background = "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
            }
          }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>Show All</span>
        </button>

        {companies.map((company, index) => {
          const isSelected = selectedCompany === company;
          return (
            <button
              key={index}
              onClick={() => setSelectedCompany(company)}
              style={{
                padding: "12px 24px",
                borderRadius: "25px",
                border: "none",
                background: isSelected
                  ? "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                color: isSelected ? "#fff" : "#495057",
                fontWeight: "600",
                fontSize: "14px",
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isSelected
                  ? "0 8px 25px rgba(86, 171, 47, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)"
                  : "0 2px 8px rgba(0, 0, 0, 0.08)",
                transform: isSelected ? "translateY(-2px)" : "translateY(0)",
                position: "relative",
                overflow: "hidden",
                border: isSelected ? "2px solid rgba(255, 255, 255, 0.3)" : "2px solid #e9ecef",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.target.style.background = "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.12)";
                  e.target.style.borderColor = "#dee2e6";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.target.style.background = "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                  e.target.style.borderColor = "#e9ecef";
                }
              }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>
                {company}
              </span>
              {/* Subtle shine effect for selected buttons */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                    animation: "shine 2s infinite",
                    zIndex: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Add this CSS animation if you want the shine effect */}
      <style jsx>{`
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`}</style>
      <div className="d-flex justify-content-between align-items-center mb-3" style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        border: "1px solid #dee2e6"
      }}>
        {/* Total Stock Amount Box */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          padding: "20px 25px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,123,255,0.1)",
          border: "2px solid #e3f2fd",
          minWidth: "350px"
        }}>
          <div>
            <h5 style={{
              fontSize: 28,
              margin: 0,
              color: "#2c3e50",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}>
              Total Stock Amount :
              <span style={{
                fontWeight: "bold",
                color: "#007bff",
                fontSize: 32,
                marginLeft: "8px",
                textShadow: "0 2px 4px rgba(0,123,255,0.2)"
              }}>
                {showAmount ? totalPurchasePrice : "••••••"}
              </span>
            </h5>
          </div>
          <button
            onClick={() => setShowAmount(!showAmount)}
            style={{
              background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
              border: "none",
              cursor: "pointer",
              color: "white",
              padding: "12px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
              width: "45px",
              height: "45px"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, #0056b3 0%, #004085 100%)";
              e.target.style.transform = "scale(1.15) rotate(5deg)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,123,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #007bff 0%, #0056b3 100%)";
              e.target.style.transform = "scale(1) rotate(0deg)";
              e.target.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)";
            }}
            title={showAmount ? "Hide amount" : "Show amount"}
          >
            {showAmount ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Stock Count Box */}
        <div style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          padding: "20px 30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,123,255,0.1)",
          border: "2px solid #e3f2fd",
          textAlign: "center",
          minWidth: "200px"
        }}>
          <h5 style={{
            fontSize: "1.8rem",
            margin: 0,
            color: "#2c3e50",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}>
            Stock: <span style={{
              fontWeight: "bold",
              color: "#007bff",
              fontSize: "2rem",
              textShadow: "0 2px 4px rgba(0,123,255,0.2)"
            }}>{visibleMobiles.length}</span>
            <span style={{ color: "#6c757d", fontSize: "1.4rem" }}>Mobile(s)</span>
          </h5>
        </div>

        {/* Share Inventory Button */}
        <Button
          variant="primary"
          onClick={handleShareInventory}
          style={{
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            border: "none",
            color: "white",
            padding: "15px 30px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "1.1rem",
            boxShadow: "0 6px 20px rgba(40,167,69,0.3)",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(135deg, #218838 0%, #1e7e34 100%)";
            e.target.style.transform = "translateY(-3px) scale(1.05)";
            e.target.style.boxShadow = "0 10px 30px rgba(40,167,69,0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = "0 6px 20px rgba(40,167,69,0.3)";
          }}
        >
          Share Inventory
        </Button>
      </div>
      <button
        onClick={() => setList(!list)}
        style={{
          padding: "14px 28px",
          background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
          color: "white",
          marginBottom: "24px",
          fontWeight: "600",
          fontSize: "14px",
          letterSpacing: "0.5px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transform: "translateY(0)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(59, 130, 246, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(59, 130, 246, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(1px)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.4), 0 2px 5px rgba(0, 0, 0, 0.2)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(59, 130, 246, 0.4), 0 6px 15px rgba(0, 0, 0, 0.15)";
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
          style={{ marginRight: "4px" }}
        >
          <path d="M3 3h18v18H3zM9 9h6v6H9z" />
        </svg>

        <span style={{ position: "relative", zIndex: 1 }}>
          Change Record Design
        </span>

        {/* Subtle shine effect overlay */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            transition: "left 0.6s ease",
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
      <h3 style={{ marginTop: "1rem", marginBottom: "1rem" }}>New Single Phones</h3>
      {!filteredMobiles.length > 0 ?
        <div className="w-full h-full flex items-center justify-center">
          <MoonLoader size={60} color="#3f4d67" />
        </div>
        :
        <>
          {list ?
            <>

              <Table
                array={filteredMobiles.filter((record) => {
                  if (record.dispatch !== false) return false;

                  if (!selectedCompany) return true;

                  const normalize = (str) =>
                    str.toLowerCase().replace(/\s+/g, "");

                  return (
                    normalize(record.companyName) === normalize(selectedCompany)
                  );
                })}
                keysToDisplay={["modelSpecifications", "companyName", "finalPrice", "phoneCondition", "warranty"]}
                label={[
                  "Model Name",
                  "Company Name",
                  "Final Price",
                  "Condition",
                  "Warranty",
                  "Actions",
                ]}

                extraColumns={[
                  (obj) =>
                    <Button
                      onClick={() => handleSoldClick(obj, "single")}
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
                ]}
              />

            </>
            :
            <>
              {/* <Row xs={1} md={2} lg={3} className="g-4">
                {filteredMobiles.length > 0 ? (
                  filteredMobiles
                    .filter((record) => record.dispatch === false)
                    .filter((record) => {
                      if (!selectedCompany) return true; // ✅ Show all if no company selected
                      const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '');
                      return normalize(record.companyName) === normalize(selectedCompany);
                    })

                    .map((mobile) => (
                      <Col key={mobile._id}>
                        <Card className="h-100 shadow border-0" style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                          <FaEdit
                            onClick={() => handleEdit(mobile)}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '50px',
                              color: '#28a745',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                            }}
                          />
                          <FaTrash
                            onClick={() => confirmDelete(mobile._id)}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              color: 'red',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                            }}
                          />
                          <Card.Body style={{ padding: '1rem', flexDirection: 'column' }}>
                            <Card.Title style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', width: '100%' }}>
                              {mobile.companyName} {mobile.modelSpecifications}
                            </Card.Title>
                            <Card.Text style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', width: '100%' }}>
                              <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>
                                  Specifications:
                                </strong>{' '}
                                {mobile.specs}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Color:</strong>{' '}
                                {mobile.color}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>{mobile.imei2 ? "imei 1" : "imei"}</strong>{' '}
                                {mobile.imei1}
                              </div>
                              {mobile.imei2 && <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>imei 2</strong>{' '}
                                {mobile.imei2}
                              </div>}
                              <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Battery Health:</strong>{' '}
                                {mobile.batteryHealth ? mobile.batteryHealth : 'N/A'}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Purchase Price:</strong>{' '}
                                {mobile.purchasePrice}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Demand Price:</strong>{' '}
                                {mobile.demandPrice}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', width: '100%' }}>Final Price:</strong>{' '}

                                {mobile.finalPrice || 'Not Sold'}
                              </div>
                            </Card.Text>
                            <div style={{ textAlign: 'right', width: '100%' }}>
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
                                // onClick={() => handleSoldClick(mobile)}
                                style={{
                                  backgroundColor: '#DE970B',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {mobile.warranty}
                              </Button>
                              <Button
                                // onClick={() => handleSoldClick(mobile)}
                                style={{
                                  backgroundColor: 'green',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {mobile.specs}
                              </Button>
                              <Button
                                onClick={() => handleSoldClick(mobile, "single")}
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
                          </Card.Body>
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
              </Row> */}
              <Row xs={1} md={2} lg={3} className="g-4">
                {filteredMobiles.length > 0 ? (
                  filteredMobiles
                    .filter(record => record.dispatch === false)
                    .filter(record => {
                      if (!selectedCompany) return true;
                      const normalize = str => str?.toLowerCase().replace(/\s+/g, '');
                      return normalize(record.companyName) === normalize(selectedCompany);
                    })
                    .map(mobile => (
                      <Col key={mobile._id}>
                        <Card style={{
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                          borderRadius: '5px',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          backgroundColor: '#fafafa'
                        }}>
                          {/* Card Header */}
                          <div style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #eee',
                            backgroundColor: '#f5f5f5',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  color: '#333',
                                  lineHeight: '1.2'
                                }}>
                                  {mobile.companyName}
                                </div>
                                <div style={{
                                  fontSize: '0.85rem',
                                  color: '#666',
                                  marginTop: '4px'
                                }}>
                                  {mobile.modelSpecifications}
                                </div>
                              </div>
                              <div style={{
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                whiteSpace: 'nowrap'
                              }}>
                                {mobile.specs}
                              </div>
                            </div>
                          </div>

                          {/* Card Body */}
                          <Card.Body style={{
                            padding: '16px',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'start'
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {/* Row 1: IMEIs */}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500',
                                  color: '#0056b3',
                                  flex: 1
                                }}>
                                  <span style={{ color: '#666', fontSize: '0.7rem', display: 'block' }}>IMEI 1</span>
                                  {mobile.imei1}
                                </div>

                                {mobile.imei2 && (
                                  <div style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    color: '#0056b3',
                                    flex: 1
                                  }}>
                                    <span style={{ color: '#666', fontSize: '0.7rem', display: 'block' }}>IMEI 2</span>
                                    {mobile.imei2}
                                  </div>
                                )}
                              </div>

                              {/* Row 2: Color & Battery */}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500',
                                  color: '#d97706',
                                  flex: 1
                                }}>
                                  <span style={{ color: '#666', fontSize: '0.7rem', display: 'block' }}>Color</span>
                                  {mobile.color}
                                </div>

                                <div style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500',
                                  color: '#065f46',
                                  flex: 1
                                }}>
                                  <span style={{ color: '#666', fontSize: '0.7rem', display: 'block' }}>Battery</span>
                                  {mobile.batteryHealth || 'N/A'}
                                </div>
                              </div>

                              {/* Row 3: Pricing */}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500',
                                  color: '#7e22ce',
                                  flex: 1
                                }}>
                                  <span style={{ color: '#666', fontSize: '0.7rem', display: 'block' }}>Purchase</span>
                                  {mobile.purchasePrice}
                                </div>

                                <div style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500',
                                  color: '#e11d48',
                                  flex: 1
                                }}>
                                  <span style={{ color: '#666', fontSize: '0.7rem', display: 'block' }}>Demand</span>
                                  {mobile.demandPrice}
                                </div>

                                <div style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500',
                                  color: mobile.finalPrice ? '#166534' : '#6b7280',
                                  flex: 1
                                }}>
                                  <span style={{ color: '#666', fontSize: '0.7rem', display: 'block' }}>Final</span>
                                  {mobile.finalPrice || 'Not Sold'}
                                </div>
                              </div>
                            </div>
                          </Card.Body>

                          {/* Card Footer - Action Buttons */}
                          <div style={{
                            padding: '12px 16px',
                            borderTop: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px'
                          }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <FaEdit
                                onClick={() => handleEdit(mobile)}
                                style={{
                                  color: '#5c6bc0',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem'
                                }}
                              />
                              <FaTrash
                                onClick={() => confirmDelete(mobile._id)}
                                style={{
                                  color: '#e53935',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem'
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleDispatchClick(mobile)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#fff',
                                  border: '1px solid #FFD000',
                                  color: '#FFD000',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  minWidth: '90px'
                                }}
                              >
                                Dispatch
                              </button>
                              <button
                                onClick={() => handleSoldClick(mobile, "single")}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#28a745',
                                  border: 'none',
                                  color: 'white',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  minWidth: '90px'
                                }}
                              >
                                Sold
                              </button>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))
                ) : (
                  <Col>
                    <Card style={{
                      textAlign: 'center',
                      padding: '20px',
                      backgroundColor: '#fafafa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px'
                    }}>
                      <Card.Body>
                        <Card.Text style={{ color: '#757575' }}>
                          No mobiles found
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </>
          }
        </>
      }

      {/* <h3 style={{marginTop:"5rem",marginBottom:"1rem",}}>New Bulk Phones</h3>
      {list?
    <> */}
      {/* <List items={bulkMobile}
      displayKeys={["modelName","companyName", "partyName","status"]}
      descriptions={["Model Name","Company Name","Party Price","Status",]}
      onRowClick={"handleClick"}
    /> */}
      {/* <Table
      routes={["/purchase/purchaseRecords"]}
           array={bulkMobile}
           search={"imei1"}
           keysToDisplay={["modelName", "companyName","partyName", "status", ]}
           label={[
               "Model Name",
               "Company Name",
               "Parth Name",
               "Status",
       
               "Actions",
           ]}
           
           extraColumns={[
             (obj) => <Button
             onClick={() => handleSoldClick(obj,"bulk")}
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
         ]}
       />

    </>  */}
      {/* : */}
      {/* <> */}
      {/* <Row xs={1} md={2} lg={3} className="g-4">
      {bulkMobile.length > 0 ? (
        bulkMobile.map((mobile) => (
          <Col key={mobile._id}>
            <Card className="h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden', position: 'relative' }}> */}
      {/* <FaEdit
                onClick={() => handleEdit(mobile)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '50px',
                  color: '#28a745',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                }}
              /> */}
      {/* <FaTrash
                onClick={() => handleBulkDelete(mobile._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                }}
              /> */}

      {/* Image handling */}
      {/* {mobile?.images?.[0] ? (
                <Card.Img
                  variant="top"
                  src={bulkMobileImage}
                  alt={`${mobile?.companyName} ${mobile?.modelName}`}
                  style={{ height: '350px', objectFit: 'cover', borderRadius: '10px' }}
                />
              ) : (
                <Card.Img
                  variant="top"
                  src={bulkMobileImage}  // Replace with your default image path
                  alt={bulkMobileImage}
                  style={{ height: '350px', objectFit: 'cover', borderRadius: '10px' }}
                />
              )} */}

      {/* <Card.Body style={{ padding: '1.5rem', display: 'flex',justifyContent:"left",alignItems:"start", flexDirection: 'column',width:"100%" }}>
                <Card.Title style={{ fontSize: '1.4rem', fontWeight: '600', color: '#333' }}>
                  {mobile?.companyName || 'No Company Name'} {mobile?.modelName || 'No Model Name'}
                </Card.Title> */}

      {/* Bulk Mobile Details */}
      {/* <Card.Text style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
                  <div>
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Party Name:</strong> {mobile?.partyName || 'Not Available'}
                  </div>
                  <div>
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Date:</strong> {mobile?.date ? new Date(mobile?.date).toLocaleDateString() : 'Not Available'}
                  </div>

                  <div >
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Prices:</strong>
                    <p>Final Price: {getActualPrice(mobile?.prices)}</p>
                    <Button
                       onClick={() => handleShowPrices(mobile)}
                       style={{
                         backgroundColor: '#3f4d67',
                         color: '#fff',
                         border: 'none',
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
                      </Button> */}

      {/* </div> */}

      {/* RAM & SIM Options - Dropdowns */}
      {/* {mobile?.ramSimDetails?.length > 0 ? (
                    <div>
                      <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>RAM and SIM Options:</strong>
                      {mobile?.ramSimDetails?.map((ramSim) => (
                        <div key={ramSim._id} style={{ marginBottom: '10px' }}>
                          <div><strong>RAM Memory:</strong> {ramSim?.ramMemory || 'Not Available'} GB</div>
                          <div><strong>SIM Option:</strong> {ramSim?.simOption || 'Not Available'}</div>
                          <div className='' style={{display:"flex"}}>
                            <strong>Quantity</strong>
                            <ul> */}
      {/* {ramSim?.imeiNumbers?.length > 0 ? 

                              (
                                ramSim?.imeiNumbers?.map((imei) => (
                                  <li key={imei._id}>IMEI 1: {imei?.imei1 || 'Not Available'}</li>
                                ))
                              )
                              : (
                                <li>No stock available</li>
                              )} */}
      {/* <p>{ramSim?.imeiNumbers?.length > 0 ? ` ${ramSim.imeiNumbers.length}` : "No stock available"}</p>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>RAM and SIM Options: Not Available</div>
                  )}
                </Card.Text> */}

      {/* Action Buttons */}
      {/* </Card.Body>
                <div style={{ textAlign: 'right', width: '100%',padding: '1.5rem' }}> */}
      {/* <Button
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
             </Button> */}
      {/* <Button
                      onClick={() => handleSoldClick(mobile,"bulk")}
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
      )} */}

      {/* Modal for Prices */}
      {/* <Modal show={showPrices} onHide={handleClosePrices}>
        <Modal.Header closeButton>
          <Modal.Title>Prices for {selectedMobile?.companyName} {selectedMobile?.modelName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li><strong>Buying Price:</strong> {selectedMobile?.prices?.buyingPrice || 'Not Available'}</li>
            <li><strong>Dealer Price:</strong> {selectedMobile?.prices?.dealerPrice || 'Not Available'}</li>
            <li><strong>LP:</strong> {selectedMobile?.prices?.lp || 'Not Available'}</li>
            <li><strong>Lifting:</strong> {selectedMobile?.prices?.lifting || 'Not Available'}</li>
            <li><strong>Promo:</strong> {selectedMobile?.prices?.promo || 'Not Available'}</li>
            <li><strong>Activation:</strong> {selectedMobile?.prices?.activation || 'Not Available'}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePrices}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Row> */}

      {/* </>  */}
      {/* } */}
      <PurchasePhone type="edit" modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} />
      {/* <AddPhone modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} /> */}

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

      <Modal show={showDispatchModal} onHide={() => setShowDispatchModal(false)}>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDispatchModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDispatchSubmit}>
            Dispatch
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Sold Modal */}
      <Modal show={showSoldModal} onHide={() => setShowSoldModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sell Mobile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <Form.Group className="mb-3">
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
              </Form.Group>
              <Form.Group controlId="saleDate">
                <Form.Label>Sale Date</Form.Label>
                <Form.Control
                  type="Date"
                  placeholder="Enter Sale Date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  required

                />
              </Form.Group>

              {/* CNIC Front Picture */}
              {/* <Form.Group className="mb-3">
                  <Form.Label>CNIC Front Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCnicFrontPic(e.target.files[0]?.name)}
                  />
                </Form.Group>

                
                <Form.Group className="mb-3">
                  <Form.Label>CNIC Back Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCnicBackPic(e.target.files[0])?.name}
                  />
                </Form.Group> */}

              {/* <div>
                {accessories.map((accessory, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <Form.Group>
                      <Form.Label>Accessory Name</Form.Label>
                      <Form.Select
                        value={accessory.name} // this holds the id now
                        onChange={(e) => handleAccessoryChange(index, "name", e.target.value)}
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
                        onChange={(e) => handleAccessoryChange(index, "quantity", e.target.value)}
                        min="1"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Accessory Price</Form.Label>
                      <Form.Control
                        type="number"
                        value={accessory.price}
                        onChange={(e) => handleAccessoryChange(index, "price", e.target.value)}
                        placeholder="Enter price"
                      />
                    </Form.Group>

                    <Button variant="secondary" className="mt-2" onClick={() => removeAccessory(index)}>
                      Remove
                    </Button>
                  </div>
                ))}

                <Button variant="primary" onClick={addAccessory}>
                  Add Another Accessory
                </Button>
              </div> */}
              <div>
                {accessories.map((accessory, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <Form.Group>
                      <Form.Label>Accessory Name</Form.Label>
                      <Form.Select
                        value={accessory.name} // holds ID
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedName = data?.data?.find(item => item._id === selectedId)?.accessoryName || "";

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
                        {data?.data?.filter(item => item.quantity > 0).map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.accessoryName} | Qty: {item.quantity} | Price: {item.perPiecePrice}
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
                        const updated = accessories.filter((_, i) => i !== index);
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
                      { id: "", name: "", quantity: 1, price: "" },
                    ])
                  }
                >
                  Add Another Accessory
                </Button>
              </div>

              <Form.Group>
                <Form.Label>Selling Type</Form.Label>
                <Form.Select
                  as="select"
                  value={sellingType}
                  onChange={(e) => setSellingType(e.target.value)}
                >
                  <option value="">Select Selling Type</option>
                  {/* <option value="Bank">Bank</option> */}
                  <option value="Exchange">Exchange</option>
                  <option value="Full Payment">Full Payment</option>
                  {/* <option value="Cash">Cash</option> */}
                  <option value="Credit">Credit</option>
                </Form.Select>
              </Form.Group>

              {/* Conditional Fields Based on Selling Type */}
              {sellingType === "Bank" && (
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

              {sellingType === "Credit" && (
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
                      onChange={(e) => setPayableAmountLaterDate(e.target.value)}
                    />
                  </Form.Group>
                </>
              )}

              {sellingType === "Exchange" && (
                <Form.Group>
                  <Form.Label>Exchange Phone Details</Form.Label>
                  <Form.Control
                    as={"textarea"}
                    rows={4} //
                    type="text"
                    placeholder="Enter exchange phone details"
                    value={exchangePhoneDetail}
                    onChange={(e) => setExchangePhoneDetail(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Sold Price</Form.Label>
                <Form.Control
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="Enter Sold price"
                />
              </Form.Group>
            </div>


            {type === "bulk" && (
              <>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                  <BarcodeReader />
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>IMEI Number</Form.Label>

                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={imeiInput}
                      onChange={(e) => setImeiInput(e.target.value)}
                      placeholder="Enter IMEI number"
                    />
                    <Button variant="success" onClick={handleAddImei} backgroundColor="linear-gradient(to right, #50b5f4, #b8bee2)" className="ms-2">
                      Add
                    </Button>
                  </div>
                </Form.Group>

                {/* Display added IMEIs */}
                {addedImeis.length > 0 && (
                  <div className="mt-3">
                    <h6>Added IMEIs:</h6>
                    <ul className="list-group">
                      {addedImeis.map((imei, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {imei}
                          <Button variant="danger" size="sm" onClick={() => handleRemoveImei(imei)}>
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

          </Form>
          <Button variant="secondary" onClick={() => setShowWalletTransactionModal(!showWalletTransactionModal)}>Proceed To Pay</Button>
          <WalletTransactionModal
            show={showWalletTransactionModal}
            toggleModal={() => setShowWalletTransactionModal(!showWalletTransactionModal)}
            singleTransaction={walletTransaction}
            setSingleTransaction={setWalletTransaction}
          />
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
