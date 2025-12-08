import React from "react";
import search from "./search.svg";

const TableSearchBar = ({ onChange }) => {
  return (
    <div
      style={{
        display: "flex",
        padding: "7px 12px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        style={{
          border: "none",
          outline: "none",
          flex: 1,
          fontSize: "14px",
        }}
        placeholder="Search"
        onChange={onChange}
      />
      <img src={search} alt="search" style={{ width: "18px", height: "18px", marginLeft: "8px" }} />
    </div>
  );
};

export default TableSearchBar;
