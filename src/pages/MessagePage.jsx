import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../components/contexts/WebSocketProvider";
import timeAgo from "../functions/timeAgo";
import "./MessagePage.scss";
import { UserContext } from "../components/contexts/UserProvider";

const MessagePage = () => {
  const { id } = useParams();
  const { socket, messages, setMessages } = useWebSocket();
  const { user } = useContext(UserContext);

  const newMessageRef = useRef("");
  const [error, setError] = useState(null);

  // URL query paraméter a névhez (talán használjuk majd?)
  const searchParams = new URLSearchParams(location.search);
  const senderName = searchParams.get("name");

  useEffect(() => {
    if (socket) {
      setMessages([]);
      socket.send(
        JSON.stringify({
          type: "get_history",
          chatId: id,
        })
      );
    }
  }, [socket, id, setMessages]);

  // useEffect(() => {
  //   console.log("Üzenetek frissültek:", messages);
  // }, [messages]);

  const handleSendMessage = () => {
    const content = newMessageRef.current.value;
    if (!content) {
      setError("Message can not be empty!");
      return;
    }

    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "message",
            senderId: user.id,
            chatId: id,
            content: content,
          })
        );
        setError(null);
        newMessageRef.current.value = "";
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      {messages.length === 0 ? (
        <p>There are no Messages</p>
      ) : (
        <ul className="message-list">
          {messages.map((msg) => (
            <li
              key={msg.Id}
              className={
                msg.SenderId === user.id ? "message sent" : "message received"
              }
            >
              <div className="message-content">{msg.Content}</div>
              <div className="message-info">
                Sent {timeAgo(new Date(msg.SentAt))}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Write message..."
          className="message-input"
          ref={newMessageRef}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
      {error && <span className="text-red-700">{error}</span>}
    </div>
  );
};

export default MessagePage;
