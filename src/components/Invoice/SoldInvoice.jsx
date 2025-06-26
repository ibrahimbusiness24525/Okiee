import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import { api } from '../../../api/api';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import { InvoiceComponent } from 'components/InvoiceComponent';
import { toast } from 'react-toastify';
const SoldInvoice = () => {
  const [selectedColor, setSelectedColor] = useState('#004B87');
  const [displayHalfP4, setDisplayHalfP4] = useState(false);
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
    // invoiceDate: dataReceived?.invoice
    // ? new Date(dataReceived?.invoice?.invoiceDate).toISOString().split('T')[0]
    // : new Date().toISOString().split('T')[0],
    invoiceDate: getValidDate(dataReceived?.invoice?.invoiceDate),

    items: dataReceived.invoice ? dataReceived.invoice?.items : [],
    totalAmount: dataReceived.invoice ? dataReceived.invoice?.totalAmount : 0,
    imei: dataReceived.imei,
    imei2: dataReceived.imei2 ?? '',
  });

  useEffect(() => {
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

    // Remove all non-digit characters first
    const digitsOnly = number.replace(/\D/g, '');

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
  const handleSubmit = async (type) => {
    if (
      dataReceived?.prices?.buyingPrice ||
      dataReceived?.bulkPhonePurchaseId
    ) {
      const payload = {
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
        }
      } catch (error) {
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
          onClick={() => setDisplayHalfP4(!displayHalfP4)}
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
        {!dataReceived?.invoice && (
          <button
            style={{ ...styles.button, ...styles.submitBtn }}
            onMouseEnter={(e) =>
              (e.target.style.transform = 'translateY(-2px)')
            }
            onMouseLeave={(e) => (e.target.style.transform = 'none')}
            onClick={handleSubmit}
          >
            Submit Invoice
          </button>
        )}
      </div>

      {!displayHalfP4 &&
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
                  {dataReceived.addedImeis.length > 0 ? (
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

                            {/* Count of matched IMEIs */}
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

                            {/* <td style={styles.td}>
                       {dataReceived?.invoice?.items
                         ? dataReceived.invoice.items[0]?.warranty
                         : dataReceived?.warranty ?? 'Not Available'}
                     </td> */}
                          </tr>
                        ))}
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
                            <td style={styles.td}>
                              {dataReceived?.invoice?.items
                                ? dataReceived?.invoice?.items[0]?.warranty
                                : dataReceived?.warranty ?? 'Not Available'}
                            </td>
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
              <div style={styles.totalSection}>
                <h3>Total:{totalInvoice}Rs</h3>
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
                    {!dataReceived?.manual && (
                      <th style={styles.th}>Company</th>
                    )}
                    {!dataReceived?.manual && <th style={styles.th}>Model</th>}
                    <th style={styles.th}>
                      {dataReceived.imei2 ? 'IMEI 1' : 'IMEI'}
                    </th>
                    {dataReceived.imei2 && <th style={styles.th}>IMEI 2</th>}
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.stripedRow}>
                    {!dataReceived?.manual && (
                      <td style={styles.td}>
                        {dataReceived?.invoice?.items
                          ? dataReceived?.invoice?.items[0]?.mobileCompany
                          : dataReceived?.companyName ?? 'Not Available'}
                      </td>
                    )}
                    {!dataReceived?.manual && (
                      <td style={styles.td}>
                        {dataReceived?.invoice?.items
                          ? dataReceived?.invoice?.items[0]?.mobileName
                          : dataReceived?.modelSpecifications ??
                            dataReceived.modelName ??
                            'Not Available'}
                      </td>
                    )}
                    {!dataReceived.manual && (
                      <td style={styles.td}>
                        {dataReceived?.invoice?.items
                          ? dataReceived?.invoice?.items[0]?.imei
                          : dataReceived?.imei1 ?? 'Not Available'}
                      </td>
                    )}
                    {dataReceived?.manual && (
                      <td style={styles.td}>
                        {['11111', '2222'].map((items) => {
                          return `${items},`;
                        })}
                        {/* {dataReceived?.writtenImeis?.map((items) => {
                          return items;
                        })} */}
                      </td>
                    )}
                    {dataReceived.imei2 && (
                      <td style={styles.td}>
                        {dataReceived?.invoice?.items
                          ? dataReceived?.invoice?.items[0]?.imei2
                          : dataReceived.imei2 ?? 'Not Available'}
                      </td>
                    )}
                    <td style={styles.td}>
                      {dataReceived?.invoice
                        ? dataReceived?.invoice?.totalAmount
                        : dataReceived?.finalPrice ?? 'Not Available'}
                    </td>
                    <td style={styles.td}>
                      {dataReceived?.invoice?.items
                        ? dataReceived?.invoice?.items[0]?.warranty
                        : dataReceived?.warranty ?? 'Not Available'}
                    </td>
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
              <div style={styles.totalSection}>
                <h3>Total:{totalInvoice}Rs</h3>
              </div>

              <div style={styles.termsSection}>
                {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
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
              <div>
                <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  <strong>Invoice No:</strong> {dataReceived.invoiceNumber}
                </p>
                <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  <strong>Date:</strong>{' '}
                  {new Date(dataReceived.dateSold).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Right */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  <strong>Customer Name:</strong> {dataReceived.customerName}
                </p>
                {dataReceived.customerNumber && (
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Customer Number:</strong>{' '}
                    {dataReceived.customerNumber}
                  </p>
                )}
                {dataReceived.customerCNIC && (
                  <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    <strong>Customer CNIC:</strong> {dataReceived?.customerCNIC}
                  </p>
                )}
              </div>
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
                    IMEI
                  </th>
                  <th style={styles.th}>Warranty</th>
                  <th style={styles.th}>Price PKR</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.stripedRow}>
                  <td style={styles.td}>Mobile Device</td>
                  <td style={styles.td}>{dataReceived.imei1}</td>
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
            <div
              style={{
                paddingTop: '10px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#555',
              }}
            >
              <p style={{ margin: 0 }}>Thank you for your business!</p>
              <p style={{ margin: 0 }}>
                For any queries, contact {shop?.contactNumber?.[0] ?? 'Support'}
              </p>
            </div>
          </div>
        )}

        <InvoiceComponent
          display={displayHalfP4}
          saleData={dataReceived}
          shopName={shop?.shopName ?? ''}
          number={shop?.contactNumber?.[0] ?? ''}
          address={shop?.address ?? 'Address not available'}
          termsAndConditions={shop?.termsAndConditions}
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
              try {
                await api.delete(
                  `/api/purchase/delete-sold-phone/${dataReceived.id}`
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
              // Handle edit action
              console.log('Edit action triggered');
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default SoldInvoice;
