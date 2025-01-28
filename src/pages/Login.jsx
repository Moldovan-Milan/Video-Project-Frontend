import axios from "axios";
import "../pages/Login.scss";
import "../components/VideoItem.scss";
import React, { useRef, useState, useContext } from "react";
import { UserContext } from "../components/contexts/UserProvider";

const Login = () => {
  //const [user, setUser] = useContext(UserContext);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [errorMessage, setErrorMessage] = useState("");

  // Felhasználó bejelentkezésének kezelése
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await axios.post("api/user/login", formData);

    if (response.status === 200) {
      console.log(response);
      // TODO: Save the JWT token for authenticated user
      localStorage.setItem("jwtToken", response.data); // Ez fogja azonosítani a felhasználót
      // Vissza a főoldalra
      window.location.href = "/";
    } else {
      setErrorMessage("Hibás felhasználónév vagy jelszó!");
      console.log(response);
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
<<<<<<< HEAD
            <label htmlFor="email" className="block text-white font-bold mb-2">
              Email-cím:
            </label>
=======
            <label htmlFor="email" className="block text-white font-bold mb-2">Email-cím:</label>
>>>>>>> 17d53ae5269d819db41dd90c1cc1908aa8f121c3
            <input
              ref={emailRef}
              type="email"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="email"
              required
            />
          </div>
          <div className="mb-4">
<<<<<<< HEAD
            <label
              htmlFor="password"
              className="block text-white font-bold mb-2"
            >
              Jelszó:
            </label>
=======
            <label htmlFor="password" className="block text-white font-bold mb-2">Jelszó:</label>
>>>>>>> 17d53ae5269d819db41dd90c1cc1908aa8f121c3
            <input
              type="password"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="password"
              required
              ref={passwordRef}
            />
          </div>
<<<<<<< HEAD
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
          >
            Bejelentkezés
          </button>
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}
=======
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Bejelentkezés
          </button>
          {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
>>>>>>> 17d53ae5269d819db41dd90c1cc1908aa8f121c3
        </form>
      </div>
    </div>
  );
};

export default Login;
