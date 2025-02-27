import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Bulk Sale Details</h2>
            {saleDetail ? (
                <>
                    <p><strong>Invoice Number:</strong> {saleDetail.invoiceNumber}</p>
                    <p><strong>Customer Name:</strong> {saleDetail.customerName}</p>
                    <p><strong>IMEI 1:</strong> {saleDetail.imei1}</p>
                    <p><strong>IMEI 2:</strong> {saleDetail.imei2 || "N/A"}</p>
                    <p><strong>Sale Price:</strong> {saleDetail.salePrice} PKR</p>
                    <p><strong>Warranty:</strong> {saleDetail.warranty}</p>
                    <p><strong>Date Sold:</strong> {new Date(saleDetail.dateSold).toLocaleString()}</p>
                </>
            ) : (
                <p>No sale details available.</p>
            )}
        </div>
    );
};

export default BulkSalesDetail;
