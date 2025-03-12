import {  useEffect, useState } from "react";
import { api } from "../../../api/api";
import Table from "components/Table/Table";
import { dateFormatter } from "utils/dateFormatter";
import { StyledHeading } from "components/StyledHeading/StyledHeading";
import { Button } from "@mui/material";
import { Card } from "react-bootstrap";
import { BarChart } from '@mui/x-charts/BarChart';

const TodayBook = () => {
const[todayBookData,setTodayBookData] = useState([]);
  const getTodayBook = async() => {
    try{
      const response = await api.get(`/api/dayBook/todayBook`);
      setTodayBookData(response?.data?.data || []);
    }catch(error){
      console.log("Error in getting the field", error);
    }
  } 

  useEffect(() => {
    getTodayBook();
  },[]); 

  console.log("Today Book Data",todayBookData);
  const totalPurchasePrice = todayBookData?.purchasedSinglePhone?.reduce(
    (acc, phone) => acc + (phone.price?.purchasePrice || phone.purchasePrice || 0), 
    0
  );
  const totalInvoices = todayBookData?.soldSinglePhone?.reduce(
    (acc, phone) => acc + (phone.totalInvoice  || 0), 
    0
  );
  
  console.log("Total Purchase Price:", totalPurchasePrice);
  
  console.log("Total invoices:", totalInvoices);
  
  
  return (
<div style={{ padding: "20px", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "24px", marginBottom:"33px",fontWeight: "600", color: "#333", marginBottom: "16px" }}>
               Today Book
            </h1>
            <div style={{display:"flex", alignItems:"center",justifyContent:"space-between"}}>
            <Card 
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
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "145px" }}>
  <BarChart
    xAxis={[{ scaleType: "band", data: ["Loss", "Profit", "Average"] }]}
    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
    width={550}
    height={300}
  />
  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#28a745", marginTop: "10px" }}>
    {/* 🔥  */}
    10% Profit 
    {/* 🔥 */}
  </p>
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
                         array={todayBookData.purchaseBulkPhone}
                         search={"imei1"}
                         keysToDisplay={["modelName", "companyName","partyName", "status", ]}
                         label={[
                           "Model Name",
                           "Company Name",
                           "Party Name",
                           "Status",
                          ]}


                     />
                      <div style={{ marginTop: "50px" }}></div>
                      <StyledHeading>Today Sold Single Phones</StyledHeading>
                    <Table
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