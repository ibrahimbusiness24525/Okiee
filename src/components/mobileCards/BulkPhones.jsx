import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';
import bulkMobileImage from "../../assets/images/phoneBoxes.jpg"
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import useScanDetection from 'use-scan-detection';
import BarcodeReader from 'components/BarcodeReader/BarcodeReader';
import { api } from '../../../api/api';
import List from '../List/List'
import Table from 'components/Table/Table';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import PurchasePhone from 'layouts/AdminLayout/PurchasePhone/PurchasePhone';
import { toast } from 'react-toastify';

const NewMobilesList = () => {
  const [imei, setImei] = useState([]);
  const [imeiList, setImeiList] = useState([]);
  const [search, setSearch] = useState("");
  const [mobiles, setMobiles] = useState([]);
  const[bankName,setBankName]= useState("");
  const[payableAmountNow,setPayableAmountNow]= useState("")
  const[payableAmountLater,setPayableAmountLater]= useState("");
  const[payableAmountLaterDate,setPayableAmountLaterDate]=useState("");
  const[exchangePhoneDetail,setExchangePhoneDetail]= useState("");
  const [type, setType] = useState("");
  const[cnicFrontPic,setCnicFrontPic]= useState("");
  const[cnicBackPic,setCnicBackPic]= useState("");
  const[sellingType,setSellingType]= useState("")
  const[accessoryName,setAccessoryName] = useState("");
  const[accessoryPrice,setAccessoryPrice]= useState(0);
  const [accessories, setAccessories] = useState([
    { name: "", quantity: 1, price: "" }
  ]);
  const[customerNumber,setCustomerNumber]= useState("");
  const [bulkMobile, setBulkMobiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMobile, setEditMobile] = useState(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldMobile, setSoldMobile] = useState(null);
  const[customerName,setCustomerName] = useState("");
  const [finalPrice, setFinalPrice] = useState('');
  const [warranty, setWarranty] = useState('12 months');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMobileId, setDeleteMobileId] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchMobile, setDispatchMobile] = useState(null);
  const [shopName, setShopName] = useState('');
  const [id, setId] = useState('');
  const [personName, setPersonName] = useState('');
  const [imeiInput, setImeiInput] = useState(""); // Input field for new IMEI
  const [addedImeis, setAddedImeis] = useState([]);
  const[bulkData,setBulkData]= useState([])
    const[list,setList]= useState(true)
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
    console.log("required id", user._id);
    
    // const response = await axios.get(BASE_URL + `api/phone/getAllPhones/${user._id}`);
    const response = await api.get("/api/Purchase/purchase-phone")
    console.log("this is the response of single mobile",response);
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
      console.log("deleteMobileId",deleteMobileId);
      if(type === "bulk"){
        await api.delete(`/api/Purchase/purchase-bulk/delete/${deleteMobileId}`);
      }else{
        await api.delete(`/api/Purchase/purchase-phone/delete/${deleteMobileId}`);
      }
      setMobiles((prevMobiles) => prevMobiles.filter((mobile) => mobile._id !== deleteMobileId));
      console.log('Phone deleted successfully');
    } 
    catch (error) {
      console.error('Error deleting phone:', error);
    } 
    finally {
      setShowDeleteModal(false);
    }

  };

  const handleDispatchClick = (mobile) => {
    const imeiList = mobile?.ramSimDetails
    ?.filter((ramSim) => 
      ramSim.imeiNumbers && ramSim.imeiNumbers.some(imei => imei.isDispatched === false) // Only include if any IMEI is not dispatched
    )
    .flatMap((ramSim) => {
      if (!ramSim.imeiNumbers) return [];
      return ramSim.imeiNumbers
        .filter((imei) => imei.isDispatched === false) // Only keep IMEIs where isDispatched is false
        .map((imei) =>
          imei.imei2
            ? `${imei.imei1} / ${imei.imei2}` // Show both if imei2 exists
            : imei.imei1 // Otherwise, just imei1
        );
    }) || [];
    setImeiList(imeiList); // 
    setId(mobile._id)
    setDispatchMobile(mobile);
    setShowDispatchModal(true);

    console.log("Bulk Id", id);
  };
  console.log('====================================');
  console.log("these are selected imeis",imei);
  console.log('====================================');

  const handleDispatchSubmit = async() => {
    try{
    if (!shopName || !personName) {
      alert('Please fill all fields');
      return;
    }
    console.log("selected imeis", imei)
    const response = await api.patch(`/api/Purchase/bulk-purchase-dispatch/${id}`, {
      shopName,
      receiverName: personName,
      ...(imei.length > 0 && {
        imeiArray: imei.map(i => {
          const [imei1, imei2] = i.split(' / ').map(part => part.trim());
          return { imei1, imei2 };
        })
      })
    });
    
    setShopName('');
    setPersonName('');
    setShowDispatchModal(false);
    getBulkPhones()
    console.log("Dispatch response", response);
    toast.success("Dispatch is created successfully")
  }catch(error){
    console.log("Error in creating a dispatch",error)
  }
  };
  
  
  const handleEdit = (mobile) => {
    console.log("This is mobile to be edit", mobile);
    
    setEditMobile(mobile);
    setShowModal(true);
  };
  const getBulkPhones = async() =>{
    try{
      const response =  await api.get("/api/Purchase/bulk-phone-purchase");
      setBulkData(response.data)
      setBulkMobiles(response.data.filter((item) => 
        item.ramSimDetails?.some((ramSim) =>
          ramSim.imeiNumbers?.some((imei) => 
            imei.imei1?.includes(searchTerm) || imei.imei2?.includes(searchTerm)
    )
        )
      ));
      console.log("bulk record response",response);
    }catch(error){
      console.log("error in getting bulk mobiles", error);
    }
  }
  useEffect(()=>{
    setBulkMobiles(bulkData.filter((item) => 
      item.ramSimDetails?.some((ramSim) =>
        ramSim.imeiNumbers?.some((imei) => 
          imei.imei1?.includes(searchTerm) || imei.imei2?.includes(searchTerm)
  )
)
    ));
  },[searchTerm])
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSoldClick = (mobile,type) => {
    console.log("this is type", type);
    
    if(type==="bulk"){
      setType("bulk")
      const imeiList = mobile?.ramSimDetails
      ?.filter((ramSim) => 
        ramSim.imeiNumbers && ramSim.imeiNumbers.some(imei => imei.isDispatched === false) // Only include if any IMEI is not dispatched
      )
      .flatMap((ramSim) => {
        if (!ramSim.imeiNumbers) return [];
        return ramSim.imeiNumbers
          .filter((imei) => imei.isDispatched === false) // Only keep IMEIs where isDispatched is false
          .map((imei) =>
            imei.imei2
              ? `${imei.imei1} / ${imei.imei2}` // Show both if imei2 exists
              : imei.imei1 // Otherwise, just imei1
          );
      }) || [];
      
   
      
      
      setImeiList(imeiList); // 
    }
    if(type==="single"){
      setType("single")
    }
    
    setSoldMobile(mobile);
    setShowSoldModal(true);
  };
  console.log(imei);

  const handleSoldSubmit = async () => {
    if (!finalPrice || !warranty) {
      alert('Please fill all fields');
      return;
    }
    
    const updatedMobile = {
      ...soldMobile,
      finalPrice,
      sellingType,
      warranty,
      addedImeis,
      cnicBackPic,
      cnicFrontPic,
      customerName,
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
  
  const handleShareInventory = () => {
    const doc = new jsPDF();
    doc.text('Mobile Inventory', 10, 10);
    
    mobiles.forEach((mobile, index) => {
      const { images, companyName, modelSpecifications , specs, color } = mobile;
      const imgData = `data:image/jpeg;base64,${images[0]}`;
      const y = 20 + index * 50;
      
      if (imgData) {
        doc.addImage(imgData, 'JPEG', 10, y, 30, 30);
      }
      doc.text(`Company: ${companyName}`, 50, y + 5);
      doc.text(`Model: ${modelSpecifications}`, 50, y + 15);
      doc.text(`Specification: ${specs}`, 50, y + 25);
      doc.text(`Color: ${color}`, 50, y + 35);
    });

    doc.save('Mobile_Inventory.pdf');
  };
  const filteredMobiles = mobiles?.filter((mobile) => {
    // Exclude sold phones
    if (mobile.isSold) return false;
    if(mobile.phoneCondition==="Used") return false
    if(mobile.imei1.includes(searchTerm) || mobile.imei2.includes(searchTerm)) return true
    
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
  
  console.log(mobiles);
  useEffect(()=>{
    getBulkPhones()
  },[])
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
const[barcodeScan,setBarcodeScan] = useState("No Barcode Scanned")
useScanDetection({
  onComplete:setBarcodeScan,
  minLength:3,
})

const handleShowPrices = (mobile) => {
  setSelectedMobile(mobile);
    setShowPrices(true);
  };
  
  const handleClosePrices = () => {
    setShowPrices(false);
    setSelectedMobile(null);
  };
  console.log("bulk Mobile",bulkMobile);
  const handleBulkDelete = (id) =>{
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
  console.log("bulk mobile",bulkMobile);
  const totalBulkStockAmount = bulkMobile.reduce((total,mobile)=>total+(Number(mobile?.prices?.buyingPrice) || 0),0)
  console.log("total stock amount",totalBulkStockAmount);
  const handleChange = (event) => {
    const selectedImeis = event.target.value; 
    setImei(selectedImeis); 
    
    setAddedImeis((prevImeis) => Array.from(new Set([...prevImeis, ...selectedImeis]))); // Ensure uniqueness

    // setAddedImeis((prevImeis) => [...new Set([...prevImeis, ...selectedImeis])]); 
  };
  
  console.log("this is imei", imei,"these are added", addedImeis);
  
  
  console.log("These are the  imeis",imeiList)
  const totalImeisArray = bulkData.map((bulk) => {
    // Sum the length of imeiNumbers for each ramSimDetails in the bulk data
    return bulk.ramSimDetails.reduce((total, ramSim) => {
      return total + ramSim.imeiNumbers.length; // Adds the number of imei entries for each ramSim
    }, 0); // Starts the count from 0
  });
  
  console.log(totalImeisArray); // This will give you an array with the total IMEI count for each mobile
  const groupedByParty = bulkMobile.reduce((acc, curr) => {
    const partyName = curr.partyName || "Unknown";
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
      if (entry.purchasePaymentType === "credit" && entry.creditPaymentData) {
        now += Number(entry.prices.buyingPrice || 0);
        later += Number(entry.creditPaymentData.payableAmountLater || 0);
      } else if (entry.purchasePaymentType === "full-payment") {
        now += Number(entry.prices?.buyingPrice || 0);
      }
    });

    return { now, later };
  };
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
      

      <div className="d-flex justify-content-between align-items-center mb-3">
   {/* Total Stock Amount */}
   <div>
    <h5 style={{fontSize: 30}}>
      {/* Total Stock Amount:  */}
      Total Stock Amount : 
      <span style={{ fontWeight: 'bold', color: '#007bff' , fontSize: 30 }}>
         {totalBulkStockAmount}
      </span>
    </h5>
  </div>

  {/* Share Inventory Button */}
  <Button
     variant="primary"
     onClick={handleShareInventory}
     style={{ backgroundColor: '#007bff', border: 'none' }}
   >
     Share Inventory
   </Button>

</div>
<button
  onClick={() => setList(!list)}
  style={{
    padding: "10px 16px",
    backgroundColor: "#2563EB",
    color: "white",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1E40AF")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
>
  Change Record Design
</button>

      
      <h3 style={{marginTop:"5rem",marginBottom:"1rem",}}>New Bulk Phones</h3>
      {list?
    <>
    
    {Object.entries(groupedByParty).map(([partyName, partyData]) => {
        const { now, later } = calculatePayables(partyData);

        return (
          <div key={partyName} style={{ marginBottom: "2rem" }}>
           <StyledHeading>{partyName}</StyledHeading>
              <p style={{ 
                      margin: "0 0 1.5rem 0", 
                      color: "#444", 
                      fontSize: "1.1rem", 
                      lineHeight: "1.6" 
                    }}>
                      <strong style={{ fontSize: "1.2rem" }}>Paid Amount:</strong>{" "}
                      <span style={{ 
                        color: "green", 
                        fontWeight: "700", 
                        fontSize: "1.2rem" 
                      }}>
                        {now.toLocaleString()} PKR
                      </span>{" "}
                      |{" "}
                      <strong style={{ fontSize: "1.2rem" }}>Remaining Amount:</strong>{" "}
                      <span style={{ 
                        color: "red", 
                        fontWeight: "700", 
                        fontSize: "1.2rem" 
                      }}>
                        {later.toLocaleString()} PKR
                      </span>
                    </p>
            <Table
              routes={["/app/dashboard/bulkPhoneDetail"]}
              array={partyData.filter((record)=> record.dispatch === false)}
              keysToDisplay={["partyName", "actualBuyingPrice","prices","creditPaymentData","status", "ramSimDetails","purchasePaymentType"]}
              label={["Party Name", "Buying Price","Payable Amount","Remaining Amount","Status", "Quantity","Payment Type", "Actions"]}
              customBlocks={[
                
                {
                  index: 1,
                  component: (buyingPrice) => {
                  
                    return <span>{buyingPrice || "Not mentioned"}</span>;
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
                        {prices?.buyingPrice || "Not mentioned"}
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
                      color: hasAmount ? '#991b1b' : '#065f46',           // red or green text
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      fontSize: '14px',
                      display: 'inline-block',
                    };
                
                    return (
                      <span style={style}>
                        {hasAmount || "Not Remaining"}
                      </span>
                    );
                  },
                },
                
                
                {
                  index: 5,
                  component: (ramSimDetails) => {
                    const totalImeiNumbers = ramSimDetails.reduce((total, ramSim) => {
                      const imeis = Array.isArray(ramSim.imeiNumbers)
                        ? ramSim.imeiNumbers.filter(imei => imei.isDispatched === false)
                        : [];
                      return total + imeis.length;
                    }, 0);
                
                    return <span>{totalImeiNumbers}</span>;
                  },
                },
                
                {
                  index: 6,
                  component: (purchasePaymentType) => {
                    return (
                      <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                        {purchasePaymentType === "full-payment" ? (
                          <span style={{ color: "green" }}>Full Payment</span>
                        ) : (
                          <span style={{ color: "orange" }}>Partial Payment</span>
                        )}
                      </span>
                    );
                  },
                }
                
              ]}
              extraColumns={[
                (obj) => (
                  <>
                      <div>
               
                 </div>
                  <Button
                    onClick={() => handleSoldClick(obj, "bulk")}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Sold
                  </Button>
                  <Button
                    onClick={() => handleEdit(obj)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
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
    :
    <>
    <Row xs={1} md={2} lg={3} className="g-4">
      {bulkMobile.length > 0 ? (
        bulkMobile
        .filter((record)=> record.dispatch === false)
        .map((mobile) => (
          <Col key={mobile._id}>
            <Card className="h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden', position: 'relative' }}>
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

              <Card.Body style={{ padding: '1.5rem', display: 'flex',justifyContent:"left",alignItems:"start", flexDirection: 'column',width:"100%" }}>
                <Card.Title style={{ fontSize: '1.4rem', fontWeight: '600', color: '#333' }}>
                  {mobile?.companyName || 'No Company Name'} {mobile?.modelName || 'No Model Name'}
                </Card.Title>

                {/* Bulk Mobile Details */}
                <Card.Text style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
                  <div>
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Party Name:</strong> {mobile?.partyName || 'Not Available'}
                  </div>
                  <div>
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Date:</strong> {mobile?.date ? new Date(mobile?.date).toLocaleDateString() : 'Not Available'}
                  </div>

                  <div >
                    <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>Price:</strong>
                    <p>Total Buying Price :
                       {mobile.prices?.buyingPrice }
                       {/* {getActualPrice(mobile?.prices)} */}
                       </p>
                    <Button
                       onClick={() => handleShowPrices(mobile)}
                       style={{
                         backgroundColor: '#3f4d67',
                         color: '#fff',
                         border: 'none',
                         width:"100%",
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

                  {/* RAM & SIM Options - Dropdowns */}
                  {mobile?.ramSimDetails?.length > 0 ? (
                    <div>
                      <div style={{marginBottom:"20px"}}></div>
                      <strong style={{ color: '#333', fontSize: '1.1rem', fontWeight: '600', }}>RAM and SIM Options:</strong>
                      <div style={{marginBottom:"10px"}}></div>
                      {mobile?.ramSimDetails?.map((ramSim) => (
                         <div
                           key={ramSim._id}
                           style={{
                             border: "1px solid #ddd",
                             padding: "10px",
                             borderRadius: "8px",
                             marginBottom: "20px",
                             backgroundColor: "#f9f9f9",
                             boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                           }}
                         >
                           <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px" }}>
                             RAM Memory: {ramSim?.ramMemory || "Not Available"} GB
                           </div>

                           <div style={{ fontSize: "14px", marginBottom: "5px" }}>
                             <strong>SIM Option:</strong> {ramSim?.simOption || "Not Available"}
                           </div>
                         
                           <div style={{ display: "flex", alignItems: "center", fontSize: "14px", marginBottom: "5px" }}>
                             <strong style={{ marginRight: "5px" }}>Quantity:</strong>
                             <span>
                               {ramSim?.imeiNumbers?.length > 0 ? `${ramSim.imeiNumbers.length}` : "No stock available"}
                             </span>
                           </div>
                         
                           {ramSim.priceOfOne && (
                             <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
                               Per Piece Price: <span style={{ color: "#007bff" }}>{ramSim.priceOfOne}</span>
                             </div>
                           )}
                           {ramSim.priceOfOne && (
                             <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
                               Total Amount: <span style={{ color: "#007bff" }}>{ramSim.priceOfOne * ramSim.imeiNumbers.length}</span>
                             </div>
                           )}
                         </div>
                        ))}

                    </div>
                  ) : (
                    <div>RAM and SIM Options: Not Available</div>
                  )}
                </Card.Text>

                {/* Action Buttons */}
              </Card.Body>
                <div style={{ textAlign: 'right', width: '100%',padding: '1.5rem' }}>
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
      )}

      {/* Modal for Prices */}
      <Modal show={showPrices} onHide={handleClosePrices}>
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
    </Row>
    
    </> 
    }
      {/* <AddPhone modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} /> */}
      <PurchasePhone type="edit" bulkEdit={true}  modal={showModal} editMobile={editMobile} handleModalClose={() => setShowModal(false)} />
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
      <Form.Group style={{ width: '100%' }}>
  <InputLabel>IMEI</InputLabel>
  <Select
    value={imei}
    onChange={handleChange}
    displayEmpty
    multiple
    fullWidth
    placeholder={"Select Mobile imeis"}
  >
    {imeiList
      .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
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
                    placeholder="Enter Customer Number"
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
               
                <div>
      {accessories.map((accessory, index) => (
        <div key={index} className="mb-3 p-3 border rounded">
          <Form.Group>
            <Form.Label>Accessory Name</Form.Label>
            <Form.Control
              type="text"
              value={accessory.name}
              onChange={(e) => handleAccessoryChange(index, "name", e.target.value)}
              placeholder="Enter accessory name"
            />
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
       <Button variant="primary" onClick={addAccessory} style={{marginBottom:"20px"}}>
        Add Another Accessory
      </Button>
     <FormControl fullWidth variant="outlined" className="mb-3">
      {/* Search Field Inside Dropdown */}
      {/* <MenuItem onMouseDown={(e) => e.stopPropagation()}>
        <TextField
          value={search}
          placeholder="Search IMEI..."
          size="small"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
      </MenuItem> */}

      {/* Filtered IMEI Options */}
      {/* {imeiList
        .filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        )
        .map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))} */}
      <InputLabel>IMEI</InputLabel>
<Select value={imei} onChange={handleChange} displayEmpty multiple>
  {imeiList
    .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
    .map((item, index) => (
      <MenuItem key={index} value={item}>
        {item}
      </MenuItem>
    ))}
</Select>
    </FormControl>
     
    </div>
            <Form.Group>
                <Form.Label>Selling Type</Form.Label>
                <Form.Select
                  as="select"
                  value={sellingType}
                  onChange={(e) => setSellingType(e.target.value)}
                >
                  <option value="">Select Selling Type</option>
                  <option value="Bank">Bank</option>
                  <option value="Exchange">Exchange</option>
                  <option value="Cash">Cash</option>
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
               {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                <BarcodeReader />
              </div> */}

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
