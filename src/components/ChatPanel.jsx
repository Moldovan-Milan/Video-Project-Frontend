import React, { useRef } from "react";
import "../styles/ChatPanel.scss";

const ChatPanel = ({ messages, onMessageSend }) => {
  const newMessageRef = useRef();
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  const handleSendMessage = () => {
    const content = newMessageRef.current.value;
    if (!content) {
      alert("You can not send empty message");
      return;
    }
    onMessageSend(content);
    newMessageRef.current.value = "";
  };

  return (
    <div className="w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="messages-container">Messages</h3>
      <div className="messages-box">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="message-bubble flex">
              <img
                src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${msg.sender.avatar.path}.${msg.sender.avatar.extension}`}
                alt={msg.sender.userName}
                className="sender-avatar"
              />
              <div className="flex flex-col">
                <span className="sender-name">{msg.sender.userName}</span>
                <p className="message-text">{msg.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-messages">No messages yet</p>
        )}
      </div>

      <div className="new-message-container">
        <input
          ref={newMessageRef}
          type="text"
          className="new-message-input"
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
