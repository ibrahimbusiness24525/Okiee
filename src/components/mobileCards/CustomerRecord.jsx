import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { StyledHeading } from "components/StyledHeading/StyledHeading";
import styled from "styled-components";
import { dateFormatter } from "utils/dateFormatter";
import { get } from "jquery";

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
  const [allParties, setAllParties] = useState([]);
  const [partyDetails, setPartyDetails] = useState(null);
  const [persons, setPersons] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const getSoldRecord = async () => {
    try {
      const response = await api.get(`/api/Purchase/customer-sold-record/${customerNumber}`);
      const responseData = response?.data?.data;
      
      if (responseData) {
        // Combine all record types into a single array for backward compatibility
        const allRecords = [
          ...(responseData.singlePurchases || []).map(record => ({ ...record, type: "purchase" })),
          ...(responseData.singleSales || []).map(record => ({ ...record, type: "sold" })),
          ...(responseData.bulkPurchases || []).map(record => ({ ...record, type: "purchase" })),
          ...(responseData.bulkSales || []).map(record => ({ ...record, type: "sold" }))
        ];
        setSoldRecord(allRecords);
      } else {
        setSoldRecord([]);
      }
    } catch (error) {
      console.error("Error fetching sold record:", error);
      setSoldRecord([]);
    }
  };

  const isSingleSale = (item) => !item.bulkPhonePurchaseId;
  const getAllParties = async () => {
    try {
      const response = await api.get('/api/partyLedger/partyNameAndId');
      setAllParties(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  }
  console.log("All parties:", allParties);

  const getPartyDetails = async (personId) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = `/api/person/detail-of-purchase-sale-by-person/${personId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      setPartyDetails(response?.data || {});
    }
    catch (error) {
      console.error("Error fetching party details:", error);
    }
  }
  const fetchPersons = async () => {
    try {
      const data = await api.get('/api/person/all');
      setPersons(data?.data || []);
    } catch (error) {
      console.log('Error fetching data. Please try again.');
    }
  };
  console.log("persons", persons);
  console.log("partyDetails", partyDetails);

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedPartyId(e.target.value);
  };

  const handleGetPartyRecord = () => {
    if (!selectedPartyId) {
      alert("Please select a party first.");
      return;
    }
    getPartyDetails(selectedPartyId);
    // Add your logic to fetch or show the party record here
  };
  console.log("partyDetails", partyDetails);

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
              // Handle both old structure (_doc) and new structure (direct record)
              const doc = record._doc || record;
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
              // Handle both old structure (_doc) and new structure (direct record)
              const doc = record._doc || record;
              
              // Check if this is a bulk purchase record
              const isBulkPurchase = doc.ramSimDetails && Array.isArray(doc.ramSimDetails);
              
              return (
                <Card key={doc._id || index} type="purchase">
                  <CardHeader>{isBulkPurchase ? "Bulk Purchase" : "Purchased Phone"}</CardHeader>
                  <InfoGrid>
                    {/* Party/Person information */}
                    {doc.personId?.name && <InfoItem><strong>Party Name:</strong> {doc.personId.name}</InfoItem>}
                    {doc.name && <InfoItem><strong>Customer Name:</strong> {doc.name}</InfoItem>}
                    
                    {/* Bulk purchase specific fields */}
                    {isBulkPurchase ? (
                      <>
                        {doc.totalQuantity && <InfoItem><strong>Total Quantity:</strong> {doc.totalQuantity}</InfoItem>}
                        {doc.status && <InfoItem><strong>Status:</strong> {doc.status}</InfoItem>}
                        {doc.purchasePaymentStatus && <InfoItem><strong>Payment Status:</strong> {doc.purchasePaymentStatus}</InfoItem>}
                        {doc.purchasePaymentType && <InfoItem><strong>Payment Type:</strong> {doc.purchasePaymentType}</InfoItem>}
                        {doc.prices?.buyingPrice && <InfoItem><strong>Buying Price:</strong> Rs {doc.prices.buyingPrice}</InfoItem>}
                        {doc.prices?.dealerPrice && <InfoItem><strong>Dealer Price:</strong> Rs {doc.prices.dealerPrice}</InfoItem>}
                        
                        {/* Credit payment details for bulk purchases */}
                        {doc.creditPaymentData && (
                          <>
                            {doc.creditPaymentData.payableAmountNow && (
                              <InfoItem>
                                <Dot color="green" />
                                <strong> Pay Now:</strong> Rs {doc.creditPaymentData.payableAmountNow}
                              </InfoItem>
                            )}
                            {doc.creditPaymentData.payableAmountLater && (
                              <InfoItem>
                                <Dot color="red" />
                                <strong> Pay Later:</strong> Rs {doc.creditPaymentData.payableAmountLater}
                              </InfoItem>
                            )}
                          </>
                        )}
                        
                        {/* RAM/Sim Details */}
                        {doc.ramSimDetails?.map((ramSim, ramIndex) => (
                          <div key={ramIndex} style={{ marginTop: "8px", padding: "8px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                            <InfoItem><strong>Model {ramIndex + 1}:</strong> {ramSim.modelName || "Unknown"}</InfoItem>
                            <InfoItem><strong>Company:</strong> {ramSim.companyName || "Unknown"}</InfoItem>
                            <InfoItem><strong>RAM:</strong> {ramSim.ramMemory || "N/A"}</InfoItem>
                            <InfoItem><strong>SIM:</strong> {ramSim.simOption || "N/A"}</InfoItem>
                            <InfoItem><strong>Price per unit:</strong> Rs {ramSim.priceOfOne || "N/A"}</InfoItem>
                            
                            {/* IMEI Numbers */}
                            {ramSim.imeiNumbers?.map((imei, imeiIndex) => (
                              <InfoItem key={imeiIndex}>
                                <strong>IMEI {imeiIndex + 1}:</strong> {imei.imei1}
                                {imei.color && <span> (Color: {imei.color})</span>}
                              </InfoItem>
                            ))}
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {/* Single purchase fields */}
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
                      </>
                    )}
                    
                    {doc.createdAt && <InfoItem><strong>
                      Purchased at: </strong> {dateFormatter(doc.createdAt)}</InfoItem>}
                  </InfoGrid>
                  
                  {/* Accessories for single purchases */}
                  {!isBulkPurchase && doc.accessories && typeof doc.accessories === "object" && (
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
        ) :
          <RecordSection>
            <StyledHeading>Purchased Phone Records</StyledHeading>
            <p>No purchased phone records found.</p>
          </RecordSection>
        }

      </>
      <div style={{
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        margin: "0 auto",
        padding: "20px"
      }}>
        {/* Party Selection Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
          border: "1px solid #eef2f7",
          flexWrap: "wrap"
        }}>
          <div style={{ width: "100%" }}>
            <h3 style={{
              margin: 0,
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#1f2937"
            }}>Filter Ledger Analytics</h3>
            <p style={{
              margin: 0,
              marginBottom: "16px",
              fontSize: "13px",
              color: "#6b7280"
            }}>Choose a person and optional date range to load sales and purchases.</p>
          </div>
          {/* <select
            value={selectedPartyId}
            onChange={handleSelectChange}
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #ced4da",
              backgroundColor: "#fff",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.08)",
              transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
              outline: "none",
              cursor: "pointer",
              ":hover": {
                borderColor: "#80bdff",
                boxShadow: "0 0 0 0.2rem rgba(0,123,255,0.25)"
              }
            }}
          >
            <option value="">Select Party</option>
            {allParties.map((party) => (
              <option key={party._id} value={party._id}>
                {party.partyName}
              </option>
            ))}
          </select> */}
           <select
                value={selectedPartyId}
                onChange={(e) =>
                  setSelectedPartyId(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(17,24,39,0.06)'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 2px 8px rgba(17,24,39,0.06)'; }}
                required
              >
                <option value="">Select a person</option>
                {[...persons]
                  .sort(
                    (a, b) => (b.favourite === true) - (a.favourite === true)
                  )
                  .map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.name} - {person.number}
                    </option>
                  ))}
              </select>
  
         {/* Date Range */}
         <div style={{
           display: "grid",
           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
           gap: "12px",
           width: "100%"
         }}>
           <div>
             <label style={{
               display: "block",
               fontSize: "12px",
               color: "#6b7280",
               marginBottom: "6px",
               fontWeight: 600
             }}>Start Date</label>
             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               <span style={{ fontSize: "16px" }}>📅</span>
               <input
                 type="date"
                 value={startDate}
                 onChange={(e) => setStartDate(e.target.value)}
                 style={{
                   width: "100%",
                   padding: "12px 14px",
                   border: "2px solid #e5e7eb",
                   borderRadius: "10px",
                   fontSize: "14px",
                   outline: "none",
                   transition: "border-color 0.2s, box-shadow 0.2s",
                   boxShadow: '0 2px 8px rgba(17,24,39,0.06)'
                 }}
                 onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                 onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 2px 8px rgba(17,24,39,0.06)'; }}
               />
             </div>
           </div>
           <div>
             <label style={{
               display: "block",
               fontSize: "12px",
               color: "#6b7280",
               marginBottom: "6px",
               fontWeight: 600
             }}>End Date</label>
             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               <span style={{ fontSize: "16px" }}>📅</span>
               <input
                 type="date"
                 value={endDate}
                 onChange={(e) => setEndDate(e.target.value)}
                 style={{
                   width: "100%",
                   padding: "12px 14px",
                   border: "2px solid #e5e7eb",
                   borderRadius: "10px",
                   fontSize: "14px",
                   outline: "none",
                   transition: "border-color 0.2s, box-shadow 0.2s",
                   boxShadow: '0 2px 8px rgba(17,24,39,0.06)'
                 }}
                 onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                 onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 2px 8px rgba(17,24,39,0.06)'; }}
               />
             </div>
           </div>
           <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-start" }}>
             <button
               onClick={() => { setStartDate(''); setEndDate(''); }}
               style={{
                 padding: "10px 14px",
                 fontSize: "13px",
                 fontWeight: 600,
                 background: "linear-gradient(135deg,#94a3b8 0%, #6b7280 100%)",
                 color: "#fff",
                 border: "none",
                 borderRadius: "10px",
                 cursor: "pointer",
                 transition: "transform 0.15s ease, box-shadow 0.2s ease",
                 boxShadow: '0 6px 14px rgba(107,114,128,0.25)'
               }}
               onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
               onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
             >
               Clear
             </button>
           </div>
         </div>
          <button
            onClick={handleGetPartyRecord}
            disabled={!selectedPartyId}
            style={{
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: selectedPartyId ? "pointer" : "not-allowed",
              background: selectedPartyId ? "linear-gradient(135deg,#6366f1 0%, #8b5cf6 100%)" : "#b0b0b0",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              transition: "transform 0.15s ease, box-shadow 0.2s ease",
              boxShadow: selectedPartyId ? '0 10px 20px rgba(99,102,241,0.25)' : '0 4px 8px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => { if (selectedPartyId) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { if (selectedPartyId) e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get Person Record
          </button>
        </div>

        {partyDetails && partyDetails.person && partyDetails.saleDetails && partyDetails.purchaseDetails && (
          <div>
            {/* Person Ledger Analytics */}
            <div style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              padding: "0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              {/* Header Section */}
              <div style={{
                padding: "18px 24px",
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #e9ecef",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h2 style={{
                  margin: "0",
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#212529"
                }}>
                  📊 {partyDetails?.person?.name}'s Ledger Analytics
                </h2>
                <div style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  backgroundColor: "#e9ecef",
                  padding: "4px 10px",
                  borderRadius: "50px",
                  fontWeight: "500"
                }}>
                  Status: {partyDetails.person.status}
                </div>
              </div>

              {/* Analytics Content */}
              <div style={{ padding: "20px 24px" }}>
                {/* Key Metrics Row */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "12px",
                  marginBottom: "24px"
                }}>
                  {/* Total Sales Count */}
                  <div style={{
                    backgroundColor: "#e8f5e8",
                    padding: "16px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #28a745",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#28a745", marginBottom: "4px" }}>
                      {partyDetails.summary.totalBulkSales + partyDetails.summary.totalSingleSales}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "500" }}>Total Sales</div>
                  </div>

                  {/* Total Sales Amount */}
                  <div style={{
                    backgroundColor: "#e3f2fd",
                    padding: "16px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #2196f3",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#2196f3", marginBottom: "4px" }}>
                      {(() => {
                        const bulkSalesTotal = (partyDetails.saleDetails?.bulkSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
                        const singleSalesTotal = (partyDetails.saleDetails?.singleSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
                        return (bulkSalesTotal + singleSalesTotal).toLocaleString();
                      })()}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "500" }}>Sales Amount</div>
                  </div>

                  {/* Total Purchases Count */}
                  <div style={{
                    backgroundColor: "#fff3e0",
                    padding: "16px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #ff9800",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#ff9800", marginBottom: "4px" }}>
                      {partyDetails.summary.totalBulkPurchases + partyDetails.summary.totalSinglePurchases}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "500" }}>Total Purchases</div>
                  </div>

                  {/* Net Credit Status */}
                  <div style={{
                    backgroundColor: partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#f8d7da" : "#d4edda",
                    padding: "16px",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#dc3545" : "#28a745"}`,
                    textAlign: "center"
                  }}>
                    <div style={{ 
                      fontSize: "18px", 
                      fontWeight: "700", 
                      color: partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#dc3545" : "#28a745", 
                      marginBottom: "4px" 
                    }}>
                      {Math.abs(partyDetails.person.givingCredit - partyDetails.person.takingCredit).toLocaleString()}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6c757d", fontWeight: "500" }}>
                      {partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "Net Receivable" : "Net Payable"}
                    </div>
                  </div>
                </div>

                {/* Receivables/Payables Summary */}
                <div style={{
                  backgroundColor: partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#f8d7da" : "#d4edda",
                    padding: "18px",
                    borderRadius: "8px",
                  borderLeft: `4px solid ${partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#dc3545" : "#28a745"}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  marginBottom: "24px"
                  }}>
                    <h3 style={{
                      color: "#495057",
                      marginTop: "0",
                      marginBottom: "16px",
                      fontSize: "16px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{
                        display: "inline-block",
                        width: "24px",
                        height: "24px",
                      backgroundColor: partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#dc3545" : "#28a745",
                        color: "#fff",
                        borderRadius: "50%",
                        textAlign: "center",
                        lineHeight: "24px",
                        fontSize: "12px"
                    }}>
                      {partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "📈" : "📉"}
                    </span>
                    {partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "Total Receivables" : "Total Payables"}
                    </h3>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px"
                  }}>
                    {/* Main Amount */}
                    <div style={{
                      backgroundColor: "#fff",
                      padding: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      textAlign: "center"
                    }}>
                      <div style={{
                        color: partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#dc3545" : "#28a745",
                        fontWeight: "600",
                        marginBottom: "8px",
                          fontSize: "14px"
                      }}>
                        {partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "Amount to Receive" : "Amount to Pay"}
                      </div>
                      <div style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        PKR {Math.abs(partyDetails.person.givingCredit - partyDetails.person.takingCredit).toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "4px"
                      }}>
                        {partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "From customer" : "To customer"}
                      </div>
                    </div>

                    {/* Taking Credit */}
                    <div style={{
                      backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{
                        color: "#28a745",
                        fontWeight: "600",
                        marginBottom: "6px",
                          fontSize: "14px"
                      }}>
                        Taking Credit
                      </div>
                      <div style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        PKR {partyDetails.person.takingCredit.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "4px"
                      }}>
                        Amount to receive
                      </div>
                    </div>

                    {/* Giving Credit */}
                    <div style={{
                      backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{
                        color: "#dc3545",
                        fontWeight: "600",
                        marginBottom: "6px",
                        fontSize: "14px"
                      }}>
                        Giving Credit
                      </div>
                      <div style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        PKR {partyDetails.person.givingCredit.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "4px"
                      }}>
                        Amount to pay
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{
                      backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <div style={{
                          color: "#495057",
                        fontWeight: "600",
                        marginBottom: "8px",
                          fontSize: "14px"
                      }}>
                        Current Status
                      </div>
                      <div style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        backgroundColor: partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#dc3545" : "#28a745",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "600"
                      }}>
                        {partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "RECEIVABLE" : "PAYABLE"}
                      </div>
                      </div>
                    </div>
                  </div>

                {/* Detailed Analytics Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px"
                }}>
                  {/* Sales Analytics */}
                  <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "18px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #28a745",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}>
                    <h3 style={{
                      color: "#495057",
                      marginTop: "0",
                      marginBottom: "16px",
                      fontSize: "16px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{
                        display: "inline-block",
                        width: "24px",
                        height: "24px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        borderRadius: "50%",
                        textAlign: "center",
                        lineHeight: "24px",
                        fontSize: "12px"
                      }}>📈</span>
                      Sales Analytics
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Bulk Sales:</span>
                        <span style={{ fontWeight: "600", color: "#212529" }}>
                          {partyDetails.summary.totalBulkSales} items
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Bulk Sales Amount:</span>
                        <span style={{ fontWeight: "600", color: "#28a745" }}>
                          PKR{(partyDetails.saleDetails?.bulkSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Single Sales:</span>
                        <span style={{ fontWeight: "600", color: "#212529" }}>
                          {partyDetails.summary.totalSingleSales} items
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Single Sales Amount:</span>
                        <span style={{ fontWeight: "600", color: "#28a745" }}>
                          PKR{(partyDetails.saleDetails?.singleSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e9ecef", paddingTop: "8px" }}>
                        <span style={{ color: "#495057", fontSize: "14px", fontWeight: "600" }}>Total Sales:</span>
                        <span style={{ fontWeight: "700", color: "#28a745", fontSize: "16px" }}>
                          PKR{(() => {
                            const bulkSalesTotal = (partyDetails.saleDetails?.bulkSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
                            const singleSalesTotal = (partyDetails.saleDetails?.singleSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
                            return (bulkSalesTotal + singleSalesTotal).toLocaleString();
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Analytics */}
                  <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "18px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #ff9800",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}>
                    <h3 style={{
                          color: "#495057",
                      marginTop: "0",
                      marginBottom: "16px",
                      fontSize: "16px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{
                        display: "inline-block",
                        width: "24px",
                        height: "24px",
                        backgroundColor: "#ff9800",
                        color: "#fff",
                        borderRadius: "50%",
                        textAlign: "center",
                        lineHeight: "24px",
                        fontSize: "12px"
                      }}>📦</span>
                      Purchase Analytics
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Bulk Purchases:</span>
                        <span style={{ fontWeight: "600", color: "#212529" }}>
                          {partyDetails.summary.totalBulkPurchases} items
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Bulk Purchase Amount:</span>
                        <span style={{ fontWeight: "600", color: "#ff9800" }}>
                          PKR{(partyDetails.purchaseDetails?.bulkPurchases || []).reduce((sum, purchase) => sum + parseInt(purchase.prices?.buyingPrice || 0), 0).toLocaleString()}
                        </span>
                    </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Single Purchases:</span>
                        <span style={{ fontWeight: "600", color: "#212529" }}>
                          {partyDetails.summary.totalSinglePurchases} items
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#495057", fontSize: "14px" }}>Single Purchase Amount:</span>
                        <span style={{ fontWeight: "600", color: "#ff9800" }}>
                          PKR{(partyDetails.purchaseDetails?.singlePurchases || []).reduce((sum, purchase) => sum + (purchase.price?.purchasePrice || 0), 0).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e9ecef", paddingTop: "8px" }}>
                        <span style={{ color: "#495057", fontSize: "14px", fontWeight: "600" }}>Total Purchases:</span>
                        <span style={{ fontWeight: "700", color: "#ff9800", fontSize: "16px" }}>
                          PKR{(() => {
                            const bulkPurchasesTotal = (partyDetails.purchaseDetails?.bulkPurchases || []).reduce((sum, purchase) => sum + parseInt(purchase.prices?.buyingPrice || 0), 0);
                            const singlePurchasesTotal = (partyDetails.purchaseDetails?.singlePurchases || []).reduce((sum, purchase) => sum + (purchase.price?.purchasePrice || 0), 0);
                            return (bulkPurchasesTotal + singlePurchasesTotal).toLocaleString();
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment & Cash Analytics */}
                <div style={{
                  backgroundColor: "#f0f8ff",
                  padding: "18px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #17a2b8",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  marginBottom: "24px"
                }}>
                  <h3 style={{
                    color: "#495057",
                    marginTop: "0",
                    marginBottom: "16px",
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{
                      display: "inline-block",
                      width: "24px",
                      height: "24px",
                      backgroundColor: "#17a2b8",
                      color: "#fff",
                      borderRadius: "50%",
                      textAlign: "center",
                      lineHeight: "24px",
                      fontSize: "12px"
                    }}>💳</span>
                    Payment & Cash Analytics
                  </h3>

                    <div style={{
                      display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "12px"
                    }}>
                    {/* Credit Sales Count */}
                        <div style={{
                          backgroundColor: "#fff",
                          padding: "12px",
                          borderRadius: "6px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                          <div style={{
                            color: "#dc3545",
                            fontWeight: "600",
                            marginBottom: "6px",
                            fontSize: "14px"
                          }}>
                        Credit Sales
                          </div>
                          <div style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#212529"
                          }}>
                        {(partyDetails.saleDetails?.bulkSales || []).filter(sale => sale.sellingPaymentType === "Credit").length + 
                         (partyDetails.saleDetails?.singleSales || []).filter(sale => sale.sellingPaymentType === "Credit").length}
                          </div>
                          <div style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginTop: "4px"
                          }}>
                        Pending payments
                          </div>
                        </div>

                    {/* Full Payment Sales Count */}
                        <div style={{
                          backgroundColor: "#fff",
                          padding: "12px",
                          borderRadius: "6px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                          <div style={{
                        color: "#28a745",
                            fontWeight: "600",
                            marginBottom: "6px",
                            fontSize: "14px"
                          }}>
                        Full Payment Sales
                          </div>
                          <div style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#212529"
                          }}>
                        {(partyDetails.saleDetails?.bulkSales || []).filter(sale => sale.sellingPaymentType === "Full Payment").length + 
                         (partyDetails.saleDetails?.singleSales || []).filter(sale => sale.sellingPaymentType === "Full Payment").length}
                          </div>
                          <div style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginTop: "4px"
                          }}>
                        Completed payments
                          </div>
                        </div>

                    {/* Total Credit Amount */}
                        <div style={{
                          backgroundColor: "#fff",
                          padding: "12px",
                          borderRadius: "6px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                          <div style={{
                        color: "#fd7e14",
                            fontWeight: "600",
                            marginBottom: "6px",
                            fontSize: "14px"
                          }}>
                        Total Credit Amount
                          </div>
                          <div style={{
                        fontSize: "16px",
                            fontWeight: "700",
                            color: "#212529"
                          }}>
                        PKR{(() => {
                          const bulkCreditTotal = (partyDetails.saleDetails?.bulkSales || [])
                            .filter(sale => sale.sellingPaymentType === "Credit")
                            .reduce((sum, sale) => sum + (sale.payableAmountNow || 0) + (sale.payableAmountLater || 0), 0);
                          const singleCreditTotal = (partyDetails.saleDetails?.singleSales || [])
                            .filter(sale => sale.sellingPaymentType === "Credit")
                            .reduce((sum, sale) => sum + (sale.payableAmountNow || 0) + (sale.payableAmountLater || 0), 0);
                          return (bulkCreditTotal + singleCreditTotal).toLocaleString();
                        })()}
                          </div>
                          <div style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginTop: "4px"
                          }}>
                        Outstanding amount
              </div>
            </div>

                    {/* Cash Flow Status */}
            <div style={{
              backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
              <div style={{
                        color: "#6f42c1",
                  fontWeight: "600",
                        marginBottom: "6px",
                        fontSize: "14px"
                }}>
                        Cash Flow Status
                      </div>
                <div style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        {(() => {
                          const totalSales = (partyDetails.saleDetails?.bulkSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0) +
                                           (partyDetails.saleDetails?.singleSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
                          const totalPurchases = (partyDetails.purchaseDetails?.bulkPurchases || []).reduce((sum, purchase) => sum + parseInt(purchase.prices?.buyingPrice || 0), 0) +
                                               (partyDetails.purchaseDetails?.singlePurchases || []).reduce((sum, purchase) => sum + (purchase.price?.purchasePrice || 0), 0);
                          return totalSales > totalPurchases ? "Positive" : "Negative";
                        })()}
                </div>
                <div style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "4px"
                      }}>
                        Net cash flow
                      </div>
                      </div>
                    </div>
                  </div>

                {/* Performance Summary */}
                  {/* <div style={{
                  backgroundColor: "#f8f9fa",
                    padding: "18px",
                    borderRadius: "8px",
                  borderLeft: "4px solid #6c757d",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}>
                    <h3 style={{
                      color: "#495057",
                      marginTop: "0",
                      marginBottom: "16px",
                      fontSize: "16px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{
                        display: "inline-block",
                        width: "24px",
                        height: "24px",
                      backgroundColor: "#6c757d",
                        color: "#fff",
                        borderRadius: "50%",
                        textAlign: "center",
                        lineHeight: "24px",
                        fontSize: "12px"
                    }}>📊</span>
                    Performance Summary
                    </h3>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px"
                  }}>
                      <div style={{
                        backgroundColor: "#fff",
                        padding: "12px",
                        borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{
                        color: "#495057",
                        fontWeight: "600",
                        marginBottom: "6px",
                              fontSize: "14px"
                      }}>
                        Sales vs Purchases Ratio
                          </div>
                      <div style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        {(() => {
                          const totalSales = partyDetails.summary.totalBulkSales + partyDetails.summary.totalSingleSales;
                          const totalPurchases = partyDetails.summary.totalBulkPurchases + partyDetails.summary.totalSinglePurchases;
                          return totalPurchases > 0 ? (totalSales / totalPurchases).toFixed(2) : "N/A";
                        })()}:1
                          </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "4px"
                      }}>
                        Sales per purchase
                  </div>
                </div>

                    <div style={{
                      backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{
                    color: "#495057",
                        fontWeight: "600",
                        marginBottom: "6px",
                        fontSize: "14px"
                      }}>
                        Average Sale Price
                      </div>
                      <div style={{
                    fontSize: "16px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        PKR{(() => {
                          const totalSales = partyDetails.summary.totalBulkSales + partyDetails.summary.totalSingleSales;
                          if (totalSales === 0) return "0";
                          const totalSalesAmount = (partyDetails.saleDetails?.bulkSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0) +
                                                 (partyDetails.saleDetails?.singleSales || []).reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
                          return Math.round(totalSalesAmount / totalSales).toLocaleString();
                        })()}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "4px"
                      }}>
                        Per transaction
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{
                        color: "#495057",
                        fontWeight: "600",
                        marginBottom: "6px",
                        fontSize: "14px"
                      }}>
                        Credit vs Cash Ratio
                      </div>
                      <div style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        {(() => {
                          const creditSales = (partyDetails.saleDetails?.bulkSales || []).filter(sale => sale.sellingPaymentType === "Credit").length +
                                            (partyDetails.saleDetails?.singleSales || []).filter(sale => sale.sellingPaymentType === "Credit").length;
                          const totalSales = partyDetails.summary.totalBulkSales + partyDetails.summary.totalSingleSales;
                          return totalSales > 0 ? Math.round((creditSales / totalSales) * 100) : 0;
                        })()}%
                          </div>
                      <div style={{
                              fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "4px"
                            }}>
                        Credit sales
                          </div>
                        </div>

                    <div style={{
                      backgroundColor: "#fff",
                      padding: "12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{
                        color: "#495057",
                        fontWeight: "600",
                        marginBottom: "6px",
                        fontSize: "14px"
                      }}>
                        Net Credit Status
                    </div>
                    <div style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "#dc3545" : "#28a745"
                      }}>
                        {partyDetails.person.givingCredit > partyDetails.person.takingCredit ? "Receivable" : "Payable"}
                      </div>
                      <div style={{
                        fontSize: "12px",
                      color: "#6c757d",
                        marginTop: "4px"
                    }}>
                        Current status
                    </div>
                </div>
              </div>
            </div> */}


            {/* Purchase Tables */}
            <div style={{ marginBottom: "32px" }}>
              {/* Bulk Purchases Table */}
              {partyDetails.purchaseDetails?.bulkPurchases?.length > 0 && (
                <div style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  marginBottom: "24px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    backgroundColor: "#ff9800",
                    color: "#fff",
                    padding: "16px 20px",
                    fontSize: "18px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    📦 Bulk Purchases ({partyDetails.purchaseDetails.bulkPurchases.length} items)
                  </div>
                  
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Model</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Company</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>IMEI</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Color</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Battery</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Buying Price</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Status</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partyDetails.purchaseDetails.bulkPurchases.map((purchase, index) => (
                          purchase.ramSimDetails?.map((phone, i) => (
                            <tr key={`${purchase._id}-${i}`} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                              <td style={{ padding: "12px", fontWeight: "500" }}>{phone.modelName || purchase.modelName || "N/A"}</td>
                              <td style={{ padding: "12px" }}>{phone.companyName || "N/A"}</td>
                              <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px" }}>{phone.imeiNumbers?.[0]?.imei1 || "N/A"}</td>
                              <td style={{ padding: "12px" }}>
                                <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: phone.imeiNumbers?.[0]?.color?.toLowerCase() || "#ccc", marginRight: "6px" }}></span>
                                {phone.imeiNumbers?.[0]?.color || "N/A"}
                              </td>
                              <td style={{ padding: "12px" }}>{phone.imeiNumbers?.[0]?.batteryHealth ? `${phone.imeiNumbers[0].batteryHealth}%` : "N/A"}</td>
                              <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#ff9800" }}>PKR {parseInt(purchase.prices?.buyingPrice || 0).toLocaleString()}</td>
                              <td style={{ padding: "12px", textAlign: "center" }}>
                                <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", backgroundColor: purchase.status === "Available" ? "#d4edda" : "#f8d7da", color: purchase.status === "Available" ? "#155724" : "#721c24" }}>{purchase.status || "N/A"}</span>
                              </td>
                              <td style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#6c757d" }}>{purchase.date ? new Date(purchase.date).toLocaleDateString() : "N/A"}</td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Single Purchases Table */}
              {partyDetails.purchaseDetails?.singlePurchases?.length > 0 && (
                <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "24px", overflow: "hidden" }}>
                  <div style={{ backgroundColor: "#17a2b8", color: "#fff", padding: "16px 20px", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                    📱 Single Purchases ({partyDetails.purchaseDetails.singlePurchases.length} items)
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Model</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Company</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>RAM</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>IMEI 1</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>IMEI 2</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Color</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Condition</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Warranty</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Purchase Price</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partyDetails.purchaseDetails.singlePurchases.map((purchase, index) => (
                          <tr key={purchase._id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{purchase.modelName}</td>
                            <td style={{ padding: "12px" }}>{purchase.companyName}</td>
                            <td style={{ padding: "12px" }}>{purchase.ramMemory}GB</td>
                            <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px" }}>{purchase.imei1}</td>
                            <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px" }}>{purchase.imei2 || "N/A"}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: purchase.color?.toLowerCase() || "#ccc", marginRight: "6px" }}></span>
                              {purchase.color}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", backgroundColor: purchase.phoneCondition === "New" ? "#d4edda" : "#fff3cd", color: purchase.phoneCondition === "New" ? "#155724" : "#856404" }}>{purchase.phoneCondition}</span>
                            </td>
                            <td style={{ padding: "12px" }}>{purchase.warranty}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#17a2b8" }}>PKR {purchase.price?.purchasePrice?.toLocaleString() || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#6c757d" }}>{new Date(purchase.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Sales Tables */}
            <div style={{ marginBottom: "32px" }}>
              {/* Bulk Sales Table */}
              {partyDetails.saleDetails?.bulkSales?.length > 0 && (
                <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "24px", overflow: "hidden" }}>
                  <div style={{ backgroundColor: "#28a745", color: "#fff", padding: "16px 20px", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                    💰 Bulk Sales ({partyDetails.saleDetails.bulkSales.length} items)
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Customer</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Model</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>IMEI</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Warranty</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Purchase Price</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Sale Price</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Profit</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Total Invoice</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Payment Type</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partyDetails.saleDetails.bulkSales.map((sale, index) => (
                          <tr key={sale._id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{sale.customerName || "N/A"}</td>
                            <td style={{ padding: "12px" }}>{sale.modelName || sale.bulkPhonePurchaseId?.ramSimDetails?.[0]?.modelName || sale.bulkPhonePurchaseId?.modelName || "N/A"}</td>
                            <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px" }}>{Array.isArray(sale.imei1) ? sale.imei1[0] : sale.imei1 || "N/A"}</td>
                            <td style={{ padding: "12px" }}>{sale.warranty || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#dc3545" }}>PKR {sale.purchasePrice?.toLocaleString() || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#28a745" }}>PKR {sale.salePrice?.toLocaleString() || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#17a2b8" }}>PKR {sale.purchasePrice && sale.salePrice ? (sale.salePrice - sale.purchasePrice).toLocaleString() : "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#6f42c1" }}>PKR {sale.totalInvoice?.toLocaleString() || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                              <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", backgroundColor: sale.sellingPaymentType === "Full Payment" ? "#d4edda" : "#f8d7da", color: sale.sellingPaymentType === "Full Payment" ? "#155724" : "#721c24" }}>{sale.sellingPaymentType || "N/A"}</span>
                            </td>
                            <td style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#6c757d" }}>{sale.dateSold || sale.createdAt ? new Date(sale.dateSold || sale.createdAt).toLocaleDateString() : "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Single Sales Table */}
              {partyDetails.saleDetails?.singleSales?.length > 0 && (
                <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "24px", overflow: "hidden" }}>
                  <div style={{ backgroundColor: "#6f42c1", color: "#fff", padding: "16px 20px", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                    💎 Single Sales ({partyDetails.saleDetails.singleSales.length} items)
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Customer</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Model</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Company</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>RAM</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>IMEI 1</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>IMEI 2</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Color</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Condition</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Purchase Price</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Sale Price</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Profit</th>
                          <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Total Invoice</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Payment Type</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6", fontWeight: "600" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partyDetails.saleDetails.singleSales.map((sale, index) => (
                          <tr key={sale._id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{sale.customerName}</td>
                            <td style={{ padding: "12px" }}>{sale.modelName}</td>
                            <td style={{ padding: "12px" }}>{sale.companyName}</td>
                            <td style={{ padding: "12px" }}>{sale.ramMemory}GB</td>
                            <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px" }}>{sale.imei1}</td>
                            <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px" }}>{sale.imei2 || "N/A"}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: sale.color?.toLowerCase() || "#ccc", marginRight: "6px" }}></span>
                              {sale.color}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", backgroundColor: sale.phoneCondition === "New" ? "#d4edda" : "#fff3cd", color: sale.phoneCondition === "New" ? "#155724" : "#856404" }}>{sale.phoneCondition}</span>
                            </td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#dc3545" }}>PKR {sale.purchasePrice?.toLocaleString() || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#28a745" }}>PKR {sale.salePrice?.toLocaleString() || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#17a2b8" }}>PKR {sale.purchasePrice && sale.salePrice ? (sale.salePrice - sale.purchasePrice).toLocaleString() : "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#6f42c1" }}>PKR {sale.totalInvoice?.toLocaleString() || "N/A"}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                              <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", backgroundColor: sale.sellingPaymentType === "Full Payment" ? "#d4edda" : "#f8d7da", color: sale.sellingPaymentType === "Full Payment" ? "#155724" : "#721c24" }}>{sale.sellingPaymentType}</span>
                            </td>
                            <td style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#6c757d" }}>{new Date(sale.saleDate || sale.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>


            //show tables here
          </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}




export default CustomerRecord;
