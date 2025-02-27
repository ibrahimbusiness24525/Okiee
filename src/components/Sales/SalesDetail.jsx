import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";

const SalesDetail = () => {
    const { id } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSaleDetail = async () => {
            try {
                const response = await api.get(`/api/Purchase/single-sold-phone/${id}`);
                if (response.data?.success) {
                    setSale(response.data.soldPhoneDetail);
                } else {
                    setError("Failed to fetch sale details");
                }
            } catch (err) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchSaleDetail();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Sale Details</h2>
            {sale ? (
                <>
                    <p><strong>Invoice Number:</strong> {sale.invoiceNumber}</p>
                    <p><strong>Customer Name:</strong> {sale.customerName}</p>
                    <p><strong>Mobile Number:</strong> {sale.mobileNumber}</p>
                    <p><strong>Father Name:</strong> {sale.fatherName}</p>
                    <p><strong>Company Name:</strong> {sale.companyName}</p>
                    <p><strong>Model:</strong> {sale.modelName}</p>
                    <p><strong>Condition:</strong> {sale.phoneCondition}</p>
                    <p><strong>Warranty:</strong> {sale.warranty}</p>
                    <p><strong>Specifications:</strong> {sale.specifications}</p>
                    <p><strong>RAM:</strong> {sale.ramMemory} GB</p>
                    <p><strong>Color:</strong> {sale.color}</p>
                    <p><strong>IMEI 1:</strong> {sale.imei1}</p>
                    <p><strong>IMEI 2:</strong> {sale.imei2}</p>
                    <p><strong>Purchase Price:</strong> {sale.purchasePrice} PKR</p>
                    <p><strong>Final Price:</strong> {sale.finalPrice} PKR</p>
                    <p><strong>Demand Price:</strong> {sale.demandPrice} PKR</p>
                    <p><strong>Sale Date:</strong> {new Date(sale.saleDate).toLocaleString()}</p>
                    <p><strong>Purchase Date:</strong> {new Date(sale.purchaseDate).toLocaleString()}</p>
                    <p><strong>Accessories:</strong></p>
                    <ul>
                        <li>Box: {sale.accessories?.box ? "Yes" : "No"}</li>
                        <li>Charger: {sale.accessories?.charger ? "Yes" : "No"}</li>
                        <li>Hand Free: {sale.accessories?.handFree ? "Yes" : "No"}</li>
                    </ul>
                </>
            ) : (
                <p>No sale details available.</p>
            )}
        </div>
    );
};

export default SalesDetail;
