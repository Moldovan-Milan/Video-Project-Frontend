import axios from "axios";
import "../styles/Login.scss";
import "../styles/VideoItem.scss";
import React, { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from "../components/contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../components/contexts/WebSocketProvider";
import { useSignalR } from "../components/contexts/SignalRProvider";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const rememberMeRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  //const { connectToServer } = useWebSocket();
  const { connectToServer } = useSignalR();

  // Felhasználó bejelentkezésének kezelése
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let rememberMe = rememberMeRef.current.checked;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("rememberMe", rememberMe);

    const response = await axios.post("api/user/login", formData);

    if (response.status === 200) {
      if (rememberMe) {
        const { refreshToken } = response.data;

        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }
      const { token, userDto } = response.data;
      sessionStorage.setItem("jwtToken", token);
      console.log(userDto);
      setUser({
        id: userDto.id,
        email: userDto.email,
        userName: userDto.userName,
        followers: userDto.followers,
        avatarId: userDto.avatarId,
        created: userDto.created,
      });

      navigate("/");
      connectToServer();
      //window.location = "/";
    } else {
      setErrorMessage("Hibás felhasználónév vagy jelszó!");
      // A form mezők kiürítése
      emailRef.current.value = "";
      passwordRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-green-600 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Bejelentkezés</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              Email-address:
            </label>
            <input
              ref={emailRef}
              type="email"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="password"
              required
              ref={passwordRef}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rememberMe" className="block font-bold mb-2">
              Remember me:
            </label>
            <input
              type="checkbox"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="rememberMe"
              ref={rememberMeRef}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
          >
            Login
          </button>
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
