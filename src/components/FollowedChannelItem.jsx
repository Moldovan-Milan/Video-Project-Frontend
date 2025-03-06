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

  return (
    <div title={userName}>
    <div className="followedUserItem">
      <Link to={`/profile/${id}`}>
        <div>
        <img src={`https://localhost:7124/api/User/avatar/${avatarId}`} className="channelAvatar"></img>
        
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