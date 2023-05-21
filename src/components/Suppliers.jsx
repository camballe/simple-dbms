import React from "react";
import { useState, useEffect, useRef } from "react";
import "../styles/Table.css";
import AddBtn from "./AddBtn";
import DeleteBtn from "./DeleteBtn";
import "../styles/App.css";
import Popup from "./Popup";
import axios from "axios";
import UpdateBtn from "./UpdateBtn";
import Dialog from "./Dialog";
import Header from "./Header";
import SearchIcon from "@mui/icons-material/Search";

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filter = () => {
    const filteredSuppliers = suppliers.filter(
      (supplier) => String(supplier.id) === searchTerm
    );
    setSuppliers(filteredSuppliers);
  };

  const [buttonPopup, setButtonPopup] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    supplier_name: "",
    postal_address: "",
    pharmacist_on_call: "",
    phone: "",
  });

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
  });

  let isFullyFilled = false;
  if (
    newSupplier.supplier_name != "" &&
    newSupplier.postal_address != "" &&
    newSupplier.pharmacist_on_call != "" &&
    newSupplier.phone != "" &&
    newSupplier.phone.length >= 10
  ) {
    isFullyFilled = true;
  }

  const recordIDRef = useRef();
  const updateIDRef = useRef();

  const handleDialog = (message, isLoading) => {
    setDialog({
      message,
      isLoading,
    });
  };

  useEffect(() => {
    const fetchAllSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:8081/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllSuppliers();
  }, []);

  const handleChange = (e) => {
    setNewSupplier((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.post("http://localhost:8081/suppliers", newSupplier);
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
  //         "http://localhost:8081/suppliers/" + recordIDRef.current
  //       );
  //       window.location.reload();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     handleDialog("", false);
  //   }
  // };

  const handleUpdate = (id, name, postalAddress, pharmacist, phone) => {
    setUpdatePopup(true);
    updateIDRef.current = id;

    setNewSupplier({
      supplier_name: name,
      postal_address: postalAddress,
      pharmacist_on_call: pharmacist,
      phone: phone,
    });
  };

  const updateRecord = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.put(
          "http://localhost:8081/suppliers/" + updateIDRef.current,
          newSupplier
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
          <th>Name</th>
          <th>Postal Address</th>
          <th>Pharmacist on Call</th>
          <th>Phone</th>
        </tr>
        {suppliers.map((supplier, i) => (
          <tr key={i}>
            <td>{supplier.id}</td>
            <td>{supplier.supplier_name}</td>
            <td>{supplier.postal_address}</td>
            <td>{supplier.pharmacist_on_call}</td>
            <td>{supplier.phone}</td>
            <UpdateBtn
              onclick={() =>
                handleUpdate(
                  supplier.id,
                  supplier.supplier_name,
                  supplier.postal_address,
                  supplier.pharmacist_on_call,
                  supplier.phone
                )
              }
            />
            {/* <DeleteBtn onclick={() => handleDelete(supplier.id)} /> */}
          </tr>
        ))}
      </table>

      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form className="add-form">
          <h2>Add Supplier</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Name"
              onChange={handleChange}
              name="supplier_name"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Postal Address"
              onChange={handleChange}
              name="postal_address"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Pharmacist on call"
              onChange={handleChange}
              name="pharmacist_on_call"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Phone number"
              minLength={10}
              onChange={handleChange}
              name="phone"
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
          <h2>Update Supplier's Details</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Name"
              onChange={handleChange}
              name="supplier_name"
              value={newSupplier.supplier_name}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Postal Address"
              onChange={handleChange}
              name="postal_address"
              value={newSupplier.postal_address}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Pharmacist on call"
              onChange={handleChange}
              name="pharmacist_on_call"
              value={newSupplier.pharmacist_on_call}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Phone number"
              minLength={10}
              onChange={handleChange}
              name="phone"
              value={newSupplier.phone}
              required
            />
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

export default Suppliers;
