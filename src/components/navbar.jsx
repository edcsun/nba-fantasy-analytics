import React from "react";

// Stateless Functional Component
const NavBar = ({ title, status }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand">{title}</a>
      <span className="badge badge-pill badge-secondary">{status}</span>
    </nav>
  );
};

export default NavBar;
