import React from "react";
import { useState, useEffect, useRef } from "react";
import "../styles/Table.css";
import AddBtn from "./AddBtn";
import DeleteBtn from "./DeleteBtn";
import "../styles/App.css";
import Popup from "./Popup";
import axios from "axios";
import Dialog from "./Dialog";
import Header from "./Header";
import SearchIcon from "@mui/icons-material/Search";

const Specialties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filter = () => {
    const filteredSpecialties = specialties.filter(
      (specialty) => String(specialty.id) === searchTerm
    );
    setSpecialties(filteredSpecialties);
  };

  const [buttonPopup, setButtonPopup] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState({
    field: "",
  });

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
  });
  const recordIDRef = useRef();
  const handleDialog = (message, isLoading) => {
    setDialog({
      message,
      isLoading,
    });
  };

  useEffect(() => {
    const fetchAllSpecialties = async () => {
      try {
        const res = await axios.get("http://localhost:8081/specialties");
        setSpecialties(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllSpecialties();
  }, []);

  const handleChange = (e) => {
    setNewSpecialty((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (newSpecialty.field != "") {
      try {
        await axios.post("http://localhost:8081/specialties", newSpecialty);
        setButtonPopup(false);
        window.location.reload();
      } catch (err) {}
    }
  };

  // const handleDelete = (id) => {
  //   handleDialog("Are you sure you want to delete this record?", true);

  //   recordIDRef.current = id;
  // };

  // const confirmDelete = async (choice) => {
  //   if (choice) {
  //     try {
  //       await axios.delete(
  //         "http://localhost:8081/specialties/" + recordIDRef.current
  //       );
  //       window.location.reload();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     handleDialog("", false);
  //   }
  // };

  return (
    <div>
      <Header />
      <div className="below-header">
        <AddBtn onclick={() => setButtonPopup(true)} />
        <div className="search">
          <input
            type="text"
            placeholder="Search by ID..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={filter} className="search-btn">
            <SearchIcon />
          </button>
        </div>
      </div>
      <table>
        <tr>
          <th>ID</th>
          <th>Field</th>
        </tr>
        {specialties.map((specialty, i) => (
          <tr key={i}>
            <td>{specialty.id}</td>
            <td>{specialty.field}</td>
            {/* <DeleteBtn onclick={() => handleDelete(specialty.id)} /> */}
          </tr>
        ))}
      </table>

      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form className="add-form">
          <h2>Add Specialty</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Field"
              onChange={handleChange}
              name="field"
              required
            />
          </div>
          <button type="submit" className="login-button" onClick={handleClick}>
            ADD
          </button>
        </form>
      </Popup>
      {dialog.isLoading && (
        <Dialog onDialog={confirmDelete} message={dialog.message} />
      )}
    </div>
  );
};

export default Specialties;
