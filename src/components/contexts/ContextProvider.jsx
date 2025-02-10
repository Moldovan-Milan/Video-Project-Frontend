import React from "react";
import { UserProvider } from "./UserProvider";

const ContextProvider = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default ContextProvider;
