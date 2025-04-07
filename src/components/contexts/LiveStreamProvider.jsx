import React, { createContext, useEffect, useState } from "react";
import {
  createSignalRConnection,
  startSignalRConnection,
  stopSignalRConnection,
} from "../../utils/signalRUtils";

export const LiveStreamContext = createContext(null);

export const LiveStreamProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = createSignalRConnection(BASE_URL, "live");
    startSignalRConnection(newConnection, setConnection);

    return () => {
      stopSignalRConnection(newConnection);
    };
  }, []);

  return (
    <LiveStreamContext.Provider value={{ connection, setConnection }}>
      {children}
    </LiveStreamContext.Provider>
  );
};
