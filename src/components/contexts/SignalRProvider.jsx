import React, { createContext, useEffect, useState, useContext } from "react";
import * as signalR from "@microsoft/signalr";
import { UserContext } from "./UserProvider";
import { tryLoginUser } from "../../functions/tryLoginUser";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const connectToServer = async () => {
    if (
      connection &&
      connection.state == signalR.HubConnectionState.Connected
    ) {
      return;
    }
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/chatHub`, {})
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newConnection.on("ReceiveChatHistory", (history) => {
      setMessages(history);
    });

    try {
      await newConnection.start();
      setConnection(newConnection);
    } catch (err) {
      //console.error("Error while starting the SignalR connection", err);
      if (user && user.rememberMe) {
        await tryLoginUser(setUser, connectToServer, connection);
      }
    }
  };

  const requestHistory = async (chatId) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      return;
    }
    connection.invoke("RequestChatHistory", chatId).catch((err) => {
      console.error("Error requesting chat history", err);
    });
  };

  const sendMessage = async (chatId, content) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("Cannot send message: SignalR is not connected.");
      return;
    }
    connection
      .invoke("SendMessage", chatId, content)
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user) {
      connectToServer();
    } else if (connection) {
      connection.stop();
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [user]);

  return (
    <SignalRContext.Provider
      value={{
        connection,
        messages,
        setMessages,
        requestHistory,
        sendMessage,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
