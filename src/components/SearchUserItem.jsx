import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye, FaUserPlus } from "react-icons/fa";
import "../styles/SearchUserItem.scss";

const SearchUserItem = forwardRef(({ user }, ref) => {
  const {  id,
    userName,
    email,
    avatarId,
    followersCount,
    created} = user;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="searchUserItemContainer" title={userName} ref={ref}>
      <div className="searchUserItem">
        <Link to={`/profile/${id}`}>
          <table className="searchItemTable">
            <tbody>
              <tr>
                <td className="searchItemAvatarTd">
                  <div className="searchItemAvatarDiv">
                    <img src={`${BASE_URL}/api/User/avatar/${avatarId}`} className="SearchItemAvatarImg"></img>
                  </div>
                </td>
                <td className="searchUserItemDetails">
                  <div className="searchItemTitle">
                    {userName}
                  </div>
                  <div className="searchItemFollowers">
                  <div className="subscribersLabel">
                  <p>Subscribers: {followersCount}</p>
                  </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Link>
      </div>
    </div>
  );
});

export default SearchUserItem;