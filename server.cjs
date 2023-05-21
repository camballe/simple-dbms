const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "bitega",
  password: "Jason/908",
  database: "pharmacy_database",
});

db.connect();

app.use(express.json());
app.use(cors());

//*==================== GET REQUESTS ====================*//

app.get("/doctors", (req, res) => {
  const sql =
    "SELECT doctors.id, doctors.doctor_first_name, doctors.doctor_last_name, doctors.phone, doctors.specialty_id, specialties.field FROM doctors INNER JOIN specialties ON doctors.specialty_id = specialties.id;";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/drugs", (req, res) => {
  const sql =
    "SELECT drugs.ref_no, drugs.brand_name, drugs.drug_type, drugs.supplier_id, suppliers.supplier_name, drugs.purchase_date, drugs.exp_date, drugs.amount_in_stock, drugs.reorder_level, drugs.unit_cost FROM drugs INNER JOIN suppliers ON drugs.supplier_id = suppliers.id";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/patients", (req, res) => {
  const sql = "SELECT * FROM patients";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/payments", (req, res) => {
  const sql = "SELECT * FROM payments";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/prescriptions", (req, res) => {
  const sql =
    "SELECT prescriptions.prescription_no, prescriptions.prescription_date, prescriptions.patient_id, prescriptions.doctor_id, patients.patient_first_name, patients.patient_last_name, doctors.doctor_first_name, doctors.doctor_last_name, json_extract(drug_details, '$.drug') AS drug,json_extract(drug_details, '$.dosage') AS dosage, prescriptions.is_satisfied FROM prescriptions INNER JOIN patients ON prescriptions.patient_id = patients.id INNER JOIN doctors ON prescriptions.doctor_id = doctors.id;";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/specialties", (req, res) => {
  const sql = "SELECT * FROM specialties";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/suppliers", (req, res) => {
  const sql = "SELECT * FROM suppliers";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

//*==================== POST REQUESTS ====================*//

app.post("/doctors", (req, res) => {
  const sql =
    "INSERT INTO doctors (`doctor_first_name`, `doctor_last_name`, `phone`, `specialty_id`) VALUES (?)";
  const values = [
    req.body.doctor_first_name,
    req.body.doctor_last_name,
    req.body.phone,
    req.body.specialty_id,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/drugs", (req, res) => {
  const sql =
    "INSERT INTO drugs (`brand_name`, `drug_type`, `supplier_id`, `exp_date`, `purchase_date`, `amount_in_stock`, `reorder_level`, `unit_cost`) VALUES (?)";
  const values = [
    req.body.brand_name,
    req.body.drug_type,
    req.body.supplier_id,
    req.body.exp_date,
    req.body.purchase_date,
    req.body.amount_in_stock,
    req.body.reorder_level,
    req.body.unit_cost,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/patients", (req, res) => {
  const sql =
    "INSERT INTO patients (`patient_first_name`, `patient_last_name`, `residence`, `phone`, `emergency_contact`, `registration_date`) VALUES (?)";
  const values = [
    req.body.patient_first_name,
    req.body.patient_last_name,
    req.body.residence,
    req.body.phone,
    req.body.emergency_contact,
    req.body.registration_date,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/payments", (req, res) => {
  const sql =
    "INSERT INTO payments (`prescription_no`, `date_of_payment`, `total`) VALUES (?)";

  const values = [
    req.body.prescription_no,
    req.body.date_of_payment,
    Number(req.body.total),
  ];

  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/prescriptions", (req, res) => {
  const sql =
    "INSERT INTO prescriptions (`prescription_date`, `patient_id`, `doctor_id`, `drug_details`, `is_satisfied`) VALUES (?)";

  const values = [
    req.body.prescription_date,
    req.body.patient_id,
    req.body.doctor_id,
    `{"drug": "${req.body.drug}", "dosage": "${req.body.dosage}"}`,
    req.body.is_satisfied,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/specialties", (req, res) => {
  const sql = "INSERT INTO specialties (`field`) VALUES (?)";
  const values = [req.body.field];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/suppliers", (req, res) => {
  const sql =
    "INSERT INTO suppliers (`supplier_name`, `postal_address`, `pharmacist_on_call`, `phone`) VALUES (?)";
  const values = [
    req.body.supplier_name,
    req.body.postal_address,
    req.body.pharmacist_on_call,
    req.body.phone,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

//*==================== DELETE REQUESTS ====================*//

app.delete("/doctors/:id", (req, res) => {
  const doctorID = req.params.id;
  const sql = "DELETE FROM doctors WHERE id = ?";

  db.query(sql, [doctorID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.delete("/drugs/:id", (req, res) => {
  const drugID = req.params.id;
  const sql = "DELETE FROM drugs WHERE ref_no = ?";

  db.query(sql, [drugID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.delete("/specialties/:id", (req, res) => {
  const specialtyID = req.params.id;
  const sql = "DELETE FROM specialties WHERE id = ?";

  db.query(sql, [specialtyID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.delete("/suppliers/:id", (req, res) => {
  const supplierID = req.params.id;
  const sql = "DELETE FROM suppliers WHERE id = ?";

  db.query(sql, [supplierID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

//*==================== PUT REQUESTS ====================*//

app.put("/doctors/:id", (req, res) => {
  const doctorID = req.params.id;
  const sql =
    "UPDATE doctors SET `doctor_first_name` = ?, `doctor_last_name` = ?, `phone` = ?, `specialty_id` = ? WHERE id = ?";

  const values = [
    req.body.doctor_first_name,
    req.body.doctor_last_name,
    req.body.phone,
    req.body.specialty_id,
  ];

  db.query(sql, [...values, doctorID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put("/drugs/:id", (req, res) => {
  const drugID = req.params.id;
  const sql =
    "UPDATE drugs SET `brand_name` = ?, `drug_type` = ?, `supplier_id` = ?, `exp_date` = ?, `purchase_date` = ?, `amount_in_stock` = ?, `reorder_level` = ?, `unit_cost` = ? WHERE ref_no = ?";
  const values = [
    req.body.brand_name,
    req.body.drug_type,
    req.body.supplier_id,
    req.body.exp_date,
    req.body.purchase_date,
    req.body.amount_in_stock,
    req.body.reorder_level,
    req.body.unit_cost,
  ];

  db.query(sql, [...values, drugID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put("/patients/:id", (req, res) => {
  const patientID = req.params.id;
  const sql =
    "UPDATE patients SET `patient_first_name` = ?, `patient_last_name` = ?, `residence` = ?, `phone` = ?, `emergency_contact` = ? WHERE id = ?";
  const values = [
    req.body.patient_first_name,
    req.body.patient_last_name,
    req.body.residence,
    req.body.phone,
    req.body.emergency_contact,
  ];

  db.query(sql, [...values, patientID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put("/prescriptions/:id", (req, res) => {
  const prescriptionID = req.params.id;
  const sql =
    "UPDATE prescriptions SET `is_satisfied` = ? WHERE prescription_no = ?";

  const values = [req.body.is_satisfied];

  db.query(sql, [...values, prescriptionID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put("/suppliers/:id", (req, res) => {
  const supplierID = req.params.id;
  const sql =
    "UPDATE suppliers SET `supplier_name` = ?, `postal_address` = ?, `pharmacist_on_call` = ?, `phone` = ? WHERE id = ?";
  const values = [
    req.body.supplier_name,
    req.body.postal_address,
    req.body.pharmacist_on_call,
    req.body.phone,
  ];

  db.query(sql, [...values, supplierID], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.listen(8081, () => console.log("Server started"));
