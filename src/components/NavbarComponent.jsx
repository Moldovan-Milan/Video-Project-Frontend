import "../components/NavbarComponent.scss";
import "../components/VideoItem.scss";
import logo from "../assets/omega_stream_v1.png";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function NavbarComponent() {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className=" text-white h-full">
      <div className="flex flex-col items-start p-4">
        <Link className="flex items-center mb-4" to="/">
          <img src={logo} className="h-8 w-8 mr-2" alt="Omega Stream Logo" />
          <span className="text-xl font-bold">Omega Stream</span>
        </Link>
        <button
          className="lg:hidden px-2 py-1 border rounded text-gray-200 border-gray-200 hover:text-white hover:border-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <div className={`lg:flex flex-col w-full ${isOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col w-full">
            {!token && (
              <>
                <li className="nav-item mb-2" id="login">
                  <Link className="nav-link text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/Login">
                    Log in
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/Registration">
                    Register
                  </Link>
                </li>
              </>
            )}
            {token && (
              <>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2">
                  Kijelentkezés
                </button>
                <li className="nav-item mb-2">
                  <Link to="/profile" className="nav-link text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Your Profile
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item mb-2">
              <Link to="/video/upload" id="upload-button" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 17 17"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
