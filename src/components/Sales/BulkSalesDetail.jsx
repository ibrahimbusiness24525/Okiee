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
                <DetailPill label="Purchase Price" value={`${formatValue(saleDetail.purchasePrice)} PKR`} />
                <DetailPill label="Sale Price" value={`${formatValue(saleDetail.salePrice)} PKR`} />
                <DetailPill label="Profit" value={`${formatValue(saleDetail.profit)} PKR`} />
                <DetailPill label="Total Invoice" value={`${formatValue(saleDetail.totalInvoice)} PKR`} />
              </div>
            </div>

            {/* IMEI & Warranty Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Device Information</h3>
              <div style={styles.gridContainer}>
                <DetailPill label="IMEI 1" value={formatValue(saleDetail.imei1?.join(", "))} />
                {/* <DetailPill label="IMEI 2" value={formatValue(saleDetail.imei2, "N/A")} /> */}
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
                      <DetailPill label="Type" value="Credit" highlight />
                      <DetailPill label="Payable Now" value={`${formatValue(saleDetail.payableAmountNow)} PKR`} />
                      <DetailPill label="Payable Later" value={`${formatValue(saleDetail.payableAmountLater)} PKR`} />
                      <DetailPill label="Due Date" value={formatDate(saleDetail.payableAmountLaterDate)} />
                    </>
                  )}
                  {saleDetail.sellingPaymentType === "Bank" && (
                    <>
                      <DetailPill label="Type" value="Bank" highlight />
                      <DetailPill label="Bank Name" value={formatValue(saleDetail.bankName)} />
                    </>
                  )}
                  {saleDetail.sellingPaymentType === "Exchange" && (
                    <>
                      <DetailPill label="Type" value="Exchange" highlight />
                      <DetailPill label="Details" value={formatValue(saleDetail.exchangePhoneDetail)} />
                    </>
                  )}
                  {saleDetail.sellingPaymentType === "Full Payment" && (
                    <DetailPill label="Type" value="Full Payment" highlight />
                  )}
                  {saleDetail.sellingPaymentType === "Cash" && (
                    <DetailPill label="Type" value="Cash" highlight />
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

                      <h4 style={styles.accessoryName}>Accessory {index + 1}</h4>
                      {/* <h4 style={styles.accessoryName}>{formatValue(acc.name)}</h4> */}
                      <div style={styles.accessoryDetails}>
                        <span style={styles.accessoryQty}>Qty: {formatValue(acc.quantity)}</span>
                        <span style={styles.accessoryPrice}>{formatValue(acc.price)} PKR</span>
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

// Reusable Detail Pill Component
const DetailPill = ({ label, value, highlight = false }) => (
  <div style={{
    ...styles.pill,
    backgroundColor: highlight ? "#DBEAFE" : "#F3F4F6",
  }}>
    <span style={styles.pillLabel}>{label}:</span>
    <span style={{
      ...styles.pillValue,
      color: highlight ? "#1E40AF" : "#1F2937",
      fontWeight: highlight ? "600" : "normal",
    }}>{value}</span>
  </div>
);

// Styles object
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
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "16px",
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
    borderRadius: "9999px",
    padding: "8px 16px",
  },
  pillLabel: {
    fontWeight: "500",
    color: "#4B5563",
    marginRight: "8px",
  },
  pillValue: {
    color: "#1F2937",
  },
  notAvailable: {
    color: "#9CA3AF",
    fontStyle: "italic",
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