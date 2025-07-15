
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

  const getSoldRecord = async () => {
    try {
      const response = await api.get(`/api/Purchase/customer-sold-record/${customerNumber}`);
      setSoldRecord(response?.data || []);
    } catch (error) {
      console.error("Error fetching sold record:", error);
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

  const getPartyDetails = async (id) => {
    try {
      const response = await api.get(`/api/partyLedger/partyDetail/${id}`);
      setPartyDetails(response?.data?.data || {});
    }
    catch (error) {
      console.error("Error fetching party details:", error);
    }
  }
  console.log("partyDetails", partyDetails);

  useEffect(() => {
    getAllParties();
    // Fetch initial sold records if needed
  }, []);
  const [selectedPartyId, setSelectedPartyId] = useState("");

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
        ) :
          <RecordSection>
            <StyledHeading>Purchased Phone Records</StyledHeading>
            <p>No purchased phone records found.</p>
          </RecordSection>
        }

      </>
      <div style={{
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px"
      }}>
        {/* Party Selection Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <select
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
          </select>

          <button
            onClick={handleGetPartyRecord}
            disabled={!selectedPartyId}
            style={{
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: selectedPartyId ? "pointer" : "not-allowed",
              backgroundColor: selectedPartyId ? "#4a6bff" : "#b0b0b0",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ":hover": {
                backgroundColor: selectedPartyId ? "#3a5bef" : "#b0b0b0",
                boxShadow: selectedPartyId ? "0 4px 8px rgba(0,0,0,0.15)" : "none",
                transform: selectedPartyId ? "translateY(-1px)" : "none"
              },
              ":active": {
                transform: selectedPartyId ? "translateY(0)" : "none"
              }
            }}
          >
            Get Party Record
          </button>
        </div>

        {partyDetails ? (
          <div>
            {/* Party Details Card */}
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
                  Party Overview
                </h2>
                <div style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  backgroundColor: "#e9ecef",
                  padding: "4px 10px",
                  borderRadius: "50px",
                  fontWeight: "500"
                }}>
                  Created: {new Date(partyDetails.party.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Main Content */}
              <div style={{ padding: "20px 24px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  marginBottom: "24px"
                }}>
                  {/* Basic Information */}
                  <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "18px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #4a6bff",
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
                        backgroundColor: "#4a6bff",
                        color: "#fff",
                        borderRadius: "50%",
                        textAlign: "center",
                        lineHeight: "24px",
                        fontSize: "12px"
                      }}>1</span>
                      Basic Information
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "120px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Party Name:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.party.partyName}</span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "120px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>User ID:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.party.userId}</span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "120px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Last Updated:</strong>
                        <span style={{ color: "#212529" }}>
                          {new Date(partyDetails.party.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
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
                      }}>2</span>
                      Mobile Transactions
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Total Purchased Mobiles:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalPurchasedMobiles}</span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Total Buying Price:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalBuyingPrice}</span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Total Dealer Price:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalDealerPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div style={{
                  backgroundColor: "#f0f8ff",
                  padding: "18px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #17a2b8",
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
                      backgroundColor: "#17a2b8",
                      color: "#fff",
                      borderRadius: "50%",
                      textAlign: "center",
                      lineHeight: "24px",
                      fontSize: "12px"
                    }}>3</span>
                    Payment Status (Mobiles)
                  </h3>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px"
                  }}>
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
                        Payable Now
                      </div>
                      <div style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        {partyDetails.stats.totalPayableAmountNow}
                      </div>
                    </div>
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
                        Payable Later
                      </div>
                      <div style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        {partyDetails.stats.totalPayableAmountLater}
                      </div>
                    </div>
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
                        Total Paid
                      </div>
                      <div style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#212529"
                      }}>
                        {partyDetails.stats.totalPaidAmount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessories Section */}
            <div style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              padding: "0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              overflow: "hidden"
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
                  Accessories Transactions
                </h2>
                <div style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  backgroundColor: "#e9ecef",
                  padding: "4px 10px",
                  borderRadius: "50px",
                  fontWeight: "500"
                }}>
                  Total: {partyDetails.accessories.length} items
                </div>
              </div>

              {/* Accessories Summary */}
              <div style={{ padding: "20px 24px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  marginBottom: "24px"
                }}>
                  {/* Accessories Financial Summary */}
                  <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "18px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #6f42c1",
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
                        backgroundColor: "#6f42c1",
                        color: "#fff",
                        borderRadius: "50%",
                        textAlign: "center",
                        lineHeight: "24px",
                        fontSize: "12px"
                      }}>4</span>
                      Accessories Summary
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Total Accessories Quantity:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalAccessoryQuantity}</span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Total Accessories Price:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalAccessoryPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accessories Payment Status */}
                  <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "18px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #fd7e14",
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
                        backgroundColor: "#fd7e14",
                        color: "#fff",
                        borderRadius: "50%",
                        textAlign: "center",
                        lineHeight: "24px",
                        fontSize: "12px"
                      }}>5</span>
                      Payment Status (Accessories)
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Payable Now:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalAccessoryPayableNow}</span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Payable Later:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalAccessoryPayableLater}</span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <strong style={{
                          minWidth: "180px",
                          color: "#495057",
                          fontSize: "14px"
                        }}>Total Paid:</strong>
                        <span style={{ color: "#212529" }}>{partyDetails.stats.totalAccessoryPaidAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Accessories List */}
                <div>
                  <h3 style={{
                    color: "#495057",
                    margin: "0 0 16px 0",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}>
                    Accessories Items
                  </h3>

                  {partyDetails.accessories.length > 0 ? (
                    <div style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      overflow: "hidden"
                    }}>
                      {/* Table Header */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                        backgroundColor: "#f8f9fa",
                        padding: "12px 16px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#495057",
                        borderBottom: "1px solid #e9ecef"
                      }}>
                        <div>Accessory Name</div>
                        <div>Quantity</div>
                        <div>Price</div>
                        <div>Payment Type</div>
                        <div>Status</div>
                      </div>

                      {/* Table Rows */}
                      {partyDetails.accessories.map((accessory, index) => (
                        <div
                          key={accessory._id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                            padding: "12px 16px",
                            fontSize: "14px",
                            color: "#212529",
                            backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa",
                            borderBottom: index === partyDetails.accessories.length - 1 ? "none" : "1px solid #e9ecef"
                          }}
                        >
                          <div>{accessory.accessoryName}</div>
                          <div>{accessory.quantity}</div>
                          <div>{accessory.totalPrice}</div>
                          <div>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              backgroundColor: accessory.purchasePaymentType === "credit" ? "#fff3cd" : "#d4edda",
                              color: accessory.purchasePaymentType === "credit" ? "#856404" : "#155724",
                              fontSize: "12px",
                              fontWeight: "500"
                            }}>
                              {accessory.purchasePaymentType}
                            </span>
                          </div>
                          <div>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              backgroundColor: accessory.purchasePaymentStatus === "pending" ? "#f8d7da" : "#d4edda",
                              color: accessory.purchasePaymentStatus === "pending" ? "#721c24" : "#155724",
                              fontSize: "12px",
                              fontWeight: "500"
                            }}>
                              {accessory.purchasePaymentStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#6c757d",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px dashed #dee2e6"
                    }}>
                      No accessories transactions found for this party.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "#6c757d",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            border: "1px dashed #dee2e6",
            marginTop: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px",
              color: "#adb5bd"
            }}>
              <i className="fas fa-user-friends"></i>
            </div>
            <h3 style={{
              margin: "0 0 8px 0",
              color: "#495057",
              fontWeight: "500"
            }}>
              No Party Selected
            </h3>
            <p style={{
              margin: "0",
              fontSize: "14px"
            }}>
              Please select a party from the dropdown and click "Get Party Record"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}




export default CustomerRecord;
