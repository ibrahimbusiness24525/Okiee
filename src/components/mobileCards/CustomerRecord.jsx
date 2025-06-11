
import { useState } from "react";
import { api } from "../../../api/api";
import { StyledHeading } from "components/StyledHeading/StyledHeading";
import styled from "styled-components";
import { dateFormatter } from "utils/dateFormatter";

const Card = styled.div`
  border: 1px solid #d0d7de;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: ${(props) => (props.type === "sold" ? "#f9f9f9" : "#eef6ff")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
  font-size: 14px;
`;

const InfoItem = styled.div`
  strong {
    color: #555;
  }
`;

const AccessoriesList = styled.ul`
  padding-left: 18px;
  margin-top: 8px;
`;

const RecordSection = styled.div`
  margin-bottom: 40px;
`;
const Dot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 6px;
  border-radius: 50%;
  background-color: ${props => props.color === "green" ? "#28a745" : "#dc3545"};
`;

const CustomerRecord = () => {
  const [customerNumber, setCustomerNumber] = useState("");
  const [soldRecord, setSoldRecord] = useState([]);

  const getSoldRecord = async () => {
    try {
      const response = await api.get(`/api/Purchase/customer-sold-record/${customerNumber}`);
      setSoldRecord(response?.data || []);
    } catch (error) {
      console.error("Error fetching sold record:", error);
    }
  };

  const isSingleSale = (item) => !item.bulkPhonePurchaseId;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
   <div
  style={{
    maxWidth: "500px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.03)",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      fontSize: "20px",
      fontWeight: "normal",
      marginBottom: "8px",
      color: "#2c3e50",
    }}
  >
    Get Customer Record
  </h3>

  <p
    style={{
      fontSize: "14px",
      color: "#555",
      marginBottom: "20px",
      lineHeight: "1.5",
    }}
  >
    Enter the customer's phone number below to view the record sales and purchase of customer. This helps in tracking their order history efficiently.
  </p>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    <input
      type="text"
      placeholder="Customer Phone Number"
      value={customerNumber}
      onChange={(e) => setCustomerNumber(e.target.value)}
      style={{
        flex: "1 1 220px",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        color: "#333",
      }}
    />

    <button
      onClick={getSoldRecord}
      style={{
        padding: "10px 18px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = "#0069d9")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = "#007BFF")
      }
    >
      Get Record
    </button>
  </div>
</div>
<>
    {/* Sold Records */}
    {soldRecord.filter(r => r.type === "sold").length > 0 ? (
      <RecordSection>
        <StyledHeading>Sold Phone Records</StyledHeading>
        {soldRecord.filter(r => r.type === "sold").map((record, index) => {
          const doc = record._doc || {};
          return (
            <Card key={doc._id || index} type="sold">
  <CardHeader>Sold Phone</CardHeader>
  <InfoGrid>
    {doc.customerName && <InfoItem><strong>Customer Name:</strong> {doc.customerName}</InfoItem>}
    {doc.modelName && <InfoItem><strong>Model:</strong> {doc.modelName}</InfoItem>}
    {doc.imei1 && <InfoItem><strong>IMEI 1:</strong> {doc.imei1}</InfoItem>}
    {doc.imei2 && <InfoItem><strong>IMEI 2:</strong> {doc.imei2}</InfoItem>}
    {doc.salePrice && <InfoItem><strong>Sale Price:</strong> Rs {doc.salePrice}</InfoItem>}
    {doc.totalInvoice && <InfoItem><strong>Total Invoice:</strong> Rs {doc.totalInvoice}</InfoItem>}
    {doc.sellingPaymentType && <InfoItem><strong>Payment Type:</strong> {doc.sellingPaymentType}</InfoItem>}
    
    {/* Show Credit Details if payment is Credit */}
    {doc.sellingPaymentType === "Credit" && (
      <>
        {doc.payableAmountNow !== undefined && (
          <InfoItem>
            <Dot color="green" />
            <strong> Pay Now:</strong> Rs {doc.payableAmountNow}
          </InfoItem>
        )}
        {doc.payableAmountLater !== undefined && (
          <InfoItem>
            <Dot color="red" />
            <strong> Pay Later:</strong> Rs {doc.payableAmountLater}
          </InfoItem>
        )}
      </>
    )}

    {doc.purchasePrice && <InfoItem><strong>Purchase Price:</strong> Rs {doc.purchasePrice}</InfoItem>}
    {doc.color && <InfoItem><strong>Color:</strong> {doc.color}</InfoItem>}
    {doc.warranty && <InfoItem><strong>Warranty:</strong> {doc.warranty}</InfoItem>}
    {doc.specifications && <InfoItem><strong>Specifications:</strong> {doc.specifications}</InfoItem>}
    {doc.phoneCondition && <InfoItem><strong>Condition:</strong> {doc.phoneCondition}</InfoItem>}
    {doc.createdAt && <InfoItem><strong>Sold at: </strong> {dateFormatter(doc.createdAt)}</InfoItem>}
  </InfoGrid>

  {doc.accessories?.length > 0 && (
    <div style={{ marginTop: "12px" }}>
      <strong>Accessories:</strong>
      <AccessoriesList>
        {doc.accessories.map((acc, idx) => (
          <li key={idx}>
            {acc.name} (x{acc.quantity}) - Rs {acc.price}
          </li>
        ))}
      </AccessoriesList>
    </div>
  )}
</Card>

          );
        })}
      </RecordSection>
    ) : 
    <RecordSection>
    <StyledHeading>Sold Phone Records</StyledHeading>
    <p>No sold phone records found.</p>
  </RecordSection>
    }

    {/* Purchased Records */}
    {soldRecord.filter(r => r.type === "purchase").length > 0 ? (
      <RecordSection>
        <StyledHeading>Purchased Phone Records</StyledHeading>
        {soldRecord.filter(r => r.type === "purchase").map((record, index) => {
          const doc = record._doc || {};
          return (
            <Card key={doc._id || index} type="purchase">
              <CardHeader>Purchased Phone</CardHeader>
              <InfoGrid>
                {doc.name && <InfoItem><strong>Customer Name:</strong> {doc.name}</InfoItem>}
                {doc.modelName && <InfoItem><strong>Model:</strong> {doc.modelName}</InfoItem>}
                {doc.imei1 && <InfoItem><strong>IMEI 1:</strong> {doc.imei1}</InfoItem>}
                {doc.imei2 && <InfoItem><strong>IMEI 2:</strong> {doc.imei2}</InfoItem>}
                {doc.price?.purchasePrice && <InfoItem><strong>Purchase Price:</strong> Rs {doc.price.purchasePrice}</InfoItem>}
                {doc.price?.finalPrice && <InfoItem><strong>Final Price:</strong> Rs {doc.price.finalPrice}</InfoItem>}
                {doc.price?.demandPrice && <InfoItem><strong>Demand Price:</strong> Rs {doc.price.demandPrice}</InfoItem>}
                {doc.color && <InfoItem><strong>Color:</strong> {doc.color}</InfoItem>}
                {doc.ramMemory && <InfoItem><strong>RAM:</strong> {doc.ramMemory}</InfoItem>}
                {doc.warranty && <InfoItem><strong>Warranty:</strong> {doc.warranty}</InfoItem>}
                {doc.specifications && <InfoItem><strong>Specifications:</strong> {doc.specifications}</InfoItem>}
                {doc.phoneCondition && <InfoItem><strong>Condition:</strong> {doc.phoneCondition}</InfoItem>}
                {doc.batteryHealth && <InfoItem><strong>Battery Health:</strong> {doc.batteryHealth}</InfoItem>}
                {doc.createdAt && <InfoItem><strong>
                  Purchased at: </strong> {dateFormatter(doc.createdAt)}</InfoItem>}
              </InfoGrid>
              {doc.accessories && typeof doc.accessories === "object" && (
                <div style={{ marginTop: "12px" }}>
                  <strong>Accessories:</strong>
                  <AccessoriesList>
                    {Object.entries(doc.accessories).map(([key, value]) => (
                      <li key={key}>{key}: {value ? "Yes" : "No"}</li>
                    ))}
                  </AccessoriesList>
                </div>
              )}
            </Card>
          );
        })}
      </RecordSection>
    ): 
    <RecordSection>
      <StyledHeading>Purchased Phone Records</StyledHeading>
      <p>No purchased phone records found.</p>
    </RecordSection>
    }
  </>

  </div>
)}

     
   

export default CustomerRecord;
