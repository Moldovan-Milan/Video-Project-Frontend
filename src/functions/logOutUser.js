import axios from "axios";
import React, { useContext } from "react";
import { UserContext } from "../components/contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const logOutUser = async (setUser, socket, navigate) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const formData = new FormData();
  formData.append("refreshToken", refreshToken);
  try {
    await axios.post("api/user/logout", formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    sessionStorage.removeItem("jwtToken"); // Token törlése a localStorage-ból
    localStorage.removeItem("refreshToken"); // Már nem kell többet
    //setToken(null);
    setUser(null);
    socket.close();

    navigate("/");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export default logOutUser;
