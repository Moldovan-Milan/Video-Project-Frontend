import axios from "axios";
import React, { useRef, useState } from "react";

const Login = () => {
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
    <div className="container">
      <h2>Bejelentkezés</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email-cím:</label>
          <input
            ref={emailRef}
            type="email"
            className="form-control"
            id="email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Jelszó:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            ref={passwordRef}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Bejelentkezés
        </button>
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default Login;
