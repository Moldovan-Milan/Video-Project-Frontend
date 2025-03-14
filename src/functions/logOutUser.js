import axios from "axios";

const logOutUser = async (setUser, navigate, connection) => {
  try {
    await axios.post("api/user/logout", {
      withCredentials: true
    });
    setUser(null);
    connection.stop();
    //socket.close();

    navigate("/");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export default logOutUser;
