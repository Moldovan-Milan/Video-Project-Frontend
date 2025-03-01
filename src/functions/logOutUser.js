import axios from "axios";

const logOutUser = async (setUser, navigate, connection) => {
  try {
    await axios.post("api/user/logout", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    sessionStorage.removeItem("jwtToken"); // Token törlése a localStorage-ból
    localStorage.removeItem("refreshToken"); // Már nem kell többet
    //setToken(null);
    setUser(null);
    connection.stop();
    //socket.close();

    navigate("/");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export default logOutUser;
