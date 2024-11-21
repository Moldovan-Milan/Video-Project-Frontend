import React, { useState, useRef } from "react";
import axios from "axios";

const Registration = () => {
  const userNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const emailRef = useRef("");
  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleRegistration = (e) => {
    e.preventDefault();

    // Megnézi, hogy minden mezőt kitöltött-e
    if (
      userNameRef.current.value === "" ||
      passwordRef.current.value === "" ||
      confirmPasswordRef.current.value === "" ||
      emailRef.current.value === "" ||
      avatar === null
    ) {
      setErrorMessage("Minden mező kitöltése kötelező!");
      return;
    } else {
      // Jelszó ellenőrzése
      if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        setErrorMessage("A jelszó nem egyezik!");
        return;
      } else {
        let succes = registrateUser();
        if (succes) {
          setErrorMessage("Sikeres regisztráció!");
        } else {
          setErrorMessage("Hiba a regisztráció során!");
        }
      }
    }
  };

  const registrateUser = async () => {
    let success = false;
    try {
      const formData = new FormData();
      formData.append("username", userNameRef.current.value);
      formData.append("email", emailRef.current.value);
      formData.append("password", passwordRef.current.value);
      formData.append("avatar", avatar);
      const response = await axios.post("api/user/register", formData);
      if (response.status === 200) {
        success = true;
      }
    } catch (err) {
      console.error(err);
    }
    return success;
  };

  return (
    <div className="container">
      <h2>Regisztráció</h2>
      <form onSubmit={(e) => handleRegistration(e)}>
        <div className="form-group">
          <label htmlFor="username">Felhasználónév:</label>
          <input
            ref={userNameRef}
            type="text"
            className="form-control"
            id="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail cím:</label>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Jelszó újra:</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            required
            ref={confirmPasswordRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Profilkép:</label>
          <input
            onChange={handleAvatarChange}
            type="file"
            className="form-control-file"
            id="avatar"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Regisztrálás
        </button>
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default Registration;
