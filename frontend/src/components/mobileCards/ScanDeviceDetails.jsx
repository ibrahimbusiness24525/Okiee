import BarcodeReader from "components/BarcodeReader/BarcodeReader";
import { useState } from "react";
import { api } from "../../../api/api";

const ScanDeviceDetails = () => {
    const [imei, setImei] = useState("");
    const [data, setData] = useState({
        purchasePhone: {},
        bulkPhone: {},
    });



    const getDeviceDetail = async () => {
        try {
            const response = await api.get(`/api/Purchase/purchase-device/detail`, {
                params: { imei }, // ✅ IMEI is sent as a query parameter
            });
            setData({
                purchasePhone: response?.data?.purchasePhone || {},
                bulkPhone: response?.data?.bulkPhone || {},
            });
        } catch (error) {
        }
    };

    return (
        <div className="container">
            {/* Scanner */}
            <div className="scanner-section">
                <BarcodeReader onScan={setImei} />
            </div>
            <div style={{ padding: "12px", width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <button className="scan-btn" onClick={getDeviceDetail}>Get Device Details</button>
            </div>


            {/* Conditional Rendering */}
            <div className="device-details">
                {Object.keys(data.purchasePhone).length > 0 ? 
                    <div className="device-card">
                        <h2>📱 Purchase Phone Details</h2>
                        <div className="device-info">
                            <p><strong>Company:</strong> {data.purchasePhone.companyName}</p>
                            <p><strong>Model:</strong> {data.purchasePhone.modelName}</p>
                            <p><strong>IMEI 1:</strong> {data.purchasePhone.imei1}</p>
                            {data.purchasePhone.imei2 && <p><strong>IMEI 2:</strong> {data.purchasePhone.imei2}</p>}
                            <p><strong>Condition:</strong> {data.purchasePhone.phoneCondition}</p>
                            <p><strong>Color:</strong> {data.purchasePhone.color}</p>
                            <p><strong>Warranty:</strong> {data.purchasePhone.warranty}</p>
                            <p><strong>Price:</strong> {data.purchasePhone.price?.finalPrice || "N/A"} PKR</p>
                            <p><strong>Owner:</strong> {data.purchasePhone.name}</p>
                            <p><strong>Mobile:</strong> {data.purchasePhone.mobileNumber}</p>
                        </div>
                    </div>
                 : 
                    Object.keys(data.bulkPhone).length > 0 ? (
                        <div className="device-card">
                            <h2>📦 Bulk Phone Details</h2>
                            <div className="device-info">
                                <p><strong>IMEI 1:</strong> {data.bulkPhone.imeiNumbers?.imei1}</p>
                                <p><strong>IMEI 2:</strong> {data.bulkPhone.imeiNumbers?.imei2}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="no-data">{data?.data?.error || "No details Found"}</p>
                    )
                }

               
            </div>

            {/* Styles */}
            <style jsx>{`
                .container {
                    max-width: 100%;
                    margin: auto;
                    padding: 20px;
                    text-align: center;
                }
                .scanner-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                }
              .scan-btn {
                        background: linear-gradient(to right, #50b5f4, #b8bee2);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        border-radius: 5px;
                        margin-top: 10px;
                        transition: background 0.3s ease-in-out;
                    }
                        
                    .scan-btn:hover {
                        background: linear-gradient(to right, #b8bee2, #50b5f4);
                    }

                .device-details {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .device-card {
                    background: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: left;
                }
                .device-card h2 {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 10px;
                }
                .device-info p {
                    margin: 5px 0;
                    font-size: 14px;
                }
                .no-data {
                    font-size: 14px;
                    color: #888;
                }
            `}</style>
        </div>
    );
};

export default ScanDeviceDetails;
