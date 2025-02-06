import React from "react";
import { useParams } from "react-router-dom";

const OtherUsersProfile = () => {
  const { id } = useParams();
  return <div>OtherUsersProfile {id}</div>;
};

export default OtherUsersProfile;
