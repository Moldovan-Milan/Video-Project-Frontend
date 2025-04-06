import axios from "axios";

export const tryLoginUser = async (setUser, connectToServer, connection) => {
  try {
    const response = await axios.get("/api/user/refresh-jwt-token", {
      withCredentials: true,
    });

    if (response.status === 200) {
      const { user } = response.data;
      setUser({
        id: userDto.id,
        email: userDto.email,
        userName: userDto.userName,
        followers: userDto.followers,
        avatarId: userDto.avatarId,
        created: userDto.created,
      });
      if (!connection) {
        connectToServer();
      }
      return user;
    } else if (response.status === 401 || response.status === 400) {
      setUser(null);
      console.log("Remove user context");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    setUser(null);
    return null;
  }
};
