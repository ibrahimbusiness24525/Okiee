import {  useEffect, useState } from "react";
import { api } from "../../../api/api";
import Table from "components/Table/Table";
import { dateFormatter } from "utils/dateFormatter";
import { StyledHeading } from "components/StyledHeading/StyledHeading";
import { Button } from "@mui/material";

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
  
  
  return (
<div style={{ padding: "20px", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "24px", marginBottom:"33px",fontWeight: "600", color: "#333", marginBottom: "16px" }}>
               Today Book
            </h1>

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