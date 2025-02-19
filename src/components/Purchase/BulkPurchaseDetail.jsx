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
            console.log("bulk result", result);
            setPurchase(result);
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
            <h2 style={{ textAlign: "center", color: "#333" }}>Purchase Detail</h2>
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", background: "#f9f9f9" }}>
                <p><strong>Party Name:</strong> {purchase.partyName}</p>
                <p><strong>Company:</strong> {purchase.companyName}</p>
                <p><strong>Model:</strong> {purchase.modelName}</p>
                <p><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {purchase.status}</p>
                
                <h3 style={{ marginTop: "15px", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>Prices</h3>
                <p><strong>Buying Price:</strong> {purchase.prices.buyingPrice}</p>
                <p><strong>Dealer Price:</strong> {purchase.prices.dealerPrice}</p>
                <p><strong>LP:</strong> {purchase.prices.lp}</p>
                <p><strong>Lifting:</strong> {purchase.prices.lifting}</p>
                <p><strong>Promo:</strong> {purchase.prices.promo}</p>
                <p><strong>Activation:</strong> {purchase.prices.activation}</p>

                <h3 style={{ marginTop: "15px", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>RAM & SIM Details</h3>
                {purchase.ramSimDetails.length > 0 ? (
                    <div>
                        {purchase.ramSimDetails.map((ramSim, index) => (
                            <div key={index} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px", background: "#fff" }}>
                                <h4 style={{ color: "#555" }}>RAM & SIM of Mobile {index + 1}</h4>
                                <p><strong>RAM/Memory:</strong> {ramSim.ramMemory}</p>
                                <p><strong>SIM Option:</strong> {ramSim.simOption}</p>
                                <h5 style={{ marginTop: "10px", color: "#777" }}>IMEI Numbers</h5>
                                <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                                    {ramSim.imeiNumbers.map((imei, i) => (
                                        <li key={i} style={{ padding: "5px 0", borderBottom: "1px solid #eee" }}>
                                            <strong>IMEI {i + 1}:</strong> {imei.imei1}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: "center", color: "#777" }}>No RAM & SIM details found.</p>
                )}
            </div>
        </div>
    );
};

export default PurchaseDetail;
