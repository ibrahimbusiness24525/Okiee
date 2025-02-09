import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h4>Scan IMEI Barcode</h4>

      {!scanning ? (
        <button
          onClick={() => setScanning(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Open Camera to Scan
        </button>
      ) : (
        <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px" }}>
          <BarcodeScannerComponent
            width={250}
            height={250}
            onUpdate={(err, result) => {
              if (result) {
                onScan(result.text); // Pass scanned IMEI to parent
                setScanning(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
