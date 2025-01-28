import React, { createContext, useState } from "react";

<<<<<<< HEAD
const UserContext = createContext();
=======
const userContext = createContext();
>>>>>>> 17d53ae5269d819db41dd90c1cc1908aa8f121c3

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

<<<<<<< HEAD
export { UserContext, UserProvider };
=======
export { userContext, UserProvider };
>>>>>>> 17d53ae5269d819db41dd90c1cc1908aa8f121c3
