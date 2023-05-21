import React from "react";
import { useState, useEffect, useRef } from "react";
import "../styles/Table.css";
import AddBtn from "./AddBtn";
import DeleteBtn from "./DeleteBtn";
import "../styles/App.css";
import Popup from "./Popup";
import axios from "axios";
import UpdateBtn from "./UpdateBtn";
import Header from "./Header";
import SearchIcon from "@mui/icons-material/Search";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filter = () => {
    const filteredPatients = patients.filter(
      (patient) => String(patient.id) === searchTerm
    );
    setPatients(filteredPatients);
  };

  const [buttonPopup, setButtonPopup] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    patient_first_name: "",
    patient_last_name: "",
    residence: "",
    phone: "",
    emergency_contact: "",
    registration_date: null,
  });

  let isFullyFilled = false;
  if (
    newPatient.patient_first_name != "" &&
    newPatient.patient_last_name != "" &&
    newPatient.residence != "" &&
    newPatient.phone != "" &&
    newPatient.emergency_contact != "" &&
    newPatient.registration_date != null &&
    newPatient.phone >= 10 &&
    newPatient.emergency_contact >= 10
  ) {
    isFullyFilled = true;
  }

  const updateIDRef = useRef();

  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        const res = await axios.get("http://localhost:8081/patients");
        setPatients(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllPatients();
  }, []);

  const handleChange = (e) => {
    setNewPatient((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.post("http://localhost:8081/patients", newPatient);
        setButtonPopup(false);
        window.location.reload();
      } catch (err) {}
    }
  };

  const handleUpdate = (
    id,
    fName,
    lName,
    residence,
    phone,
    emergencyContact,
    regDate
  ) => {
    setUpdatePopup(true);
    updateIDRef.current = id;

    setNewPatient({
      patient_first_name: fName,
      patient_last_name: lName,
      residence: residence,
      phone: phone,
      emergency_contact: emergencyContact,
      registration_date: regDate,
    });
  };

  const updateRecord = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.put(
          "http://localhost:8081/patients/" + updateIDRef.current,
          newPatient
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
          <th>Residence</th>
          <th>Phone</th>
          <th>Emergency Contact</th>
          <th>Registration Date</th>
        </tr>
        {patients.map((patient, i) => (
          <tr key={i}>
            <td>{patient.id}</td>
            <td>
              {patient.patient_first_name + " " + patient.patient_last_name}
            </td>
            <td>{patient.residence}</td>
            <td>{patient.phone}</td>
            <td>{patient.emergency_contact}</td>
            <td>{patient.registration_date}</td>
            <UpdateBtn
              onclick={() =>
                handleUpdate(
                  patient.id,
                  patient.patient_first_name,
                  patient.patient_last_name,
                  patient.residence,
                  patient.phone,
                  patient.emergency_contact,
                  patient.registration_date
                )
              }
            />
          </tr>
        ))}
      </table>

      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form className="add-form">
          <h2>Add Patient</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="First name"
              onChange={handleChange}
              name="patient_first_name"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Second name"
              onChange={handleChange}
              name="patient_last_name"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Place of Residence"
              onChange={handleChange}
              name="residence"
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
            <input
              type="text"
              placeholder="Emergency contact"
              onChange={handleChange}
              name="emergency_contact"
              required
            />
          </div>
          <div className="input-box">
            <label>Registration Date</label>
            <input
              type="date"
              onChange={handleChange}
              name="registration_date"
              required
            />
          </div>
          <button type="submit" className="login-button" onClick={handleClick}>
            ADD
          </button>
        </form>
      </Popup>

      <Popup trigger={updatePopup} setTrigger={setUpdatePopup}>
        <form className="add-form">
          <h2>Update Patient's Details</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="First name"
              onChange={handleChange}
              name="patient_first_name"
              value={newPatient.patient_first_name}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Second name"
              onChange={handleChange}
              name="patient_last_name"
              value={newPatient.patient_last_name}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Place of Residence"
              onChange={handleChange}
              name="residence"
              value={newPatient.residence}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Phone number"
              onChange={handleChange}
              name="phone"
              value={newPatient.phone}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Emergency contact"
              onChange={handleChange}
              name="emergency_contact"
              value={newPatient.emergency_contact}
              required
            />
          </div>

          <button type="submit" className="login-button" onClick={updateRecord}>
            UPDATE
          </button>
        </form>
      </Popup>
    </div>
  );
};

export default Patients;
