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

const Drugs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filter = () => {
    const filteredDrugs = drugs.filter(
      (drug) => String(drug.ref_no) === searchTerm
    );
    setDrugs(filteredDrugs);
  };

  const [buttonPopup, setButtonPopup] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newDrug, setNewDrug] = useState({
    brand_name: "",
    drug_type: "",
    supplier_id: null,
    exp_date: null,
    purchase_date: null,
    amount_in_stock: null,
    reorder_level: null,
    unit_cost: null,
  });
  let isFullyFilled = false;
  if (
    newDrug.brand_name != "" &&
    newDrug.drug_type != "" &&
    newDrug.supplier_id != null &&
    newDrug.exp_date != null &&
    newDrug.purchase_date != null &&
    newDrug.amount_in_stock != null &&
    newDrug.reorder_level != null &&
    newDrug.unit_cost != null
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
    const fetchAllDrugs = async () => {
      try {
        const res = await axios.get("http://localhost:8081/drugs");
        setDrugs(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:8081/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllDrugs();
    fetchAllSuppliers();
  }, []);

  const handleChange = (e) => {
    setNewDrug((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.post("http://localhost:8081/drugs", newDrug);
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
  //         "http://localhost:8081/drugs/" + recordIDRef.current
  //       );
  //       window.location.reload();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     handleDialog("", false);
  //   }
  // };

  const handleUpdate = (
    ref_no,
    name,
    type,
    supplierID,
    expDate,
    purchaseDate,
    amount,
    reorderLevel,
    cost
  ) => {
    setUpdatePopup(true);
    updateIDRef.current = ref_no;

    setNewDrug({
      brand_name: name,
      drug_type: type,
      supplier_id: supplierID,
      exp_date: expDate,
      purchase_date: purchaseDate,
      amount_in_stock: amount,
      reorder_level: reorderLevel,
      unit_cost: cost,
    });
  };

  const updateRecord = async (e) => {
    e.preventDefault();
    if (isFullyFilled) {
      try {
        await axios.put(
          "http://localhost:8081/drugs/" + updateIDRef.current,
          newDrug
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
          <th>Name</th>
          <th>Type</th>
          <th>Supplier</th>
          <th>Date of Purchase</th>
          <th>Expiry Date</th>
          <th>Amount in Stock</th>
          <th>Reorder Level</th>
          <th>Unit cost (KES)</th>
        </tr>
        {drugs.map((drug, i) => (
          <tr key={i}>
            <td>{drug.ref_no}</td>
            <td>{drug.brand_name}</td>
            <td>{drug.drug_type}</td>
            <td>{drug.supplier_name}</td>
            <td>{drug.purchase_date}</td>
            <td>{drug.exp_date}</td>
            <td>{drug.amount_in_stock}</td>
            <td>{drug.reorder_level}</td>
            <td>{drug.unit_cost}</td>
            <UpdateBtn
              onclick={() =>
                handleUpdate(
                  drug.ref_no,
                  drug.brand_name,
                  drug.drug_type,
                  drug.supplier_id,
                  drug.exp_date,
                  drug.purchase_date,
                  drug.amount_in_stock,
                  drug.reorder_level,
                  drug.unit_cost
                )
              }
            />
            {/* <DeleteBtn onclick={() => handleDelete(drug.ref_no)} /> */}
          </tr>
        ))}
      </table>

      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form className="add-form">
          <h2>Add Drug</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Name"
              onChange={handleChange}
              name="brand_name"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Type"
              onChange={handleChange}
              name="drug_type"
              required
            />
          </div>
          <div className="input-box">
            <select onChange={handleChange} name="supplier_id">
              <option>Supplier ID</option>
              {suppliers.map((supplier, i) => (
                <option key={i}>{Number(supplier.id)}</option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <label>Expiry Date</label>
            <input
              type="date"
              onChange={handleChange}
              name="exp_date"
              required
            />
          </div>
          <div className="input-box">
            <label>Date of Purchase</label>
            <input
              type="date"
              onChange={handleChange}
              name="purchase_date"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="number"
              placeholder="Amount in stock"
              onChange={handleChange}
              name="amount_in_stock"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="number"
              placeholder="Reorder level"
              onChange={handleChange}
              name="reorder_level"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="number"
              placeholder="Unit cost"
              onChange={handleChange}
              name="unit_cost"
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
          <h2>Update Drug Details</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Name"
              onChange={handleChange}
              name="brand_name"
              value={newDrug.brand_name}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Type"
              onChange={handleChange}
              name="drug_type"
              value={newDrug.drug_type}
              required
            />
          </div>
          <div className="input-box">
            <select
              onChange={handleChange}
              name="supplier_id"
              value={newDrug.supplier_id}
            >
              <option>Supplier ID</option>
              {suppliers.map((supplier, i) => (
                <option key={i}>{Number(supplier.id)}</option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <label>Expiry Date</label>
            <input
              type="date"
              onChange={handleChange}
              name="exp_date"
              value={newDrug.exp_date}
              required
            />
          </div>
          <div className="input-box">
            <label>Date of Purchase</label>
            <input
              type="date"
              onChange={handleChange}
              name="purchase_date"
              value={newDrug.purchase_date}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="number"
              placeholder="Amount in stock"
              onChange={handleChange}
              name="amount_in_stock"
              value={newDrug.amount_in_stock}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="number"
              placeholder="Reorder level"
              onChange={handleChange}
              name="reorder_level"
              value={newDrug.reorder_level}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="number"
              placeholder="Unit cost"
              onChange={handleChange}
              name="unit_cost"
              value={newDrug.unit_cost}
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

export default Drugs;
