import axios from "axios";

export const tryLoginUser = async (setUser, connectToServer) => {
  try {
    const response = await axios.post("/api/user/refresh-jwt-token", {}, { withCredentials: true });

    if (response.status === 200) {
      const { userDto } = response.data;
      const roles = await axios.get("api/user/get-roles", {withCredentials: true});
      setUser({
        id: userDto.id,
        email: userDto.email,
        userName: userDto.userName,
        followers: userDto.followers,
        avatarId: userDto.avatarId,
        created: userDto.created,
        roles: roles.data
      });
      connectToServer();
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
