import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaBox, FaMemory, FaMobileAlt, FaMoneyBillWave, FaSimCard, FaUserTie } from "react-icons/fa";

const BulkPhoneDetail = () => {
  const { id } = useParams();
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CSS Variables
  const styles = {
    container: {
      padding: "1rem",
      backgroundColor: "rgba(255,255,255,255)",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    header: {
      marginBottom: "1.5rem"
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#292c31",
      marginTop: "0.5rem"
    },
    backButton: {
      display: "flex",
      alignItems: "center",
      color: "#292c31",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0.5rem 0",
      fontSize: "0.875rem"
    },
    card: {
      backgroundColor: "rgba(255,255,255,255)",
      border: "1px solid #f6f7fc",
      borderRadius: "0.5rem",
      padding: "1rem",
      marginBottom: "1.5rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    },
    cardTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#292c31",
      marginBottom: "1rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #f6f7fc"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "1rem"
    },
    gridMd: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1rem"
    },
    flexRow: {
      display: "flex",
      alignItems: "center"
    },
    flexBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    iconContainer: {
      backgroundColor: "rgba(25, 32, 48, 0.1)",
      borderRadius: "50%",
      padding: "0.5rem",
      marginRight: "0.75rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    icon: {
      color: "#192030",
      fontSize: "1rem"
    },
    label: {
      fontSize: "0.875rem",
      color: "#dbdee4",
      marginBottom: "0.25rem"
    },
    value: {
      fontSize: "1rem",
      color: "#292c31",
      fontWeight: "500"
    },
    badge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500"
    },
    badgeSuccess: {
      backgroundColor: "#d1fae5",
      color: "#065f46"
    },
    badgePending: {
      backgroundColor: "#fef3c7",
      color: "#92400e"
    },
    badgeDanger: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c"
    },
    statCard: {
      padding: "0.75rem",
      borderRadius: "0.5rem",
      backgroundColor: "rgba(246, 247, 252, 0.2)"
    },
    configHeader: {
      backgroundColor: "#192030",
      color: "#ffffff",
      padding: "1rem",
      borderTopLeftRadius: "0.5rem",
      borderTopRightRadius: "0.5rem"
    },
    configTitle: {
      color: "#ffffff",
      fontWeight: "600",
      display: "flex",
      alignItems: "center"
    },
    imeiContainer: {
      maxHeight: "240px",
      overflowY: "auto",
      paddingRight: "0.5rem",
      marginTop: "1rem"
    },
    imeiCard: {
      padding: "0.75rem",
      backgroundColor: "rgba(246, 247, 252, 0.2)",
      borderRadius: "0.5rem",
      marginBottom: "0.5rem"
    },
    imeiValue: {
      fontFamily: "monospace",
      color: "#292c31"
    },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      marginRight: "0.75rem",
      border: "none",
      transition: "opacity 0.2s ease"
    },
    primaryButton: {
      backgroundColor: "#192030",
      color: "#ffffff"
    },
    secondaryButton: {
      backgroundColor: "#f6f7fc",
      color: "#192030"
    },
    dangerButton: {
      backgroundColor: "transparent",
      color: "#ef4444",
      border: "1px solid #ef4444"
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "16rem",
      color: "#292c31"
    },
    error: {
      color: "#ef4444",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "16rem"
    }
  };

  // For responsive design
  const getResponsiveStyle = () => {
    if (window.innerWidth >= 768) {
      return {
        container: { ...styles.container, padding: "1.5rem" },
        grid: { ...styles.gridMd }
      };
    }
    return {
      container: styles.container,
      grid: styles.grid
    };
  };

  const [responsiveStyles, setResponsiveStyles] = useState(getResponsiveStyle());

  // Update styles on window resize
  useEffect(() => {
    const handleResize = () => {
      setResponsiveStyles(getResponsiveStyle());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBulkPurchaseDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/Purchase/bulk-phone-purchase/${id}`);
      setPurchaseData(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Failed to load purchase details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkPurchaseDetail();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return <div style={styles.loading}>Loading purchase details...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={responsiveStyles.container}>
      {/* Back button and header */}
      <div style={styles.header}>
        <button 
          onClick={() => window.history.back()} 
          style={styles.backButton}
        >
          <FaArrowLeft style={{ marginRight: "0.5rem" }} /> Back to Purchases
        </button>
        <div style={styles.flexBetween}>
          <h1 style={styles.headerTitle}>Bulk Phone Purchase Details</h1>
          <span 
            style={{
              ...styles.badge,
              ...(purchaseData?.status === "Available" ? styles.badgeSuccess : styles.badgePending)
            }}
          >
            {purchaseData?.status}
          </span>
        </div>
      </div>

      {/* Purchase Overview Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Purchase Overview</h2>
        <div style={responsiveStyles.grid}>
          <div style={styles.flexRow}>
            <div style={styles.iconContainer}>
              <FaUserTie style={styles.icon} />
            </div>
            <div>
              <p style={styles.label}>Party Name</p>
              <p style={styles.value}>{purchaseData?.partyName || "N/A"}</p>
            </div>
          </div>
          
          <div style={styles.flexRow}>
            <div style={styles.iconContainer}>
              <FaBox style={styles.icon} />
            </div>
            <div>
              <p style={styles.label}>Company</p>
              <p style={styles.value}>{purchaseData?.companyName || "N/A"}</p>
            </div>
          </div>
          
          <div style={styles.flexRow}>
            <div style={styles.iconContainer}>
              <FaMobileAlt style={styles.icon} />
            </div>
            <div>
              <p style={styles.label}>Model</p>
              <p style={styles.value}>{purchaseData?.modelName || "N/A"}</p>
            </div>
          </div>
          
          <div style={styles.flexRow}>
            <div style={styles.iconContainer}>
              <FaMoneyBillWave style={styles.icon} />
            </div>
            <div>
              <p style={styles.label}>Payment Type</p>
              <p style={styles.value}>{purchaseData?.purchasePaymentType ? 
                purchaseData.purchasePaymentType.charAt(0).toUpperCase() + 
                purchaseData.purchasePaymentType.slice(1) : "N/A"}
              </p>
            </div>
          </div>
          
          <div style={styles.flexRow}>
            <div style={styles.iconContainer}>
              <FaMoneyBillWave style={styles.icon} />
            </div>
            <div>
              <p style={styles.label}>Payment Status</p>
              <p style={{
                ...styles.value,
                color: purchaseData?.purchasePaymentStatus === "paid" ? "#059669" : "#d97706"
              }}>
                {purchaseData?.purchasePaymentStatus ? 
                  purchaseData.purchasePaymentStatus.charAt(0).toUpperCase() + 
                  purchaseData.purchasePaymentStatus.slice(1) : "N/A"}
              </p>
            </div>
          </div>
          
          <div style={styles.flexRow}>
            <div style={styles.iconContainer}>
              <FaMoneyBillWave style={styles.icon} />
            </div>
            <div>
              <p style={styles.label}>Purchase Date</p>
              <p style={styles.value}>{formatDate(purchaseData?.date)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Details Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Pricing Details</h2>
        <div style={responsiveStyles.grid}>
          {purchaseData?.prices && (
            <>
              <div style={styles.statCard}>
                <p style={styles.label}>Buying Price</p>
                <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600"}}>
                  {formatCurrency(purchaseData.prices.buyingPrice)}
                </p>
              </div>
              
              <div style={styles.statCard}>
                <p style={styles.label}>Dealer Price</p>
                <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600"}}>
                  {formatCurrency(purchaseData.prices.dealerPrice)}
                </p>
              </div>
              
              {purchaseData.prices.lp && (
                <div style={styles.statCard}>
                  <p style={styles.label}>LP</p>
                  <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600"}}>
                    {formatCurrency(purchaseData.prices.lp)}
                  </p>
                </div>
              )}
              
              {purchaseData.prices.lifting && (
                <div style={styles.statCard}>
                  <p style={styles.label}>Lifting</p>
                  <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600"}}>
                    {formatCurrency(purchaseData.prices.lifting)}
                  </p>
                </div>
              )}
              
              {purchaseData.prices.promo && (
                <div style={styles.statCard}>
                  <p style={styles.label}>Promo</p>
                  <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600"}}>
                    {formatCurrency(purchaseData.prices.promo)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Credit Payment Details */}
      {purchaseData?.purchasePaymentType === "credit" && purchaseData?.creditPaymentData && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Credit Payment Details</h2>
          <div style={responsiveStyles.grid}>
            <div style={{...styles.statCard, backgroundColor: "#d1fae5"}}>
              <p style={styles.label}>Paid Amount</p>
              <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600", color: "#059669"}}>
                {formatCurrency(purchaseData.creditPaymentData.totalPaidAmount)}
              </p>
            </div>
            
            <div style={{...styles.statCard, backgroundColor: "#fef3c7"}}>
              <p style={styles.label}>Payable Now</p>
              <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600", color: "#d97706"}}>
                {formatCurrency(purchaseData.creditPaymentData.payableAmountNow)}
              </p>
            </div>
            
            <div style={{...styles.statCard, backgroundColor: "#fee2e2"}}>
              <p style={styles.label}>Payable Later</p>
              <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600", color: "#b91c1c"}}>
                {formatCurrency(purchaseData.creditPaymentData.payableAmountLater)}
              </p>
            </div>
            
            <div style={{...styles.statCard, backgroundColor: "#dbeafe"}}>
              <p style={styles.label}>Payment Due Date</p>
              <p style={{...styles.value, fontSize: "1.125rem", fontWeight: "600", color: "#2563eb"}}>
                {formatDate(purchaseData.creditPaymentData.dateOfPayment)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RAM/SIM Details */}
      {purchaseData?.ramSimDetails && purchaseData.ramSimDetails.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{...styles.value, fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem"}}>
            Phone Configurations
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth >= 768 ? "repeat(auto-fill, minmax(400px, 1fr))" : "1fr",
            gap: "1.5rem"
          }}>
            {purchaseData.ramSimDetails.map((config, index) => (
              <div 
                key={config._id} 
                style={{
                  ...styles.card,
                  padding: 0,
                  overflow: "hidden",
                  marginBottom: 0
                }}
              >
                <div style={styles.configHeader}>
                  <h3 style={styles.configTitle}>
                    <FaMemory style={{ marginRight: "0.5rem" }} /> 
                    Configuration #{index + 1}: {config.ramMemory}GB RAM, {config.simOption}
                  </h3>
                </div>
                
                <div style={{ padding: "1rem" }}>
                  <div style={{...styles.flexBetween, marginBottom: "0.75rem"}}>
                    <span style={styles.label}>Price Per Unit:</span>
                    <span style={styles.value}>{formatCurrency(config.priceOfOne)}</span>
                  </div>
                  
                  <div style={{...styles.flexBetween, marginBottom: "1rem"}}>
                    <span style={styles.label}>Total Units:</span>
                    <span style={styles.value}>
                      {config.imeiNumbers ? config.imeiNumbers.length : 0}
                    </span>
                  </div>
                  
                  {/* IMEI Numbers Section */}
                  {config.imeiNumbers && config.imeiNumbers.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                      <h4 style={{...styles.value, fontWeight: "500", display: "flex", alignItems: "center"}}>
                        <FaSimCard style={{ marginRight: "0.5rem" }} /> IMEI Numbers
                      </h4>
                      <div style={styles.imeiContainer}>
                        {config.imeiNumbers.map((imei, imeiIndex) => (
                          <div 
                            key={imei._id || imeiIndex} 
                            style={styles.imeiCard}
                          >
                            <div style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                              justifyContent: "space-between"
                            }}>
                              {imei.imei1 && (
                                <div>
                                  <span style={styles.label}>IMEI 1:</span>
                                  <p style={styles.imeiValue}>{imei.imei1}</p>
                                </div>
                              )}
                              
                              {imei.imei2 && (
                                <div>
                                  <span style={styles.label}>IMEI 2:</span>
                                  <p style={styles.imeiValue}>{imei.imei2}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button style={{...styles.button, ...styles.primaryButton}}>
          Edit Purchase
        </button>
        <button style={{...styles.button, ...styles.secondaryButton}}>
          Print Details
        </button>
        <button style={{...styles.button, ...styles.dangerButton}}>
          Delete Purchase
        </button>
      </div>
    </div>
  );
};

export default BulkPhoneDetail;