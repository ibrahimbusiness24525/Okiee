import { BASE_URL } from "config/constant";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SalesDetail = () => {
    const { id } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSaleDetail = async () => {
        try {
            const response = await fetch(`${BASE_URL}api/invoice/invoices/${id}`);
            const result = await response.json();
            console.log(result);
            if (response.ok) {
                setSale(result.invoice);  // ✅ Corrected to use `invoice`
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
        fetchSaleDetail();
    }, [id]);  // ✅ Dependency added to refetch if `id` changes
    
    if (loading) return <h2 style={{ textAlign: "center", color: "blue" }}>Loading...</h2>;
    if (error) return <h2 style={{ textAlign: "center", color: "red" }}>Error: {error}</h2>;
    if (!sale) return <h2 style={{ textAlign: "center", color: "gray" }}>Not Found</h2>;

    // Extract first item from invoice (since it's an array)
    const item = sale.items?.[0] || {};

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h3 style={{ textAlign: "center", color: "#333" }}>Invoice Detail</h3>
            <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", background: "#f9f9f9" }}>
                <p><strong>Invoice Number:</strong> {sale.invoiceNumber}</p>
                <p><strong>Date:</strong> {new Date(sale.invoiceDate).toLocaleDateString()}</p>
                <p><strong>Shop ID:</strong> {sale.shopId}</p>
                <p><strong>Total Amount:</strong> {sale.totalAmount}</p>
                
                {/* Mobile Details */}
                {item && (
                    <>
                        <p><strong>Mobile Name:</strong> {item.mobileName}</p>
                        <p><strong>Company:</strong> {item.mobileCompany}</p>
                        <p><strong>IMEI 1:</strong> {item.imei}</p>
                        <p><strong>IMEI 2:</strong> {item.imei2}</p>
                        <p><strong>Warranty:</strong> {item.warranty}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SalesDetail;
