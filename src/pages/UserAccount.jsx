import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/UserAccount.scss";
import UserAccountHeader from "../components/UserAccountHeader";
import UserAccountDetailsPanel from "../components/UserAccountDetailsPanel";
import UserAccountVideosPanel from "../components/UserAccountVideosPanel";
import { UserContext } from "../components/contexts/UserProvider";
import UserEditComponent from "../components/UserEditComponent";

const UserAccount = () => {
  //TODO: Ha be vagyunk jelentkezve, és a SingleVideo-nál rányomunk a saját csatornánkra, ne az OtherUsersProfile-ra dobjon, hanem irányítson át ide
  const { id } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [userVideos,setUserVideos]=useState([]);
  const pageSize = 30;
  const {user} = useContext(UserContext)

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    followers: 0,
    created: "",
  });



  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const { data } = await axios.get(`/api/user/profile?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            withCredentials: true
          });

          const formattedDate = new Date(data.created).toLocaleDateString(
            "hu-HU",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          );
          setUserData({
            username: data.userName,
            email: data.email,
            avatar: `${BASE_URL}/api/User/avatar/${data.avatarId}`,
            followers: data.followersCount,
            created: formattedDate,
          });
          setUserVideos(data.videos)
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) {
      document.title = `Page for ${userData.username} | Omega Stream`;
    }
  }, [userData]);

  return (  
    <UserEditComponent userData={userData} userVideos={userVideos}/>
  );
};

export default UserAccount;
