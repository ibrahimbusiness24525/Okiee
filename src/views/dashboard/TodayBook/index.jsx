import {  useEffect, useState } from "react";
import Table from "components/Table/Table";
import { dateFormatter } from "utils/dateFormatter";
import { StyledHeading } from "components/StyledHeading/StyledHeading";
import { Button } from "@mui/material";
import { Card } from "react-bootstrap";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset, valueFormatter } from '../../../constant/weather';
import { PieChart } from '@mui/x-charts/PieChart';
import { api } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TodayBook = () => {
const[todayBookData,setTodayBookData] = useState([]);
const[date,setDate ] = useState("")
  const getTodayBook = async() => {
    try{
      const response = await api.get(`/api/dayBook/todayBook`, {
        params: { date }
      });
      
      setTodayBookData(response?.data?.data || []);
    }catch(error){
      console.log("Error in getting the field", error);
    }
  } 
  console.log("this is the date" , date);
  
  useEffect(() => {
    getTodayBook();
  },[]); 


  console.log("Today Book Data",todayBookData);
  const totalPurchasePrice = 
  (todayBookData?.purchasedSinglePhone?.reduce(
    (acc, phone) => acc + (Number(phone.price?.purchasePrice) || Number(phone.purchasePrice) || 0), 
    0
  ) || 0) + 
  (todayBookData?.purchaseBulkPhone?.reduce(
    (price, phone) => price + (Number(phone.prices?.buyingPrice) || 0),
    0
  ) || 0);

  const totalInvoices = todayBookData?.soldSinglePhone?.reduce(
    (acc, phone) => acc + (phone.totalInvoice  || 0), 
    0
  ) + (todayBookData?.soldBulkPhone?.reduce(
    (acc, phone) => acc + (phone.totalInvoice  || 0),
    0
  ) || 0);

  const totalBulkInvoices = todayBookData?.soldBulkPhone?.reduce(
    (acc, phone) => acc + (phone.totalInvoice  || 0),
    0
  );

  
  console.log("Total Purchase Price:", totalPurchasePrice);
  
  console.log("Total invoices:", totalInvoices);

  console.log("Total bulk invoices:", totalBulkInvoices);
  
  console.log("detail today book", todayBookData);
  const navigation = useNavigate()
  return (
<div style={{ padding: "20px", minHeight: "100vh" }}>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
  }}
>
  <h1
    style={{
      fontSize: "24px",
      fontWeight: "600",
      color: "#333",
      margin: 0,
      flex: 1
    }}
  >
    Today Book
  </h1>

  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
    <input
      onChange={(e) => setDate(e.target.value)}
      type="date"
      value={date}
      name="date"
      style={{
        padding: "8px 12px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        outline: "none",
        backgroundColor: "#fff",
        color: "#333",
        cursor: "pointer",
        minWidth: "160px"
      }}
    />
    <button
      onClick={getTodayBook}
      style={{
        padding: "8px 16px",
        backgroundColor: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background 0.3s ease"
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#115293")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
    >
      Get
    </button>
  </div>
</div>


            <div style={{display:"flex", alignItems:"center",justifyContent:"space-between"}}>
            <Card 
              onClick={()=>navigation("/todayBook/pruchaseDetail/:id")}
              className="text-center shadow-lg p-3" 
              style={{
                borderRadius: "12px",
                width: "350px",
                margin: "auto",
                background: "linear-gradient(135deg, #667eea, #764ba2)", // Cool gradient
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                color: "white"
              }}
              >
              <Card.Body style={{display:"flex", flexDirection:"column"}}>
                <h5 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
                  Total Purchase (Today)
                </h5>
                <hr style={{ borderTop: "2px solid rgba(255, 255, 255, 0.6)", margin: "10px 0" }} />
                <span style={{ fontSize: "28px", fontWeight: "700", display: "block" }}>
                  {totalPurchasePrice?.toLocaleString() || "0.00"} PKR 
                  

                  
                </span>
              </Card.Body>
            </Card>

            <Card 
            onClick={()=>navigation("/todayBook/saleDetail/:id")}
            className="text-center shadow-lg p-3" 
            style={{
              borderRadius: "12px",
               width: "350px",
               margin: "auto",
               background: "linear-gradient(135deg, #ff7e5f, #feb47b)", // Warm gradient
               boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
               color: "white"
             }}
           >
                <Card.Body style={{display:"flex", flexDirection:"column"}}>
                <h5 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
                  Total Sales (Today)
                </h5>
                <hr style={{ borderTop: "2px solid rgba(255, 255, 255, 0.6)", margin: "10px 0" }} />
                <span style={{ fontSize: "28px", fontWeight: "700", display: "block" }}>
                  {totalInvoices?.toLocaleString() || "0.00"} PKR
                
                </span>
              </Card.Body>
            </Card>
            </div>
            <div
  style={{
    width: "80%", // Adjust width
    maxWidth: "750px", // Prevents it from becoming too large
    backgroundColor: "#fff", // Card background
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow effect
    borderRadius: "12px", // Rounded corners
    padding: "20px", // Padding inside card
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "145px auto", // Center it horizontally
  }}
>
  <h3 style={{ marginBottom: "10px", color: "#333" }}>Today's Sales & Purchases</h3>
  <PieChart
    series={[
      {
        data: [
          { id: 0, 
            value:
             todayBookData?.purchasedSinglePhone?.reduce(
            (acc, phone) => acc + (Number(phone.price?.purchasePrice) || Number(phone.purchasePrice) || 0), 
            0
          ) || 0,
           label: "Today Single Purchase" },
          { id: 1, 
            value: todayBookData?.purchaseBulkPhone?.reduce(
              (price, phone) => price + (Number(phone.prices?.buyingPrice) || 0),
              0
            ) || 0,
             label: "Today Bulk Purchase" },
          { id: 2,
             value: todayBookData?.soldSinglePhone?.reduce(
              (acc, phone) => acc + (phone.totalInvoice  || 0), 
              0) || 0,
             label: "Today Single Sale" },
          { id: 3,
             value: todayBookData?.soldBulkPhone?.reduce(
              (acc, phone) => acc + (phone.totalInvoice  || 0),
              0
            ) || 0, 
             label: "Today Bulk Sale" },
        ],
      },
    ]}
    width={700}
    height={250}
  />
</div>


            <div style={{ marginTop: "50px" }}></div>
            <StyledHeading>Today Ledger</StyledHeading>
              <Table
                        array={todayBookData.ledger}
                        keysToDisplay={["openingCash", "cashPaid", "cashReceived", "expense", "closingCash","createdAt"]}
                        label={[
                            "Opening Cash",
                            "Cash Paid",
                            "Cash Received",
                            "Expense",
                            "Closing Cash",
                            "Created At"
                            // "Actions",
                          ]}
                        customBlocks={[
                            {
                                index: 5,
                                component: (date) => {
                                  return dateFormatter(date)
                                }
                              }
                            ]}
                        // extraColumns={[
                        //     () => {
                        //         return (
                        //             <MdEdit

                        //                 className="text-[#ccccc] text-[1.3rem]" />
                        //         );
                        //     },
                        // ]}
                    />
                     <div style={{ marginTop: "50px" }}></div>
                     <StyledHeading>Today Purchased Single Phones</StyledHeading>
                     <Table

                          routes={["/purchase/purchaseRecords"]}
                        array={todayBookData.purchasedSinglePhone}
                         search={"imei1"}
                           keysToDisplay={["modelName", "companyName","color", "phoneCondition", "warranty"]}
                           label={[
                             "Model Name",
                               "Company Name",
                               "Color",
                               "Condition",
                               "Warranty",
                           ]}

                         
                       />
                        <div style={{ marginTop: "50px" }}></div>
                        <StyledHeading>Today Purchased Bulk Phones</StyledHeading>
                         <Table
                         routes={["/purchase/purchaseRecords/bulkPurchase"]}
                         array={todayBookData.purchaseBulkPhone}
                         search={"imei1"}
                         keysToDisplay={["partyName", "status", "createdAt"]}
                         label={[
                           "Party Name",
                           "Status",
                           "Date"
                          ]}
                          customBlocks={[
                         
                            {
                              index: 2,
                              component: (date) => {
                                return dateFormatter(date)
                               }
                             },
                            
                           ]}

                     />
                      <div style={{ marginTop: "50px" }}></div>
                      <StyledHeading>Today Sold Single Phones</StyledHeading>
                    <Table
                    routes={["/sales/sales"]}
                       array={todayBookData.soldSinglePhone}
                       search={"imei1"}
                       keysToDisplay={[
                         "customerName",
                         "companyName",
                         "sellingPaymentType",
                         "purchasePrice",
                         "salePrice",
                         "saleDate",
                        ]}
                       label={[
                         "Customer Name",
                         "Company Name",
                         "Selling Payment Type",
                         "Purchase Price",
                         "Sale Price",
                         "Date Sold",
                         "Profit/Loss",
                        ]}
                       customBlocks={[
                         
                         {
                           index: 2,
                           component: (sellingType) => {
                             return sellingType ? sellingType : "Not mentioned"
                            }
                          },
                          {
                            index: 4,
                            component: (salePrice) => {
                              return salePrice? salePrice :"Not Mentioned"
                            }
                          },
                          {
                            index: 5,
                            component: (date) => {
                              return dateFormatter(date)
                            }
                          }
                        ]}
                             extraColumns={[
                               (obj) => {
                                 const salePrice = Number(obj.salePrice) || 0;
                                 const purchasePrice = Number(obj.purchasePrice) || 0;
                                 const profitOrLoss = salePrice - purchasePrice;
                                 
                                 return <p>{profitOrLoss < 0 ? `Loss of ${-profitOrLoss}` : profitOrLoss}</p>;
                                },
                              ]}
                           
                                 />
                              <div style={{ marginTop: "50px" }}></div>
                                 <StyledHeading>Today Sold Bulk Phones</StyledHeading>
                       <Table
                        routes={["/sales/BulkSales"]}
                       array={todayBookData.soldBulkPhone}
                       search={"imei1"}
                       keysToDisplay={[
                        "sellingPaymentType",
                        // "modelName",
                        // "companyName",
                        // "partyName",
                        "salePrice",
                        "sellingPaymentType",
                        "warranty",
                        "dateSold",

                       ]}
                       label={[
                         // "Model Name",
                         // "Company",
                         // "Party Name",
                         "Type of Sale",
                         "Price",
                         "Selling Payment Type",
                         "Warranty",
                         "Invoice Date",
                       ]}
                       customBlocks={[
                         {
                           index: 2,
                           component: (sellingType) => {
                           return sellingType ? sellingType : "Not mentioned"
                          }
                        },
                              {
                                 index: 4,
                                 component: (date) => {
                                 return dateFormatter(date)
                                }
                              }
                             ]}
                           />

  </div>
  );
}

     export  default TodayBook;