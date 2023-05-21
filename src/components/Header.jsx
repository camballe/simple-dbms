import React, { useState } from "react";
import Navbar from "./Navbar";
import "../styles/Dashboard.css";

const Header = () => {
  const [menuState, setMenuState] = useState({
    activeObject: null,
    objects: [
      {
        id: 1,
        link: "http://localhost:5173/dashboard/drugs",
        title: "Drugs",
      },
      {
        id: 2,
        link: "http://localhost:5173/dashboard/prescriptions",
        title: "Prescriptions",
      },
      {
        id: 3,
        link: "http://localhost:5173/dashboard/payments",
        title: "Payments",
      },
      {
        id: 4,
        link: "http://localhost:5173/dashboard/patients",
        title: "Patients",
      },
      {
        id: 5,
        link: "http://localhost:5173/dashboard/suppliers",
        title: "Suppliers",
      },
      {
        id: 6,
        link: "http://localhost:5173/dashboard/doctors",
        title: "Doctors",
      },
      {
        id: 7,
        link: "http://localhost:5173/dashboard/specialties",
        title: "Specialties",
      },
    ],
  });

  const toggleActive = (i) => {
    setMenuState({ ...menuState, activeObject: menuState.objects[i] });
  };

  const toggleActiveStyles = (i) => {
    if (menuState.objects[i].link === window.location.href) {
      return "tab active";
    } else {
      return "tab inactive";
    }
  };

  return (
    <div className="Dashboard">
      <Navbar text={"Pharmacy Database Management System"} />
      <div className="menu">
        {menuState.objects.map((element, i) => (
          <a
            key={i}
            href={element.link}
            className={toggleActiveStyles(i)}
            onClick={() => {
              toggleActive(i);
            }}
          >
            <h3>{element.title}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Header;
