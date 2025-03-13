import axios from "axios";
import isTokenExpired from "../utils/isTokenExpired";

export const tryLoginUser = async (setUser, connectToServer) => {
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
      const { newToken, userDto } = response.data;
      sessionStorage.setItem("jwtToken", newToken);
      setUser({
        id: userDto.id,
        email: userDto.email,
        userName: userDto.userName,
        followers: userDto.followers,
        avatarId: userDto.avatarId,
        created: userDto.created,
      });
      connectToServer();
    } else {
      localStorage.removeItem("refreshToken");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("refreshToken");
    return null;
  }
};
