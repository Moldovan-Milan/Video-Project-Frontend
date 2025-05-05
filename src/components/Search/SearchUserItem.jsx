import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../../functions/timeAgo";
import { FaEye, FaUserPlus } from "react-icons/fa";
import "../../styles/Search/SearchUserItem.scss";

const SearchUserItem = forwardRef(({ user }, ref) => {
  const { id, userName, email, avatarId, avatar, followersCount, created } =
    user;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  return (
    <div className="searchUserItemContainer" title={userName} ref={ref}>
      <div className="searchUserItem">
        <Link to={`/profile/${id}`}>
          <div className="searchItemGrid">
            <div className="avatarColumn">
              <img
                src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${avatar.path}.${avatar.extension}`}
                className="searchItemAvatarImg"
                alt={userName}
              />
            </div>
            <div className="infoColumn">
              <div className="SearchUserName">{userName}</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
});

export default SearchUserItem;
