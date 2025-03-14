import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { UserContext } from "./UserProvider";

const WTSignalRContext = createContext();

export const WtSingalRProvider = ({ children }) => {
  const [connection, setConnection] = useState();
  const user = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (user) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/watch`, {

        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      newConnection
        .start()
        .then(() => {
          console.log("✅ Watch together connection started");
        })
        .catch((err) => console.log(`❌ An error happend ${err}`));
      setConnection(newConnection);

      return () => {
        if (newConnection) {
          newConnection.off("JoinRoom");
          newConnection.stop();
        }
      };
    }
  }, [user]);

  return (
    <WTSignalRContext.Provider value={connection}>
      {children}
    </WTSignalRContext.Provider>
  );
};

export const useWTSignalR = () => {
  return useContext(WTSignalRContext);
};
