import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../components/contexts/WebSocketProvider";
import timeAgo from "../functions/timeAgo";

const MessagePage = () => {
  const { id } = useParams();
  const { socket, messages, setMessages } = useWebSocket();

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
  }, []); // Csak akkor fusson le, ha a socket már létezik

  //   useEffect(() => {
  //     console.log("Üzenetek frissültek:", messages);
  //   }, [messages]); // Minden alkalommal kiírja az új üzeneteket

  return (
    <div>
      <h1>Üzenetek</h1>
      {messages.length === 0 ? (
        <p>Nincsenek üzenetek</p>
      ) : (
        <ul>
          {messages.map((msgObj) =>
            msgObj.map((msg, idx) => (
              <li key={idx}>
                {msg.Content} |<br /> Elküldve: {timeAgo(new Date(msg.SentAt))}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default MessagePage;
