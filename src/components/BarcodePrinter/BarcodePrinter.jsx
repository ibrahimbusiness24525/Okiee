import JsBarcode from "jsbarcode";
import { useRef, useState } from "react";
<<<<<<< HEAD
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import List from '../List/List'

const BarcodePrinter = ({ obj, type }) => {
=======
import { Button, ListGroup, Modal,Form } from "react-bootstrap";

const BarcodePrinter = ({ obj,type}) => {
    const barcodeRef = useRef(null);
>>>>>>> cd4d1d9f17da02deb5f656f81898d022f4d26c5f
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
<<<<<<< HEAD
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
    padding: 1mm;
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
                        <div class="shop-name">${shopName}</div>
                        <div class="barcode-section">
                            <img class="barcode-img" src="${canvas1.toDataURL()}" alt="IMEI 1 Barcode" />
                            <p>${companyName} ${color} ${ramMemory} ${phoneCondition}</p>
                            ${imei2 ? `<img class="barcode-img" src="${canvas2.toDataURL()}" alt="IMEI 2 Barcode" />` : ""}
                        </div>
                        <div class="battery-health">${batteryHealth ? `<p>${batteryHealth}</p>` : ""}</div>
                    </div>
                    <script>
=======
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
>>>>>>> cd4d1d9f17da02deb5f656f81898d022f4d26c5f
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

<<<<<<< HEAD
    return (
        <div>
=======
    const printBulkPhoneBarcode = () =>{
        setModal(true)
    }
    const imeiList = obj?.ramSimDetails?.map(item => {
        return item.imeiNumbers?.map(num => ({
            imei1: num.imei1 || null,
            imei2: num.imei2 || null, // Include IMEI2 only if present
            modelName: obj?.modelName || "N/A",
            batteryHealth: obj?.batteryHealth || "N/A",
            partyName: obj?.partyName || "N/A",
            prices: obj?.prices || {},
            simType: num.imei2 ? "Dual SIM" : "Single SIM", // Identify Single or Dual SIM
        }));
    }).flat() || []; // Flatten the array to remove nesting
    
    
console.log("Extracted IMEIs:", imeiList);
console.log("This is the object:", obj);
const handleSelectImei = (imei) => {
    setSelectedImeis((prevSelected) => {
        const isAlreadySelected = prevSelected.some(
            (item) => item.imei1 === imei.imei1 && item.imei2 === imei.imei2
        );

        return isAlreadySelected
            ? prevSelected.filter((item) => item.imei1 !== imei.imei1 || item.imei2 !== imei.imei2) // Remove selected IMEI pair
            : [...prevSelected, imei]; // Add new IMEI pair
    });
};

// const printBulkBarcode = (data) =>{
//     console.log("this is the data", data);
    
//    const imei = data.imei1 ? data.imei1.toString() : null;
//     const imei2 = data.imei2 ? data.imei2.toString() : null;
//     const modelName = data.modelName || "Unknown Model"; // Fallback value
//     const batteryHealth = data?.batteryHealth; // Fallback value
//     const partyName = data.partyName || "Unknown Party Name"; // Fallback value
//     // Create barcodes for available IMEIs
//     const canvas1 = document.createElement("canvas");
//     JsBarcode(canvas1, imei || "N/A", {
//         format: "CODE128",
//         displayValue: true,
//         width: 2,
//         height: 30,
//     });

//     let canvas2;
//     if (imei2) {
//         canvas2 = document.createElement("canvas");
//         JsBarcode(canvas2, imei2, {
//             format: "CODE128",
//             displayValue: true,
//             width: 2,
//             height: 30,
//         });
//     }

//     // Open a new print window
//     const printWindow = window.open("", "_blank");
//     if (printWindow) {
//         printWindow.document.write(`
//             <html>
//             <head>
//                 <title>Print Barcode</title>
//                 <style>
//                    body { 
//                     font-family: Arial, sans-serif; 
//                     display: flex; 
//                     align-items: center; 
//                     justify-content: center; 
//                     width: 50.8mm;
//                     height: 25.4mm;
//                     margin: 0;
//                     }

//                     .container {
//                     display: flex;

//                     align-items: center;
//                     justify-content: center;
//                     width: 100%;
//                     height: 5rem;
//                     border: 1px solid black; /* Optional: for visualization */
//                     }

//                     .company-name {
//                     writing-mode: vertical-rl;
//                     transform: rotate(180deg);
//                     font-size: 8px; /* Adjusted for better fit */
//                     font-weight: bold;
//                     padding: 2px;
//                     text-align: center;
//                     white-space: nowrap;
//                     }

//                     .barcode-section {
//                     text-align: center;
//                     line-height: 1.0;
//                     padding-right: 18px;
//                     padding-bottom:3px
//                     }

//                     .barcode-img { 
//                     width: 36mm;  /* Adjusted for scale */
//                     height: 8mm; /* Adjusted for scale */
//                     margin-top: 2px;
//                     }

//                     p {
//                     margin: 2px 0;
//                     font-size: 8px;
//                     font-weight: 800;
//                     }

//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="barcode-section">
//                      <img class="barcode-img" src="${canvas1.toDataURL()}" alt="IMEI 1 Barcode" />
//                       <p>${modelName || ""}   ${ "New"}</p>
//                             ${imei2 ? `<img class="barcode-img" src="${canvas2.toDataURL()}" alt="IMEI 2 Barcode" />` : ""}
//                             </div>

//                         </div>
//                     </div>
//                 <script>
//                     window.onload = function() {
//                         window.print();
//                         setTimeout(() => window.close(), 500);
//                     };
//                 </script>
//             </body>
//             </html>
//         `);
//         printWindow.document.close();
//     }
// }
const printBulkBarcode = (data) => {
    console.log("this is the data", data);

    const imei = data.imei1 ? data.imei1.toString() : null;
    const imei2 = data.imei2 ? data.imei2.toString() : null;
    const modelName = data.modelName || "Unknown Model";

    // Create barcodes for available IMEIs
    const canvas1 = document.createElement("canvas");
    JsBarcode(canvas1, imei || "N/A", {
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

    // Create a hidden iframe for printing
    let iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
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
                border: 1px solid black;
                }

                .barcode-section {
                text-align: center;
                line-height: 1.0;
                padding-right: 18px;
                padding-bottom:3px
                }

                .barcode-img { 
                width: 36mm;
                height: 8mm;
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
                    <p>${modelName} New</p>
                    ${imei2 ? `<img class="barcode-img" src="${canvas2.toDataURL()}" alt="IMEI 2 Barcode" />` : ""}
                </div>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => {
                        window.parent.document.body.removeChild(window.frameElement);
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    doc.close();
};


const handlePrintSelectedImeis = async () => {
    if (selectedImeis.length === 0) {
        alert("No IMEIs selected for printing.");
        return;
    }

    for (let i = 0; i < selectedImeis.length; i++) {
        await new Promise((resolve) => {
            setTimeout(() => {
                printBulkBarcode(selectedImeis[i]);
                resolve();
            }, 1000); 
        });
    }
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
    imeiList.map((item, index) => (
      <ListGroup.Item key={index} className="d-flex align-items-center">
        <Form.Check
          type="checkbox"
          checked={selectedImeis.some(i => i.imei1 === item.imei1 && i.imei2 === item.imei2)}
          onChange={() => handleSelectImei(item)}
        />
        <span className="ms-2">Imei1: {item.imei1}</span>
        {item.imei2 && <span className="ms-2">Imei2: {item.imei2}</span>}
        <span className="ms-2">{item.modelName}</span>
        <span className="ms-2">{item.partyName}</span>
      </ListGroup.Item>
    ))
  ) : (
    <p>No IMEIs available</p>
  )}
</ListGroup>

                {/* <h6 className="mt-3">Selected IMEIs:</h6> */}
                {/* {selectedImeis.length > 0 ? (
                    <ListGroup>
                        {selectedImeis.map((imei, index) => (
                            <ListGroup.Item key={index}>{imei}</ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>No IMEIs selected</p>
                )} */}
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
>>>>>>> cd4d1d9f17da02deb5f656f81898d022f4d26c5f
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
