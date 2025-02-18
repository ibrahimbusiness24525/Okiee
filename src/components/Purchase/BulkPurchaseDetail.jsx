import { BASE_URL } from "config/constant";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PurchaseDetail = () => {
    const { id } = useParams();
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchBulkPurchaseDetail = async () => {
        try {
            const response = await fetch(`${BASE_URL}api/Purchase/bulk-phone-purchase/${id}`);
            const result = await response.json();
            console.log("bulk result",result);
            
            setPurchase(result)
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBulkPurchaseDetail();
    }, []);

    if (loading) return <h2 style={{ textAlign: "center", color: "blue" }}>Loading...</h2>;
    if (error) return <h2 style={{ textAlign: "center", color: "red" }}>Error: {error}</h2>;
    if (!purchase) return <h2 style={{ textAlign: "center", color: "gray" }}>Not Found</h2>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h3 style={{ textAlign: "center", color: "#333" }}>Purchase Detail</h3>
                <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", background: "#f9f9f9" }}>
                    <p><strong>Party Name:</strong> {purchase.partyName}</p>
                    <p><strong>Company:</strong> {purchase.companyName}</p>
                    <p><strong>Model:</strong> {purchase.modelName}</p>
                    <p><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {purchase.status}</p>
                    <h4>Prices</h4>
                    <p><strong>Buying Price:</strong> {purchase.prices.buyingPrice}</p>
                    <p><strong>Dealer Price:</strong> {purchase.prices.dealerPrice}</p>
                    <p><strong>LP:</strong> {purchase.prices.lp}</p>
                    <p><strong>Lifting:</strong> {purchase.prices.lifting}</p>
                    <p><strong>Promo:</strong> {purchase.prices.promo}</p>
                    <p><strong>Activation:</strong> {purchase.prices.activation}</p>
                    <h4>RAM & SIM Details</h4>
                       {purchase.ramSimDetails.length > 0 ?
                       <>
                          {purchase.ramSimDetails.map((ramSim, index) => (
                              <div key={index} style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                                  <p><strong>RAM/Memory:</strong> {ramSim.ramMemory}</p>
                                  <p><strong>SIM Option:</strong> {ramSim.simOption}</p>
                                  <h5>IMEI Numbers</h5>
                                  {ramSim.imeiNumbers.map((imei, i) => (
                                      <p key={i}><strong>IMEI {i + 1}:</strong> {imei.imei1}</p>
                                  ))}
                              </div>
                          ))}
       
                       </>:
                      <>
                       <p>
                          Not Found
                       </p>
                      </>
                      }
                </div>
        </div>
    );
};

export default PurchaseDetail;
