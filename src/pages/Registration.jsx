import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../components/contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import ThumbnailUpload from "../components/ThumbnailUpload";

const Registration = () => {
  const userNameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const emailRef = useRef("");
  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | Omega Stream";
  }, []);

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (
      userNameRef.current.value === "" ||
      passwordRef.current.value === "" ||
      confirmPasswordRef.current.value === "" ||
      emailRef.current.value === "" ||
      avatar === null
    ) {
      setErrorMessage([{ description: "You need to fill out everything!" }]);
      return;
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setErrorMessage([{ description: "The passwords don't match!" }]);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", userNameRef.current.value);
      formData.append("email", emailRef.current.value);
      formData.append("password", passwordRef.current.value);
      formData.append("avatar", avatar);
      const response = await axios.post("api/user/register", formData);

      if (response.status === 200) {
        window.alert("Successfully Registered!");
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(err.response.data);
    }
  };

  if (user) {
    navigate("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-green-600 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleRegistration}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Username:
            </label>
            <input
              ref={userNameRef}
              type="text"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              E-mail address:
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
            <label
              htmlFor="confirmPassword"
              className="block text-gray-white font-bold mb-2"
            >
              Confrim Password:
            </label>
            <input
              type="password"
              className="text-black form-input w-full px-4 py-2 border rounded-md"
              id="confirmPassword"
              required
              ref={confirmPasswordRef}
            />
          </div>
          <ul>
            {errorMessage.map((error, index) => (
              <li key={index}>
                <span
                  data-testid="errorMessage"
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  {error.description}
                </span>
              </li>
            ))}
          </ul>
          <div className="mb-4">
            <label className="block text-white font-bold mb-2">
              Profile Picture:
            </label>
            <ThumbnailUpload
              thumbnail={avatar}
              setThumbnail={setAvatar}
              maxWidth={128}
              maxHeight={128}
              setGoBackText={() => {}}
              buttonText={"Upload Image"}
              borderRadius={"250px"}
            />
          </div>
          <button
            data-testid="signUpButton"
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
