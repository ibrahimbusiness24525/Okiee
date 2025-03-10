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
    console.log("sales detail", sale);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Sale Details</h2>
            {sale ? (
                <>
                    <p><strong>Invoice Number:</strong> {sale.invoiceNumber}</p>
                    <p><strong>Customer Name:</strong> {sale.customerName}</p>
                    <p><strong>Mobile Number:</strong> {sale.mobileNumber}</p>
                    <p><strong>Father Name:</strong> {sale.fatherName}</p>
                    <p><strong>Company Name:</strong> {sale.companyName}</p>
                    <p><strong>Model:</strong> {sale.modelName}</p>
                    <p><strong>Condition:</strong> {sale.phoneCondition}</p>
                    <p><strong>Warranty:</strong> {sale.warranty}</p>
                    <p><strong>Specifications:</strong> {sale.specifications}</p>
                    <p><strong>RAM:</strong> {sale.ramMemory} GB</p>
                    <p><strong>Color:</strong> {sale.color}</p>
                    <p><strong>IMEI 1:</strong> {sale.imei1}</p>
                    <p><strong>IMEI 2:</strong> {sale.imei2}</p>
                    <p><strong>Purchase Price:</strong> {sale.purchasePrice} PKR</p>
                    <p><strong>Final Price:</strong> {sale.finalPrice} PKR</p>
                    <p><strong>Demand Price:</strong> {sale.demandPrice} PKR</p>
                    <p><strong>Sale Date:</strong> {new Date(sale.saleDate).toLocaleString()}</p>
                    <p><strong>Purchase Date:</strong> {new Date(sale.purchaseDate).toLocaleString()}</p>
                    {
                        sale.sellingPaymentType ? 
                        <>
                        <StyledHeading>Sale Type</StyledHeading>
                            {
                     sale.sellingPaymentType === "Bank" ? (
                       <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                         <p><strong>Selling Type:</strong> Bank</p>
                         <p>{sale.bankName}</p>
                       </div>
                     ) : sale.sellingPaymentType === "Credit" ? (
                       <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                         <p><strong>Selling Type:</strong> Credit</p>
                         <p><strong>Payable Amount:</strong> {sale.payableAmountNow}</p>
                         <p><strong>Payable Amount Later:</strong> {sale.payableAmountLater}</p>
                         <p><strong>Due Date:</strong> {sale.payableAmountLaterDate}</p>
                       </div>
                     ) : sale.sellingPaymentType === "Exchange" ? (
                       <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                         <p><strong>Selling Type:</strong> Exchange</p>
                         <p><strong>Exchange Detail:</strong> {sale.exchangePhoneDetail}</p>
                       </div>
                     ) : (
                       <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                         <p><strong>Selling Type:</strong> Cash</p>
                         <p><strong>Total Cash:</strong> {sale.finalPrice}</p>
                       </div>
                     )
                   }
                        </>
                        :
                        <>
                        <p>No sale type mentioned</p>
                        </>
                    }
                    <div style={{ marginTop: "16px" }}>
  <p style={{ fontWeight: "bold" }}>Accessories:</p>

  {sale.accessories.length > 0 ? (
    <div style={{ display: "flex", gap: "16px", padding: "8px", background: "#f3f4f6", borderRadius: "8px" }}>
      {sale.accessories.map((accessory, index) => (
        <div 
          key={index} 
          style={{ 
            padding: "8px", 
            background: "white", 
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
            borderRadius: "8px", 
            textAlign: "center",
            flex: "1"
          }}
        >
          <p style={{ fontWeight: "600" }}>{accessory.name}</p>
          <p style={{ fontSize: "14px", color: "#4B5563" }}>Qty: {accessory.quantity}</p>
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2937" }}> {accessory.price}</p>
        </div>
      ))}
    </div>
  ) : (
    <p style={{ color: "#9CA3AF", fontStyle: "italic", marginTop: "8px" }}>No accessories found</p>
  )}
</div>

                </>
            ) : (
                <p>No sale details available.</p>
            )}
        </div>
    );
};

export default SalesDetail;
