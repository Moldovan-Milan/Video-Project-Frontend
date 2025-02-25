import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userContext");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user == null) {
      localStorage.removeItem("userContext");
    } else {
      localStorage.setItem("userContext", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
