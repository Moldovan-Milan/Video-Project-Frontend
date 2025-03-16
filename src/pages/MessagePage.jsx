import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSignalR } from "../components/contexts/SignalRProvider";
import "../styles/MessagePage.scss";
import { UserContext } from "../components/contexts/UserProvider";
import MessageItem from "../components/MessageItem";

const MessagePage = () => {
  const { id } = useParams();
  const [safeId] = useState(id);
  const { connection, messages, setMessages, requestHistory, sendMessage } =
    useSignalR();
  const { user } = useContext(UserContext);

  const newMessageRef = useRef("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!connection || connection.state !== "Connected") return;

    console.log(`📥 Requesting chat history for chat ID: ${safeId}`);
    setMessages([]);
    requestHistory(Number(safeId));
  }, [safeId, connection]);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  useEffect(() => {
    const name = queryParams.get('name');
    document.title = `Private chat with ${name} | Omega Stream`
  }, [])

  const handleSendMessage = () => {
    const content = newMessageRef.current.value.trim();
    if (!content) {
      setError("⚠️ Message cannot be empty!");
      return;
    }
    setError(null);
    sendMessage(Number(safeId), content);
    newMessageRef.current.value = "";
  };

  return (
    <div>
      <h1>Messages</h1>
      {messages.length === 0 ? (
        <p>📭 No messages yet</p>
      ) : (
        <div className="msg-container">
          {messages.map((msg) => (
            <MessageItem msg={msg} user={user} key={msg.id}></MessageItem>
          ))}
        </div>
      )}
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Write a message..."
          className="message-input"
          ref={newMessageRef}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
