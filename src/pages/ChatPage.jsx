import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ChatPage = () => {
  const [chats, setChats] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const { data } = await axios.get("/api/chat/user-chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChats();
  }, []);

  return (
    <div>
      <ul>
        {chats &&
          chats.map((chat, id) => (
            <li key={id}>
              <Link to={`/chat/${chat.id}`}>{chat.id}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChatPage;
