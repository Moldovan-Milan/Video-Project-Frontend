import { useEffect, useState, useContext } from "react";
import * as signalR from "@microsoft/signalr";
import { UserContext } from "../components/contexts/UserProvider";

const useWatchTogetherSignalR = () => {
  const [connection, setConnection] = useState(null);
  const user = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!user) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/watch`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ Watch together connection started");
        setConnection(newConnection);
      })
      .catch((err) =>
        console.error("❌ Error starting SignalR connection:", err)
      );

    // return () => {
    //   if (newConnection) {
    //     newConnection.off("JoinRoom");
    //     //newConnection.stop();
    //   }
    //};
  }, [user]);

  return connection;
};

export default useWatchTogetherSignalR;
