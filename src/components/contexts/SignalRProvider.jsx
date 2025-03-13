import React, { createContext, useEffect, useState, useContext } from "react";
import {
  createSignalRConnectionWithToken,
  setupSignalREventHandlers,
  invokeSignalRMethod,
  startSignalRConnection,
  stopSignalRConnection,
} from "../../utils/signalRUtils";
import { UserContext } from "./UserProvider";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const token = sessionStorage.getItem("jwtToken");
  const user = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (token) {
      const newConnection = createSignalRConnectionWithToken(
        BASE_URL,
        "chathub",
        token
      );

      setupSignalREventHandlers(newConnection, {
        ReceiveMessage: (message) =>
          setMessages((prev) => [...prev, JSON.parse(message)]),
        ReceiveChatHistory: setMessages,
      });

      startSignalRConnection(newConnection, setConnection);

      return () =>
        stopSignalRConnection(newConnection, [
          "ReceiveMessage",
          "ReceiveChatHistory",
        ]);
    }
  }, [user, token]);

  return (
    <SignalRContext.Provider
      value={{
        connection,
        messages,
        setMessages,
        requestHistory: (chatId) =>
          invokeSignalRMethod(connection, "RequestChatHistory", chatId),
        sendMessage: (chatId, content) =>
          invokeSignalRMethod(connection, "SendMessage", chatId, content),
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
