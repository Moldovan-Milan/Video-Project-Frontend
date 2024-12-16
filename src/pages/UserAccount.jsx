import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import avatarimg from "../assets/defa_pfp.png";
import ImageEditor from "../components/ImageEditor";

const UserAccount = () => {
  //TODO: Legyen más a profil, ha vendégként nézzük, bejelentkezett felhasználóként nézzük, vagy a saját profilunkat nézzük
  const { id } = useParams();

  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const fetchUser = async (id) => {
      let token = localStorage.getItem("jwtToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub);
        setToken(token);

        const userId = decodedToken.id;
        console.log(userId);

        const response = await axios.get(
          `api/user/profile/${userId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let user = response.data;
        setUser(user);

        console.log(user);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <h1>{username}</h1>
      <ImageEditor img={avatarimg}></ImageEditor>
    </>
  );
};

export default UserAccount;
