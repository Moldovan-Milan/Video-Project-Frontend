import React, { useRef } from "react";
import "../styles/ChatPanel.scss";

const ChatPanel = ({ messages, onMessageSend }) => {
  const newMessageRef = useRef();

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
            <div key={index} className="message-item">
              <img
                src={`https://localhost:7124/api/User/avatar/${msg.sender.avatarId}`}
                alt={msg.sender.userName}
                className="sender-avatar"
              />
              <div>
                <span className="sender-name">{msg.sender.userName}</span>
                <div className="message-bubble">{msg.content}</div>
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
