import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../components/contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const userNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const emailRef = useRef("");
  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext)
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  useEffect(() => {
    document.title = "Register"
  }, [])

  const handleRegistration = async (e) => {
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
        try {
          const formData = new FormData();
          formData.append("username", userNameRef.current.value);
          formData.append("email", emailRef.current.value);
          formData.append("password", passwordRef.current.value);
          formData.append("avatar", avatar);
          const response = await axios.post("api/user/register", formData);
          if (response.status === 200) {
            setErrorMessage("Regisztráció sikeres");
          } else {
            setErrorMessage(response.data);
            console.log(response.data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  if(user){
    navigate("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-green-600 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Regisztráció</h2>
        <form onSubmit={(e) => handleRegistration(e)}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">Felhasználónév:</label>
            <input
              ref={userNameRef}
              type="text"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">E-mail cím:</label>
            <input
              ref={emailRef}
              type="email"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">Jelszó:</label>
            <input
              type="password"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="password"
              required
              ref={passwordRef}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-white font-bold mb-2">Jelszó újra:</label>
            <input
              type="password"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="confirmPassword"
              required
              ref={confirmPasswordRef}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="avatar" className="block text-gray-white font-bold mb-2">Profilkép:</label>
            <input
              onChange={handleAvatarChange}
              type="file"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="avatar"
            />
            {avatar && <img src={URL.createObjectURL(avatar)} alt="Avatar" className="mt-4 w-32 h-32 rounded-full object-cover" />}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Regisztrálás
          </button>
          {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default Registration;
