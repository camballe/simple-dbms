import React from "react";
import "../styles/Popup.css";
import "../styles/App.css";

const Dialog = ({ message, onDialog }) => {
  return (
    <div className="popup">
      <div className="dialog">
        <h3>{message}</h3>
        <div className="buttons">
          <button onClick={() => onDialog(false)} className="cancel-delete-btn">
            NO
          </button>
          <button
            onClick={() => onDialog(true)}
            className="continue-delete-btn"
          >
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
