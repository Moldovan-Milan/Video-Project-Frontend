import axios from "axios";

export const tryLoginUser = async (setUser, connectToServer, connection) => {
  try {
    const response = await axios.gemt("/api/user/refresh-jwt-token", {
      withCredentials: true,
    });

    if (response.status === 200) {
      const { user } = response.data;
      setUser({
        id: user.id,
        email: user.email,
        userName: user.userName,
        followers: user.followers,
        avatarId: user.avatarId,
        created: user.created,
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
