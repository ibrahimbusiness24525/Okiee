import { BASE_URL } from "config/constant";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PurchaseDetail = () => {
    const { id } = useParams();
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchaseDetail = async () => {
            try {
                const response = await fetch(`${BASE_URL}api/Purchase/purchase-phone/${id}`);
                const result = await response.json();
                console.log(result);
                if (response.ok) {
                    setPurchase(result.data);
                } else {
                    setError(result.message || "Failed to fetch data");
                }
            } catch (err) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseDetail();
    }, [id]);
    
    if (loading) return <h2 style={{ textAlign: "center", color: "blue" }}>Loading...</h2>;
    if (error) return <h2 style={{ textAlign: "center", color: "red" }}>Error: {error}</h2>;
    if (!purchase) return <h2 style={{ textAlign: "center", color: "gray" }}>Not Found</h2>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h3 style={{ textAlign: "center", color: "#333" }}>Today Purchase Detail</h3>
            <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", background: "#f9f9f9" }}>
                <p><strong>Name:</strong> {purchase.name}</p>
                <p><strong>Father Name:</strong> {purchase.fatherName}</p>
                <p><strong>Company:</strong> {purchase.companyName}</p>
                <p><strong>Model:</strong> {purchase.modelName}</p>
                <p><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                <p><strong>CNIC:</strong> {purchase.cnic}</p>
                <p><strong>Phone Condition:</strong> {purchase.phoneCondition}</p>
                <p><strong>Warranty:</strong> {purchase.warranty}</p>
                <p><strong>Specifications:</strong> {purchase.specifications}</p>
                <p><strong>RAM/Memory:</strong> {purchase.ramMemory}</p>
                <p><strong>Color:</strong> {purchase.color}</p>
                <p><strong>IMEI 1:</strong> {purchase.imei1}</p>
                <p><strong>IMEI 2:</strong> {purchase.imei2}</p>
                <p><strong>Mobile Number:</strong> {purchase.mobileNumber}</p>
                <p><strong>Approved from Egadgets:</strong> {purchase.isApprovedFromEgadgets ? "Yes" : "No"}</p>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <h4 style={{ color: "#555" }}>Profile & Egadget Pics</h4>
                <img src={purchase.profilePic || "not-found.jpg"} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "10px", marginRight: "10px" }} />
                <img src={purchase.egadgetPic || "not-found.jpg"} alt="Egadget" style={{ width: "100px", height: "100px", borderRadius: "10px" }} />
            </div>
        </div>
    );
};

export default PurchaseDetail;