import JsBarcode from "jsbarcode";
import { useRef } from "react";

const BarcodePrinter = ({ obj }) => {
    const barcodeRef = useRef(null);

    const printBarcode = () => {
        if (!obj) return;

        // Determine which IMEI(s) to print
        const imei1 = obj?.imei1 ? obj.imei1.toString() : null;
        const imei2 = obj?.imei2 ? obj.imei2.toString() : null;
        const batteryHealth = obj?.batteryHealth? obj?.batteryHealth.toString() : null;
        const specifications = obj?.specifications? obj?.specifications.toString() : null;
        const modelName = obj?.modelName || "Unknown Model"; // Fallback for modelName
        const companyName = obj?.companyName || "Unknown Company Name"; // Fallback for modelName
        const shop = JSON.parse(localStorage.getItem("shop") || "{}"); // Ensure it's an object
        const { shopName } = shop;

        // Create barcodes for available IMEIs
        const canvas1 = document.createElement("canvas");
        JsBarcode(canvas1, imei1 || "N/A", {
            format: "CODE128",
            displayValue: true,
            width: 2,
            height: 50,
        });

        let canvas2;
        if (imei2) {
            canvas2 = document.createElement("canvas");
            JsBarcode(canvas2, imei2, {
                format: "CODE128",
                displayValue: true,
                width: 2,
                height: 50,
            });
        }

        // Open a new print window
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            height: 20rem; 
                            margin: 0;
                        }
                        .container {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .company-name {
                            writing-mode: vertical-rl;
                            transform: rotate(180deg);
                            font-size: 14px;
                            font-weight: bold;
                            padding: 10px;
                            text-align: center;
                            white-space: nowrap;
                        }
                        .barcode-section {
                            text-align: center;
                            line-height: 1.2;
                            padding-left: 10px;
                        }
                        .barcode-img { 
                            width:90px
                            height:80px;
                            margin-bottom: 5px;
                        }
                        p {
                            margin: 5px 0;
                            font-size: 10px;
                            font-weight: 800;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="company-name">${shopName}</div>
                        <div class="barcode-section">
                          <img class="barcode-img" src="${canvas1.toDataURL()}" alt="IMEI 1 Barcode" />
                            <p>${modelName}</p>
                            ${imei2 ? `<img class="barcode-img" src="${canvas2.toDataURL()}" alt="IMEI 2 Barcode" />` : ""}
                            <p>${specifications || "No Mentioned"}</p>
                            
                            </div>
                            <div class="company-name">${batteryHealth ? `<p>${batteryHealth}</p>` : ""}</div>
                             
                        </div>
        
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
        
    };

    return (
        <div>
            <button
                style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}
                onClick={printBarcode}
            >
                Print Barcode
            </button>
        </div>
    );
};

export default BarcodePrinter;
