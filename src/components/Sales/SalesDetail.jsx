import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { StyledHeading } from "components/StyledHeading/StyledHeading";

const SalesDetail = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaleDetail = async () => {
      try {
        const response = await api.get(`/api/Purchase/single-sold-phone/${id}`);
        if (response.data?.success) {
          setSale(response.data.soldPhoneDetail);
        } else {
          setError("Failed to fetch sale details");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!sale) return <div>No sale details found.</div>;

  const formatValue = (value, fallback = "Not Found") =>
    value !== undefined && value !== null && value !== "" ? value : fallback;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <StyledHeading>Sale Details</StyledHeading>
      <div style={{ lineHeight: 1.8 }}>
        <p><strong>Invoice Number:</strong> {formatValue(sale.invoiceNumber)}</p>
        <p><strong>Customer Name:</strong> {formatValue(sale.customerName)}</p>
        <p><strong>Mobile Number:</strong> {formatValue(sale.mobileNumber)}</p>
        <p><strong>Father Name:</strong> {formatValue(sale.fatherName)}</p>
        <p><strong>Company Name:</strong> {formatValue(sale.companyName)}</p>
        <p><strong>Model:</strong> {formatValue(sale.modelName)}</p>
        <p><strong>Condition:</strong> {formatValue(sale.phoneCondition)}</p>
        <p><strong>Warranty:</strong> {formatValue(sale.warranty)}</p>
        <p><strong>Specifications:</strong> {formatValue(sale.specifications)}</p>
        <p><strong>RAM:</strong> {formatValue(sale.ramMemory)} GB</p>
        <p><strong>Color:</strong> {formatValue(sale.color)}</p>
        <p><strong>IMEI 1:</strong> {formatValue(sale.imei1)}</p>
        <p><strong>IMEI 2:</strong> {formatValue(sale.imei2)}</p>
        <p><strong>Purchase Price:</strong> {formatValue(sale.purchasePrice)} PKR</p>
        <p><strong>Final Price:</strong> {formatValue(sale.finalPrice)} PKR</p>
        <p><strong>Demand Price:</strong> {formatValue(sale.demandPrice)} PKR</p>
        <p><strong>Sale Date:</strong> {sale.saleDate ? new Date(sale.saleDate).toLocaleString() : "Not Found"}</p>
        <p><strong>Purchase Date:</strong> {sale.purchaseDate ? new Date(sale.purchaseDate).toLocaleString() : "Not Found"}</p>
      </div>

      {/* Sale Type Section */}
      <div style={{ marginTop: "20px" }}>
        <StyledHeading>Sale Type</StyledHeading>
        {sale.sellingPaymentType ? (
          <>
            {sale.sellingPaymentType === "Bank" && (
              <div style={styleCard}>
                <p><strong>Selling Type:</strong> Bank</p>
                <p><strong>Bank Name:</strong> {formatValue(sale.bankName)}</p>
              </div>
            )}
            {sale.sellingPaymentType === "Credit" && (
              <div style={styleCard}>
                <p><strong>Selling Type:</strong> Credit</p>
                <p><strong>Payable Now:</strong> {formatValue(sale.payableAmountNow)} PKR</p>
                <p><strong>Payable Later:</strong> {formatValue(sale.payableAmountLater)} PKR</p>
                <p><strong>Due Date:</strong> {formatValue(sale.payableAmountLaterDate)}</p>
              </div>
            )}
            {sale.sellingPaymentType === "Exchange" && (
              <div style={styleCard}>
                <p><strong>Selling Type:</strong> Exchange</p>
                <p><strong>Exchange Detail:</strong> {formatValue(sale.exchangePhoneDetail)}</p>
              </div>
            )}
            {sale.sellingPaymentType === "Cash" && (
              <div style={styleCard}>
                <p><strong>Selling Type:</strong> Cash</p>
                <p><strong>Total Cash:</strong> {formatValue(sale.finalPrice)} PKR</p>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "gray" }}>No sale type mentioned.</p>
        )}
      </div>

      {/* Accessories */}
      <div style={{ marginTop: "24px" }}>
        <StyledHeading>Accessories</StyledHeading>
        {sale.accessories && sale.accessories.length > 0 ? (
          <div style={accessoryContainer}>
            {sale.accessories.map((acc, i) => (
              <div key={i} style={accessoryCard}>
                <p style={{ fontWeight: "600" }}>{formatValue(acc.name)}</p>
                <p style={{ fontSize: "14px", color: "#4B5563" }}>Qty: {formatValue(acc.quantity)}</p>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2937" }}>{formatValue(acc.price)} PKR</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#9CA3AF", fontStyle: "italic", marginTop: "8px" }}>
            No accessories found
          </p>
        )}
      </div>
    </div>
  );
};

const styleCard = {
  padding: "12px",
  marginTop: "12px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  lineHeight: 1.6,
};

const accessoryContainer = {
  display: "flex",
  gap: "16px",
  padding: "8px",
  borderRadius: "8px",
  flexWrap: "wrap",
};

const accessoryCard = {
  padding: "10px",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  width: "150px",
  textAlign: "center",
};

export default SalesDetail;


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { api } from "../../../api/api";
// import { StyledHeading } from "components/StyledHeading/StyledHeading";

// const SalesDetail = () => {
//     const { id } = useParams();
//     const [sale, setSale] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSaleDetail = async () => {
//             try {
//                 const response = await api.get(`/api/Purchase/single-sold-phone/${id}`);
//                 if (response.data?.success) {
//                     setSale(response.data.soldPhoneDetail);
//                 } else {
//                     setError("Failed to fetch sale details");
//                 }
//             } catch (err) {
//                 setError("Network error");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSaleDetail();
//     }, [id]);
    
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//             <h2>Sale Details</h2>
//             {sale ? (
//                 <>
//                     <p><strong>Invoice Number:</strong> {sale.invoiceNumber}</p>
//                     <p><strong>Customer Name:</strong> {sale.customerName}</p>
//                     <p><strong>Mobile Number:</strong> {sale.mobileNumber}</p>
//                     <p><strong>Father Name:</strong> {sale.fatherName}</p>
//                     <p><strong>Company Name:</strong> {sale.companyName}</p>
//                     <p><strong>Model:</strong> {sale.modelName}</p>
//                     <p><strong>Condition:</strong> {sale.phoneCondition}</p>
//                     <p><strong>Warranty:</strong> {sale.warranty}</p>
//                     <p><strong>Specifications:</strong> {sale.specifications}</p>
//                     <p><strong>RAM:</strong> {sale.ramMemory} GB</p>
//                     <p><strong>Color:</strong> {sale.color}</p>
//                     <p><strong>IMEI 1:</strong> {sale.imei1}</p>
//                     <p><strong>IMEI 2:</strong> {sale.imei2}</p>
//                     <p><strong>Purchase Price:</strong> {sale.purchasePrice} PKR</p>
//                     <p><strong>Final Price:</strong> {sale.finalPrice} PKR</p>
//                     <p><strong>Demand Price:</strong> {sale.demandPrice} PKR</p>
//                     <p><strong>Sale Date:</strong> {new Date(sale.saleDate).toLocaleString()}</p>
//                     <p><strong>Purchase Date:</strong> {new Date(sale.purchaseDate).toLocaleString()}</p>
//                     {
//                         sale.sellingPaymentType ? 
//                         <>
//                         <StyledHeading>Sale Type</StyledHeading>
//                             {
//                      sale.sellingPaymentType === "Bank" ? (
//                        <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
//                          <p><strong>Selling Type:</strong> Bank</p>
//                          <p>{sale.bankName}</p>
//                        </div>
//                      ) : sale.sellingPaymentType === "Credit" ? (
//                        <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
//                          <p><strong>Selling Type:</strong> Credit</p>
//                          <p><strong>Payable Amount:</strong> {sale.payableAmountNow}</p>
//                          <p><strong>Payable Amount Later:</strong> {sale.payableAmountLater}</p>
//                          <p><strong>Due Date:</strong> {sale.payableAmountLaterDate}</p>
//                        </div>
//                      ) : sale.sellingPaymentType === "Exchange" ? (
//                        <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
//                          <p><strong>Selling Type:</strong> Exchange</p>
//                          <p><strong>Exchange Detail:</strong> {sale.exchangePhoneDetail}</p>
//                        </div>
//                      ) : (
//                        <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
//                          <p><strong>Selling Type:</strong> Cash</p>
//                          <p><strong>Total Cash:</strong> {sale.finalPrice}</p>
//                        </div>
//                      )
//                    }
//                         </>
//                         :
//                         <>
//                         <p>No sale type mentioned</p>
//                         </>
//                     }
//                     <div style={{ marginTop: "16px" }}>
//   <p style={{ fontWeight: "bold" }}>Accessories:</p>

//   {sale.accessories.length > 0 ? (
//     <div style={{ display: "flex", gap: "16px", padding: "8px", background: "#f3f4f6", borderRadius: "8px" }}>
//       {sale.accessories.map((accessory, index) => (
//         <div 
//           key={index} 
//           style={{ 
//             padding: "8px", 
//             background: "white", 
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
//             borderRadius: "8px", 
//             textAlign: "center",
//             flex: "1"
//           }}
//         >
//           <p style={{ fontWeight: "600" }}>{accessory.name}</p>
//           <p style={{ fontSize: "14px", color: "#4B5563" }}>Qty: {accessory.quantity}</p>
//           <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2937" }}> {accessory.price}</p>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <p style={{ color: "#9CA3AF", fontStyle: "italic", marginTop: "8px" }}>No accessories found</p>
//   )}
// </div>

//                 </>
//             ) : (
//                 <p>No sale details available.</p>
//             )}
//         </div>
//     );
// };

// export default SalesDetail;
