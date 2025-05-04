import React from "react";
import axios from "axios";
import "../../styles/Admin/VerificationRequestButton.scss";

const VerificationRequestButton = ({ onRequestSent }) => {
  const handleClick = async () => {
    try {
      const response = await axios.post(
        "api/User/request-verification",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        window.alert("Successfully sent verification request!");
        onRequestSent();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button className="verification-button" onClick={handleClick}>
      Request to get Verified
    </button>
  );
};

export default VerificationRequestButton;
