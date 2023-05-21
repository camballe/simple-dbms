import React from "react";
import "../styles/Table.css";
import EditIcon from "@mui/icons-material/Edit";

const UpdateBtn = ({ onclick }) => {
  return (
    <td>
      <button className="update-btn" onClick={onclick}>
        <EditIcon className="edit-icon" />
      </button>
    </td>
  );
};

export default UpdateBtn;
