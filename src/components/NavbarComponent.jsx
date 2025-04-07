import "../styles/NavbarComponent.scss";
import "../styles/VideoItem.scss";
import logo from "../assets/omega_stream_v1.png";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import {
  FaPlusCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaBars,
  FaUser,
  FaHistory,
  FaUserFriends,
  FaPhotoVideo,
  FaUserTie,
  FaUpload,
  FaEyeSlash,
  FaEyeDropper,
  FaRegEye,
  FaVideo,
} from "react-icons/fa";
import logOutUser from "../functions/logOutUser";
import { UserContext } from "./contexts/UserProvider";
import { useSignalR } from "./contexts/SignalRProvider";
import {
  Fa42Group,
  FaEye,
  FaMessage,
  FaUsersLine,
  FaUsersRectangle,
} from "react-icons/fa6";
import axios from "axios";
import getRoles from "../functions/getRoles";

export default function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [roles, setRoles] = useState([]);
  const { user, setUser } = useContext(UserContext);
  //const { socket } = useWebSocket();
  const navigate = useNavigate();
  const { connection } = useSignalR();

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const loadRoles = async () => {
      const fetchedRoles = await getRoles(user.id);
      setRoles(fetchedRoles);
    };

    if (user) {
      loadRoles();
    }
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
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
          <FaBars />
        </button>
        <div
          className={`lg:flex flex-col w-full ${isOpen ? "block" : "hidden"}`}
        >
          <ul className="flex flex-col w-full">
            {!user && (
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
            <li className="nav-item mb-2">
              <Link
                to="/shorts"
                className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaPhotoVideo className="navIcon" />
                Shorts
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/livestream"
                className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaEye className="navIcon" />
                Watch Streams
              </Link>
            </li>
            {user && (
              <>
                <button
                  onClick={() => logOutUser(setUser, navigate, connection)}
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
                    <FaUser className="navIcon" />
                    My Profile
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/chats"
                    className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <FaMessage className="navIcon" />
                    Chats
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/watch-together"
                    className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <FaUsersRectangle className="navIcon" />
                    Watch Together
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/go-live"
                    className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <FaVideo className="navIcon" />
                    Go live
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/watch-history"
                    className="nav-link px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <FaHistory className="navIcon" />
                    Watch History
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/following"
                    className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <FaUserFriends className="navIcon" />
                    Subscriptions
                  </Link>
                </li>
                {user && roles && roles.includes("Admin") && (
                  <li>
                    <Link
                      to="/admin/verification-list"
                      className="nav-link  px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <FaUserTie className="navIcon" />
                      Admin Page
                    </Link>
                  </li>
                )}
              </>
            )}
            <li className="nav-item mb-2">
              <Link
                to="/video/upload"
                id="upload-button"
                className="px-3 py-2 rounded-md text-sm font-medium"
              >
                <p style={{ display: "flex", alignItems: "center" }}>
                  <FaUpload className="m-1" /> Upload Video
                </p>
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
