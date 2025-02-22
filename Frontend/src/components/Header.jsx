import React from "react";
import { Link } from "react-router-dom";

const Header = ({ username, handleLogout }) => {
  if (username) {
    return (
      <header className="header">
        <h4>Bejelenkeztél {username} néven!</h4>
        <button onClick={handleLogout} className="btn btn-danger">
          Kijelentkezés
        </button>
      </header>
    );
  } else {
    return (
      <header className="header">
        <Link style={{ marginRight: "10px" }} to="/login">
          Bejelentkezés
        </Link>

        <Link to="/registration">Regisztrálás</Link>
      </header>
    );
  }
};

export default Header;
