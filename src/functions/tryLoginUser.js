import axios from "axios";

const tryLoginUser = async () => {
  console.log("Try login user");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }
  const formData = new FormData();
  formData.append("refreshToken", refreshToken);
  const response = await axios.post("/api/user/refresh-jwt-token", formData);
  // Helytelen a token, ezért kitöröljük
  if (response.status === 403) {
    localStorage.removeItem("refreshToken");
  } else if (response.status === 200) {
    const data = response.data;
    const newToken = data;
    sessionStorage.setItem("jwtToken", newToken);
    return newToken;
  }
  return null;
};

export default tryLoginUser;
