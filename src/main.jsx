import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import Dashboard from "./pages/Dashboard";
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctors from "./components/Doctors";
import Drugs from "./components/Drugs";
import Patients from "./components/Patients";
import Payments from "./components/Payments";
import Prescriptions from "./components/Prescriptions";
import Specialties from "./components/Specialties";
import Suppliers from "./components/Suppliers";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/doctors" element={<Doctors />} />
        <Route path="/dashboard/drugs" element={<Drugs />} />
        <Route path="/dashboard/patients" element={<Patients />} />
        <Route path="/dashboard/payments" element={<Payments />} />
        <Route path="/dashboard/prescriptions" element={<Prescriptions />} />
        <Route path="/dashboard/specialties" element={<Specialties />} />
        <Route path="/dashboard/suppliers" element={<Suppliers />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
