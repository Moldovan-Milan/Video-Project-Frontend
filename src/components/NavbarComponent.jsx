import "../components/NavbarComponent.scss";
import "../components/VideoItem.scss";
import logo from "../assets/omega_stream_v1.png";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaPlusCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaBars
} from "react-icons/fa";

export default function NavbarComponent() {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const handleLogout = async () => {
    try {
      await axios.post(
        "api/user/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      sessionStorage.removeItem("jwtToken"); // Token törlése a localStorage-ból
      setToken(null);
      setUsername(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    let token = sessionStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.sub);
      setToken(token);
    }
  }, []);

  return (
    <nav className="h-full">
      <div className="flex flex-col items-center p-4">
        <Link className="flex items-center mb-4 main-logo" to="/">
          <img src={logo} className="h-8 w-8 mr-2" alt="Omega Stream Logo" />
          <span className="text-xl font-bold">Omega Stream</span>
        </Link>
        <button
          className="lg:hidden px-2 py-1 border rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars/>
          
        </button>
        <div
          className={`lg:flex flex-col w-full ${isOpen ? "block" : "hidden"}`}
        >
          <ul className="flex flex-col w-full">
            {!token && (
              <>
                <li className="nav-item mb-2" id="login">
                  <Link
                    className="nav-link px-3 py-2 rounded-md text-sm font-medium navbar-btn"
                    to="/Login"
                  >
                    <FaSignInAlt className="symbol" />
                    Log in
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    className="nav-link px-3 py-2 rounded-md text-sm font-medium navbar-btn"
                    to="/Registration"
                  >
                    <FaUserPlus className="symbol" />
                    Register
                  </Link>
                </li>
              </>
            )}
            {token && (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 navbar-btn"
                >
                  <FaSignOutAlt className="symbol" />
                  Log out
                </button>
                <li className="nav-item mb-2">
                  <Link
                    to="/profile"
                    className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Your Profile
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item mb-2">
              <Link
                to="/video/upload"
                id="upload-button"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaPlusCircle />
              </Link>
            </li>
            <li className="nav-item mb-2">
            <div className="switch">
            <input
              type="checkbox"
              onChange={() => handleThemeChange()}
              className="switch__input"
              id="Switch"
              checked={theme === "dark"}
            />
            <label className="switch__label" htmlFor="Switch">
              <span className="switch__decoration"></span>
              <span className="switch__indicator"></span>
            </label>
          </div>
            </li>
          </ul>
          
        </div>
      </div>
    </nav>
  );
}
