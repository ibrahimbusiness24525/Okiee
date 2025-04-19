// import { useState } from "react";
// import { api } from "../../../api/api";

// const CustomerSoldRecord = () => {
//   const [customerNumber, setCustomerNumber] = useState("");
//   const [soldRecord, setSoldRecord] = useState([]);

//   const getSoldRecord = async () => {
//     try {
//       const response = await api.get(`/api/Purchase/customer-sold-record/${customerNumber}`);
//       setSoldRecord(response?.data || []);
//       console.log("Sold Record:", response.data);
//     } catch (error) {
//       console.error("Error fetching sold record:", error);
//     }
//   };

//   const renderField = (label, value) => {
//     if (!value) return null;
//     return (
//       <div style={{ marginBottom: "4px" }}>
//         <strong>{label}:</strong> {value}
//       </div>
//     );
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h3 style={{ marginBottom: "10px" }}>Customer Sold Record</h3>
//       <input
//         type="text"
//         placeholder="Enter Customer Number"
//         value={customerNumber}
//         onChange={(e) => setCustomerNumber(e.target.value)}
//         style={{ padding: "8px", marginRight: "10px", width: "250px" }}
//       />
//       <button
//         onClick={getSoldRecord}
//         style={{
//           padding: "8px 16px",
//           backgroundColor: "#007bff",
//           color: "white",
//           border: "none",
//           cursor: "pointer",
//         }}
//       >
//         Get Sold Record
//       </button>

//       <div style={{ marginTop: "30px" }}>
//         {soldRecord.map((item, index) => (
//           <div
//             key={item._id}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//               padding: "15px",
//               marginBottom: "20px",
//               backgroundColor: index === 0 ? "#f5f5f5" : "#ffffff",
//             }}
//           >
//             <h4 style={{ marginBottom: "10px" }}>
//               {index === 0 ? "Single Phone Sale" : `Bulk Sale #${index}`}
//             </h4>

//             {renderField("Customer Name", item.customerName)}
//             {renderField("Customer Number", item.customerNumber)}
//             {renderField("Mobile", item.mobileNumber)}
//             {renderField("Company", item.companyName)}
//             {renderField("Model", item.modelName)}
//             {renderField("IMEI 1", item.imei1)}
//             {renderField("IMEI 2", item.imei2)}
//             {renderField("Phone Condition", item.phoneCondition)}
//             {renderField("Color", item.color)}
//             {renderField("RAM/Memory", item.ramMemory)}
//             {renderField("Warranty", item.warranty)}
//             {renderField("Demand Price", item.demandPrice)}
//             {renderField("Final Price", item.finalPrice)}
//             {renderField("Purchase Price", item.purchasePrice)}
//             {renderField("Sale Price", item.salePrice)}
//             {renderField("Total Invoice", item.totalInvoice)}
//             {renderField("Invoice Number", item.invoiceNumber)}
//             {renderField("Bank Name", item.bankName)}
//             {renderField("Selling Payment Type", item.sellingPaymentType)}
//             {renderField("Specifications", item.specifications)}
//             {renderField("Dispatch", item.dispatch ? "Yes" : "No")}
//             {renderField("Approved From Egadgets", item.isApprovedFromEgadgets ? "Yes" : "No")}
//             {renderField("Purchase Date", item.purchaseDate?.slice(0, 10))}
//             {renderField("Sale Date", item.saleDate?.slice(0, 10) || item.dateSold?.slice(0, 10))}

//             {item?.accessories?.length > 0 && (
//               <div style={{ marginTop: "10px" }}>
//                 <strong>Accessories:</strong>
//                 <ul>
//                   {item.accessories.map((acc, i) => (
//                     <li key={i}>
//                       {acc.name} - Quantity: {acc.quantity} - Price: {acc.price}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CustomerSoldRecord;
import { useState } from "react";
import { api } from "../../../api/api";

const CustomerSoldRecord = () => {
  const [customerNumber, setCustomerNumber] = useState("");
  const [soldRecord, setSoldRecord] = useState([]);

  const getSoldRecord = async () => {
    try {
      const response = await api.get(`/api/Purchase/customer-sold-record/${customerNumber}`);
      setSoldRecord(response?.data || []);
      console.log("Sold Record:", response);
    } catch (error) {
      console.error("Error fetching sold record:", error);
    }
  };

  const isSingleSale = (item) => !item.bulkPhonePurchaseId;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ marginBottom: "10px" }}>Customer Sold Record</h3>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Customer Number"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
            width: "250px",
          }}
        />
        <button
          onClick={getSoldRecord}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Get Sold Record
        </button>
      </div>

      {/* Render Single Phone Sales */}
      {soldRecord.filter(isSingleSale).length > 0 && (
        <div>
          <h4 style={{ marginBottom: "10px" }}>Single Phone Sales</h4>
          {soldRecord.filter(isSingleSale).map((record, index) => (
            <div
              key={record._id || index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {record.customerName && <p><strong>Customer Name:</strong> {record.customerName}</p>}
              {record.modelName && <p><strong>Model:</strong> {record.modelName}</p>}
              {record.imei1 && <p><strong>IMEI 1:</strong> {record.imei1}</p>}
              {record.imei2 && <p><strong>IMEI 2:</strong> {record.imei2}</p>}
              {record.salePrice && <p><strong>Sale Price:</strong> {record.salePrice}</p>}
              {record.totalInvoice && <p><strong>Total Invoice:</strong> {record.totalInvoice}</p>}
              {record.sellingPaymentType && <p><strong>Payment Type:</strong> {record.sellingPaymentType}</p>}
              {record.purchasePrice && <p><strong>Purchase Price:</strong> {record.purchasePrice}</p>}
              {record.color && <p><strong>Color:</strong> {record.color}</p>}
              {record.warranty && <p><strong>Warranty:</strong> {record.warranty}</p>}
              {record.specifications && <p><strong>Specifications:</strong> {record.specifications}</p>}
              {record.phoneCondition && <p><strong>Condition:</strong> {record.phoneCondition}</p>}
              {record.accessories?.length > 0 && (
                <div>
                  <strong>Accessories:</strong>
                  <ul>
                    {record.accessories.map((acc, idx) => (
                      <li key={idx}>
                        {acc.name} (x{acc.quantity}) - Rs {acc.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Render Bulk Phone Sales */}
      {soldRecord.filter((r) => !isSingleSale(r)).length > 0 && (
        <div>
          <h4 style={{ margin: "20px 0 10px" }}>Bulk Phone Sales</h4>
          {soldRecord.filter((r) => !isSingleSale(r)).map((record, index) => (
            <div
              key={record._id || index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#eef6ff",
              }}
            >
              {record.customerName && <p><strong>Customer Name:</strong> {record.customerName}</p>}
              {record.invoiceNumber && <p><strong>Invoice Number:</strong> {record.invoiceNumber}</p>}
              {record.salePrice && <p><strong>Sale Price:</strong> {record.salePrice}</p>}
              {record.totalInvoice && <p><strong>Total Invoice:</strong> {record.totalInvoice}</p>}
              {record.dateSold && <p><strong>Date Sold:</strong> {new Date(record.dateSold).toLocaleDateString()}</p>}
              {record.imei1 && <p><strong>IMEI 1:</strong> {record.imei1}</p>}
              {record.imei2 && <p><strong>IMEI 2:</strong> {record.imei2}</p>}
              {record.warranty && <p><strong>Warranty:</strong> {record.warranty}</p>}
              {record.sellingPaymentType && <p><strong>Payment Type:</strong> {record.sellingPaymentType}</p>}
              {record.accessories?.length > 0 && (
                <div>
                  <strong>Accessories:</strong>
                  <ul>
                    {record.accessories.map((acc, idx) => (
                      <li key={idx}>
                        {acc.name} (x{acc.quantity}) - Rs {acc.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSoldRecord;
