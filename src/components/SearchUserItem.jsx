import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/SearchVideoItem.scss";

const SearchUserItem = forwardRef(({ user }, ref) => {
  const {  id,
    userName,
    email,
    avatarId,
    followersCount,
    created} = user;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="searchVideoItemContainer" title={userName} ref={ref}>
      <div className="searchVideoItem">
        <Link to={`/profile/${id}`}>
          <table className="searchItemTable">
            <tbody>
              <tr>
                <td className="searchItemThumbnail">
                  <div
                    style={{
                      backgroundImage: `url("${BASE_URL}/api/User/avatar/${avatarId}")`,
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
});

export default SearchUserItem;