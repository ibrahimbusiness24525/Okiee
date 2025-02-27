// import { BASE_URL } from "config/constant";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const BulkSalesDetail = () => {
//     const { id } = useParams();
//     const [purchase, setPurchase] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     const BulkSalesDetail = async () => {
//         try {
//             const response = await fetch(`${BASE_URL}api/Purchase/bulk-phone-purchase/${id}`);
//             const result = await response.json();
//             console.log("bulk result",result);
            
//             setPurchase(result)
//         } catch (err) {
//             setError("Network error");
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         BulkSalesDetail();
//     }, []);

//     if (loading) return <h2 style={{ textAlign: "center", color: "blue" }}>Loading...</h2>;
//     if (error) return <h2 style={{ textAlign: "center", color: "red" }}>Error: {error}</h2>;
//     if (!purchase) return <h2 style={{ textAlign: "center", color: "gray" }}>Not Found</h2>;

//     return (
//         <div></div>
//         // <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//         //     <h3 style={{ textAlign: "center", color: "#333" }}>Purchase Detail</h3>
//         //         <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", background: "#f9f9f9" }}>
//         //             <p><strong>Party Name:</strong> {purchase.partyName}</p>
//         //             <p><strong>Company:</strong> {purchase.companyName}</p>
//         //             <p><strong>Model:</strong> {purchase.modelName}</p>
//         //             <p><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
//         //             <p><strong>Status:</strong> {purchase.status}</p>
//         //             <h4>Prices</h4>
//         //             <p><strong>Buying Price:</strong> {purchase.prices.buyingPrice}</p>
//         //             <p><strong>Dealer Price:</strong> {purchase.prices.dealerPrice}</p>
//         //             <p><strong>LP:</strong> {purchase.prices.lp}</p>
//         //             <p><strong>Lifting:</strong> {purchase.prices.lifting}</p>
//         //             <p><strong>Promo:</strong> {purchase.prices.promo}</p>
//         //             <p><strong>Activation:</strong> {purchase.prices.activation}</p>
//         //             <h4>RAM & SIM Details</h4>
//         //                {purchase.ramSimDetails.length > 0 ?
//         //                <>
//         //                   {purchase.ramSimDetails.map((ramSim, index) => (
//         //                       <div key={index} style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
//         //                           <p><strong>RAM/Memory:</strong> {ramSim.ramMemory}</p>
//         //                           <p><strong>SIM Option:</strong> {ramSim.simOption}</p>
//         //                           <h5>IMEI Numbers</h5>
//         //                           {ramSim.imeiNumbers.map((imei, i) => (
//         //                               <p key={i}><strong>IMEI {i + 1}:</strong> {imei.imei1}</p>
//         //                           ))}
//         //                       </div>
//         //                   ))}
       
//         //                </>:
//         //               <>
//         //                <p>
//         //                   Not Found
//         //                </p>
//         //               </>
//         //               }
//         //         </div>
//         // </div>
//     );
// };

// export default BulkSalesDetail;


import React from "react";

const SalesDetails = () => {
  const salesData = [
    {
      customerName: "John Doe",
      modelName: "iPhone 15 Pro",
      companyName: "Apple",
      phones: [
        { phone: "123-456-7890", price: "$1,200" },
        { phone: "987-654-3210", price: "$1,200" }
      ],
      quantity: 2,
      totalPrice: "$2,400",
      date: "2025-02-27"
    },
    {
      customerName: "Jane Smith",
      modelName: "Samsung Galaxy S24",
      companyName: "Samsung",
      phones: [
        { phone: "555-123-4567", price: "$1,000" },
        { phone: "777-888-9999", price: "$1,000" },
        { phone: "222-333-4444", price: "$1,000" }
      ],
      quantity: 3,
      totalPrice: "$3,000",
      date: "2025-02-26"
    },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Sales Details</h2>
      {salesData.map((sale, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "15px",
            marginBottom: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p><strong>Customer Name:</strong> {sale.customerName}</p>
          <p><strong>Model Name:</strong> {sale.modelName}</p>
          <p><strong>Company Name:</strong> {sale.companyName}</p>
          <p><strong>Phones:</strong></p>
          <ul>
            {sale.phones.map((p, i) => (
              <li key={i}><strong>Phone:</strong> {p.phone}, <strong>Price:</strong> {p.price}</li>
            ))}
          </ul>
          <p><strong>Quantity:</strong> {sale.quantity}</p>
          <p><strong>Total Price:</strong> {sale.totalPrice}</p>
          <p><strong>Date:</strong> {sale.date}</p>
        </div>
      ))}
    </div>
  );
};

export default SalesDetails;
