import React, { createContext, useEffect, useState, useContext } from "react";
import * as signalR from "@microsoft/signalr";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const token = sessionStorage.getItem("jwtToken");

  const connectToServer = async () => {
    // if (connection) {
    //   console.warn("⚠️ SignalR connection already exists.");
    //   return;
    // }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7124/chatHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (message) => {
      //console.log("📩 New message: ", JSON.parse(message));
      setMessages((prevMessages) => [...prevMessages, JSON.parse(message)]);
    });

    newConnection.on("ReceiveChatHistory", (history) => {
      //console.log("📜 Received history: ", history);
      setMessages(history);
    });

    try {
      await newConnection.start();
      setConnection(newConnection);
    } catch (err) {
      console.error("❌ Error while starting the SignalR connection", err);
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
      console.error("❌ Error requesting chat history", err);
    });
  };

  const sendMessage = async (chatId, content) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("⚠️ Cannot send message: SignalR is not connected.");
      return;
    }
    connection
      .invoke("SendMessage", chatId, content)
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (token) {
      connectToServer();
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [token]);

  return (
    <SignalRContext.Provider
      value={{
        connection,
        messages,
        setMessages,
        connectToServer,
        requestHistory,
        sendMessage,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  return useContext(SignalRContext);
};
