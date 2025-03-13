import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserProvider";
import {
  createSignalRConnectionWithToken,
  startSignalRConnection,
  stopSignalRConnection,
} from "../../utils/signalRUtils";

const WTSignalRContext = createContext();

export const WtSignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState();
  const user = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    if (token) {
      const newConnection = createSignalRConnectionWithToken(
        BASE_URL,
        "watch",
        token
      );

      startSignalRConnection(newConnection, setConnection);

      return () => stopSignalRConnection(newConnection, ["JoinRoom"]);
    }
  }, [user, token]);

  return (
    <WTSignalRContext.Provider value={connection}>
      {children}
    </WTSignalRContext.Provider>
  );
};

export const useWTSignalR = () => useContext(WTSignalRContext);
