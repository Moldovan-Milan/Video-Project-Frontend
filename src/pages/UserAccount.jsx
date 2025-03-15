import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ImageEditor from "../components/ImageEditor";
import InputAndLabel from "../components/InputAndLabel";
import { UserContext } from "../components/contexts/UserProvider";

const UserAccount = () => {
  //TODO: Legyen más a profil, ha vendégként nézzük, bejelentkezett felhasználóként nézzük, vagy a saját profilunkat nézzük
  const { id } = useParams();
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
          const { data } = await axios.get(`/api/user/profile`, {
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
    <div className="container">
      <h1>{userData.username}</h1>
      <InputAndLabel
        name={"Email cím: "}
        inputId={"email"}
        type="email"
        value={userData.email}
        isReadOnly={true}
      />
      <InputAndLabel
        name={"Követőid száma: "}
        inputId={"followers"}
        type="number"
        value={userData.followers}
        isReadOnly={true}
      />
      <InputAndLabel
        name={"Fiók létrehozva: "}
        inputId={"created"}
        value={userData.created}
        isReadOnly={true}
      />
      <div className="form-group">
        <label htmlFor="avatar">Profilkép:</label>
        <ImageEditor img={userData.avatar} />
      </div>
    </div>
  );
};

export default UserAccount;
