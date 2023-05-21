import React from "react";
import { useState, useEffect } from "react";
import "../styles/Table.css";
import AddBtn from "./AddBtn";
import DeleteBtn from "./DeleteBtn";
import axios from "axios";
import Header from "./Header";
import SearchIcon from "@mui/icons-material/Search";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filter = () => {
    const filteredPayments = payments.filter(
      (payment) => String(payment.ref_no) === searchTerm
    );
    setPayments(filteredPayments);
  };

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const res = await axios.get("http://localhost:8081/payments");
        setPayments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllPayments();
  }, []);

  return (
    <div>
      <Header />
      <div className="below-header">
        {/* <AddBtn onclick={() => setButtonPopup(true)} /> */}
        <div className="search">
          <input
            type="text"
            placeholder="Search by Ref no..."
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
          <th>Ref no.</th>
          <th>Prescription no.</th>
          <th>Date of Payment</th>
          <th>Total (KES)</th>
        </tr>
        {payments.map((payment, i) => (
          <tr key={i}>
            <td>{payment.ref_no}</td>
            <td>{payment.prescription_no}</td>
            <td>{payment.date_of_payment}</td>
            <td>{payment.total}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Payments;
