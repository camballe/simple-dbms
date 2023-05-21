import React from "react";
import "../styles/Table.css";

const SatisfyBtn = ({ onclick }) => {
  return (
    <button className="satisfy-btn" onClick={onclick}>
      RECORD PAYMENT
    </button>
  );
};

export default SatisfyBtn;
