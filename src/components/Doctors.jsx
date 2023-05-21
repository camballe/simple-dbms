import React from "react";
import { useState, useEffect, useRef } from "react";
import "../styles/Table.css";
import "../styles/App.css";
import AddBtn from "./AddBtn";
import DeleteBtn from "./DeleteBtn";
import Popup from "./Popup";
import axios from "axios";
import UpdateBtn from "./UpdateBtn";
import Dialog from "./Dialog";
import Header from "./Header";
import SearchIcon from "@mui/icons-material/Search";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filter = () => {
    const filteredDoctors = doctors.filter(
      (doctor) => String(doctor.id) === searchTerm
    );
    setDoctors(filteredDoctors);
  };

  const [buttonPopup, setButtonPopup] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    doctor_first_name: "",
    doctor_last_name: "",
    phone: "",
    specialty_id: null,
  });

  let isFullyFilled = false;
  if (
    newDoctor.doctor_first_name != "" &&
    newDoctor.doctor_last_name != "" &&
    newDoctor.phone != "" &&
    newDoctor.specialty_id != null &&
    newDoctor.phone.length >= 10
  ) {
    isFullyFilled = true;
  }

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
  });
  const recordIDRef = useRef();
  const updateIDRef = useRef();

  const handleDialog = (message, isLoading) => {
    setDialog({
      message,
      isLoading,
    });
  };

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8081/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchAllSpecialties = async () => {
      try {
        const res = await axios.get("http://localhost:8081/specialties");
        setSpecialties(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllDoctors();
    fetchAllSpecialties();
  }, []);

  const handleChange = (e) => {
    setNewDoctor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.post("http://localhost:8081/doctors", newDoctor);
        setButtonPopup(false);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
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
  //         "http://localhost:8081/doctors/" + recordIDRef.current
  //       );
  //       window.location.reload();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     handleDialog("", false);
  //   }
  // };

  const handleUpdate = (id, fName, lName, phone, specialtyID) => {
    setUpdatePopup(true);
    updateIDRef.current = id;

    setNewDoctor({
      doctor_first_name: fName,
      doctor_last_name: lName,
      phone: phone,
      specialty_id: specialtyID,
    });
  };

  const updateRecord = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.put(
          "http://localhost:8081/doctors/" + updateIDRef.current,
          newDoctor
        );
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

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
          <th>Full Name</th>
          <th>Phone</th>
          <th>Specialty</th>
        </tr>
        {doctors.map((doctor, i) => (
          <tr key={i}>
            <td>{doctor.id}</td>
            <td>{doctor.doctor_first_name + " " + doctor.doctor_last_name}</td>
            <td>{doctor.phone}</td>
            <td>{doctor.field}</td>
            <UpdateBtn
              onclick={() =>
                handleUpdate(
                  doctor.id,
                  doctor.doctor_first_name,
                  doctor.doctor_last_name,
                  doctor.phone,
                  doctor.specialty_id
                )
              }
            />
            {/* <DeleteBtn onclick={() => handleDelete(doctor.id)} /> */}
          </tr>
        ))}
      </table>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form className="add-form">
          <h2>Add Doctor</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="First name"
              onChange={handleChange}
              name="doctor_first_name"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Second name"
              onChange={handleChange}
              name="doctor_last_name"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Phone number"
              onChange={handleChange}
              name="phone"
              required
            />
          </div>
          <div className="input-box">
            <select name="specialty_id" onChange={handleChange}>
              <option>Specialty ID</option>
              {specialties.map((specialty, i) => (
                <option key={i}>{Number(specialty.id)}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="login-button" onClick={handleClick}>
            ADD
          </button>
        </form>
      </Popup>

      <Popup trigger={updatePopup} setTrigger={setUpdatePopup}>
        <form className="add-form">
          <h2>Update Doctor's Details</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="First name"
              onChange={handleChange}
              name="doctor_first_name"
              value={newDoctor.doctor_first_name}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Second name"
              onChange={handleChange}
              name="doctor_last_name"
              value={newDoctor.doctor_last_name}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Phone number"
              onChange={handleChange}
              name="phone"
              value={newDoctor.phone}
              required
            />
          </div>
          <div className="input-box">
            <select
              name="specialty_id"
              value={newDoctor.specialty_id}
              onChange={handleChange}
            >
              <option>Specialty ID</option>
              {specialties.map((specialty, i) => (
                <option key={i}>{Number(specialty.id)}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="login-button" onClick={updateRecord}>
            UPDATE
          </button>
        </form>
      </Popup>
      {dialog.isLoading && (
        <Dialog onDialog={confirmDelete} message={dialog.message} />
      )}
    </div>
  );
};

export default Doctors;
