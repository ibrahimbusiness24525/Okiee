import { BASE_URL } from "config/constant";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineUser, AiOutlineMobile } from "react-icons/ai"; // Import Icons

const PurchaseDetail = () => {
    const { id } = useParams();
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchPurchaseDetail();
    }, []);
    
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
    <h4 style={{ color: "#555", marginBottom: "10px" }}>Profile & Egadget Pics</h4>

    {/* Profile Picture */}
    <div style={{ display: "inline-block", textAlign: "center", marginRight: "15px" }}>
        {purchase.profilePic ? (
            <img
                src={purchase.profilePic}
                alt="Profile"
                style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}
            />
        ) : (
            <>
                <AiOutlineUser size={100} color="#888" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "10px", padding: "10px" }} />
                <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>Not Found</p>
            </>
        )}
    </div>

    {/* Egadget Picture */}
    <div style={{ display: "inline-block", textAlign: "center" }}>
        {purchase.egadgetPic ? (
            <img
                src={purchase.egadgetPic}
                alt="Egadget"
                style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}
             />
                ) : (
                <>
                    <AiOutlineMobile size={100} color="#888" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "10px", padding: "10px" }} />
                    <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>Not Found</p>
                </>
              )}
            </div>
        </div>

        </div>
    );
};

export default PurchaseDetail;