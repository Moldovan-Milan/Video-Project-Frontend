import React from "react";
import { UserProvider } from "./UserProvider";

const ContextProvider = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

const ThemeProvider = ({children}) =>{
  return <ThemeProvider>{children}</ThemeProvider>
}

export default ContextProvider;
