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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <StyledHeading>Bulk Sale Details</StyledHeading>

      {saleDetail ? (
        <>
          <div style={infoSection}>
            <p><strong>Invoice Number:</strong> {formatValue(saleDetail.invoiceNumber)}</p>
            <p><strong>Customer Name:</strong> {formatValue(saleDetail.customerName)}</p>
            <p><strong>IMEI 1:</strong> {formatValue(saleDetail.imei1)}</p>
            <p><strong>IMEI 2:</strong> {formatValue(saleDetail.imei2, "N/A")}</p>
            <p><strong>Warranty:</strong> {formatValue(saleDetail.warranty)}</p>
            <p><strong>Sale Price:</strong> {formatValue(saleDetail.salePrice)} PKR</p>
            <p><strong>Total Invoice:</strong> {formatValue(saleDetail.totalInvoice)} PKR</p>
            <p><strong>Date Sold:</strong> {new Date(saleDetail.dateSold).toLocaleString()}</p>
          </div>

          {/* Sale Type Block */}
          <div style={{ marginTop: "24px" }}>
            <StyledHeading>Sale Type</StyledHeading>
            {saleDetail.sellingPaymentType ? (
              <>
                {saleDetail.sellingPaymentType === "Bank" && (
                  <div style={card}>
                    <p><strong>Type:</strong> Bank</p>
                    <p><strong>Bank Name:</strong> {formatValue(saleDetail.bankName)}</p>
                  </div>
                )}
                {saleDetail.sellingPaymentType === "Credit" && (
                  <div style={card}>
                    <p><strong>Type:</strong> Credit</p>
                    <p><strong>Payable Now:</strong> {formatValue(saleDetail.payableAmountNow)} PKR</p>
                    <p><strong>Payable Later:</strong> {formatValue(saleDetail.payableAmountLater)} PKR</p>
                    <p><strong>Due Date:</strong> {formatValue(saleDetail.payableAmountLaterDate)}</p>
                  </div>
                )}
                {saleDetail.sellingPaymentType === "Exchange" && (
                  <div style={card}>
                    <p><strong>Type:</strong> Exchange</p>
                    <p><strong>Details:</strong> {formatValue(saleDetail.exchangePhoneDetail)}</p>
                  </div>
                )}
                {saleDetail.sellingPaymentType === "Cash" && (
                  <div style={card}>
                    <p><strong>Type:</strong> Cash</p>
                    <p><strong>Total Cash:</strong> {formatValue(saleDetail.finalPrice)} PKR</p>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: "gray" }}>No sale type mentioned.</p>
            )}
          </div>

          {/* Accessories Section */}
          <div style={{ marginTop: "24px" }}>
            <StyledHeading>Accessories</StyledHeading>
            {saleDetail.accessories?.length ? (
              <div style={accessoryContainer}>
                {saleDetail.accessories.map((acc, index) => (
                  <div key={index} style={accessoryCard}>
                    <p style={{ fontWeight: "600" }}>{formatValue(acc.name)}</p>
                    <p style={{ fontSize: "14px", color: "#4B5563" }}>Qty: {formatValue(acc.quantity)}</p>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2937" }}>{formatValue(acc.price)} PKR</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#9CA3AF", fontStyle: "italic" }}>No accessories found</p>
            )}
          </div>

          {/* CNIC Images */}
          {/* <div style={{ marginTop: "24px" }}>
            <StyledHeading>CNIC Images</StyledHeading>
            <div style={{ display: "flex", gap: "16px" }}>
              <div>
                <p style={{ fontWeight: 500 }}>Front</p>
                {saleDetail.cnicFrontPic ? (
                  <img
                    src={saleDetail.cnicFrontPic}
                    alt="CNIC Front"
                    style={cnicStyle}
                  />
                ) : (
                  <p style={{ color: "gray" }}>Not uploaded</p>
                )}
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>Back</p>
                {saleDetail.cnicBackPic ? (
                  <img
                    src={saleDetail.cnicBackPic}
                    alt="CNIC Back"
                    style={cnicStyle}
                  />
                ) : (
                  <p style={{ color: "gray" }}>Not uploaded</p>
                )}
              </div>
            </div>
          </div> */}
        </>
      ) : (
        <p>No sale details available.</p>
      )}
    </div>
  );
};

const card = {
  padding: "12px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  lineHeight: 1.6,
  marginBottom: "12px",
};

const infoSection = {
  lineHeight: 1.8,
};

const accessoryContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  padding: "12px",
  borderRadius: "8px",
};

const accessoryCard = {
  background: "#fff",
  padding: "10px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  width: "150px",
  textAlign: "center",
};

const cnicStyle = {
  width: "200px",
  height: "auto",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

export default BulkSalesDetail;
