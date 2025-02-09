import { useState } from "react";
import useScanDetection from "use-scan-detection";

const BarcodeReader = ({ onScan }) => {
  const [imeiNumber, setImeiNumber] = useState("Not Scanned yet");

  useScanDetection({
    onComplete: (value) => {
      setImeiNumber(value);
      if (onScan) onScan(value);
    },
    minLength: 3,
  });

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "200px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    margin: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  };

  const textStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  };

  return (
    <div style={containerStyle}>
       <h4>Scan a Barcode</h4>
      <p style={textStyle}>{`IMEI Value: ${imeiNumber}`}</p>
    </div>
  );
};

export default BarcodeReader;
