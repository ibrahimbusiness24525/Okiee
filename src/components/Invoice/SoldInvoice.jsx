import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import { api } from '../../../api/api';
import { truncate } from '../../utils/truncate';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
const SoldInvoice = () => {
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
      borderBottom: '3px solid #004B87',
      color: '#004B87',
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#004B87',
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
      backgroundColor: '#004B87',
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
      color: '#004B87',
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
      borderTop: '3px solid #004B87',
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
      color: '#004B87',
    },
    termsText: {
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '10px',
    },
  };

  const location = useLocation();
  const dataReceived = location?.state ?? {};

  const [shop, setShop] = useState(null);
  const [price, setPrice] = useState(dataReceived.invoice?.totalAmount ?? dataReceived?.finalPrice ?? dataReceived?.demandPrice ?? 0);
  const [invoiceData, setInvoiceData] = useState({
    shopId: shop?.shopId ?? '',
    invoiceNumber:  dataReceived?.invoice?.invoiceNumber?? dataReceived.invoice ? dataReceived.invoice?.invoiceNumber : `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    invoiceDate: dataReceived.invoice 
    ? new Date(dataReceived.invoice?.invoiceDate).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0],
    items: dataReceived.invoice ? dataReceived.invoice?.items : [],
    totalAmount: dataReceived.invoice ? dataReceived.invoice?.totalAmount : 0,
    imei: dataReceived.imei,
    imei2: dataReceived.imei2 ?? '',
  });

  
  useEffect(() => {
    console.log(dataReceived, 'datarecieved')
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
    dataReceived?.ramSimDetails?.flatMap(item => item.imeiNumbers) || []
  );
  const imeiOneList =dataReceived?.addedImeis?.length !== 0 && dataReceived?.addedImeis?.map((imei) => imei.split(" / ")[0]) || [];
  console.log("this is the imeiOneList",imeiOneList);
  const handleSubmit = async (type) => {
    if(dataReceived?.prices?.buyingPrice){
      const payload = {
        bulkPhonePurchaseId: dataReceived?.ramSimDetails?.[0]?.bulkPhonePurchaseId, // Get from first object
        imeiNumbers: dataReceived?.addedImeis?.length === 0 
        ? imeis.map(item => item?.imei1)  // Extract imei1 properly
        : imeiOneList, 
        // : dataReceived?.addedImeis, 
        salePrice: dataReceived?.finalPrice,
          totalInvoice,
        // salePrice: dataReceived?.finalPrice,
        warranty: dataReceived?.warranty, 
        customerName:dataReceived?.customerName,
        cnicFrontPic:"/file",
        cnicBackPic:"/file",
        sellingPaymentType:dataReceived.sellingType,
        accessories:dataReceived?.accessories,
        // accesssoryName:dataReceived.accessoryName,
        // accesssoryAmount:Number(dataReceived.accessoryPrice),
        ...(dataReceived?.sellingType === "Bank" && { bankName: dataReceived?.bankName }),

        // Conditionally add credit fields if selling type is "Credit"
        ...(dataReceived?.sellingType === "Credit" && { 
            payableAmountNow: dataReceived?.payableAmountNow,
            payableAmountLater: dataReceived?.payableAmountLater,
            payableAmountLaterDate: dataReceived?.payableAmountLaterDate
        }),
      
        // Conditionally add exchangePhoneDetail if selling type is "Exchange"
        ...(dataReceived?.sellingType === "Exchange" && { 
            exchangePhoneDetail: dataReceived?.exchangePhoneDetail 
        })
      };
      console.log("bulk payload",payload);
      try {
        const response = await api.post(`api/Purchase/sell-phone`, payload);
        // const response = await axios.post(BASE_URL + `api/Purchase/sell-phone`, payload,{
        //   "headers": {"Content-Type": "application/json"}
        // });
        console.log("response of bulk invoice",response);
        
        if (response) {
          alert('Bulk invoice submitted successfully');
        }
      } catch (error) {
        alert('Error in submitting bulk invoice: ' + error.message);
      }


    }else{
      try {
        const payload = { 
          purchasePhoneId: dataReceived._id,
          salePrice: Number(dataReceived.finalPrice),
          totalInvoice: Number(totalInvoice),
          warranty: dataReceived?.warranty,
          customerName:dataReceived?.customerName,
          cnicFrontPic:"/file",
          cnicBackPic:"/file",
          sellingPaymentType:dataReceived.sellingType,
          accessories:dataReceived?.accessories,
          // accesssoryName:dataReceived.accessoryName,
          // accesssoryAmount:Number(dataReceived.accessoryPrice),
          ...(dataReceived?.sellingType === "Bank" && { bankName: dataReceived?.bankName }),

          // Conditionally add credit fields if selling type is "Credit"
          ...(dataReceived?.sellingType === "Credit" && { 
              payableAmountNow: dataReceived?.payableAmountNow,
              payableAmountLater: dataReceived?.payableAmountLater,
              payableAmountLaterDate: dataReceived?.payableAmountLaterDate
          }),
        
          // Conditionally add exchangePhoneDetail if selling type is "Exchange"
          ...(dataReceived?.sellingType === "Exchange" && { 
              exchangePhoneDetail: dataReceived?.exchangePhoneDetail 
          })
        }
        console.log("This is the single sell phone data",payload);
        
        const response = await api.post(`api/Purchase/sell-single-phone`, payload);
        console.log("This is the single phone",response);

        if (response) {
          alert('Invoice submitted successfully');
        }
      } catch (error) {
        alert('Error submitting invoice: ' + error.message);
      }
      // try {
      //   console.log("This is the single invoice data",invoiceData);
        
      //   const response = await axios.post(BASE_URL + `api/invoice/invoices`, invoiceData);

      //   if (response) {
      //     alert('Invoice submitted successfully');
      //   }
      // } catch (error) {
      //   alert('Error submitting invoice: ' + error.message);
      // }
    }
  };
console.log("this is the type",dataReceived?.type);
const totalAccessoriesPrice = dataReceived?.accessories?.reduce(
  (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
  0
);

const totalInvoice = Number(dataReceived.finalPrice || 0) + totalAccessoriesPrice;

console.log("this is the total invoice",totalInvoice);
console.log("These are the dataReceived",dataReceived.addedImeis);


  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          style={{ ...styles.button, ...styles.printBtn }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'none')}
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          style={{ ...styles.button, ...styles.downloadBtn }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'none')}
          onClick={handleDownload}
        >
          Download
        </button>
        {!dataReceived?.invoice && (
          <button
            style={{ ...styles.button, ...styles.submitBtn }}
            onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.target.style.transform = 'none')}
            onClick={handleSubmit}
          >
            Submit Invoice
          </button>
        )}
      </div>

     {dataReceived?.prices?.buyingPrice ? 
       <>
          <div id="invoice" style={styles.container}>
            {/* <h1>Bulk Mobile Invoice</h1> */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.logo}>{shop?.shopName ?? 'Shop Name'}</h2>
            <p>{shop?.contactNumber?.join(' | ') ?? 'Contact number not available'}</p>
          </div>
          <h2 style={{ color: '#004B87' }}>Okiiee</h2>
        </header>

        <section style={{ ...styles.infoSection, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
  {/* Left Side */}
         <div>
         <p style={{fontSize: "15px" , fontWeight: "bold"}}><strong>Shop Address:</strong> {shop?.address ?? 'Address not available'}</p>
         <p style={{fontSize: "15px" , fontWeight: "bold"}}><strong>Invoice No:</strong> {invoiceData.invoiceNumber}</p>
          <p style={{fontSize: "15px" , fontWeight: "bold"}}><strong>Date of Sale:</strong> {invoiceData.invoiceDate}</p>
        </div>

  {/* Right Side */}
      <div style={{ textAlign: 'right' }}>
        <p style={{fontSize: "18px" , fontWeight: "bold"}}><strong>Customer Name:</strong> {dataReceived?.partyName}</p>
        {/* <p style={{fontSize: "18px" , fontWeight: "bold"}}><strong>Customer Number:</strong> {dataReceived?.modelName}</p> */}
        { dataReceived.customerCNIC && <p style={{fontSize: "18px" , fontWeight: "bold"}}><strong>Customer CNIC:</strong> {dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.customerCNIC : dataReceived?.customerCNIC ?? 'Not Available'}</p>}
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
              <th style={styles.th}>Warranty</th>
            </tr>
          </thead>
          <tbody>
          {dataReceived?.ramSimDetails ? (
  dataReceived.ramSimDetails.map((detail, index) => (
    <tr key={index} style={styles.stripedRow}>
      {/* Mobile Company */}
      <td style={styles.td}>
        {dataReceived?.invoice?.items
          ? dataReceived?.invoice?.items[0]?.mobileCompany
          : dataReceived?.companyName ?? 'Not Available'}
      </td>

      {/* Model Name */}
      <td style={styles.td}>{dataReceived?.modelName ?? 'Not Available'}</td>

      {/* RAM Memory */}
      <td style={styles.td}>{detail?.ramMemory ?? 'Not Available'}</td>

      {/* SIM Option */}
      <td style={styles.td}>{detail?.simOption ?? 'Not Available'}</td>

      {/* IMEI Numbers */}
        {/* {detail?.imeiNumbers?.length
          ? detail.imeiNumbers.map((imei, i) => (
              <div key={i}>
               { truncate(imei.imei1, 7)} {imei?.imei2 && `/ ${truncate(imei.imei2, 7)}`} */}
                {/* {imei?.imei1} {imei?.imei2 && `/ ${imei.imei2}`} */}
              {/* </div>
            ))
          : 'N/A'} */}
       <td style={styles.td}>
        {/* {dataReceived?.addedImeis?.length || detail?.imeiNumbers?.length} */}
        <td style={styles.td}>
          {detail.imeiNumbers.length}
        </td>

         {/* dataReceived?.addedImeis.length !== 0 ? 
          <>
            {
                <div>
                 Typed Imei  */}
                    {/* {truncate(dataReceived?.addedImeis[0], 7)} */}
                {/* </div>
            }
          </> */}

          {/* :
          <>
          {
            detail?.imeiNumbers?.length ? (
              <div>
                  {truncate(detail.imeiNumbers[0].imei1, 7)}
                   {detail.imeiNumbers[0]?.imei2 && ` / ${truncate(detail.imeiNumbers[0].imei2, 7)}`}
                   {detail.imeiNumbers.length > 1 && " ..."}
              </div>
                  ) : (
                "Not Available"
            )
          }
          </>} */}
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
    <td colSpan={7} style={styles.td}>No Data Available</td>
  </tr>
)}

            {/* <tr style={styles.stripedRow}>
              <td style={styles.td}>{dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.mobileCompany : dataReceived?.companyName ?? 'N/A'}</td>
              <td style={styles.td}>{dataReceived?.modelName}</td>
              <td style={styles.td}>{dataReceived?.ramSimDetails[0]?.imeiNumbers?.imei1}</td>
              <td style={styles.td}>{dataReceived?.invoice? dataReceived?.invoice?.totalAmount :dataReceived?.finalPrice ?? 'N/A'}</td>
              <td style={styles.td}>{dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.warranty :dataReceived?.warranty ?? 'N/A'}</td>
            </tr> */}
          </tbody>
        </table>
        {dataReceived.accessoryName && (
  <div style={{ ...styles.termsSection, display: "flex",marginBottom:"10px", alignItems: "center", justifyContent:"center",border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
    <p style={{ fontWeight: "bold", minWidth: "150px" }}>Accessory Details:</p>
    <div style={{ flex: 1, display: "flex", gap: "20px" }}>
      <p><strong>Name:</strong> {dataReceived.accessoryName}</p>
      <p><strong>Sold Price:</strong> {dataReceived.accessoryPrice}</p>
    </div>
  </div>
)}
        <div style={styles.totalSection}>
          <h3>Total:{totalInvoice}Rs</h3>
        </div>
        {dataReceived.addedImeis.length !== 0? 
        <>
            <div style={styles.termsSection}>
           {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
           <div style={styles.termsHeading}>Total Selected Imeis</div>
           <div style={styles.termsText}>
  {dataReceived?.addedImeis?.length ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <span style={{ fontWeight: "bold" }}>Selected IMEIs:</span>
      {dataReceived?.ramSimDetails?.map((ramGroup, ramIndex) => {
  // Filter only those imeis that are present in addedImeis
  const matchedImeis = ramGroup.imeiNumbers.filter(imeiObj =>
    dataReceived.addedImeis.includes(imeiObj.imei1)
  );

  if (matchedImeis.length === 0) return null; // skip if no imeis matched for this RAM group

  return (
    <div key={ramIndex} style={{ marginBottom: "20px" }}>
      <StyledHeading>Ram Memory: {ramGroup.ramMemory}</StyledHeading>
      {matchedImeis.map((imeiObj, index) => (
        <div
          key={index}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <strong>Phone {index + 1}:</strong>
          <span style={{ background: "#f0f0f0", padding: "6px 10px", borderRadius: "10px" }}>
            IMEI 1: {imeiObj.imei1}
          </span>
          {imeiObj.imei2 && (
            <span style={{ background: "#f0f0f0", padding: "6px 10px", borderRadius: "10px" }}>
              IMEI 2: {imeiObj.imei2}
            </span>
          )}
        </div>
      ))}
    </div>
  );
})}

    </div>
  ) : null}
</div>

     </div>
        </>:
        <>
       {
  dataReceived.ramSimDetails?.length>0 ? (
    // <div>
    //   <div style={styles.termsSection} >
    //     <strong style={styles.termsHeading}>Total IMEIs:</strong>
    //     {dataReceived.ramSimDetails.map((detail, index) =>
    //       detail.imeiNumbers?.length ? (
    //         <div key={index} style={{ display: "flex", gap: "10px" }}>
    //           {detail.imeiNumbers.map((imeiObj, i) => (
    //             <p key={i}>{imeiObj.imei1}</p>
    //           ))}
    //         </div>
    //       ) : (
    //         <p key={index}>N/A</p>
    //       )
    //     )}
    //   </div>
    // </div>
    <div>
  <div style={styles.termsSection}>
    <strong style={styles.termsHeading}>Total IMEIs:</strong>
    <div
      style={{
        display: "flex",
        gap: "6px",
        maxWidth: "100%",
        flexDirection:"column",
        padding: "5px 0",
      }}
    >
     {/* {dataReceived.ramSimDetails.map((detail, index) => (
  <div key={index} style={{ marginBottom: "8px" , display:"flex", alignItems:"center"}}>
    <strong style={{ fontSize: "14px", color: "#333" }}>
      Phone {index + 1}:
    </strong>
    {detail.imeiNumbers?.length ? (
      <div
        style={{
          display: "flex",
   
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "4px",
        }}
      >
        {detail.imeiNumbers.map((imeiObj, i) => (
          <div
            key={i}
            style={{
              background: "#f0f0f0",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <strong>IMEI 1:</strong> {imeiObj.imei1}{" "}
            {imeiObj.imei2 ? (
              <>
                | <strong>IMEI 2:</strong> {imeiObj.imei2}
              </>
            ) : null}
          </div>
        ))}
      </div>
    ) : (
      <span style={{ fontSize: "12px", color: "#888", marginLeft: "10px" }}>
        Not Available
      </span>
    )}
  </div>
))} */}
{dataReceived?.ramSimDetails?.map((detail, detailIndex) => (
  <div key={detailIndex} style={{ marginBottom: "16px" }}>
    <StyledHeading>Ram Memory: {detail?.ramMemory}</StyledHeading>

    {detail?.imeiNumbers?.length > 0 ? <>
      {detail.imeiNumbers?.map((imeiObj, imeiIndex) => (
      <div
        key={`${detailIndex}-${imeiIndex}`}
        style={{
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <strong style={{ fontSize: "14px", color: "#333" }}>
          Phone {imeiIndex + 1}:
        </strong>
        <div
          style={{
            background: "#f0f0f0",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            marginTop: "4px",
          }}
        >
          <strong>IMEI 1:</strong> {imeiObj.imei1}
          {imeiObj.imei2 && ` | `}
          {imeiObj.imei2 && <strong>IMEI 2:</strong>} {imeiObj.imei2}
        </div>
      </div>
    ))}
    </> : <>
    <div
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          <strong>Not found</strong> 
         
        </div>
    </>}
  </div>
))}



    </div>
  </div>
</div>

  ) : (
    ""
  )
}

        </>
        }
        {/* Terms & Conditions Section */}
        {/* <div style={styles.termsSection}>
          <h3 style={styles.termsHeading}>Terms & Conditions</h3>
          <p style={styles.termsText}>1. All sales are final once the invoice is generated.</p>
          <p style={styles.termsText}>2. Warranty is valid only for products with a valid invoice.</p>
          <p style={styles.termsText}>3. The company is not responsible for any damages caused by misuse of the product.</p>
          <p style={styles.termsText}>4. Payment must be made in full before the invoice is considered complete.</p>
          <p style={styles.termsText}>5. Terms and conditions are subject to change without prior notice.</p>
        </div> */}
      {/* {dataReceived.accessoryName && <>
        <div style={styles.termsSection}>
              <div style={styles.termsHeading}>Accessory Details</div>
              <div style={styles.termsText}>
              <p><strong>Accessory Name: </strong>{dataReceived.accessoryName}</p>
              <p>Accessory Sold Price: {dataReceived.accessoryPrice}</p>
              </div>
             
          </div>
      </>} */}
 


        <div style={styles.termsSection}>
           {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
           <div style={styles.termsHeading}>Terms & conditions</div>
           <div style={styles.termsText}>
           {/* {
           dataReceived.sellingType === "Bank" ? (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Bank</p>
               <p>{dataReceived.bankName}</p>
             </div>
           ) : dataReceived.sellingType === "Credit" ? (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Credit</p>
               <p><strong>Payable Amount:</strong> {dataReceived.payableAmountNow}</p>
               <p><strong>Payable Amount Later:</strong> {dataReceived.payableAmountLater}</p>
               <p><strong>Due Date:</strong> {dataReceived.payableAmountLaterDate}</p>
             </div>
           ) : dataReceived.sellingType === "Exchange" ? (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Exchange</p>
               <p><strong>Exchange Detail:</strong> {dataReceived.exchangePhoneDetail}</p>
             </div>
           ) : (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Cash</p>
               <p><strong>Total Cash:</strong> {price}</p>
             </div>
           )
         } */}
         
             {shop?.termsCondition.map((item, index) => (
               <p key={index}><strong style={{ fontSize: '1.0rem', fontWeight: '600', color: '#333', width: '100%' }}>{index + 1}.</strong> {item}</p>
             ))}
           </div>
     </div>
        <footer style={styles.footer}>
          <p>
            {shop?.shopName ?? 'Shop Name'} | {shop?.address ?? 'Address not available'} | {shop?.contactNumber?.join(' | ') ?? 'Contact number not available'}
          </p>
        </footer>
      </div>
       </>
        :
       <>
        <div id="invoice" style={styles.container}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.logo}>{shop?.shopName ?? 'Shop Name'}</h2>
            <p>{shop?.contactNumber?.join(' | ') ?? 'Contact number not available'}</p>
          </div>
          <h2 style={{ color: '#004B87' }}>Okiiee</h2>
        </header>

        <section style={{ ...styles.infoSection, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
  {/* Left Side */}
  <div>
    <p style={{fontSize: "15px" , fontWeight: "bold"}}><strong>Shop Address:</strong> {shop?.address ?? 'Address not available'}</p>
    <p style={{fontSize: "15px" , fontWeight: "bold"}}><strong>Invoice No:</strong> {invoiceData.invoiceNumber}</p>
    <p style={{fontSize: "15px" , fontWeight: "bold"}}><strong>Date of Sale:</strong> {invoiceData.invoiceDate}</p>
  </div>

  {/* Right Side */}
  <div style={{ textAlign: 'right' }}>
    <p style={{fontSize: "18px" , fontWeight: "bold"}}><strong>Customer Name:</strong> {dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.customerName : dataReceived?.customerName ?? 'Not Available'}</p>
    {/* <p style={{fontSize: "18px" , fontWeight: "bold"}}><strong>Customer Number:</strong> {dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.customerNumber : dataReceived?.customerNumber ?? 'N/A'}</p> */}
   { dataReceived.customerCNIC && <p style={{fontSize: "18px" , fontWeight: "bold"}}><strong>Customer CNIC:</strong> {dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.customerCNIC : dataReceived?.customerCNIC ?? 'Not Available'}</p>}
  </div>
</section>


        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Model</th>
              <th style={styles.th}>{dataReceived.imei2 ? "IMEI 1" : "IMEI"}</th>
              {dataReceived.imei2 && <th style={styles.th}>IMEI 2</th>}
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Warranty</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.stripedRow}>
              <td style={styles.td}>{dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.mobileCompany : dataReceived?.companyName ?? 'Not Available'}</td>
              <td style={styles.td}>{dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.mobileName :dataReceived?.modelSpecifications ?? 'Not Available'}</td>
              <td style={styles.td}>{dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.imei :dataReceived?.imei1 ?? 'Not Available'}</td>
             {dataReceived.imei2 && <td style={styles.td}>{dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.imei2 : dataReceived.imei2 ?? 'Not Available'}</td> }
              <td style={styles.td}>{dataReceived?.invoice? dataReceived?.invoice?.totalAmount :dataReceived?.finalPrice ?? 'Not Available'}</td>
              <td style={styles.td}>{dataReceived?.invoice?.items ? dataReceived?.invoice?.items[0]?.warranty :dataReceived?.warranty ?? 'Not Available'}</td>
            </tr>
          </tbody>
        </table>
        {dataReceived.accessoryName && (
  <div style={{ ...styles.termsSection, display: "flex",marginBottom:"10px", alignItems: "center", justifyContent:"center",border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
    <p style={{ fontWeight: "bold", minWidth: "150px" }}>Accessory Details:</p>
    <div style={{ flex: 1, display: "flex", gap: "20px" }}>
      <p><strong>Name:</strong> {dataReceived.accessoryName}</p>
      <p><strong>Sold Price:</strong> {dataReceived.accessoryPrice}</p>
    </div>
  </div>
)}
        <div style={styles.totalSection}>
          <h3>Total:{totalInvoice}Rs</h3>
        </div>

 
      {/* {dataReceived.accessoryName && <>
        <div style={styles.termsSection}>
              <div style={styles.termsHeading}>Accessory Details</div>
              <div style={styles.termsText}>
              <p><strong>Accessory Name: </strong>{dataReceived.accessoryName}</p>
              <p>Accessory Sold Price: {dataReceived.accessoryPrice}</p>
              </div>
             
          </div>
      </>} */}
 

      
        <div style={styles.termsSection}>
           {/* <div style={styles.termsHeading}>Sold Type Details</div> */}
           <div style={styles.termsHeading}>Terms and conditions</div>
           <div style={styles.termsText}>
           {/* {
           dataReceived.sellingType === "Bank" ? (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Bank</p>
               <p>{dataReceived.bankName}</p>
             </div>
           ) : dataReceived.sellingType === "Credit" ? (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Credit</p>
               <p><strong>Payable Amount:</strong> {dataReceived.payableAmountNow}</p>
               <p><strong>Payable Amount Later:</strong> {dataReceived.payableAmountLater}</p>
               <p><strong>Due Date:</strong> {dataReceived.payableAmountLaterDate}</p>
             </div>
           ) : dataReceived.sellingType === "Exchange" ? (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Exchange</p>
               <p><strong>Exchange Detail:</strong> {dataReceived.exchangePhoneDetail}</p>
             </div>
           ) : (
             <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
               <p><strong>Selling Type:</strong> Cash</p>
               <p><strong>Total Cash:</strong> {price}</p>
             </div>
           )
         } */}
         
             {shop?.termsCondition.map((item, index) => (
               <p key={index}><strong style={{ fontSize: '1.0rem', fontWeight: '600', color: '#333', width: '100%' }}>{index + 1}.</strong> {item}</p>
             ))}
           </div>
     </div>
        <footer style={styles.footer}>
          <p>
            {shop?.shopName ?? 'Shop Name'} | {shop?.address ?? 'Address not available'} | {shop?.contactNumber?.join(' | ') ?? 'Contact number not available'}
          </p>
        </footer>
      </div>
       </> 
    }
    </div>
  );
};

export default SoldInvoice;
