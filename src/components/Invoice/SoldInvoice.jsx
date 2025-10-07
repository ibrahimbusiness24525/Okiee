import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import { api } from '../../../api/api';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import { InvoiceComponent } from 'components/InvoiceComponent';
import { toast } from 'react-toastify';
import Modal from 'components/Modal/Modal';
import { SmallInvoiceComponent } from 'components/SmallInvoiceComponent';
import { BASE_URL } from 'config/constant';
import { StockListComponent } from 'components/StockInvoice';
const SoldInvoice = () => {
  const [selectedColor, setSelectedColor] = useState('#004B87');
  const [logoUrl, setLogoUrl] = useState(null);
  const [displayHalfP4, setDisplayHalfP4] = useState(false);
  const [showSmallInvoice, setShowSmallInvoice] = useState(false);
  const [originalInvoice, setOriginalInvoice] = useState(true);
  const colorOptions = [
    { name: 'Dark Blue', code: '#004B87' },
    { name: 'Sky Blue', code: '#87CEEB' },
    { name: 'Emerald Green', code: '#28a745' },
    { name: 'Bright Orange', code: '#fd7e14' },
    { name: 'Cherry Red', code: '#dc3545' },
    { name: 'Royal Purple', code: '#6f42c1' },
    { name: 'Golden Yellow', code: '#ffc107' },
    { name: 'Black', code: '#000000' },
    { name: 'Soft Grey', code: '#6c757d' },
    { name: 'Slate Grey', code: '#708090' },
    { name: 'Teal Tint', code: '#20c997' },
    { name: 'Lavender', code: '#b57edc' },
  ];
  const styles = {
    container: {
      width: '210mm',
      minHeight: 'auto',
      margin: '30px auto',
      padding: '30px',
      background: '#f9f9f9',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Poppins', sans-serif",
      color: '#333',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      paddingBottom: '1px',
      borderBottom: `3px solid  ${selectedColor}`,
      color: `${selectedColor}`,
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: `${selectedColor}`,
      letterSpacing: '1px',
    },
    infoSection: {
      marginBottom: '25px',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '30px',
    },
    th: {
      padding: '15px',
      backgroundColor: `${selectedColor}`,
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    td: {
      padding: '12px',
      textAlign: 'center',
      backgroundColor: '#fafafa',
      borderBottom: '1px solid #eee',
      color: '#333',
    },
    stripedRow: {
      backgroundColor: '#f4f4f4',
    },
    totalSection: {
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      textAlign: 'right',
      fontSize: '20px',
      fontWeight: 'bold',
      color: `${selectedColor}`,
    },
    button: {
      margin: '10px',
      padding: '12px 30px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    printBtn: {
      backgroundColor: '#28a745',
      color: '#fff',
    },
    downloadBtn: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    submitBtn: {
      backgroundColor: '#ffc107',
      color: '#fff',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    footer: {
      marginTop: '15px',
      paddingTop: '10px',
      borderTop: `3px solid  ${selectedColor}`,
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
    },
    termsSection: {
      marginTop: '30px',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      color: '#333',
    },
    termsHeading: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: `${selectedColor}`,
    },
    termsText: {
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '10px',
    },
  };

  // Fetch logo from API once
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/api/shop/logo');
        if (isMounted && res?.data?.success && res?.data?.logo) {
          const path = String(res.data.logo);
          const full = `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
          setLogoUrl(full);
        }
      } catch (_) {}
    })();
    return () => { isMounted = false; };
  }, []);

  const location = useLocation();
  const dataReceived = location?.state ?? {};
  const getValidDate = (inputDate) => {
    const date = new Date(inputDate);
    return isNaN(date.getTime())
      ? new Date().toISOString().split('T')[0] // fallback to today's date
      : date.toISOString().split('T')[0];
  };

  const [shop, setShop] = useState(null);
  const [price, setPrice] = useState(
    dataReceived.invoice?.totalAmount ??
    dataReceived?.finalPrice ??
    dataReceived?.demandPrice ??
    0
  );
  const [invoiceData, setInvoiceData] = useState({
    shopId: shop?.shopId ?? '',
    invoiceNumber:
      dataReceived?.invoice?.invoiceNumber ?? dataReceived.invoice
        ? dataReceived.invoice?.invoiceNumber
        : `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    invoiceDate: getValidDate(dataReceived?.invoice?.invoiceDate),

    items: dataReceived.invoice ? dataReceived.invoice?.items : [],
    totalAmount: dataReceived.invoice ? dataReceived.invoice?.totalAmount : 0,
    imei: dataReceived.imei,
    imei2: dataReceived.imei2 ?? '',
  });
  const getDetailByImei = async () => {
    try {
      const response = await api.get(
        `api/Purchase/getDetailByImei/${dataReceived.writtenImeis}`
      );
      setPhoneDetail(response?.data?.results);
      console.log('Response from getDetailByImei:', response);
    } catch (error) {
      console.error('Error fetching details by IMEI:', error);
    }
  };
  const [phoneDetail, setPhoneDetail] = useState();
  console.log('phoneDetail', phoneDetail);

  useEffect(() => {
    {
      dataReceived.writtenImeis?.length > 0 && getDetailByImei();
    }
    const shopData = localStorage.getItem('shop');
    if (shopData) {
      const parsedShop = JSON.parse(shopData);
      setShop(parsedShop);

      setInvoiceData((prevInvoiceData) => ({
        ...prevInvoiceData,
        shopId: parsedShop.shopId,
        totalAmount: price,
        items: [
          {
            mobileId: dataReceived._id,
            mobileName: dataReceived.modelSpecifications,
            mobileCompany: dataReceived.companyName,
            imei: dataReceived.imei,
            imei2: dataReceived.imei2 ?? '',
            warranty: '1 year',
            quantity: 1,
            invoiceNumber: invoiceData.invoiceNumber,
            purchaseAmount: dataReceived.purchasePrice,
          },
        ],
      }));
    }
  }, []);

  const handlePrint = () => {
    const printContents = document.getElementById('invoice').outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownload = () => {
    const element = document.getElementById('invoice');
    html2pdf().from(element).save('invoice.pdf');
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    setInvoiceData({
      ...invoiceData,
      totalAmount: newPrice,
    });
  };
  const [imeis, setImeis] = useState(
    dataReceived?.ramSimDetails?.flatMap((item) => item.imeiNumbers) || []
  );
  function formatPhoneNumber(number) {
    if (!number) return null;

    // Ensure number is a string before replacing
    const digitsOnly = String(number).replace(/\D/g, '');

    // If number is in international format (+923057903867)
    if (digitsOnly.startsWith('92')) {
      return '0' + digitsOnly.slice(2); // Convert +92 305... → 0305...
    }

    // If number already starts with 0 (assume correct local format)
    if (digitsOnly.startsWith('0')) {
      return digitsOnly; // Keep as-is (030...)
    }

    // If number doesn't start with 0 or 92 (unexpected format)
    return '0' + digitsOnly; // Fallback: prepend 0
  }
  const imeiOneList =
    (dataReceived?.addedImeis?.length !== 0 &&
      dataReceived?.addedImeis?.map((imei) => imei.split(' / ')[0])) ||
    [];

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (type) => {
    setLoading(true);
    if (
      dataReceived?.prices?.buyingPrice ||
      dataReceived?.bulkPhonePurchaseId
    ) {
      const payload = {
        imeisWithPrices: dataReceived?.imeisWithPrices,
        entityData: dataReceived?.entityData,
        bankAccountUsed: dataReceived?.walletTransaction?.bankAccountUsed,
        accountCash: Number(dataReceived?.walletTransaction?.amountFromBank),
        pocketCash: Number(dataReceived?.walletTransaction?.amountFromPocket),
        bulkPhonePurchaseId:
          dataReceived?.ramSimDetails?.[0]?.bulkPhonePurchaseId ||
          dataReceived?.bulkPhonePurchaseId, // Get from first object
        imeiNumbers:
          dataReceived?.addedImeis?.length === 0
            ? imeis.map((item) => item?.imei1) // Extract imei1 properly
            : imeiOneList,
        // : dataReceived?.addedImeis,
        salePrice: dataReceived?.finalPrice,
        totalInvoice,
        // salePrice: dataReceived?.finalPrice,
        warranty: dataReceived?.warranty,
        customerName: dataReceived?.customerName,
        dateSold: dataReceived?.saleDate,
        // customerNumber: dataReceived?.customerNumber,
        customerNumber: formatPhoneNumber(dataReceived?.customerNumber),

        cnicFrontPic: '/file',
        cnicBackPic: '/file',
        sellingPaymentType: dataReceived.sellingType,
        accessories: dataReceived?.accessories,
        // accesssoryName:dataReceived.accessoryName,
        // accesssoryAmount:Number(dataReceived.accessoryPrice),
        ...(dataReceived?.sellingType === 'Bank' && {
          bankName: dataReceived?.bankName,
        }),

        // Conditionally add credit fields if selling type is "Credit"
        ...(dataReceived?.sellingType === 'Credit' && {
          payableAmountNow: dataReceived?.payableAmountNow,
          payableAmountLater: dataReceived?.payableAmountLater,
          payableAmountLaterDate: dataReceived?.payableAmountLaterDate,
        }),

        // Conditionally add exchangePhoneDetail if selling type is "Exchange"
        ...(dataReceived?.sellingType === 'Exchange' && {
          exchangePhoneDetail: dataReceived?.exchangePhoneDetail,
        }),
      };
      try {
        const response = await api.post(`api/Purchase/sell-phone`, payload);
        // const response = await axios.post(BASE_URL + `api/Purchase/sell-phone`, payload,{
        //   "headers": {"Content-Type": "application/json"}
        // });

        if (response) {
          alert('Bulk invoice submitted successfully');
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        alert('Error in submitting bulk invoice: ' + error.message);
      }
    } else {
      try {
        const payload = {
          bankAccountUsed: dataReceived?.walletTransaction?.bankAccountUsed,
          accountCash: dataReceived?.walletTransaction?.amountFromBank,
          pocketCash: dataReceived?.walletTransaction?.amountFromPocket,
          purchasePhoneId: dataReceived._id,
          salePrice: Number(dataReceived.finalPrice),
          totalInvoice: Number(totalInvoice),
          warranty: dataReceived?.warranty,
          customerName: dataReceived?.customerName,
          saleDate: dataReceived?.saleDate,
          cnicFrontPic: '/file',
          cnicBackPic: '/file',
          purchasePrice: dataReceived?.purchasePrice,
          sellingPaymentType: dataReceived.sellingType,
          customerNumber: formatPhoneNumber(dataReceived?.customerNumber),
          accessories: dataReceived?.accessories,
          // accesssoryName:dataReceived.accessoryName,
          // accesssoryAmount:Number(dataReceived.accessoryPrice),
          ...(dataReceived?.sellingType === 'Bank' && {
            bankName: dataReceived?.bankName,
          }),

          // Conditionally add credit fields if selling type is "Credit"
          ...(dataReceived?.sellingType === 'Credit' && {
            payableAmountNow: dataReceived?.payableAmountNow,
            payableAmountLater: dataReceived?.payableAmountLater,
            payableAmountLaterDate: dataReceived?.payableAmountLaterDate,
          }),

          // Conditionally add exchangePhoneDetail if selling type is "Exchange"
          ...(dataReceived?.sellingType === 'Exchange' && {
            exchangePhoneDetail: dataReceived?.exchangePhoneDetail,
          }),
        };

        const response = await api.post(
          `api/Purchase/sell-single-phone`,
          payload
        );

        if (response) {
          alert('Invoice submitted successfully');
        }
      } catch (error) {
        alert('Error submitting invoice: ' + error.message);
      }
      // try {

      //   const response = await axios.post(BASE_URL + `api/invoice/invoices`, invoiceData);

      //   if (response) {
      //     alert('Invoice submitted successfully');
      //   }
      // } catch (error) {
      //   alert('Error submitting invoice: ' + error.message);
      // }
    }
  };

  const totalAccessoriesPrice = dataReceived?.accessories?.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const totalInvoice =
    Number(dataReceived.finalPrice || 0) + totalAccessoriesPrice;

  const addedImei1s =
    dataReceived?.addedImeis?.map((imeiPair) => {
      const [imei1] = imeiPair.split('/').map((imei) => imei.trim());
      return imei1;
    }) ?? [];

  console.log(
    'dataReceived',
    dataReceived,
    'totalInvoice',
    totalInvoice,
    'addedImei1s',
    addedImei1s
  );
  const whatsAppPhoneFormatter = (customerNumber) => {
    if (!customerNumber) return null;

    // 1. Remove all non-digit characters
    const digitsOnly = customerNumber.replace(/\D/g, '');

    // 2. Convert local format (0305...) to international (92305...)
    if (digitsOnly.startsWith('0')) {
      return '92' + digitsOnly.substring(1); // Remove leading 0, add 92
    }

    // 3. Handle numbers already in international format
    if (digitsOnly.startsWith('92')) {
      return digitsOnly; // Return as-is
    }

    // 4. Handle numbers without country code (305...)
    if (/^3\d{9}$/.test(digitsOnly)) {
      return '92' + digitsOnly; // Add 92 prefix
    }

    // 5. Return null for invalid numbers
    return null;
  };
  console.log(dataReceived);
  const handleSellAnyPhone = async () => {
    try {
      const payload = {
        // imeis: dataReceived.imei,
        entityData: dataReceived?.entityData,
        customerName: dataReceived?.customerName,
        customerNumber: dataReceived?.customerNumber,
         imeiPrices: dataReceived?.imeiPrices || [], // Array of {imei: '', price: ''} objects
        warranty: dataReceived.warranty,
        saleDate: dataReceived.saleDate,
        finalPrice: dataReceived.finalPrice,
        sellingType: dataReceived.sellingType,
        manual: dataReceived.manual,
        bankAccountUsed: dataReceived.bankAccountUsed,
        accountCash: dataReceived.accountCash,
        pocketCash: dataReceived.pocketCash,
        accessories: dataReceived.accessories,
        imeis: dataReceived.writtenImeis,
        exchangePhoneDetail: dataReceived.exchangePhoneDetail,
        cnicFrontPic: dataReceived.cnicFrontPic,
        cnicBackPic: dataReceived.cnicBackPic,
        payableAmountNow: Number(dataReceived.payableAmountNow) || 0,
        payableAmountLater: Number(dataReceived.payableAmountLater) || 0,
        payableAmountLaterDate: dataReceived.payableAmountLaterDate,
        bankName: dataReceived.bankName,
        salePrice: dataReceived.finalPrice,
        totalInvoice: totalInvoice,
        sellingPaymentType: dataReceived.sellingType,
        mobileNumber: dataReceived.customerNumber,
        // ...any other fields you want
      };
      console.log('payload', payload);
      const response = await api.post(
        '/api/purchase/general-mobile-sale',
        payload
      );
      toast.success('Sold Successfully');
      console.log('✅ Sold successfully', response.data);
    } catch (error) {
      toast.error('something went wrong');
      console.error(
        '❌ Error selling phone:',
        error.response?.data || error.message
      );
    }
  };
  console.log('shop', shop);
  // State for editing invoice fields in modal
  const [editInvoiceFields, setEditInvoiceFields] = useState({
    customerName: dataReceived.customerName || '',
    customerNumber: dataReceived.customerNumber || '',
    companyName: dataReceived.companyName || '',
    modelName: dataReceived.modelName || '',
    warranty: dataReceived.warranty || '',
    saleDate: dataReceived.saleDate || '',
    sellingType: dataReceived.sellingType || '',
    bankName: dataReceived.bankName || '',
    finalPrice: dataReceived.finalPrice || '',
    // payableAmountNow: dataReceived.payableAmountNow || '',
    // payableAmountLater: dataReceived.payableAmountLater || '',
    // payableAmountLaterDate: dataReceived.payableAmountLaterDate || '',
    // exchangePhoneDetail: dataReceived.exchangePhoneDetail || null,
    cnicFrontPic: dataReceived.cnicFrontPic || '',
    cnicBackPic: dataReceived.cnicBackPic || '',
    accessories: dataReceived.accessories || [],
    imei1: dataReceived.imei1 || '',
    // Add more fields as needed
  });

  // Modal state for editing invoice
  const [invoiceModal, setInvoiceModal] = useState(false);

  // Update invoice data function (for edit/save)
  const updateInvoiceData = async () => {
    try {
      const response = await api.put(
        `/update-sold-phone/${dataReceived.id}`,
        editInvoiceFields
      );
      toast.success('Invoice data updated successfully');
      console.log('Invoice data updated successfully:', response.data);
    } catch (error) {
      toast.error('Error updating invoice data');
      console.error('Error updating invoice data:', error);
    }
  };
  console.log('termsAndConditions', shop);

  // const smallInvoiceData = {
  //   termsAndConditions:
  //     shop?.termsCondition || 'No terms and conditions provided',
  //   shopInfo: shop?.address || 'Shop Address Not Mentioned',
  //   title: 'INVOICE',
  //   subtitle:
  //     dataReceived?.sellingType || phoneDetail?.sellingType || 'Counter Sale',
  //   date:
  //     dataReceived?.saleDate || phoneDetail?.saleDate
  //       ? new Date(
  //         dataReceived?.saleDate || phoneDetail?.saleDate
  //       ).toLocaleDateString('en-GB')
  //       : 'N/A',
  //   invoiceNumber:
  //     (dataReceived?._id || phoneDetail?._id)?.slice(-6).toUpperCase() ||
  //     '000000',
  //   customer: {
  //     name:
  //       dataReceived?.customerName ||
  //       phoneDetail?.customerName ||
  //       'Customer Name Not Provided',
  //     phone:
  //       dataReceived?.customerNumber ||
  //       phoneDetail?.customerNumber ||
  //       '____________________',
  //   },
  //   items: [
  //     // Handle both ramSimDetails (bulk) and single phone cases
  //     ...(dataReceived?.ramSimDetails?.flatMap((ramSim, index) => {
  //       return ramSim?.imeiNumbers?.map((imeiItem, subIndex) => ({
  //         no: index * 2 + subIndex + 1,
  //         name: `${ramSim.companyName || phoneDetail?.companyName || 'Brand'} ${ramSim.modelName || phoneDetail?.modelName || 'Model'} ${ramSim.ramMemory || phoneDetail?.ramMemory || ''}`,
  //         code:
  //           imeiItem.imei1 || dataReceived?.imei1 || phoneDetail?.imei1 || '-',
  //         qty: 1,
  //         rate: String(
  //           ramSim.priceOfOne ||
  //           dataReceived?.finalPrice ||
  //           phoneDetail?.finalPrice ||
  //           0
  //         ),
  //         amount: String(
  //           ramSim.priceOfOne ||
  //           dataReceived?.finalPrice ||
  //           phoneDetail?.finalPrice ||
  //           0
  //         ),
  //       }));
  //     }) || []),

  //     // Fallback to single phone if no ramSimDetails
  //     ...(!dataReceived?.ramSimDetails && !phoneDetail?.ramSimDetails
  //       ? [
  //         {
  //           no: 1,
  //           name: `${dataReceived?.companyName || phoneDetail?.companyName || 'Brand'} ${dataReceived?.modelName || phoneDetail?.modelName || 'Model'}`,
  //           code: dataReceived?.addedImei1s||dataReceived?.imei1 || phoneDetail?.imei1 || '-',
  //           qty: 1,
  //           rate: String(
  //             dataReceived?.finalPrice || phoneDetail?.finalPrice || 0
  //           ),
  //           amount: String(
  //             dataReceived?.totalInvoice ||
  //             phoneDetail?.totalInvoice ||
  //             dataReceived?.finalPrice ||
  //             phoneDetail?.finalPrice ||
  //             0
  //           ),
  //         },
  //       ]
  //       : []),

  //     // Handle accessories from either source
  //     ...((dataReceived?.accessories || phoneDetail?.accessories)?.map(
  //       (item, index) => ({
  //         no:
  //           (dataReceived?.ramSimDetails?.length ||
  //             phoneDetail?.ramSimDetails?.length ||
  //             0) +
  //           index +
  //           1,
  //         name: `Accessory: ${item.name || 'Unknown'}`,
  //         code: item.name || '-',
  //         qty: Number(item.quantity) || 1,
  //         rate: String(item.price || 0),
  //         amount: String(Number(item.price || 0) * Number(item.quantity || 1)),
  //       })
  //     ) || []),
  //   ],
  //   summary: {
  //     items:
  //       (dataReceived?.ramSimDetails?.reduce(
  //         (sum, ramSim) => sum + (ramSim.imeiNumbers?.length || 0),
  //         0
  //       ) || 0) +
  //       (!dataReceived?.ramSimDetails && !phoneDetail?.ramSimDetails ? 1 : 0) +
  //       (dataReceived?.accessories?.length ||
  //         phoneDetail?.accessories?.length ||
  //         0),

  //     cashReturn: '–',
  //     bankReturn: '–',
  //     freight: '–',
  //     subTotal: String(
  //       Number(
  //         dataReceived?.prices?.buyingPrice || phoneDetail?.purchasePrice || 0
  //       ) +
  //       ((dataReceived?.accessories || phoneDetail?.accessories)?.reduce(
  //         (sum, acc) =>
  //           sum + Number(acc.price || 0) * Number(acc.quantity || 0),
  //         0
  //       ) || 0)
  //     ),
  //     discount: '–',
  //     netTotal: String(
  //       dataReceived?.finalPrice || phoneDetail?.finalPrice || 0
  //     ),
  //     previousBal: '–',
  //     total: String(
  //       dataReceived?.totalInvoice ||
  //       phoneDetail?.totalInvoice ||
  //       dataReceived?.finalPrice ||
  //       phoneDetail?.finalPrice ||
  //       0
  //     ),
  //     bankDeposit:
  //       dataReceived?.walletTransaction?.amountFromBank ||
  //       phoneDetail?.walletTransaction?.amountFromBank ||
  //       '–',
  //     currentTotal: '–',
  //   },
  //   operator: 'admin',
  //   timestamp: new Date().toLocaleString('en-GB', {
  //     dateStyle: 'medium',
  //     timeStyle: 'short',
  //   }),
  //   pending: [
  //     // Only add pending items if this is a credit sale
  //     ...(dataReceived?.sellingPaymentType === 'Credit' ||
  //       phoneDetail?.sellingPaymentType === 'Credit'
  //       ? [
  //         {
  //           no: 1,
  //           name: `${dataReceived?.companyName || phoneDetail?.companyName || 'Brand'} ${dataReceived?.modelName || phoneDetail?.modelName || 'Model'}`,
  //           qty: 1,
  //         },
  //       ]
  //       : []),
  //   ],
  //   social: {
  //     url: 'http://www.conceptmobiles.net',
  //     text: 'www.conceptmobiles.net',
  //   },
  //   qr: 'qr-code.png',
  // };
  const smallInvoiceData = {
    termsAndConditions: shop?.termsCondition || 'No terms and conditions provided',
    shopInfo: shop?.address || 'Shop Address Not Mentioned',
    title: 'INVOICE',
    subtitle: dataReceived?.sellingType || phoneDetail?.sellingType || 'Counter Sale',
    date: dataReceived?.saleDate || phoneDetail?.saleDate
      ? new Date(dataReceived?.saleDate || phoneDetail?.saleDate).toLocaleDateString('en-GB')
      : 'N/A',
    invoiceNumber: (dataReceived?._id || phoneDetail?._id)?.slice(-6).toUpperCase() || '000000',
    customer: {
      name: dataReceived?.customerName || phoneDetail?.customerName || 'Customer Name Not Provided',
      phone: dataReceived?.customerNumber || phoneDetail?.customerNumber || '____________________',
    },
    items: [
      // Handle ramSimDetails with addedImeis filter
      ...(dataReceived?.ramSimDetails?.flatMap((ramSim, index) => {
        const filteredImeis = ramSim?.imeiNumbers?.filter(imeiItem =>
          dataReceived.addedImeis?.includes(imeiItem.imei1)
        ) || [];

        return filteredImeis.map((imeiItem, subIndex) => ({
          no: index * 2 + subIndex + 1,
          name: `${ramSim.companyName || phoneDetail?.companyName || 'Brand'} ${ramSim.modelName || phoneDetail?.modelName || 'Model'} ${ramSim.ramMemory || phoneDetail?.ramMemory || ''}`,
          code: imeiItem.imei1 || '-',
          qty: 1,
          rate: String(
            dataReceived.imeisWithPrices?.[imeiItem.imei1] ||
            ramSim.priceOfOne ||
            dataReceived?.finalPrice ||
            phoneDetail?.finalPrice ||
            0
          ),
          amount: String(
            dataReceived.imeisWithPrices?.[imeiItem.imei1] ||
            ramSim.priceOfOne ||
            dataReceived?.finalPrice ||
            phoneDetail?.finalPrice ||
            0
          ),
        }));
      }) || []),

      // Fallback to single phone if no ramSimDetails
      ...(!dataReceived?.ramSimDetails && !phoneDetail?.ramSimDetails
        ? [{
          no: 1,
          name: `${dataReceived?.companyName || phoneDetail?.companyName || 'Brand'} ${dataReceived?.modelName || phoneDetail?.modelName || 'Model'}`,
          code: dataReceived?.addedImeis?.[0] || dataReceived?.imei1 || phoneDetail?.imei1 || '-',
          qty: 1,
          rate: String(
            dataReceived?.imeisWithPrices?.[dataReceived?.addedImeis?.[0]] ||
            dataReceived?.finalPrice ||
            phoneDetail?.finalPrice ||
            0
          ),
          amount: String(
            dataReceived?.imeisWithPrices?.[dataReceived?.addedImeis?.[0]] ||
            dataReceived?.totalInvoice ||
            phoneDetail?.totalInvoice ||
            dataReceived?.finalPrice ||
            phoneDetail?.finalPrice ||
            0
          ),
        }]
        : []),

      // Handle accessories from either source
      ...((dataReceived?.accessories || phoneDetail?.accessories)?.map((item, index) => ({
        no: (dataReceived?.ramSimDetails?.reduce((sum, ramSim) =>
          sum + (ramSim.imeiNumbers?.filter(imeiItem =>
            dataReceived.addedImeis?.includes(imeiItem.imei1)
          )?.length || 0), 0) || 0) +
          (!dataReceived?.ramSimDetails && !phoneDetail?.ramSimDetails ? 1 : 0) +
          index + 1,
        name: `Accessory: ${item.name || 'Unknown'}`,
        code: item.name || '-',
        qty: Number(item.quantity) || 1,
        rate: String(item.price || 0),
        amount: String(Number(item.price || 0) * Number(item.quantity || 1)),
      })) || []),
    ],
    summary: {
      items: (dataReceived?.ramSimDetails?.reduce((sum, ramSim) =>
        sum + (ramSim.imeiNumbers?.filter(imeiItem =>
          dataReceived.addedImeis?.includes(imeiItem.imei1)
        )?.length || 0), 0) || 0) +
        (!dataReceived?.ramSimDetails && !phoneDetail?.ramSimDetails ? 1 : 0) +
        (dataReceived?.accessories?.length || phoneDetail?.accessories?.length || 0),

      cashReturn: '–',
      bankReturn: '–',
      freight: '–',
      subTotal: String(
        Number(dataReceived?.prices?.buyingPrice || phoneDetail?.purchasePrice || 0) +
        ((dataReceived?.accessories || phoneDetail?.accessories)?.reduce(
          (sum, acc) => sum + Number(acc.price || 0) * Number(acc.quantity || 0),
          0
        ) || 0)
      ),
      discount: '–',
      netTotal: String(dataReceived?.finalPrice || phoneDetail?.finalPrice || 0),
      previousBal: '–',
      total: String(
        dataReceived?.totalInvoice ||
        phoneDetail?.totalInvoice ||
        dataReceived?.finalPrice ||
        phoneDetail?.finalPrice ||
        0
      ),
      bankDeposit: dataReceived?.walletTransaction?.amountFromBank ||
        phoneDetail?.walletTransaction?.amountFromBank ||
        '–',
      currentTotal: '–',
    },
    operator: 'admin',
    timestamp: new Date().toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    pending: [
      ...(dataReceived?.sellingPaymentType === 'Credit' ||
        phoneDetail?.sellingPaymentType === 'Credit'
        ? [{
          no: 1,
          name: `${dataReceived?.companyName || phoneDetail?.companyName || 'Brand'} ${dataReceived?.modelName || phoneDetail?.modelName || 'Model'}`,
          qty: 1,
        }]
        : []),
    ],
    social: {
      url: 'http://www.conceptmobiles.net',
      text: 'www.conceptmobiles.net',
    },
    qr: 'qr-code.png',
    dataReceived: dataReceived,
    phoneDetail: phoneDetail,
  };
  // {
  //   shopInfo: shop?.address || 'Shop info not available',
  //   title: 'INVOICE',
  //   subtitle: dataReceived?.sellingType || 'Counter Sale',
  //   date: dataReceived?.saleDate
  //     ? new Date(dataReceived.saleDate).toLocaleDateString('en-GB')
  //     : 'N/A',
  //   invoiceNumber: dataReceived?._id?.slice(-6).toUpperCase() || 'N/A',
  //   customer: {
  //     name: dataReceived?.customerName || 'Unknown',
  //     phone: dataReceived?.customerNumber || 'Not provided',
  //   },
  //   items: [
  //     ...(dataReceived?.ramSimDetails?.flatMap((ramSim, index) => {
  //       return ramSim?.imeiNumbers?.map((imeiItem, subIndex) => ({
  //         no: index * 2 + subIndex + 1,
  //         name: `${ramSim.modelName || 'Model'} ${ramSim.ramMemory || ''}`,
  //         code: imeiItem.imei1 || 'N/A',
  //         qty: 1,
  //         rate: `${ramSim.priceOfOne || 0}`,
  //         amount: `${ramSim.priceOfOne || 0}`,
  //       }));
  //     }) || []),
  //     ...(dataReceived?.accessories?.map((item, index) => ({
  //       no: (dataReceived.ramSimDetails?.length || 0) + index + 1,
  //       name: `Accessory (${item.id})`,
  //       code: item.name,
  //       qty: Number(item.quantity) || 1,
  //       rate: item.price,
  //       amount: (Number(item.price) * Number(item.quantity)).toString(),
  //     })) || []),
  //   ],
  //   summary: {
  //     items:
  //       (dataReceived?.ramSimDetails?.reduce(
  //         (sum, ramSim) => sum + (ramSim.imeiNumbers?.length || 0),
  //         0
  //       ) || 0) + (dataReceived?.accessories?.length || 0),
  //     cashReturn: '–',
  //     bankReturn: '–',
  //     freight: '–',
  //     subTotal: String(
  //       Number(dataReceived?.prices?.buyingPrice || 0) +
  //         (dataReceived?.accessories?.reduce(
  //           (sum, acc) =>
  //             sum + Number(acc.price || 0) * Number(acc.quantity || 0),
  //           0
  //         ) || 0)
  //     ),
  //     discount: '–',
  //     netTotal: dataReceived?.finalPrice || '0',
  //     previousBal: '–',
  //     total:
  //       dataReceived?.totalInvoice?.toString() ||
  //       dataReceived?.finalPrice ||
  //       '0',
  //     bankDeposit: dataReceived?.walletTransaction?.amountFromBank || '–',
  //     currentTotal: '–',
  //   },
  //   operator: 'admin',
  //   timestamp: new Date().toLocaleString('en-GB', {
  //     dateStyle: 'medium',
  //     timeStyle: 'short',
  //   }),
  //   pending: [], // You can fill this if needed
  //   social: {
  //     url: 'http://www.conceptmobiles.net',
  //     text: 'www.conceptmobiles.net',
  //   },
  //   qr: 'qr-code.png',
  // };

  // {
  //   shopInfo: shop?.address || 'Shop Address Not Mentioned',
  //   title: 'INVOICE',
  //   subtitle: 'Counter Sale',
  //   date: new Date(dataReceived.saleDate || Date.now()).toLocaleDateString(
  //     'en-GB'
  //   ),
  //   invoiceNumber: dataReceived._id?.slice(-6).toUpperCase() || '000000',
  //   customer: {
  //     name: dataReceived.customerName || 'Customer Name Not Provided',
  //     phone: dataReceived.customerNumber || '____________________',
  //   },
  //   items: [
  //     {
  //       no: 1,
  //       name: `${dataReceived.companyName || 'Brand'} ${dataReceived.modelName || 'Model'}`,
  //       code: dataReceived.imei1 || '-',
  //       qty: 1,
  //       rate: Number(dataReceived.finalPrice || 0).toLocaleString(),
  //       amount: Number(dataReceived.totalInvoice || 0).toLocaleString(),
  //     },
  //     ...(dataReceived.accessories?.map((item, index) => ({
  //       no: index + 2,
  //       name: `Accessory: ${item.id || 'Unknown'}`,
  //       code: item.name || '-',
  //       qty: item.quantity || 0,
  //       rate: Number(item.price || 0).toLocaleString(),
  //       amount: (
  //         Number(item.price || 0) * Number(item.quantity || 0)
  //       ).toLocaleString(),
  //     })) || []),
  //   ],
  //   summary: {
  //     items: 1 + (dataReceived.accessories?.length || 0),
  //     cashReturn: '–',
  //     bankReturn: '–',
  //     freight: '–',
  //     subTotal: Number(dataReceived.totalInvoice || 0).toLocaleString(),
  //     discount: '–',
  //     netTotal: Number(dataReceived.totalInvoice || 0).toLocaleString(),
  //     previousBal: '–',
  //     total: Number(dataReceived.totalInvoice || 0).toLocaleString(),
  //     bankDeposit:
  //       dataReceived.walletTransaction?.amountFromBank?.toLocaleString?.() ||
  //       '–',
  //     currentTotal: '–',
  //   },
  //   operator: 'admin',
  //   timestamp: new Date().toLocaleString('en-GB', {
  //     day: '2-digit',
  //     month: 'short',
  //     year: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   }),
  //   pending: [
  //     {
  //       no: 1,
  //       name: `${dataReceived.companyName || 'Brand'} ${dataReceived.modelName || 'Model'}`,
  //       qty: 1,
  //     },
  //   ],
  //   social: {
  //     url: 'http://www.conceptmobiles.net',
  //     text: 'www.conceptmobiles.net',
  //   },
  //   qr: 'qr-code.png',
  // };
  const handleChangePreview = () => {
    if (originalInvoice) {
      // Switch from original → half preview
      setOriginalInvoice(false);
      setDisplayHalfP4(true);
      setShowSmallInvoice(false);
    } else if (displayHalfP4) {
      // Switch from half preview → small invoice
      setOriginalInvoice(false);
      setDisplayHalfP4(false);
      setShowSmallInvoice(true);
    } else if (showSmallInvoice) {
      // Switch from small invoice → original
      setOriginalInvoice(true);
      setDisplayHalfP4(false);
      setShowSmallInvoice(false);
    }
  };

  return (
    <div>
      {!displayHalfP4 && (
        <div style={{ padding: '20px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
            Select Color:
          </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: selectedColor,
              color: selectedColor === '#000000' ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            <option value="">-- Choose Color --</option>
            {colorOptions.map((color, index) => (
              <option key={index} value={color.code}>
                {color.name}
              </option>
            ))}
          </select>

          {/* Color Preview */}
          {/* {selectedColor && (
        <div
          style={{
            marginTop: '20px',
            width: '100px',
            height: '30px',
            backgroundColor: selectedColor,
            border: '1px solid #ccc',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: selectedColor === '#000000' ? '#fff' : '#000',
            fontWeight: 'bold'
          }}
        >
          {selectedColor}
        </div>
      )} */}
        </div>
      )}

      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          style={{ ...styles.button, ...styles.printBtn }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'none')}
          onClick={handleChangePreview}
        >
          Change Preview
        </button>
        {!displayHalfP4 && (
          <button
            style={{ ...styles.button, ...styles.printBtn }}
            onMouseEnter={(e) =>
              (e.target.style.transform = 'translateY(-2px)')
            }
            onMouseLeave={(e) => (e.target.style.transform = 'none')}
            onClick={handlePrint}
          >
            Print
          </button>
        )}
        {!displayHalfP4 && (
          <button
            style={{ ...styles.button, ...styles.downloadBtn }}
            onMouseEnter={(e) =>
              (e.target.style.transform = 'translateY(-2px)')
            }
            onMouseLeave={(e) => (e.target.style.transform = 'none')}
            onClick={handleDownload}
          >
            Download
          </button>
        )}
        <button
          style={{
            ...styles.button,
            ...styles.submitBtn,
            backgroundColor: '#25D366',
            color: '#fff',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'none')}
          onClick={() => {
            // Send WhatsApp message directly to customer number if available
            const customerNumber = dataReceived?.customerNumber;
            if (customerNumber) {
              // WhatsApp expects international format without + or 00, e.g., 923001234567
              // Remove any non-digit characters
              // const phone = customerNumber.replace(/\D/g, '');
              const phone = whatsAppPhoneFormatter(customerNumber);
              const message = encodeURIComponent(
                `Invoice Details:\n\nShop Name: ${shop?.shopName ?? 'Shop Name'}\nContact: ${shop?.contactNumber?.join(' | ') ?? 'Contact number not available'}\nInvoice No: ${invoiceData.invoiceNumber}\nDate: ${dataReceived?.saleDate}\nCustomer Name: ${dataReceived?.customerName}\nCustomer Number: ${customerNumber}\nTotal Amount: ${totalInvoice}Rs\n\nThank you!`
              );
              window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            } else {
              window.open(
                `https://api.whatsapp.com/send?text=Invoice%20Details:%0A%0AShop%20Name:%20${shop?.shopName ?? 'Shop Name'}%0AContact:%20${shop?.contactNumber?.join(' | ') ?? 'Contact number not available'}%0AInvoice%20No:%20${invoiceData.invoiceNumber}%0ADate:%20${dataReceived?.saleDate}%0ACustomer%20Name:%20${dataReceived?.customerName}%0ACustomer%20Number:%20${dataReceived?.customerNumber}%0ATotal%20Amount:%20${totalInvoice}Rs%0A%0AThank%20you!`,
                '_blank'
              );
            }
          }}
        >
          Send to WhatsApp
        </button>
        {!dataReceived?.invoice && !dataReceived.manual && (
          <button
            style={{
              ...styles.button,
              ...styles.submitBtn,
              backgroundColor: loading ? '#ccc' : styles.submitBtn.backgroundColor,
              color: loading ? '#666' : styles.submitBtn.color,
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = 'translateY(-2px)')
            }
            onMouseLeave={(e) => (e.target.style.transform = 'none')}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Invoice'}
          </button>
        )}
        {dataReceived.manual && (
          <button
            style={{ ...styles.button, ...styles.submitBtn }}
            onMouseEnter={(e) =>
              (e.target.style.transform = 'translateY(-2px)')
            }
            onMouseLeave={(e) => (e.target.style.transform = 'none')}
            onClick={handleSellAnyPhone}
          >
            Submit Invoice
          </button>
        )}
      </div>

      {originalInvoice &&
        !dataReceived?.showInvoice &&
        (dataReceived?.prices?.buyingPrice ||
          dataReceived?.bulkPhonePurchaseId ? (
          <>
            <div id="invoice" style={styles.container}>
              {/* <h1>Bulk Mobile Invoice</h1> */}
              <header style={styles.header}>
                <div>
                  <h2 style={styles.logo}>{shop?.shopName ?? 'Shop Name'}</h2>
                  <p>
                    {shop?.contactNumber?.join(' | ') ??
                      'Contact number not available'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="logo"
                      style={{ fontSize: '4rem',width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover',marginBottom: '10px' }}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </div>
                <h2 style={{ color: `${selectedColor}`, margin: 0 }}>Okiiee</h2>
              </header>

              <section
                style={{
                  ...styles.infoSection,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left Side */}
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Shop Address:</strong>{' '}
                    {shop?.address ?? 'Address not available'}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Invoice No:</strong> {invoiceData.invoiceNumber}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Date of Sale:</strong> {dataReceived?.saleDate}
                  </p>
                </div>

                {/* Right Side */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    <strong>Customer name:</strong> {dataReceived?.customerName}
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    <strong>Customer Number:</strong>{' '}
                    {dataReceived?.customerNumber}
                  </p>
                  {/* <p style={{fontSize: "18px" , fontWeight: "bold"}}><strong>Customer Number:</strong> {dataReceived?.contactNumber}</p> */}
                  {dataReceived.customerCNIC && (
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      <strong>Customer CNIC:</strong>{' '}
                      {dataReceived?.invoice?.items
                        ? dataReceived?.invoice?.items[0]?.customerCNIC
                        : dataReceived?.customerCNIC ?? 'Not Available'}
                    </p>
                  )}
                </div>
              </section>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Model</th>
                    <th style={styles.th}>RAM/ROM</th>
                    <th style={styles.th}>SIM</th>
                    <th style={styles.th}>Quantity</th>
                    {/* <th style={styles.th}>{dataReceived.imei2 ? "IMEI 1" : "IMEI"}</th>
              {dataReceived.imei2 && <th style={styles.th}>IMEI 2</th>} */}
                    <th style={styles.th}>Price</th>
                    {/* <th style={styles.th}>Warranty</th> */}
                  </tr>
                </thead>
                <tbody>
                  {/* {dataReceived.addedImeis.length > 0 ? (
                    <>
                      {dataReceived?.ramSimDetails
                        ?.filter((detail) =>
                          detail.imeiNumbers.some((imeiObj) =>
                            addedImei1s.includes(imeiObj.imei1)
                          )
                        )
                        .map((detail, index) => (
                          <tr key={index} style={styles.stripedRow}>
                            <td style={styles.td}>
                              {detail?.companyName ?? 'Not Available'}
                            </td>

                            <td style={styles.td}>
                              {detail?.modelName ?? 'Not Available'}
                            </td>
                            <td style={styles.td}>
                              {detail?.ramMemory ?? 'Not Available'}
                            </td>
                            <td style={styles.td}>
                              {detail?.simOption ?? 'Not Available'}
                            </td>

                            <td style={styles.td}>
                              {
                                detail.imeiNumbers.filter((imeiObj) =>
                                  addedImei1s.includes(imeiObj.imei1)
                                ).length
                              }
                            </td>

                            <td style={styles.td}>
                              {dataReceived?.invoice
                                ? dataReceived.invoice.totalAmount
                                : dataReceived?.finalPrice ?? 'Not Available'}
                            </td>

            
                          </tr>
                        ))}
                    </> */}
                  {dataReceived.addedImeis.length > 0 ? (
                    <>
                      {dataReceived?.ramSimDetails
                        ?.filter((detail) =>
                          detail.imeiNumbers.some((imeiObj) =>
                            addedImei1s.includes(imeiObj.imei1)
                          )
                        )
                        .map((detail, index) => {
                          // Get matched IMEIs for this detail
                          const matchedImeis = detail.imeiNumbers.filter(imeiObj =>
                            addedImei1s.includes(imeiObj.imei1)
                          );

                          // Format prices for display (only prices, no IMEIs)
                          const imeiPricesDisplay = matchedImeis.map(imeiObj =>
                            dataReceived.imeisWithPrices[imeiObj.imei1] || 'N/A'
                          ).join(', ');

                          return (
                            <tr key={index} style={styles.stripedRow}>
                              <td style={styles.td}>
                                {detail?.companyName ?? 'Not Available'}
                              </td>

                              <td style={styles.td}>
                                {detail?.modelName ?? 'Not Available'}
                              </td>
                              <td style={styles.td}>
                                {detail?.ramMemory ?? 'Not Available'}
                              </td>
                              <td style={styles.td}>
                                {detail?.simOption ?? 'Not Available'}
                              </td>

                              {/* Count of matched IMEIs */}
                              <td style={styles.td}>
                                {matchedImeis.length}
                              </td>

                              {/* Column for prices only */}
                              <td style={styles.td}>
                                {imeiPricesDisplay || 'Not Available'}
                              </td>

                              {!imeiPricesDisplay && (
                                <td style={styles.td}>
                                  {dataReceived?.invoice
                                    ? dataReceived.invoice.totalAmount
                                    : dataReceived?.finalPrice ?? 'Not Available'}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                    </>
                  ) : (
                    <>
                      {dataReceived?.ramSimDetails ? (
                        dataReceived.ramSimDetails.map((detail, index) => (
                          <tr key={index} style={styles.stripedRow}>
                            <td style={styles.td}>
                              {detail?.companyName ?? 'Not Available'}
                            </td>

                            {/* Model Name */}
                            <td style={styles.td}>
                              {detail?.modelName ?? 'Not Available'}
                            </td>

                            {/* RAM Memory */}
                            <td style={styles.td}>
                              {detail?.ramMemory ?? 'Not Available'}
                            </td>

                            {/* SIM Option */}
                            <td style={styles.td}>
                              {detail?.simOption ?? 'Not Available'}
                            </td>

                            <td style={styles.td}>
                              {/* {dataReceived?.addedImeis?.length || detail?.imeiNumbers?.length} */}
                              <td style={styles.td}>
                                {detail.imeiNumbers.length}
                              </td>
                            </td>

                            {/* Final Price */}
                            <td style={styles.td}>
                              {dataReceived?.invoice
                                ? dataReceived?.invoice?.totalAmount
                                : dataReceived?.finalPrice ?? 'Not Available'}
                            </td>

                            {/* Warranty */}
                            {!dataReceived?.ramSimDetails && (
                              <td style={styles.td}>
                                {dataReceived?.invoice?.items
                                  ? dataReceived?.invoice?.items[0]?.warranty
                                  : dataReceived?.warranty ?? 'Not Available'}
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={styles.td}>
                            No Data Available
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>

              {dataReceived.accessoryName && (
                <div
                  style={{
                    ...styles.termsSection,
                    display: 'flex',
                    marginBottom: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ddd',
                    padding: '10px',
                    borderRadius: '5px',
                  }}
                >
                  <p style={{ fontWeight: 'bold', minWidth: '150px' }}>
                    Accessory Details:
                  </p>
                  <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
                    <p>
                      <strong>Name:</strong> {dataReceived.accessoryName}
                    </p>
                    <p>
                      <strong>Sold Price:</strong> {dataReceived.accessoryPrice}
                    </p>
                  </div>
                </div>
              )}
              {/* <div style={styles.totalSection}>
                <h3>Total:{totalInvoice}Rs</h3>
              </div> */}
              <div
                style={{
                  ...styles.totalSection,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '10px 20px',
                  marginTop: '20px',
                  backgroundColor: '#f9f9f9',
                  borderTop: '1px solid #ddd',
                }}
              >
                {/* Left side - 60% width */}
                <div style={{ width: '60%' }}>
                  {dataReceived?.accessories?.map((acc, index) => (
                    <p
                      key={index}
                      style={{
                        fontSize: '15px',
                        color: '#444',
                        paddingBottom: '6px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        margin: 0,
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      {acc.id}: {acc.quantity} × {acc.price} Rs
                    </p>
                  ))}
                </div>

                {/* Right side - 40% width - Total */}
                <div
                  style={{
                    width: '40%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#222',
                    }}
                  >
                    Total: {totalInvoice} Rs
                  </h3>
                </div>
              </div>

              {dataReceived.addedImeis.length !== 0 ? (
                <>
                  <div style={styles.termsSection}>
                    {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
                    {/* <div style={styles.termsHeading}>Total Selected Imeis</div> */}
                    <div style={styles.termsText}>
                      {dataReceived?.addedImeis?.length ? (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            maxWidth: '100%',
                            overflow: 'hidden',
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            Selected IMEIs:
                          </span>
                          {dataReceived?.ramSimDetails?.map(
                            (ramGroup, ramIndex) => {
                              // Filter only those imeis that are present in addedImeis
                              const matchedImeis = ramGroup.imeiNumbers.filter(
                                (imeiObj) => addedImei1s.includes(imeiObj.imei1)
                              );

                              if (matchedImeis.length === 0) return null; // skip if no imeis matched for this RAM group

                              return (
                                <div
                                  key={ramIndex}
                                  style={{ marginBottom: '20px' }}
                                >
                                  <StyledHeading>
                                    Ram Memory: {ramGroup.ramMemory}
                                  </StyledHeading>
                                  {matchedImeis.map((imeiObj, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        whiteSpace: 'nowrap',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                      }}
                                    >
                                      <strong>Phone {index + 1}:</strong>
                                      <span
                                        style={{
                                          background: '#f0f0f0',
                                          padding: '6px 10px',
                                          borderRadius: '10px',
                                        }}
                                      >
                                        IMEI 1: {imeiObj.imei1}
                                      </span>
                                      {imeiObj.imei2 && (
                                        <span
                                          style={{
                                            background: '#f0f0f0',
                                            padding: '6px 10px',
                                            borderRadius: '10px',
                                          }}
                                        >
                                          IMEI 2: {imeiObj.imei2}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {dataReceived.ramSimDetails?.length > 0 ? (
                    <div>
                      <div style={styles.termsSection}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            maxWidth: '100%',
                            overflow: 'hidden',
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            Total IMEIs:
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                            maxWidth: '100%',
                            flexDirection: 'column',
                            padding: '5px 0',
                          }}
                        >
                          {dataReceived?.ramSimDetails?.map(
                            (detail, detailIndex) => (
                              <div
                                key={detailIndex}
                                style={{ marginBottom: '16px' }}
                              >
                                <StyledHeading>
                                  Ram Memory: {detail?.ramMemory}
                                </StyledHeading>

                                {detail?.imeiNumbers?.length > 0 ? (
                                  <>
                                    {detail.imeiNumbers?.map(
                                      (imeiObj, imeiIndex) => (
                                        <div
                                          key={`${detailIndex}-${imeiIndex}`}
                                          style={{
                                            marginBottom: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                          }}
                                        >
                                          <strong
                                            style={{
                                              fontSize: '14px',
                                              color: '#333',
                                            }}
                                          >
                                            Phone {imeiIndex + 1}:
                                          </strong>
                                          <div
                                            style={{
                                              background: '#f0f0f0',
                                              padding: '4px 8px',
                                              borderRadius: '4px',
                                              fontSize: '12px',
                                              whiteSpace: 'nowrap',
                                              marginTop: '4px',
                                            }}
                                          >
                                            <strong>IMEI 1:</strong>{' '}
                                            {imeiObj.imei1}
                                            {imeiObj.imei2 && ` | `}
                                            {imeiObj.imei2 && (
                                              <strong>IMEI 2:</strong>
                                            )}{' '}
                                            {imeiObj.imei2}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                      }}
                                    >
                                      <strong>Not found</strong>
                                    </div>
                                  </>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </>
              )}

              <div style={styles.termsSection}>
                {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
                <div style={styles.termsHeading}>Terms & conditions</div>
                <div style={styles.termsText}>
                  {shop?.termsCondition.map((item, index) => (
                    <p key={index}>
                      <strong
                        style={{
                          fontSize: '1.0rem',
                          fontWeight: '600',
                          color: '#333',
                          width: '100%',
                        }}
                      >
                        {index + 1}.
                      </strong>{' '}
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <footer style={styles.footer}>
                <p>
                  {shop?.shopName ?? 'Shop Name'} |{' '}
                  {shop?.address ?? 'Address not available'} |{' '}
                  {shop?.contactNumber?.join(' | ') ??
                    'Contact number not available'}
                </p>
              </footer>
            </div>
          </>
        ) : (
          <>
            <div id="invoice" style={styles.container}>
              <header style={styles.header}>
                <div>
                  <h2 style={styles.logo}>{shop?.shopName ?? 'Shop Name'}</h2>
                  <p>
                    {shop?.contactNumber?.join(' | ') ??
                      'Contact number not available'}
                  </p>
                </div>
                <h2 style={{ color: `${selectedColor}` }}>Okiiee</h2>
              </header>

              <section
                style={{
                  ...styles.infoSection,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left Side */}
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Shop Address:</strong>{' '}
                    {shop?.address ?? 'Address not available'}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Invoice No:</strong> {invoiceData.invoiceNumber}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Date of Sale:</strong> {dataReceived?.saleDate}
                  </p>
                </div>

                {/* Right Side */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    <strong>Customer Name:</strong>{' '}
                    {dataReceived?.invoice?.items
                      ? dataReceived?.invoice?.items[0]?.customerName
                      : dataReceived?.customerName ?? 'Not Available'}
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    <strong>Customer Number:</strong>{' '}
                    {dataReceived?.invoice?.items
                      ? dataReceived?.invoice?.items[0]?.customerNumber
                      : dataReceived?.customerNumber ?? 'N/A'}
                  </p>
                  {dataReceived.customerCNIC && (
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      <strong>Customer CNIC:</strong>{' '}
                      {dataReceived?.invoice?.items
                        ? dataReceived?.invoice?.items[0]?.customerCNIC
                        : dataReceived?.customerCNIC ?? 'Not Available'}
                    </p>
                  )}
                </div>
              </section>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Model</th>
                    {Array.isArray(phoneDetail) &&
                      phoneDetail.length > 0 &&
                      phoneDetail[0]?.ramMemory && (
                        <th style={styles.th}>Ram Memory</th>
                      )}
                    {Array.isArray(phoneDetail) &&
                      phoneDetail.length > 0 &&
                      phoneDetail.some(item => item?.batteryHealth && String(item.batteryHealth).trim() !== '') && (
                        <th style={styles.th}>Battery Health</th>
                      )}
                    {Array.isArray(phoneDetail) &&
                      phoneDetail.length > 0 &&
                      phoneDetail.some(item => item?.color && String(item.color).trim() !== '') && <th style={styles.th}>Color</th>}
                    {Array.isArray(phoneDetail) &&
                      phoneDetail.length > 0 &&
                      phoneDetail[0]?.simOption && (
                        <th style={styles.th}>Sim Option</th>
                      )}
                    {/* {dataReceived?.modelName && (
                      <th style={styles.th}>Ram Memory</th>
                    )} */}
                    {dataReceived?.batteryHealth && (
                      <th style={styles.th}>Battery Health</th>
                    )}
                    {phoneDetail?.specifications && (
                      <th style={styles.th}>Type</th>
                    )}
                    {dataReceived?.specifications && (
                      <th style={styles.th}>Type</th>
                    )}
                    <th style={styles.th}>
                      {dataReceived.imei2 ? 'IMEI 1' : 'IMEI'}
                    </th>
                    {dataReceived.imei2 && <th style={styles.th}>IMEI 2</th>}
                    <th style={styles.th}>Price</th>
                    {dataReceived?.writtenImeis?.length <= 1 && (
                      <th style={styles.th}>Warranty</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                    {/* Company */}
                    <td
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      <div>
                        {dataReceived?.invoice?.items?.[0]?.mobileCompany ||
                          dataReceived?.companyName ||
                          (Array.isArray(phoneDetail)
                            ? phoneDetail.map((item, i) => (
                              <div key={i}>
                                {item.companyName || 'Not Available'}
                              </div>
                            ))
                            : phoneDetail?.bulkPhonePurchase?.ramSimDetails?.[0]
                              ?.companyName || 'Not Available')}
                      </div>
                    </td>

                    {/* Model */}
                    <td
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      {dataReceived?.invoice?.items?.[0]?.mobileName ||
                        dataReceived?.modelSpecifications ||
                        dataReceived?.modelName ||
                        (Array.isArray(phoneDetail) ? (
                          <div>
                            {phoneDetail.map((item, i) => (
                              <div key={i}>
                                {item.modelName || 'Not Available'}
                              </div>
                            ))}
                          </div>
                        ) : (
                          phoneDetail?.bulkPhonePurchase?.ramSimDetails?.[0]
                            ?.modelName || 'Not Available'
                        ))}
                    </td>

                    {/* RAM */}
                    {Array.isArray(phoneDetail) && <>

                      <td
                        style={{
                          padding: '8px',
                          fontSize: '14px',
                          fontWeight: 500,
                          textAlign: 'center',
                        }}
                      >
                        {Array.isArray(phoneDetail) &&
                          phoneDetail.some(item => item?.ramMemory && String(item.ramMemory).trim() !== '') ? (
                          <div>
                            {phoneDetail.map((item, i) => (
                              <div key={i}>{item.ramMemory || 'N/A'}</div>
                            ))}
                          </div>
                        ) : dataReceived?.ramMemory ? (
                          <span>{dataReceived.ramMemory}</span>
                        ) : (
                          'Not Available'
                        )}
                      </td></>}

                    {/* Battery Health */}
                    {Array.isArray(phoneDetail) &&
                      <>
                        <td
                          style={{
                            padding: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            textAlign: 'center',
                          }}
                        >
                          {Array.isArray(phoneDetail) &&
                            phoneDetail[0]?.batteryHealth ? (
                            <div>
                              {phoneDetail.map((item, i) => (
                                <div key={i}>{item.batteryHealth || 'N/A'}</div>
                              ))}
                            </div>
                          ) : dataReceived?.batteryHealth ? (
                            <span>{dataReceived.batteryHealth}</span>
                          ) : (Array.isArray(phoneDetail) && phoneDetail.some(item => item?.batteryHealth && String(item.batteryHealth).trim() !== '')) ? (
                            <span>{phoneDetail.map((item, i) => (
                              <div key={i}>{item.batteryHealth || 'N/A'}</div>
                            ))}</span>
                          ) : (
                            'Not Available'
                          )}
                        </td>
                      </>}

                    {/* Color */}
                    {Array.isArray(phoneDetail) && <>
                      <td
                        style={{
                          padding: '8px',
                          fontSize: '14px',
                          fontWeight: 500,
                          textAlign: 'center',
                        }}
                      >
                        {Array.isArray(phoneDetail) && phoneDetail[0]?.color ? (
                          <div>
                            {phoneDetail.map((item, i) => (
                              <div key={i}>{item.color || 'N/A'}</div>
                            ))}
                          </div>
                        ) : (Array.isArray(phoneDetail) && phoneDetail.some(item => item?.color && String(item.color).trim() !== '')) ? (
                          <span>{phoneDetail.map((item, i) => (
                            <div key={i}>{item.color || 'N/A'}</div>
                          ))}</span>
                        ) : (
                          'Not Available'
                        )}
                      </td>
                    </>}

                    {/* SIM Option */}
                    {Array.isArray(phoneDetail) &&
                      phoneDetail.length > 0 &&
                      phoneDetail[0]?.simOption && (
                        <td
                          style={{
                            padding: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            textAlign: 'center',
                          }}
                        >
                          <div>
                            {phoneDetail.map((item, i) => (
                              <div key={i}>{item.simOption || 'N/A'}</div>
                            ))}
                          </div>
                        </td>
                      )}

                    {/* IMEI */}
                    <td
                      style={{
                        padding: '8px',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                      }}
                    >
                      {!dataReceived.manual ? (
                        dataReceived?.invoice?.items?.[0]?.imei ||
                        dataReceived?.imei1 ||
                        'Not Available'
                      ) : (
                        <div>
                          {dataReceived?.writtenImeis?.map((imei, i) => (
                            <div key={i}>{imei}</div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* IMEI 2 (if exists) */}
                    {dataReceived.imei2 && (
                      <td
                        style={{
                          padding: '8px',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                        }}
                      >
                        {dataReceived?.invoice?.items?.[0]?.imei2 ||
                          dataReceived.imei2 ||
                          'Not Available'}
                      </td>
                    )}

                    {/* Price */}
                      {/* { dataReceived?.invoice?.totalAmount
                        ? `${dataReceived.invoice.totalAmount.toLocaleString()}`
                        : dataReceived?.finalPrice
                          ? `${dataReceived.finalPrice.toLocaleString()}`
                          : 'Not Available'} */}
                    <td
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textAlign: 'right',
                      }}
                    >
                      {Array.isArray(dataReceived?.imeiPrices) && dataReceived.imeiPrices.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                          {dataReceived.imeiPrices.map((item, idx) => (
                            <div
                              key={`${item.imei}-${idx}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 8px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                maxWidth: '100%'
                              }}
                            >
                            
                              <span style={{ fontSize: '12px', fontWeight: 600, }}> {Number(item.price || 0).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : dataReceived?.invoice?.totalAmount ? (
                        `${Number(dataReceived.invoice.totalAmount).toLocaleString()}`
                      ) : dataReceived?.finalPrice ? (
                        `${Number(dataReceived.finalPrice).toLocaleString()}`
                      ) : (
                        'Not Available'
                      )}
                    </td>

                    {/* Warranty */}
                  
                    {dataReceived.writtenImeis?.length <= 1 && (
                      <td
                        style={{
                          padding: '8px',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      >
                        {dataReceived?.invoice?.items?.[0]?.warranty ||
                          dataReceived?.warranty ||
                          phoneDetail?.warranty ||
                          'Not Available'}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
              {dataReceived.accessoryName && (
                <div
                  style={{
                    ...styles.termsSection,
                    display: 'flex',
                    marginBottom: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ddd',
                    padding: '10px',
                    borderRadius: '5px',
                  }}
                >
                  <p style={{ fontWeight: 'bold', minWidth: '150px' }}>
                    Accessory Details:
                  </p>
                  <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
                    <p>
                      <strong>Name:</strong> {dataReceived.accessoryName}
                    </p>
                    <p>
                      <strong>Sold Price:</strong> {dataReceived.accessoryPrice}
                    </p>
                  </div>
                </div>
              )}

              <div
                style={{
                  ...styles.totalSection,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '10px 20px',
                  marginTop: '20px',
                  backgroundColor: '#f9f9f9',
                  borderTop: '1px solid #ddd',
                }}
              >
                <div style={{ width: '60%' }}>
                  {dataReceived?.accessories?.map((acc, index) => (
                    <p
                      key={index}
                      style={{
                        fontSize: '15px',
                        color: '#444',
                        paddingBottom: '6px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        margin: 0,
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      {acc.id}: {acc.quantity} × {acc.price} Rs
                    </p>
                  ))}
                </div>

                <div
                  style={{
                    width: '40%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#222',
                    }}
                  >
                    Total: {totalInvoice} Rs
                  </h3>
                </div>
              </div>

              <div style={styles.termsSection}>
                <div style={styles.termsHeading}>Terms and conditions</div>
                <div style={styles.termsText}>
                  {shop?.termsCondition.map((item, index) => (
                    <p key={index}>
                      <strong
                        style={{
                          fontSize: '1.0rem',
                          fontWeight: '600',
                          color: '#333',
                          width: '100%',
                        }}
                      >
                        {index + 1}.
                      </strong>{' '}
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <footer style={styles.footer}>
                <p>
                  {shop?.shopName ?? 'Shop Name'} |{' '}
                  {shop?.address ?? 'Address not available'} |{' '}
                  {shop?.contactNumber?.join(' | ') ??
                    'Contact number not available'}
                </p>
              </footer>
            </div>
          </>
        ))}
      <div>
        {dataReceived?.showInvoice && (
          <div id="invoice" style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
              <div>
                <h2 style={styles.logo}>{shop?.shopName ?? 'Shop Name'}</h2>
                <p>
                  {shop?.contactNumber?.join(' | ') ??
                    'Contact number not available'}
                </p>
              </div>
              <h2 style={{ color: selectedColor || '#4a6baf' }}>Invoice</h2>
            </header>

            {/* Info Section */}
            <section
              style={{
                ...styles.infoSection,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {/* Left */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Invoice No:</strong> {dataReceived.invoiceNumber}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Date of sale:</strong>{' '}
                    {new Date(dataReceived.dateSold).toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Customer Name:</strong> {dataReceived.customerName}
                  </p>

                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Customer Number:</strong>{' '}
                    {dataReceived.customerNumber}
                  </p>
                </div>
              </div>
              {/* Right */}
            </section>

            {/* Table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: '15px',
                      backgroundColor: `${selectedColor}`,
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: '15px',
                      backgroundColor: `${selectedColor}`,
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Imeis
                  </th>
                  <th
                    style={{
                      padding: '15px',
                      backgroundColor: `${selectedColor}`,
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Selling Payment Type
                  </th>
                  <th style={styles.th}>Warranty</th>
                  <th style={styles.th}>Price PKR</th>
                </tr>
              </thead>
              <tbody
                style={{
                  backgroundColor: '#fafafa',
                }}
              >
                <tr style={styles.stripedRow}>
                  <td style={styles.td}>{dataReceived?.type}</td>
                  <td
                    style={{
                      display: 'flex',
                      maxWidth: '220px',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '10px',
                      justifyContent: 'center',
                      padding: '12px',
                      backgroundColor: '#fafafa',
                      borderBottom: '1px solid #eee',
                      color: '#333',
                    }}
                  >
                    {dataReceived?.imei1.map((imei) => {
                      return (
                        <span
                          style={{
                            background: '#f0f0f0',
                            padding: '3px 5px',
                            fontSize: '12px',
                            borderRadius: '10px',
                          }}
                        >
                          {imei}
                        </span>
                      );
                    })}
                  </td>
                  <td style={styles.td}>{dataReceived.sellingPaymentType}</td>
                  <td style={styles.td}>
                    {dataReceived.warranty ?? 'Not Available'}
                  </td>
                  <td style={styles.td}>
                    {dataReceived.salePrice.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Section */}
            <div
              style={{
                padding: '15px 0',
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Total: {dataReceived.salePrice.toLocaleString('en-IN')} PKR
            </div>

            {/* Footer */}

            <div style={styles.termsSection}>
              {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
              <div style={styles.termsHeading}>Terms & conditions</div>
              <div style={styles.termsText}>
                {shop?.termsCondition.map((item, index) => (
                  <p key={index}>
                    <strong
                      style={{
                        fontSize: '1.0rem',
                        fontWeight: '600',
                        color: '#333',
                        width: '100%',
                      }}
                    >
                      {index + 1}.
                    </strong>{' '}
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <footer style={styles.footer}>
              <p>
                {shop?.shopName ?? 'Shop Name'} |{' '}
                {shop?.address ?? 'Address not available'} |{' '}
                {shop?.contactNumber?.join(' | ') ??
                  'Contact number not available'}
              </p>
            </footer>
          </div>
        )}
        {/* <StockListComponent /> */}
        {showSmallInvoice && (
          <SmallInvoiceComponent invoiceData={smallInvoiceData} />
        )}
        <InvoiceComponent
        dataReceived={dataReceived}
          invoiceNumber={
            invoiceData.invoiceNumber ?? dataReceived?.invoiceNumber
          }
          imeiPrices={dataReceived?.imeiPrices}
          companyName={
            dataReceived?.companyName ??
            phoneDetail?.companyName ??
            phoneDetail?.map((item) => item.companyName) ??
            phoneDetail?.bulkPhonePurchase?.ramSimDetails[0].companyName ??
            dataReceived?.type ??
            ''
          }
          modelName={
            dataReceived?.modelName ??
            phoneDetail?.modelName ??
            phoneDetail?.map((item) => item.modelName) ??
            phoneDetail?.bulkPhonePurchase?.ramSimDetails[0].modelName ??
            dataReceived?.type ??
            ''
          }
          batteryHealth={
            dataReceived?.batteryHealth ??
            phoneDetail?.batteryHealth ??
            phoneDetail?.map((item) => item.batteryHealth) ??
            ''
          }
          ramMemory={
            dataReceived?.ramMemory ??
            phoneDetail?.ramMemory ??
            phoneDetail?.map((item) => item.ramMemory) ??
            ''
          }
          color={
            dataReceived?.color ??
            phoneDetail?.color ??
            phoneDetail?.map((item) => item.color) ??
            ''
          }
          simOption={
            dataReceived?.simOption ??
            phoneDetail?.simOption ??
            phoneDetail?.map((item) => item.simOption) ??
            ''
          }
          type={
            dataReceived?.specifications ?? phoneDetail?.specifications ?? ''
          }
          warranty={phoneDetail?.warranty ?? dataReceived?.warranty ?? null}
          display={displayHalfP4}
          saleData={dataReceived}
          shopName={shop?.shopName ?? ''}
          number={shop?.contactNumber?.[0] ?? ''}
          address={shop?.address ?? 'Address not available'}
          termsAndConditions={shop?.termsCondition}
        />
      </div>
      {dataReceived?.editing && (
        <div style={{ textAlign: 'end', marginTop: '20px' }}>
          <button
            style={{
              marginRight: '10px',
              backgroundColor: '#f00',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
            }}
            onClick={async () => {
              console.log('data received', dataReceived);
              if (!dataReceived.id) {
                toast.error('Invoice ID not found');
                return;
              }
              try {
                await api.delete(
                  `/api/purchase/delete-sold-phone/${dataReceived.id || dataReceived._id}`
                );
                toast.success('Invoice deleted successfully');
                // window.location.reload();
              } catch (error) {
                console.error('Error deleting invoice:', error);
                toast.error('Failed to delete invoice');
              }
            }}
          >
            Delete
          </button>
          <button
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
            }}
            onClick={() => {
              setInvoiceModal(true);
              console.log('Edit action triggered');
            }}
          >
            Edit
          </button>
        </div>
      )}
      <Modal
        show={invoiceModal}
        isOpen={invoiceModal}
        onClose={() => setInvoiceModal(false)}
        toggleModal={() => setInvoiceModal(!invoiceModal)}
        style={{
          maxWidth: '600px',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h4>Edit Invoice</h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          {/* Left Column */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}
              >
                Customer Number
              </label>
              <input
                type="text"
                placeholder="Enter Customer Number"
                value={editInvoiceFields.customerNumber}
                onChange={(e) =>
                  setEditInvoiceFields({
                    ...editInvoiceFields,
                    customerNumber: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}
              >
                Sale Price
              </label>
              <input
                type="text"
                placeholder="Enter Sale Price"
                value={editInvoiceFields.finalPrice}
                onChange={(e) =>
                  setEditInvoiceFields({
                    ...editInvoiceFields,
                    finalPrice: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}
              >
                Warranty
              </label>
              <input
                type="text"
                placeholder="Enter Warranty"
                value={editInvoiceFields.warranty}
                onChange={(e) =>
                  setEditInvoiceFields({
                    ...editInvoiceFields,
                    warranty: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}
              >
                Sale Date
              </label>
              <input
                type="text"
                placeholder="Enter Sale Date"
                value={editInvoiceFields.saleDate}
                onChange={(e) =>
                  setEditInvoiceFields({
                    ...editInvoiceFields,
                    saleDate: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}
              >
                IMEI 1
              </label>
              <input
                type="text"
                placeholder="Enter IMEI 1"
                value={editInvoiceFields.imei1}
                onChange={(e) =>
                  setEditInvoiceFields({
                    ...editInvoiceFields,
                    imei1: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}
              >
                Company Name
              </label>
              <input
                type="text"
                placeholder="Enter Company Name"
                value={editInvoiceFields.companyName}
                onChange={(e) =>
                  setEditInvoiceFields({
                    ...editInvoiceFields,
                    companyName: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>
            <div style={{ width: '100%', alignContent: 'start' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: '500',
                }}
              >
                Model Name
              </label>
              <input
                type="text"
                placeholder="Enter Model Name"
                value={editInvoiceFields.modelName}
                onChange={(e) =>
                  setEditInvoiceFields({
                    ...editInvoiceFields,
                    modelName: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              await api.put(
                `/api/Purchase/update-sold-phone/${dataReceived.id}`,
                editInvoiceFields
              );
              toast.success('Invoice updated successfully');
              setInvoiceModal(false);
            } catch (error) {
              console.error('Error updating invoice:', error);
              toast.error('Failed to update invoice');
            }
          }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            width: '100%',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Update Invoice
        </button>
      </Modal>
    </div>
  );
};

export default SoldInvoice;
