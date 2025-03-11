import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/contexts/UserProvider";
import ChatUserItem from "../components/ChatUserItem";

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
    document.title = "Private Messages | Omega Stream"
  }, []);

  return (
    <div>
        {chats &&
          chats.map((chat, id) => (
            <ChatUserItem key={id} chat={chat}></ChatUserItem>
          ))}
    </div>
  );
};

export default ChatPage;
