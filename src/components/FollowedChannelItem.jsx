import React from "react";
import { Link } from "react-router-dom";
import "../styles/FollowedChannelItem.scss";

const FollowedChannelItem = ({ user }) => {
  const {  id,
    userName,
    email,
    avatarId,
    followersCount,
    created} = user;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div title={userName}>
    <div className="followedUserItem">
      <Link to={`/profile/${id}`}>
        <div>
        <img src={`${BASE_URL}/api/User/avatar/${avatarId}`} className="channelAvatar"></img>
        
        </div>
        <div className="p-4">
          <div className="followedChannelName">
            {userName}
          </div>
        </div>
      </Link>
    </div>
  </div>
  );
};

export default FollowedChannelItem;