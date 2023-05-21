import React, { useRef } from "react";
import { useState, useEffect } from "react";
import "../styles/Table.css";
import AddBtn from "./AddBtn";
import DeleteBtn from "./DeleteBtn";
import "../styles/App.css";
import Popup from "./Popup";
import axios from "axios";
import Satisfied from "./Satisfied";
import SatisfyBtn from "./SatisfyBtn";
import Header from "./Header";
import SearchIcon from "@mui/icons-material/Search";

const Prescriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filter = () => {
    const filteredPrescriptions = prescriptions.filter(
      (prescription) => String(prescription.prescription_no) === searchTerm
    );
    setPrescriptions(filteredPrescriptions);
  };

  const [buttonPopup, setButtonPopup] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    prescription_date: null,
    patient_id: null,
    doctor_id: null,
    drug: "",
    dosage: "",
    is_satisfied: 0,
  });

  const [newPayment, setNewPayment] = useState({
    prescription_no: null,
    date_of_payment: null,
    total: "",
  });

  const prescriptionNoRef = useRef();
  const paymentPrescriptionNoRef = useRef();

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  let isCorrectEntry = false;

  if (
    newPrescription.prescription_date != null &&
    newPrescription.patient_id != null &&
    newPrescription.doctor_id != null &&
    newPrescription.drug != "" &&
    newPrescription.dosage != "" &&
    newPrescription.is_satisfied != null
  ) {
    isCorrectEntry = true;
  }

  let isFullyFilled = false;
  if (
    newPayment.prescription_no != null &&
    newPayment.date_of_payment != null &&
    newPayment.total != ""
  ) {
    isFullyFilled = true;
  }

  useEffect(() => {
    const fetchAllPrescriptions = async () => {
      try {
        const res = await axios.get("http://localhost:8081/prescriptions");
        setPrescriptions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllPatients = async () => {
      try {
        const res = await axios.get("http://localhost:8081/patients");
        setPatients(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8081/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllPrescriptions();
    fetchAllPatients();
    fetchAllDoctors();
  }, []);

  const handlePaymentEntry = (
    prescriptionNumber,
    date,
    patientID,
    docID,
    drug,
    dosage
  ) => {
    setUpdatePopup(true);
    prescriptionNoRef.current = prescriptionNumber;
    paymentPrescriptionNoRef.current = prescriptionNumber;
    setNewPayment({
      prescription_no: paymentPrescriptionNoRef.current,
      date_of_payment: currentDate,
      total: "",
    });

    setNewPrescription({
      prescription_date: date,
      patient_id: patientID,
      doctor_id: docID,
      drug: drug,
      dosage: dosage,
      is_satisfied: 1,
    });
  };

  const handleEntry = (e) => {
    setNewPrescription((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addPrescription = async (e) => {
    e.preventDefault();
    if (isCorrectEntry) {
      try {
        await axios.post(
          "http://localhost:8081/prescriptions",
          newPrescription
        );
        setButtonPopup(false);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    setNewPayment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const postPayment = async () => {
    try {
      await axios.post("http://localhost:8081/payments", newPayment);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const putPrescription = async () => {
    try {
      await axios.put(
        "http://localhost:8081/prescriptions/" + prescriptionNoRef.current,
        newPrescription
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (isFullyFilled && isCorrectEntry) {
      putPrescription();
      postPayment();
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
            placeholder="Search by Prescription no..."
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
          <th>Prescription no.</th>
          <th>Prescription Date</th>
          <th>Patient's Name</th>
          <th>Doctor's Name</th>
          <th>Drug(s) & dosage</th>
          <th>Is Satisfied?</th>
        </tr>
        {prescriptions.map((prescription, i) => (
          <tr key={i}>
            <td>{prescription.prescription_no}</td>
            <td>{prescription.prescription_date}</td>
            <td>
              {prescription.patient_first_name +
                " " +
                prescription.patient_last_name}
            </td>
            <td>
              {prescription.doctor_first_name +
                " " +
                prescription.doctor_last_name}
            </td>
            <td>
              {String(prescription.drug).slice(1, -1) +
                ", " +
                String(prescription.dosage).slice(1, -1)}
            </td>
            <td>{Number(prescription.is_satisfied) === 1 ? "YES" : "NO"}</td>
            <td>
              {Number(prescription.is_satisfied) === 1 ? (
                <Satisfied />
              ) : (
                <SatisfyBtn
                  onclick={() =>
                    handlePaymentEntry(
                      prescription.prescription_no,
                      prescription.prescription_date,
                      prescription.patient_id,
                      prescription.doctor_id,
                      prescription.drug,
                      prescription.dosage
                    )
                  }
                />
              )}
            </td>
          </tr>
        ))}
      </table>

      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form className="add-form">
          <h2>Add Prescription</h2>
          <div className="input-box">
            <label>Date</label>
            <input
              type="date"
              name="prescription_date"
              onChange={handleEntry}
              required
            />
          </div>

          <div className="input-box">
            <select onChange={handleEntry} name="patient_id">
              <option>Patient ID</option>
              {patients.map((patient, i) => (
                <option key={i}>{patient.id}</option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <select onChange={handleEntry} name="doctor_id">
              <option>Doctor ID</option>
              {doctors.map((doctor, i) => (
                <option key={i}>{doctor.id}</option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Drug(s)"
              name="drug"
              onChange={handleEntry}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Dosage"
              name="dosage"
              onChange={handleEntry}
              required
            />
          </div>
          <button
            type="submit"
            className="login-button"
            onClick={addPrescription}
          >
            ADD
          </button>
        </form>
      </Popup>

      <Popup trigger={updatePopup} setTrigger={setUpdatePopup}>
        <form className="add-form">
          <h2>Prescription Payment</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter the cost"
              name="total"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="login-button"
            onClick={handlePayment}
          >
            DONE
          </button>
        </form>
      </Popup>
    </div>
  );
};

export default Prescriptions;
