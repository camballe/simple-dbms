import React from "react";
import "../styles/Table.css";

const AddBtn = ({ onclick }) => {
  return (
    <button className="add-btn" onClick={onclick}>
      ADD +
    </button>
  );
};

export default AddBtn;
