import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/UserAccount.scss";
import { UserContext } from "../components/contexts/UserProvider";
import UserEditComponent from "../components/UserEditComponent";

const UserAccount = () => {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  const [pageNumber, setPageNumber] = useState(1);
  const [userVideos, setUserVideos] = useState([]);
  const pageSize = 30;
  const { user } = useContext(UserContext);

  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
    avatar: "",
    followers: 0,
    created: "",
    userTheme: {},
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const { data } = await axios.get(
            `/api/user/profile?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            {
              withCredentials: true,
            }
          );

          const formattedDate = new Date(data.created).toLocaleDateString(
            "hu-HU",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          );
          setUserData({
            id: data.id,
            username: data.userName,
            email: data.email,
            avatar: `${CLOUDFLARE_PATH}/${AVATAR_PATH}/${data.avatar.path}.${data.avatar.extension}`,
            followers: data.followersCount,
            created: formattedDate,
            userTheme: data.userTheme,
          });
          setUserVideos(data.videos);
          console.log(userData);
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

  return <UserEditComponent userData={userData} userVideos={userVideos} />;
};

export default UserAccount;
