import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { StyledHeading } from "components/StyledHeading/StyledHeading";

const BulkSalesDetail = () => {
  const { id } = useParams();
  const [saleDetail, setSalesDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBulkSalesDetail = async () => {
      try {
        const response = await api.get(`/api/Purchase/bulk-sold-phone/${id}`);
        if (response.data?.success) {
          setSalesDetail(response.data.soldPhoneDetail);
        } else {
          setError("Failed to fetch sale details");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchBulkSalesDetail();
  }, [id]);

  const formatValue = (val, fallback = "Not Found") =>
    val !== undefined && val !== null && val !== "" ? val : fallback;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <StyledHeading style={styles.heading}>Bulk Sale Details</StyledHeading>

        {saleDetail ? (
          <>
            {/* Main Info Section */}
            <div style={styles.gridContainer}>
              <div style={styles.column}>
                <DetailPill label="Invoice Number" value={formatValue(saleDetail.invoiceNumber)} />
                <DetailPill label="Customer Name" value={formatValue(saleDetail.customerName)} />
                <DetailPill label="Customer Number" value={formatValue(saleDetail.customerNumber)} />
                <DetailPill label="Date Sold" value={formatDate(saleDetail.dateSold)} />
              </div>
              <div style={styles.column}>
                <DetailPill label="Purchase Price" value={formatCurrency(saleDetail.purchasePrice)} />
                <DetailPill label="Sale Price" value={formatCurrency(saleDetail.salePrice)} />
                <DetailPill
                  label="Profit/Loss"
                  value={formatCurrency(saleDetail.profit)}
                  highlight={saleDetail.profit >= 0 ? "profit" : "loss"}
                />
                <DetailPill label="Total Invoice" value={formatCurrency(saleDetail.totalInvoice)} />
              </div>
            </div>

            {/* Purchase Details Section */}
            {saleDetail.bulkPhonePurchaseId && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Purchase Information</h3>
                <div style={styles.purchaseCard}>
                  <div style={styles.gridContainer}>
                    <div style={styles.column}>
                      <DetailPill label="Purchase Date" value={formatDate(saleDetail.bulkPhonePurchaseId.date)} />
                      <DetailPill label="Payment Status" value={formatValue(saleDetail.bulkPhonePurchaseId.purchasePaymentStatus)} />
                      <DetailPill label="Payment Type" value={formatValue(saleDetail.bulkPhonePurchaseId.purchasePaymentType)} />
                    </div>
                    <div style={styles.column}>
                      <DetailPill label="Status" value={formatValue(saleDetail.bulkPhonePurchaseId.status)} />
                      <DetailPill label="Dispatch" value={saleDetail.bulkPhonePurchaseId.dispatch ? "Yes" : "No"} />
                    </div>
                  </div>

                  {/* Prices from Purchase */}
                  {saleDetail.bulkPhonePurchaseId.prices && (
                    <>
                      <h4 style={styles.subSectionTitle}>Purchase Prices</h4>
                      <div style={styles.gridContainer}>
                        <div style={styles.column}>
                          <DetailPill label="Buying Price" value={formatValue(saleDetail.bulkPhonePurchaseId.prices.buyingPrice)} />
                          {/* <DetailPill label="Dealer Price" value={formatValue(saleDetail.bulkPhonePurchaseId.prices.dealerPrice)} /> */}
                          {/* <DetailPill label="LP" value={formatValue(saleDetail.bulkPhonePurchaseId.prices.lp)} /> */}
                        </div>
                        <div style={styles.column}>
                          {/* <DetailPill label="Lifting" value={formatValue(saleDetail.bulkPhonePurchaseId.prices.lifting)} /> */}
                          {/* <DetailPill label="Promo" value={formatValue(saleDetail.bulkPhonePurchaseId.prices.promo)} /> */}
                          {/* <DetailPill label="Activation" value={formatValue(saleDetail.bulkPhonePurchaseId.prices.activation)} /> */}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* IMEI & Warranty Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Device Information</h3>
              <div style={styles.gridContainer}>
                <DetailPill label="IMEI 1" value={formatValue(Array.isArray(saleDetail.imei1) ? saleDetail.imei1.join(", ") : saleDetail.imei1)} />
                <DetailPill label="IMEI 2" value={formatValue(Array.isArray(saleDetail.imei2) ? saleDetail.imei2.join(", ") : saleDetail.imei2)} />
                <DetailPill label="Warranty" value={formatValue(saleDetail.warranty)} />
              </div>
            </div>

            {/* Payment Type Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Payment Information</h3>
              {saleDetail.sellingPaymentType ? (
                <div style={styles.paymentCard}>
                  {saleDetail.sellingPaymentType === "Credit" && (
                    <>
                      <DetailPill label="Type" value="Credit" highlight="info" />
                      <DetailPill label="Payable Now" value={formatCurrency(saleDetail.payableAmountNow)} />
                      <DetailPill label="Payable Later" value={formatCurrency(saleDetail.payableAmountLater)} />
                      <DetailPill label="Due Date" value={formatDate(saleDetail.payableAmountLaterDate)} />
                    </>
                  )}
                  {saleDetail.sellingPaymentType === "Bank" && (
                    <>
                      <DetailPill label="Type" value="Bank" highlight="info" />
                      <DetailPill label="Bank Name" value={formatValue(saleDetail.bankName)} />
                    </>
                  )}
                  {saleDetail.sellingPaymentType === "Exchange" && (
                    <>
                      <DetailPill label="Type" value="Exchange" highlight="info" />
                      <DetailPill label="Details" value={formatValue(saleDetail.exchangePhoneDetail)} />
                    </>
                  )}
                  {saleDetail.sellingPaymentType === "Full Payment" && (
                    <DetailPill label="Type" value="Full Payment" highlight="info" />
                  )}
                  {saleDetail.sellingPaymentType === "Cash" && (
                    <DetailPill label="Type" value="Cash" highlight="info" />
                  )}
                </div>
              ) : (
                <p style={styles.notAvailable}>No payment information available</p>
              )}
            </div>

            {/* Accessories Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Accessories</h3>
              {saleDetail.accessories?.length ? (
                <div style={styles.accessoriesGrid}>
                  {saleDetail.accessories.map((acc, index) => (
                    <div key={index} style={styles.accessoryCard}>
                      <h4 style={styles.accessoryName}>{formatValue(acc.name, `Accessory ${index + 1}`)}</h4>
                      <div style={styles.accessoryDetails}>
                        <span style={styles.accessoryQty}>Qty: {formatValue(acc.quantity)}</span>
                        <span style={styles.accessoryPrice}>{formatCurrency(acc.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.notAvailable}>No accessories included</p>
              )}
            </div>

            {/* CNIC Images Section */}
            {/* <div style={styles.section}>
              <h3 style={styles.sectionTitle}>CNIC Images</h3>
              <div style={styles.cnicContainer}>
                <div style={styles.cnicImageWrapper}>
                  <p style={styles.cnicLabel}>Front Side</p>
                  {saleDetail.cnicFrontPic ? (
                    <img
                      src={saleDetail.cnicFrontPic}
                      alt="CNIC Front"
                      style={styles.cnicImage}
                    />
                  ) : (
                    <div style={styles.cnicPlaceholder}>Not uploaded</div>
                  )}
                </div>
                <div style={styles.cnicImageWrapper}>
                  <p style={styles.cnicLabel}>Back Side</p>
                  {saleDetail.cnicBackPic ? (
                    <img
                      src={saleDetail.cnicBackPic}
                      alt="CNIC Back"
                      style={styles.cnicImage}
                    />
                  ) : (
                    <div style={styles.cnicPlaceholder}>Not uploaded</div>
                  )}
                </div>
              </div>
            </div> */}
          </>
        ) : (
          <p style={styles.notAvailable}>No sale details available.</p>
        )}
      </div>
    </div>
  );
};

// Enhanced Detail Pill Component with different highlight types
const DetailPill = ({ label, value, highlight = false }) => {
  let backgroundColor = "#F3F4F6";
  let color = "#1F2937";
  let fontWeight = "normal";

  if (highlight === "profit") {
    backgroundColor = "#D1FAE5";
    color = "#065F46";
    fontWeight = "600";
  } else if (highlight === "loss") {
    backgroundColor = "#FEE2E2";
    color = "#B91C1C";
    fontWeight = "600";
  } else if (highlight === "info") {
    backgroundColor = "#DBEAFE";
    color = "#1E40AF";
    fontWeight = "600";
  } else if (highlight) {
    backgroundColor = "#DBEAFE";
    color = "#1E40AF";
    fontWeight = "600";
  }

  return (
    <div style={{
      ...styles.pill,
      backgroundColor,
    }}>
      <span style={styles.pillLabel}>{label}:</span>
      <span style={{
        ...styles.pillValue,
        color,
        fontWeight,
      }}>{value}</span>
    </div>
  );
};

// Updated Styles object
const styles = {
  container: {
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    marginBottom: "24px",
  },
  heading: {
    marginBottom: "24px",
    color: "#111827",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  section: {
    marginBottom: "32px",
    padding: "16px",
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "16px",
  },
  subSectionTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: "12px",
    marginTop: "16px",
  },
  purchaseCard: {
    backgroundColor: "#F0F9FF",
    border: "1px solid #BAE6FD",
    borderRadius: "8px",
    padding: "16px",
  },
  paymentCard: {
    backgroundColor: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  accessoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "12px",
  },
  accessoryCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  accessoryName: {
    fontWeight: "500",
    color: "#111827",
    marginBottom: "8px",
    fontSize: "14px",
  },
  accessoryDetails: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  accessoryQty: {
    color: "#6B7280",
  },
  accessoryPrice: {
    fontWeight: "600",
    color: "#1E40AF",
  },
  cnicContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "24px",
    flexWrap: "wrap",
  },
  cnicImageWrapper: {
    flex: "1",
    minWidth: "200px",
  },
  cnicLabel: {
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
  },
  cnicImage: {
    width: "100%",
    maxWidth: "300px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
  },
  cnicPlaceholder: {
    backgroundColor: "#F3F4F6",
    border: "1px dashed #D1D5DB",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    color: "#6B7280",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "8px",
    padding: "12px 16px",
  },
  pillLabel: {
    fontWeight: "500",
    color: "#4B5563",
  },
  pillValue: {
    fontWeight: "normal",
  },
  notAvailable: {
    color: "#9CA3AF",
    fontStyle: "italic",
    padding: "8px",
  },
  loading: {
    textAlign: "center",
    padding: "32px",
    color: "#4B5563",
  },
  error: {
    textAlign: "center",
    padding: "32px",
    color: "#DC2626",
  },
};

export default BulkSalesDetail;