
import { useState, useRef } from "react";
import useScanDetection from "use-scan-detection";
import { BrowserMultiFormatReader } from "@zxing/browser";
import BarcodeScanner from "react-qr-barcode-scanner";
import { FiCopy, FiCamera } from "react-icons/fi";

const BarcodeReader = ({ onScan }) => {
  const [imeiNumber, setImeiNumber] = useState("111111111111");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUsingZXing, setIsUsingZXing] = useState(false);
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  // Handle keyboard barcode scanning
  useScanDetection({
    onComplete: (value) => {
      setImeiNumber(value);
      if (onScan) onScan(value);
    },
    minLength: 3,
  });

  // Handle clipboard copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imeiNumber);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Start camera scanning with @zxing/browser
  const startZXingScanner = async () => {
    try {
      setIsCameraOpen(true);
      setIsUsingZXing(true);
      const devices = await codeReader.listVideoInputDevices();
      if (devices.length === 0) {
        alert("No camera found!");
        stopScanning();
        return;
      }
      const firstCameraId = devices[0].deviceId;
      codeReader.decodeFromVideoDevice(firstCameraId, videoRef.current, (result, err) => {
        if (result) {
          setImeiNumber(result.getText());
          if (onScan) onScan(result.getText());
          stopScanning();
        }
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      stopScanning();
    }
  };

  // Stop scanning
  const stopScanning = () => {
    codeReader.reset();
    setIsCameraOpen(false);
    setIsUsingZXing(false);
  };

  // Handle scanning with react-qr-barcode-scanner
  const handleScan = (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result) {
      setImeiNumber(result.text);
      if (onScan) onScan(result.text);
      stopScanning();
    }
  };

  return (
    <div style={styles.container}>
      <h4>Scan a Barcode</h4>

      {/* IMEI Display & Copy Button */}
      <div style={styles.row}>
        <p style={styles.text}>IMEI: {imeiNumber}</p>
        <FiCopy onClick={handleCopy} style={styles.icon} title="Copy IMEI" />
      </div>

      {/* Toggle Camera Scanner */}
      <button
        onClick={(e) => {
          e.preventDefault();
          if (isCameraOpen) {
            stopScanning();
          } else {
            setIsCameraOpen(true);
          }
        }}
        style={styles.button}
      >
        <FiCamera style={styles.cameraIcon} />
        {isCameraOpen ? " Stop Scanning" : " Scan with Camera"}
      </button>

      {/* Camera Scanner */}
      {isCameraOpen && (
        <div style={styles.scannerContainer}>
          {isUsingZXing ? (
            <video ref={videoRef} style={styles.video} />
          ) : (
            <BarcodeScanner onUpdate={handleScan} width="100%" height="100%" facingMode="environment" />
          )}
        </div>
      )}

      {/* Switch Scanner */}
      {isCameraOpen && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsUsingZXing(!isUsingZXing)
          }}
          style={{ ...styles.button, marginTop: "10px" }}
        >
          {isUsingZXing ? "Switch to QR Scanner" : "Switch to ZXing Scanner"}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  text: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    fontSize: "20px",
    cursor: "pointer",
    color: "#007bff",
  },
  button: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    borderRadius: "5px",
    background: "linear-gradient(to right, #50b5f4, #b8bee2)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  cameraIcon: {
    marginRight: "5px",
  },
  scannerContainer: {
    width: "100%",
    maxHeight: "300px",
    borderRadius: "10px",
    marginTop: "10px",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    maxHeight: "300px",
    borderRadius: "10px",
  },
};

export default BarcodeReader;


// import { useState } from "react";
// import useScanDetection from "use-scan-detection";
// import  BarcodeScanner  from "react-qr-barcode-scanner";
// import { FiCopy } from "react-icons/fi";
// const BarcodeReader = ({ onScan }) => {
//   const [imeiNumber, setImeiNumber] = useState("Not Scanned yet");
//   const [isCameraOpen, setIsCameraOpen] = useState(false);

//   // Handle keyboard barcode scanning
//   useScanDetection({
//     onComplete: (value) => {
//       setImeiNumber(value);
//       if (onScan) onScan(value);
//     },
//     minLength: 3,
//   });
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(imeiNumber);
//       alert("Copied to clipboard!");
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };
//   // Handle camera barcode scan
//   const handleScan = (err, result) => {
//     err && console.error(err);
//     if (result) {
//       setImeiNumber(result.text);
//       if (onScan) onScan(result.text);
//       setIsCameraOpen(false); // Close camera after scan
//     }
//   };
  
//   return (
//     <div
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       width: "100%",
//       maxWidth: "400px",
//       borderRadius: "10px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       padding: "20px",
//       margin: "20px auto",
//       textAlign: "center",
//       fontFamily: "Arial, sans-serif",
//     }}
//     >
//       <h4>Scan a Barcode</h4>
//      <div style={{display:"flex",justifyContent:"center",alignItems:"center", gap:"1rem" }}>
//      <p
//         style={{
//           fontSize: "15px",
//           fontWeight: "semibold",
//           color: "#333",
//         }}
//         >
//         {`IMEI Value: ${imeiNumber}`}
//       </p>
//       <FiCopy onClick={handleCopy} size={"1.2rem"} style={{marginBottom:"1rem"}}  title="Copy IMEI" />
//      </div>
//       {/* Toggle Camera Scanner */}
//       <button
//         style={{
//           marginTop: "10px",
//           padding: "10px 15px",
//           borderRadius: "5px",
//           background: "linear-gradient(to right, #50b5f4, #b8bee2)",
//           color: "#fff",
//           border: "none",
//           cursor: "pointer",
//           fontSize: "16px",
//         }}
//         onClick={(e) => {
//           e.stopPropagation(); // ✅ Prevents modal from closing
//           setIsCameraOpen(!isCameraOpen);
//           e.preventDefault();
//         }}
//         >
//         {isCameraOpen ? "Close Camera" : "Scan with Camera"}
//       </button>

//       {/* Show Camera Scanner when enabled */}
//       {isCameraOpen && (
//         <div style={{ width: "100%", height: "300px", marginTop: "10px" }}>
//           <BarcodeScanner
//             onUpdate={handleScan}
//             width="100%"
//             height="100%"
//             facingMode="environment"
//             />
//         </div>
//       )}
//     </div>
//   );
// };

// export default BarcodeReader;

  // import { useState } from "react";
  // import useScanDetection from "use-scan-detection";
  
  // const BarcodeReader = ({ onScan }) => {
  //   const [imeiNumber, setImeiNumber] = useState("Not Scanned yet");
  
  //   useScanDetection({
  //     onComplete: (value) => {
  //       setImeiNumber(value);
  //       if (onScan) onScan(value);
  //     },
  //     minLength: 3,
  //   });
  
  //   const containerStyle = {
  //     display: "flex",
  //     flexDirection: "column",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     width: "100%",
  //     height: "200px",
  //     borderRadius: "10px",
  //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  //     padding: "20px",
  //     margin: "20px",
  //     textAlign: "center",
  //     fontFamily: "Arial, sans-serif",
  //   };
  
  //   const textStyle = {
  //     fontSize: "18px",
  //     fontWeight: "bold",
  //     color: "#333",
  //   };
  
  //   return (
  //     <div style={containerStyle}>
  //        <h4>Scan a Barcode</h4>
  //       <p style={textStyle}>{`IMEI Value: ${imeiNumber}`}</p>
  //     </div>
  //   );
  // };
  
  // export default BarcodeReader;