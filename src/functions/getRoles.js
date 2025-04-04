import axios from "axios";

const getRoles = async (userId) => {
  try {
    const response = await axios.get(`api/User/get-roles/${userId}`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }
};

export default getRoles;
