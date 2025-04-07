import React, { createContext, useContext, useEffect, useState } from "react";
import isTokenExpired from "../../utils/isTokenExpired";
import { UserContext } from "./UserProvider";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { setUser } = useContext(UserContext);
  const [token, setToken] = useState(sessionStorage.getItem("jwtToken"));

  useEffect(() => {
    const checkTokenValidity = () => {
      const storedToken = sessionStorage.getItem("jwtToken");

      if (!storedToken || isTokenExpired(storedToken)) {
        sessionStorage.removeItem("jwtToken");
        setUser(null);
        setToken(null);

        if (!sessionStorage.getItem("hasRedirected")) {
          sessionStorage.setItem("hasRedirected", "true");
          window.location.href = "/";
        }
      } else {
        sessionStorage.removeItem("hasRedirected");
        if (storedToken !== token) {
          setToken(storedToken);
        }
      }
    };

    checkTokenValidity();

    const interval = setInterval(checkTokenValidity, 60 * 1000); // 60 sec

    return () => clearInterval(interval);
  }, [token, setUser]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
