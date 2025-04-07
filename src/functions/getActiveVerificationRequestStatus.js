import axios from "axios";

const getActiveVerificationRequestStatus = async (userId) => {
  try {
    const response = await axios.get(
      `api/User/${userId}/verification-request/active`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error checking verification request:", error);
    return false;
  }
};

export default getActiveVerificationRequestStatus;
