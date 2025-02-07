import axios from "axios";

const logOutUser = async (setToken) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const formData = new FormData();
  formData.append("refreshToken", refreshToken);
  try {
    await axios.post("api/user/logout", formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    sessionStorage.removeItem("jwtToken"); // Token törlése a localStorage-ból
    localStorage.removeItem("refreshToken"); // Már nem kell többet
    setToken(null);
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export default logOutUser;
