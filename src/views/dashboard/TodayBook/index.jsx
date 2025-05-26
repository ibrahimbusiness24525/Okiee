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
import { DollarSign, Smartphone, TrendingUp, Wallet, CreditCard, Receipt, ShoppingCart, Package } from "lucide-react"
const TodayBook = () => {
const[todayBookData,setTodayBookData] = useState([]);
const[bankData,setBankData]= useState([])
const[date,setDate ] = useState("")
const [totalCash, setTotalCash] = useState(0);

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
  const fetchTotalCash = async () => {
      try {
        const res = await api.get('/api/pocketCash/total');
        setTotalCash(res.data.total);
        console.log("total", res)
      } catch (error) {
        console.error('Failed to fetch total cash:', error);
      }
};
  
  console.log("this is the date" , totalCash);
  const getAllBanks = async () => {
    try {
      const response = await api.get('/api/banks/getAllBanks'); // your get all banks endpoint
      console.log('All banks:', response?.data?.banks);
      setBankData(response?.data?.banks); // Set the banks state with the fetched data
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
}
  useEffect(() => {
        getAllBanks(); // Fetch all banks when the component mounts
        fetchTotalCash();
        getTodayBook();
  },[]); 
console.log("these are required banks", bankData)

  


  const totalPurchasePrice =
    (todayBookData?.purchasedSinglePhone?.reduce(
      (acc, phone) => acc + (Number(phone.price?.purchasePrice) || Number(phone.purchasePrice) || 0),
      0,
    ) || 0) +
    (todayBookData?.purchaseBulkPhone?.reduce((price, phone) => price + (Number(phone.prices?.buyingPrice) || 0), 0) ||
      0)

  const totalInvoices =
    (todayBookData?.soldSinglePhone?.reduce((acc, phone) => acc + (phone.totalInvoice || 0), 0) || 0) +
    (todayBookData?.soldBulkPhone?.reduce((acc, phone) => acc + (phone.totalInvoice || 0), 0) || 0)

  // Calculate all metrics properly
  const totalProfit = totalInvoices - totalPurchasePrice

  // Calculate accessories sales (from sold phones accessories)
  const accessoriesSales =
    (todayBookData?.soldSinglePhone?.reduce((acc, phone) => {
      return (
        acc +
        (phone.accessories?.reduce((accAcc, accessory) => {
          return accAcc + (Number(accessory.price) || 0)
        }, 0) || 0)
      )
    }, 0) || 0) +
    (todayBookData?.soldBulkPhone?.reduce((acc, phone) => {
      return (
        acc +
        (phone.accessories?.reduce((accAcc, accessory) => {
          return accAcc + (Number(accessory.price) || 0)
        }, 0) || 0)
      )
    }, 0) || 0)

  // Calculate opening balance from banks
  const openingBalance = bankData?.reduce((acc, bank) => acc + (Number(bank.accountCash) || 0), 0) + totalCash || 0 + totalCash
  const bankTotalBalance = bankData?.reduce((acc, bank) => acc + (Number(bank.accountCash) || 0), 0)  || 0 

  // Calculate cash amount from ledger
  const cashAmount = todayBookData?.ledger?.reduce((acc, entry) => acc + (Number(entry.openingCash) || 0), 0) || 0
  const pocketCash  = totalCash;
  // Calculate expenses from ledger
  const totalExpenses = todayBookData?.ledger?.reduce((acc, entry) => acc + (Number(entry.expense) || 0), 0) || 0

  // Calculate total amount (sales + opening balance - expenses)
  const totalAmount = totalInvoices + openingBalance - totalExpenses

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} PKR`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const metrics = [
  {
    title: "Sales Profit",
    value: formatCurrency(totalProfit),
    icon: TrendingUp,
    color: totalProfit >= 0 ? "#16a34a" : "#dc2626", // green-600 or red-600
    bgColor: totalProfit >= 0 ? "#f0fdf4" : "#fef2f2", // green-50 or red-50
    route: "/reports/profit",
  },
  {
    title: "Mobile Sales",
    value: formatCurrency(totalInvoices),
    icon: Smartphone,
    color: "#2563eb", // blue-600
    bgColor: "#eff6ff", // blue-50
    route: "/sales",
  },
  {
    title: "Accessories Sale",
    value: formatCurrency(accessoriesSales),
    icon: Package,
    color: "#7c3aed", // purple-600
    bgColor: "#f5f3ff", // purple-50
    route: "/sales/accessories",
  },
  {
    title: "Opening Balance",
    value: formatCurrency(openingBalance),
    icon: Wallet,
    color: "#ea580c", // orange-600
    bgColor: "#fff7ed", // orange-50
    route: "/accounts/balance",
  },
  {
    title: "Cash Amount",
    value: formatCurrency(pocketCash),
    icon: DollarSign,
    color: "#16a34a", // green-600
    bgColor: "#f0fdf4", // green-50
    route: "/accounts/cash",
  },
  {
    title: "Bank Amount",
    value: formatCurrency(bankTotalBalance),
    icon: CreditCard,
    color: "#2563eb", // blue-600
    bgColor: "#eff6ff", // blue-50
    route: "/accounts/banks",
  },
  {
    title: "Expenses",
    value: formatCurrency(totalExpenses),
    icon: Receipt,
    color: "#dc2626", // red-600
    bgColor: "#fef2f2", // red-50
    route: "/accounts/expenses",
  },
  {
    title: "Total Amount",
    value: formatCurrency(totalAmount),
    icon: DollarSign,
    color: "#059669", // emerald-600
    bgColor: "#ecfdf5", // emerald-50
    route: "/reports/total",
  },
];
const [data, setData] = useState({
    totalPurchased: 1250,
    totalSold: 890,
    totalRemaining: 360,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newSold = prevData.totalSold + Math.floor(Math.random() * 3)
        const newPurchased = prevData.totalPurchased + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0)
        const newRemaining = newPurchased - newSold

        return {
          totalPurchased: newPurchased,
          totalSold: newSold,
          totalRemaining: Math.max(0, newRemaining),
        }
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    cursor: "pointer",
  }

  const cardHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  }

  const numberStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    lineHeight: "1",
    marginBottom: "8px",
  }

  const labelStyle = {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  }

  const containerStyle = {
    minHeight: "20vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  }

  const headerStyle = {
    textAlign: "center",
    marginBottom: "48px",
  }

  const titleStyle = {
    fontSize: "2.25rem",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "8px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  }

  const subtitleStyle = {
    fontSize: "1.125rem",
    color: "#e5e7eb",
    fontWeight: "400",
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  }

  const statusDotStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    display: "inline-block",
    marginRight: "8px",
    animation: "pulse 2s infinite",
  }

  const liveIndicatorStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "24px",
  }


  
  console.log("Total Purchase Price:", totalPurchasePrice);
  
  console.log("Total invoices:", totalInvoices);

  // console.log("Total bulk invoices:", totalBulkInvoices);
  
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


          
{/* Add these cards between your existing cards and pie chart */}
<div className="responsive-grid">
  {metrics.map((metric, index) => {
    const Icon = metric.icon;

    return (
      <div
        key={index}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "24px",
          cursor: "pointer",
          border: "1px solid #e5e7eb",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onClick={() => (window.location.href = metric.route)}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4b5563",
                  marginBottom: "8px",
                }}
              >
                {metric.title}
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: metric.color,
                  wordBreak: "break-word",
                }}
              >
                {metric.value}
              </p>
            </div>
            <div
              style={{
                padding: "12px",
                borderRadius: "9999px",
                backgroundColor: metric.bgColor,
                marginLeft: "12px",
                flexShrink: 0,
              }}
            >
              <Icon style={{ height: "24px", width: "24px", color: metric.color }} />
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
 <div style={containerStyle}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Mobile Inventory</h1>
        <p style={subtitleStyle}>Real-time mobile phone stock monitoring</p>
        <div style={liveIndicatorStyle}>
          <span style={statusDotStyle}></span>
          Live Updates
        </div>
      </div>

      <div style={gridStyle}>
        {/* Total Purchased */}
        <div
          className="card"
          style={{
            ...cardStyle,
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <div
            style={{
              ...numberStyle,
              color: "#3b82f6",
            }}
          >
            {data.totalPurchased.toLocaleString()}
          </div>
          <div style={labelStyle}>Total Purchased Mobiles</div>
          <div
            style={{
              marginTop: "12px",
              fontSize: "0.75rem",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
                marginRight: "6px",
              }}
            ></span>
            Inventory Input
          </div>
        </div>

        {/* Total Sold */}
        <div
          className="card"
          style={{
            ...cardStyle,
            borderLeft: "4px solid #10b981",
          }}
        >
          <div
            style={{
              ...numberStyle,
              color: "#10b981",
            }}
          >
            {data.totalSold.toLocaleString()}
          </div>
          <div style={labelStyle}>Total Sold Mobiles</div>
          <div
            style={{
              marginTop: "12px",
              fontSize: "0.75rem",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                marginRight: "6px",
              }}
            ></span>
            Sales Revenue
          </div>
        </div>

        {/* Total Remaining */}
        <div
          className="card"
          style={{
            ...cardStyle,
            borderLeft: `4px solid ${data.totalRemaining < 100 ? "#ef4444" : "#f59e0b"}`,
          }}
        >
          <div
            style={{
              ...numberStyle,
              color: data.totalRemaining < 100 ? "#ef4444" : "#f59e0b",
            }}
          >
            {data.totalRemaining.toLocaleString()}
          </div>
          <div style={labelStyle}>Total Remaining Phones</div>
          <div
            style={{
              marginTop: "12px",
              fontSize: "0.75rem",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: data.totalRemaining < 100 ? "#ef4444" : "#f59e0b",
                marginRight: "6px",
              }}
            ></span>
            {data.totalRemaining < 100 ? "Low Stock Alert" : "Available Stock"}
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "32px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {/* <div
          style={{
            ...cardStyle,
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#6366f1",
              marginBottom: "4px",
            }}
          >
            {((data.totalSold / data.totalPurchased) * 100).toFixed(1)}%
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            Sales Rate
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            padding: "16px",
            textAlign: "center" ,
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#8b5cf6",
              marginBottom: "4px",
            }}
          >
            {Math.floor(data.totalSold / 30)}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            Daily Avg Sales
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            padding: "16px",
            textAlign: "center" ,
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: data.totalRemaining < 100 ? "#ef4444" : "#10b981",
              marginBottom: "4px",
            }}
          >
            {data.totalRemaining < 100 ? "LOW" : "GOOD"}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            Stock Status
          </div>
        </div> */}
      </div>
    </div>

<div style={{ 
  display: "flex", 
  flexWrap: "wrap", 
  justifyContent: "space-between", 
  gap: "20px", 
  margin: "30px 0" 
}}>
 
  
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