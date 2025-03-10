import React from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/SearchVideoItem.scss";

const SearchUserItem = ({ user }) => {
  const {  id,
    userName,
    email,
    avatarId,
    followersCount,
    created} = user;

  return (
    <div className="searchVideoItemContainer" title={userName}>
      <div className="searchVideoItem">
        <Link to={`/profile/${id}`}>
          <table className="searchItemTable">
            <tbody>
              <tr>
                <td className="searchItemThumbnail">
                  <div
                    style={{
                      backgroundImage: `url("https://localhost:7124/api/User/avatar/${avatarId}")`,
                    }}
                    className="searchItemThumbnailDiv"
                  >
                  </div>
                </td>
                <td className="searchItemDetails">
                  <div className="searchItemTitle">
                    {userName}
                  </div>
                  <div className="searchItemViews">
                    {followersCount}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Link>
      </div>
    </div>
  );
};

export default SearchUserItem;