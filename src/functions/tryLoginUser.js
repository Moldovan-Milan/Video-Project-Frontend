import axios from "axios";
import isTokenExpired from "./isTokenExpired";
import { useContext } from "react";
import { UserContext } from "../components/contexts/UserProvider";

const tryLoginUser = async () => {
  //console.log("Try login user");
  //const { user, setUser } = useContext(UserContext);

  const refreshToken = localStorage.getItem("refreshToken");
  const token = sessionStorage.getItem("jwtToken");

  // Ha a token érvényes, nincs teendő
  if (token && !isTokenExpired(token)) {
    //await setUserData(token, setUser);
    return token;
  }

  // Ha nincs refresh token, nincs teendő
  if (!refreshToken) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("refreshToken", refreshToken);

    const response = await axios.post("/api/user/refresh-jwt-token", formData);

    if (response.status === 200) {
      const newToken = response.data;
      sessionStorage.setItem("jwtToken", newToken);
      //await setUserData(newToken, setUser);
      return newToken;
    } else {
      localStorage.removeItem("refreshToken");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("refreshToken");
    return null;
  }
};

const setUserData = async (token, setUser) => {
  try {
    const { data } = await axios.get("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser({
      userName: data.userName,
      email: data.email,
      avatarId: data.avatarId,
      followers: data.followers || 0,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export default tryLoginUser;
