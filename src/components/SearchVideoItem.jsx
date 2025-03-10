import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/SearchVideoItem.scss";

const SearchVideoItem = forwardRef(({ video }, ref) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="searchVideoItemContainer" title={title} ref={ref}>
      <div className="searchVideoItem">
        <Link to={`/video/${id}`}>
          <table className="searchItemTable">
            <tbody>
              <tr>
                <td className="searchItemThumbnail">
                  <div
                    style={{
                      backgroundImage: `url("${BASE_URL}/api/Video/thumbnail/${thumbnailId}")`,
                    }}
                    className="searchItemThumbnailDiv"
                  >
                    <div className="video-duration">{duration}</div>
                  </div>
                </td>
                <td className="searchItemDetails">
                  <div className="searchItemTitle">
                    {title.length > 30 ? title.substring(0, 30) + "..." : title}
                  </div>
                  <div className="searchItemUploader">{user.userName}</div>
                  <div className="searchItemViews">
                    <FaEye className="searchEye" /> 10 views ● Created:{" "}
                    {timeAgo(new Date(created))}
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

export default SearchVideoItem;
