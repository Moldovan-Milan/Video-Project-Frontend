import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("userContext");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user == null) {
      sessionStorage.removeItem("userContext");
    } else {
      sessionStorage.setItem("userContext", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
