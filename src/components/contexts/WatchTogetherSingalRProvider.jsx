import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { UserContext } from "./UserProvider";

const WTSignalRContext = createContext();

export const WtSingalRProvider = ({ children }) => {
  const [connection, setConnection] = useState();
  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7124/watch", {
          accessTokenFactory: () => sessionStorage.getItem("jwtToken"),
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
