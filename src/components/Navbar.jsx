import React from "react";
import "../styles/Navbar.css";

const Navbar = ({ text }) => {
  return (
    <nav className="navbar">
      <h2>{text}</h2>
    </nav>
  );
};

export default Navbar;
