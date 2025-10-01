// import React, { useEffect, useState } from "react";
// import TableSearchBar from "./TableSearchBar";
// import { useNavigate } from "react-router-dom";
// import Pagination from "./Pagination";
// import { Skeleton } from "@mui/material";

// const Table = ({
//   array,
//   label = [],
//   keysToDisplay = [],
//   filter,
//   customBlocks = [],
//   extraColumns = [],
//   setRecord,
//   search,
//   routes = [],
// }) => {
//   const [searchedData, setSearchedData] = useState("");
//   const navigate = useNavigate();
//   const [noOfRecordsPerPage, setNoOfRecordsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage, setRecordsPerPage] = useState([]);

//   useEffect(() => {
//     setRecordsPerPage(
//       array &&
//         array.filter((obj) => {
//           return (
//             searchedData === "" ||
//            String(obj[search])?.toLowerCase().includes(searchedData.toLowerCase())
//           );
//         })
//     );
//   }, [searchedData]);

//   useEffect(() => {
//     const startIndex = (currentPage - 1) * noOfRecordsPerPage;
//     const endIndex = startIndex + noOfRecordsPerPage;

//     setRecordsPerPage(array && array.slice(startIndex, endIndex));
//   }, [array, noOfRecordsPerPage, currentPage]);

//   const renderComponent = (index, data) => {
//     const temp = data
//       .map((block) => (block.index === index ? block : false))
//       .filter((item) => item !== false)[0];

//     return temp || false;
//   };

//   return (
//     <>
//       <div style={{ display: "flex", justifyContent: "end", alignItems: "center", marginBottom: "16px" ,overflowX:"auto"}}>
//         {search && (
//           <TableSearchBar onChange={(event) => setSearchedData(event.target.value)} />
//         )}
//         {filter && filter()}
//       </div>
//       <div style={{ background: "transparent",overflowX:"auto", borderRadius: "9px", border: "1px solid #c4c4c4", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" }}>
//         <table style={{ width: "100%", }}>
//           <thead>
//             <tr style={{ textTransform: "uppercase", borderBottom: "1px solid #c4c4c4" }}>
//               {label.map((text, index) => (
//                 <th
//                   key={index}
//                   style={{
//                     padding: "16px",
//                     background: "#F9FAFB",
//                     fontWeight: "600",
//                     fontSize: "15px",
//                     color: "#1D2939",
//                     whiteSpace: "nowrap",
//                     textAlign: index === label.length - 1 ? "right" : "left",
//                     paddingLeft: index === 0 ? "36px" : "0",
//                     paddingRight: index === label.length - 1 ? "36px" : "0",
//                     borderTopLeftRadius: index === 0 ? "9px" : "0",
//                     borderTopRightRadius: index === label.length - 1 ? "9px" : "0",
//                   }}
//                 >
//                   {text}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {recordsPerPage ? (
//               recordsPerPage.length > 0 ? (
//                 recordsPerPage.map((obj) => (
//                   <tr
//                     key={obj._id}
//                     onClick={() => {
//                       if (setRecord) setRecord(obj);
//                     }}
//                     style={{ cursor: "pointer", backgroundColor: "transparent", borderBottom: "1px solid #F2F2F2" }}
//                   >
//                     {keysToDisplay.map((key, index) => {
//                       const blocksList = renderComponent(index, customBlocks);
//                       return (
//                         <td
//                           key={index}
//                           onClick={() => {
//                             if (routes.length > 0) navigate(`${routes[0]}/${obj._id}`);
//                           }}
//                           style={{
//                             padding: "16px",
//                             fontWeight: "400",
//                             fontSize: "14px",
//                             color: "#858992",
//                             textAlign: index === label.length - 1 ? "right" : "left",
//                             paddingLeft: "36px",
//                             paddingRight: index === label.length - 1 ? "36px" : "0",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {blocksList ? blocksList.component(key ? obj[key] : obj) : obj[key]}
//                         </td>
//                       );
//                     })}
//                     {extraColumns.map((item, index) => (
//                       <td
//                         key={index}
//                         style={{
//                           padding: "16px",
//                           fontWeight: "400",
//                           fontSize: "14px",
//                           color: "#858992",
//                           display: "flex",
//                           justifyContent: "end",
//                           paddingRight: "36px",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {item(obj)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={label.length} style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid #F2F2F2" }}>
//                     No Records Found
//                   </td>
//                 </tr>
//               )
//             ) : (
//               <tr>
//                 <td colSpan={label.length} style={{ padding: "16px" }}>
//                   {label.map((_, index) => (
//                     <Skeleton key={index} height={50} />
//                   ))}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         <Pagination
//           noOfRecordsPerPage={noOfRecordsPerPage}
//           setNoOfRecordsPerPage={setNoOfRecordsPerPage}
//           setCurrentPage={setCurrentPage}
//           currentPage={currentPage}
//           noOfTotalRecords={array?.length || 0}
//         />
//       </div>
//     </>
//   );
// };

// export default Table;
import React, { useEffect, useState } from "react";
import TableSearchBar from "./TableSearchBar";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { Skeleton } from "@mui/material";

const Table = ({
  array,
  label = [],
  keysToDisplay = [],
  filter,
  customBlocks = [],
  extraColumns = [],
  setRecord,
  search,
  routes = [],
  getRowData, // New optional prop to get row data
}) => {
  const [searchedData, setSearchedData] = useState("");
  const navigate = useNavigate();
  const [noOfRecordsPerPage, setNoOfRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState([]);

  // Helper function to search in nested IMEI structure
  const searchInNestedImei = (obj, searchTerm) => {
    if (!obj.ramSimDetails || !Array.isArray(obj.ramSimDetails)) {
      return false;
    }
    
    return obj.ramSimDetails.some(ramSim => 
      ramSim.imeiNumbers && Array.isArray(ramSim.imeiNumbers) &&
      ramSim.imeiNumbers.some(imei => 
        imei.imei1 && String(imei.imei1).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setRecordsPerPage(
      array &&
        array.filter((obj) => {
          if (searchedData === "") return true;
          
          const searchTerm = searchedData.toLowerCase();
          
          // Handle nested IMEI search for bulk purchases
          if (search === 'imeiNumbers') {
            return searchInNestedImei(obj, searchTerm);
          }
          
          // Handle regular property search
          return String(obj[search])?.toLowerCase().includes(searchTerm);
        })
    );
  }, [searchedData, search, array]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * noOfRecordsPerPage;
    const endIndex = startIndex + noOfRecordsPerPage;

    setRecordsPerPage(array && array.slice(startIndex, endIndex));
  }, [array, noOfRecordsPerPage, currentPage]);

  const renderComponent = (index, data, rowData) => {
    const temp = data.find((block) => block.index === index);
    return temp ? temp.component : null;
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "end", alignItems: "center", marginBottom: "16px", overflowX: "auto" }}>
        {search && (
          <TableSearchBar onChange={(event) => setSearchedData(event.target.value)} />
        )}
        {filter && filter()}
      </div>
      <div style={{ background: "transparent", overflowX: "auto", borderRadius: "9px", border: "1px solid #c4c4c4", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ textTransform: "uppercase", borderBottom: "1px solid #c4c4c4" }}>
              {label.map((text, index) => (
                <th
                  key={index}
                  style={{
                    padding: "16px",
                    background: "#F9FAFB",
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#1D2939",
                    whiteSpace: "nowrap",
                    textAlign: index === label.length - 1 ? "right" : "left",
                    paddingLeft: index === 0 ? "36px" : "0",
                    paddingRight: index === label.length - 1 ? "36px" : "0",
                    borderTopLeftRadius: index === 0 ? "9px" : "0",
                    borderTopRightRadius: index === label.length - 1 ? "9px" : "0",
                  }}
                >
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recordsPerPage ? (
              recordsPerPage.length > 0 ? (
                recordsPerPage.map((obj) => (
                  <tr
                    key={obj._id}
                    onClick={() => {
                      if (setRecord) setRecord(obj);
                      if (getRowData) getRowData(obj); // Pass row data if provided
                    }}
                    style={{ cursor: "pointer", backgroundColor: "transparent", borderBottom: "1px solid #F2F2F2" }}
                  >
                    {keysToDisplay.map((key, index) => {
                      const customComponent = renderComponent(index, customBlocks, obj);

                      return (
                        <td
                          key={index}
                          onClick={() => {
                            if (routes.length > 0) navigate(`${routes[0]}/${obj._id}`);
                          }}
                          style={{
                            padding: "16px",
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#858992",
                            textAlign: index === label.length - 1 ? "right" : "left",
                            paddingLeft: "36px",
                            paddingRight: index === label.length - 1 ? "36px" : "0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {customComponent ? customComponent(obj[key], obj) : obj[key]}
                        </td>
                      );
                    })}
                    {extraColumns.map((item, index) => (
                      <td
                        key={index}
                        style={{
                          padding: "16px",
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#858992",
                          display: "flex",
                          justifyContent: "end",
                          paddingRight: "36px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item(obj)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={label.length} style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid #F2F2F2" }}>
                    No Records Found
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={label.length} style={{ padding: "16px" }}>
                  {label.map((_, index) => (
                    <Skeleton key={index} height={50} />
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          noOfRecordsPerPage={noOfRecordsPerPage}
          setNoOfRecordsPerPage={setNoOfRecordsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          noOfTotalRecords={array?.length || 0}
        />
      </div>
    </>
  );
};

export default Table;
