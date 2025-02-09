import React, { useEffect, useState } from "react";
import arrow_right from "./arrow_right.png";

const Pagination = ({
  noOfTotalRecords = 0,
  noOfRecordsPerPage,
  setNoOfRecordsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const [pagination, setPagination] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const noOfPages = Math.ceil(noOfTotalRecords / noOfRecordsPerPage) || 1;
    setTotalPages(noOfPages);
    setPagination(Array.from({ length: noOfPages }, (_, i) => i + 1));
  }, [noOfRecordsPerPage, noOfTotalRecords]);

  const onPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const onNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: "16px", color: "#6B7280", fontWeight: 500 }}>
        <p>Show </p>
        <select
          style={{ margin: "0 10px", padding: "5px", border: "1px solid #DCDCDC", borderRadius: "5px", background: "#f5f5f5", color: "#717171" }}
          onChange={(e) => setNoOfRecordsPerPage(parseInt(e.target.value))}
          value={noOfRecordsPerPage}
        >
          {[10, 20, 30, 40, 50].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <p style={{ color: "#717171" }}>{` of ${noOfTotalRecords} entries`}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          onClick={onPrevious}
          style={{ padding: "10px", height: "40px", width: "40px", background: "white", border: "1px solid #E6E6E6", cursor: "pointer", borderRadius: "9px 0 0 9px", display: "flex", justifyContent: "center", alignItems: "center", opacity: currentPage === 1 ? 0.4 : 1 }}
        >
          <img src={arrow_right} alt="Previous" style={{ transform: "rotate(180deg)" }} />
        </div>
        {pagination.map((item) => (
          <span
            key={item}
            onClick={() => setCurrentPage(item)}
            style={{
              padding: "10px", height: "40px", width: "40px", background: currentPage === item ? "#D1E3F8" : "white",
              border: "1px solid #E6E6E6", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", borderLeft: 0,
            }}
          >
            {item}
          </span>
        ))}
        <div
          onClick={onNext}
          style={{ padding: "10px", height: "40px", width: "40px", background: "white", border: "1px solid #E6E6E6", cursor: "pointer", borderRadius: "0 9px 9px 0", display: "flex", justifyContent: "center", alignItems: "center", borderLeft: 0, opacity: currentPage === totalPages ? 0.4 : 1 }}
        >
          <img src={arrow_right} alt="Next" />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
