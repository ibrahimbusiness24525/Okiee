import JsBarcode from "jsbarcode";
import { useRef, useState } from "react";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import List from '../List/List'

const BarcodePrinter = ({ obj, type }) => {
    const [selectedImeis, setSelectedImeis] = useState([]);
    const [modal, setModal] = useState(false);

    const printBarcode = () => {
        if (!obj) return;
        const imei1 = obj?.imei1 ? obj.imei1.toString() : null;
        const imei2 = obj?.imei2 ? obj.imei2.toString() : null;
        const batteryHealth = obj?.batteryHealth ? obj?.batteryHealth.toString() : null;
        const modelName = obj?.modelName || "Unknown Model";
        const ramMemory = obj?.ramMemory || "Unknown RAM";
        const phoneCondition = obj?.phoneCondition || "Unknown Condition";
        const companyName = obj?.companyName || "Unknown Brand";
        const color = obj?.color || "Unknown Color";
        const shop = JSON.parse(localStorage.getItem("shop") || "{}");
        const { shopName } = shop;

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

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                       @page { 
    size: portrait; /* Keep portrait */
    margin: 0;
}

body { 
    font-family: Arial, sans-serif; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    width: 70mm;  /* Increase width */
    height: 40mm; /* Increase height */
    margin: 0;
}

.container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 1mm; /* Slightly more padding */
}

.company-name {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 40px;  /* Bigger text */
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
}

.battery-health {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 100px;  /* Bigger text */
    font-weight: bold;
    text-align: left;
    white-space: nowrap;
        margin-right: 40mm;  /* Add margin to move it to the right */

}

.shop-name {

    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 12px;  /* Bigger text */
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
}

.barcode-section {
    text-align: center;
    line-height: 1.2;
        transform: rotate(360deg);
}

.barcode-img { 
    width: 60mm;  /* Bigger barcode */
    height: 10mm; 
}

p {
    margin: 2px 0;
    font-size: 12px;  /* Bigger text */
    font-weight: bold;
}

                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="barcode-section">
                            <img class="barcode-img" src="${canvas1.toDataURL()}" alt="IMEI 1 Barcode" />
                            <p>${companyName} ${color} ${ramMemory} ${phoneCondition}</p>
                                                    <p>${shopName}</p>
                            ${imei2 ? `<img class="barcode-img" src="${canvas2.toDataURL()}" alt="IMEI 2 Barcode" />` : ""}
                        </div>
                        <div class="battery-health">${batteryHealth ? `<p>${batteryHealth}</p>` : ""}</div>
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
                onClick={() => printBarcode()}
            >
                Print Barcode
            </button>
        </div>
    );
};

export default BarcodePrinter;
