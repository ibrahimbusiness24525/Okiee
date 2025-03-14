import JsBarcode from "jsbarcode";
import { useRef, useState } from "react";
import { Button, ListGroup, Modal,Form } from "react-bootstrap";
import List from '../List/List'
const BarcodePrinter = ({ obj,type}) => {
    const barcodeRef = useRef(null);
    const [selectedImeis, setSelectedImeis] = useState([]);
    const[modal,setModal] = useState(false)
    const printBarcode = () => {
        if (!obj) return;
        // Determine which IMEI(s) to print
        const imei1 = obj?.imei1 ? obj.imei1.toString() : null;
        const imei2 = obj?.imei2 ? obj.imei2.toString() : null;
        const batteryHealth = obj?.batteryHealth? obj?.batteryHealth.toString() : null;
        const specifications = obj?.specifications? obj?.specifications.toString() : null;
        const modelName = obj?.modelName || "Unknown Model"; // Fallback value
        const ramMemory = obj?.ramMemory || "Unknown RAM"; // Fallback value
        const phoneCondition = obj?.phoneCondition || "Unknown Condition"; // Fallback value
        const companyName = obj?.companyName || "Unknown Brand"; // Fallback value
        const color = obj?.color || "Unknown Color"; // Fallback value
        const shop = JSON.parse(localStorage.getItem("shop") || "{}"); // Ensure it's an object
        const { shopName } = shop;

        // Create barcodes for available IMEIs
        const canvas1 = document.createElement("canvas");
        JsBarcode(canvas1, imei1 || "N/A", {
            format: "CODE128",
            displayValue: true,
            width: 2,
            height: 30,
        });

        let canvas2;
        if (imei2) {
            canvas2 = document.createElement("canvas");
            JsBarcode(canvas2, imei2, {
                format: "CODE128",
                displayValue: true,
                width: 2,
                height: 30,
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
    width: 50.8mm;
    height: 25.4mm;
    margin: 0;
}

.container {
    display: flex;
    
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 5rem;
    border: 1px solid black; /* Optional: for visualization */
}

.company-name {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 8px; /* Adjusted for better fit */
    font-weight: bold;
    padding: 2px;
    text-align: center;
    white-space: nowrap;
}

.barcode-section {
    text-align: center;
    line-height: 1.0;
    padding-right: 18px;
    padding-bottom:3px
}

.barcode-img { 
    width: 36mm;  /* Adjusted for scale */
    height: 8mm; /* Adjusted for scale */
    margin-top: 2px;
}

p {
    margin: 2px 0;
    font-size: 8px;
    font-weight: 800;
}

                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="company-name">${shopName}</div>
                        <div class="barcode-section">
                        <img class="barcode-img" src="${canvas1.toDataURL()}" alt="IMEI 1 Barcode" />
                      <p>${companyName || ""}  ${color || ""}  ${ramMemory || ""} ${phoneCondition || ""}</p>
                            ${imei2 ? `<img class="barcode-img" src="${canvas2.toDataURL()}" alt="IMEI 2 Barcode" />` : ""}
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

    const printBulkPhoneBarcode = () =>{
        setModal(true)
    }


    const imeiList = obj?.ramSimDetails
    ?.flatMap(item => item.imeiNumbers?.flatMap(num => [num.imei1, num.imei2]) || [])
    .filter(Boolean) || []; 

    // const imeiList = obj?.ramSimDetails?.map((item) => ({
    //     imeis: item.imeiNumbers?.flatMap(num => [num.imei1, num.imei2]).filter(Boolean) || [],
    //     modelName: obj?.modelName || "N/A",
    //     partyName: obj?.partyName || "N/A",
    //     prices: obj?.prices || {},
    // })) || [];

console.log("Extracted IMEIs:", imeiList);
console.log("This is the object:", obj);
const handleSelectImei = (imei) => {
    setSelectedImeis((prevSelected) =>
        prevSelected.includes(imei)
            ? prevSelected.filter((item) => item !== imei) // Remove if already selected
            : [...prevSelected, imei] // Add if not selected
    );
};
const printBulkBarcode = (imei) =>{
   
    // Create barcodes for available IMEIs
    const canvas1 = document.createElement("canvas");
    JsBarcode(canvas1, imei || "N/A", {
        format: "CODE128",
        displayValue: true,
        width: 2,
        height: 30,
    });

    let canvas2;
    if (imei) {
        canvas2 = document.createElement("canvas");
        JsBarcode(canvas2, imei, {
            format: "CODE128",
            displayValue: true,
            width: 2,
            height: 30,
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
width: 50.8mm;
height: 25.4mm;
margin: 0;
}

.container {
display: flex;

align-items: center;
justify-content: center;
width: 100%;
height: 5rem;
border: 1px solid black; /* Optional: for visualization */
}

.company-name {
writing-mode: vertical-rl;
transform: rotate(180deg);
font-size: 8px; /* Adjusted for better fit */
font-weight: bold;
padding: 2px;
text-align: center;
white-space: nowrap;
}

.barcode-section {
text-align: center;
line-height: 1.0;
padding-right: 18px;
padding-bottom:3px
}

.barcode-img { 
width: 36mm;  /* Adjusted for scale */
height: 8mm; /* Adjusted for scale */
margin-top: 2px;
}

p {
margin: 2px 0;
font-size: 8px;
font-weight: 800;
}

                </style>
            </head>
            <body>
                <div class="container">
                    <div class="barcode-section">
                    <img class="barcode-img" src="${canvas1.toDataURL()}" alt="IMEI 1 Barcode" />
                        </div>
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
}

const handlePrintSelectedImeis = () => {
    selectedImeis.forEach((imei, index) => {
        console.log(`Printing IMEI ${index + 1}: ${imei}`);
        printBulkBarcode(imei);
    });
};
    return (
        <div>
              <Modal show={modal} >
                    <Modal.Header>
                      <Modal.Title>Imeis </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                    <ListGroup>
                    {imeiList.length > 0 ? (
                        imeiList.map((imei, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedImeis.includes(imei)}
                                    onChange={() => handleSelectImei(imei)}
                                />
                                <span className="ms-2">{imei}</span>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p>No IMEIs available</p>
                    )}
                </ListGroup>

                <h6 className="mt-3">Selected IMEIs:</h6>
                {selectedImeis.length > 0 ? (
                    <ListGroup>
                        {selectedImeis.map((imei, index) => (
                            <ListGroup.Item key={index}>{imei}</ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>No IMEIs selected</p>
                )}
                    </Modal.Body>
                    <Modal.Footer>
                <Button variant="secondary"onClick={()=> setModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handlePrintSelectedImeis}>
                    Print Selected IMEIs
                </Button>
            </Modal.Footer>
                    
                  </Modal>
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
                onClick={() => (type === "bulk" ? printBulkPhoneBarcode() : printBarcode())}
            >
                Print Barcode
            </button>
        </div>
    );
};

export default BarcodePrinter;



