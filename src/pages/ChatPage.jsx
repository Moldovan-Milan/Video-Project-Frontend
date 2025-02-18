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
        console.log("Beszélgetések: " + chats);
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
              <Link
                to={`/chat/${chat.id}?name=${
                  user.id === chat.user1.id
                    ? chat.user2.userName
                    : chat.user1.username
                }`}
              >
                {user.id === chat.user1.id
                  ? chat.user2.userName
                  : chat.user1.userName}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChatPage;
