import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/contexts/UserProvider";

const ChatPage = () => {
  const [chats, setChats] = useState(null);
  const { user, setUser } = useContext(UserContext);

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
        //console.log("Beszélgetések: " + chats);
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
              {console.log(chat)}
              <Link to={`/chat/${chat.id}?name=${chat.user.userName}`}>
                {chat.user.userName}
              </Link>
              <img
                src={`https://localhost:7124/api/User/avatar/${chat.user.avatarId}`}
              ></img>
              <p>{chat.lastMessage}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChatPage;
