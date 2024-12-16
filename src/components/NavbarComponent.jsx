import "../components/NavbarComponent.scss";
import "../components/VideoItem.scss"
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
    <nav className="navbar navbar-expand-lg text-white">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} />
          Omega Stream
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
                  <Link  className="nav-link" to="/Login">Log in</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Registration">
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
                  <Link to="/profile" className="nav-link">Your Profile</Link>
                </li>
              </>
            )}
            <Link to="/video/upload" id="upload-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 17 17">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
            </Link>

            {/* <li className="nav-item dropdown">
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
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
