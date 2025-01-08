import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ImageEditor from "../components/ImageEditor";
import InputAndLabel from "../components/InputAndLabel";

const UserAccount = () => {
  //TODO: Legyen más a profil, ha vendégként nézzük, bejelentkezett felhasználóként nézzük, vagy a saját profilunkat nézzük
  const { id } = useParams();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    followers: 0,
    created: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const userId = jwtDecode(token).id;

        try {
          const { data } = await axios.get(`/api/user/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const formattedDate = new Date(data.created).toLocaleDateString(
            "hu-HU",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          );
          setUserData({
            username: data.userName,
            email: data.email,
            avatar: `https://localhost:7124/api/User/avatar/${data.avatarId}`,
            followers: data.followers,
            created: formattedDate,
          });
          console.log(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="container">
      <h1>{userData.username}</h1>
      <form>
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
      </form>
    </div>
  );
};

export default UserAccount;
