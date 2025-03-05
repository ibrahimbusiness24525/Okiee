import JsBarcode from "jsbarcode";
import { useRef } from "react";

const BarcodePrinter = ({ obj }) => {
    const barcodeRef = useRef(null);

    const printBarcode = () => {
        if (!obj) return;

        // Determine which IMEI(s) to print
        const imei1 = obj?.imei1 ? obj.imei1.toString() : null;
        const imei2 = obj?.imei2 ? obj.imei2.toString() : null;
        const modelName = obj?.modelName || "Unknown Model"; // Fallback for modelName
        const companyName = obj?.companyName || "Unknown Company Name"; // Fallback for modelName

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
                        body { text-align: center; padding: 20px; font-family: Arial, sans-serif; }
                        img { max-width: 100%; margin-bottom: 10px; }
                    </style>
                </head>
                <body>
                <p>${companyName}</p>
                <img src="${canvas1.toDataURL()}" alt="IMEI 1 Barcode" />
            <p style="font-size: 12px; font-weight: 800;">${modelName}</p>

                
                    ${imei2 ? `
                        <img src="${canvas2.toDataURL()}" alt="IMEI 2 Barcode" />
                    ` : ""}
                    
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
