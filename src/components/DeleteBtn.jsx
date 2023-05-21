import React from "react";
import "../styles/Table.css";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteBtn = ({ onclick }) => {
  return (
    <td>
      <button className="delete-btn" onClick={onclick}>
        <DeleteIcon className="delete-icon" />
      </button>
    </td>
  );
};

export default DeleteBtn;
