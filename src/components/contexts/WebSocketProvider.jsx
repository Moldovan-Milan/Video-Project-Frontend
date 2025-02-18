import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const connectToServer = () => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      return;
    }

    const ws = new WebSocket("wss://localhost:7124/ws");

    ws.addEventListener("open", () => {
      console.log("Websocket nyitva");
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "connect",
          content: token,
        })
      );
    });

    ws.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Fogadott üzenet:", message);

        if (message.Type === "debug") {
          console.log(message);
        } else if (message.Type === "message") {
          const parsedMessage = JSON.parse(message.Content);
          setMessages((prev) => [...prev, parsedMessage]);
        } else if (message.Type === "history") {
          const parsedHistory = JSON.parse(message.Content);
          setMessages(parsedHistory);
        }
      } catch {
        console.log(event.data);
      }
    });

    ws.addEventListener("close", () => {
      console.log("Websocket zárva");
    });
  };

  useEffect(() => {
    connectToServer();
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ socket, messages, setMessages, connectToServer }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
