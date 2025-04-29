import React from "react";
import { Link } from "react-router-dom";
import "../styles/FollowedChannelItem.scss";

const FollowedChannelItem = ({ user }) => {
  const { id, userName, avatar } = user;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  return (
    <div title={userName}>
      <div className="followedUserItem">
        <Link to={`/profile/${id}`}>
          <div>
            <img
              src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${avatar.path}.${avatar.extension}`}
              className="channelAvatar"
            ></img>
          </div>
          <div className="p-4">
            <div className="followedChannelName">{userName}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FollowedChannelItem;
