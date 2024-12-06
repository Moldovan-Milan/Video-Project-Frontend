import "../components/NavbarComponent.scss";
import logo from "../assets/omega_stream_v1.png";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function NavbarComponent() {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post(
        "api/user/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.removeItem("jwtToken"); // Token törlése a localStorage-ból
      setToken(null);
      setUsername(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  useEffect(() => {
    let token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.sub);
      setToken(token);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} />
          Navbar
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!token && (
              <>
                <li className="nav-item" id="login">
                  <Link to="/Login">Log in</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Register">
                    Register
                  </Link>
                </li>
              </>
            )}
            {token && (
              <>
                <button onClick={handleLogout} className="btn btn-danger">
                  Kijelentkezés
                </button>
                <li className="nav-item">
                  <Link to="/profile">Your Profile</Link>
                </li>
              </>
            )}

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
