import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/RecVideoItem.scss";
import getViewText from "../functions/getViewText";

const RecVideoItem = forwardRef(({ video }, ref) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div ref={ref} className="recVideoItemContainer" title={title}>
      <div className="recVideoItem">
        <Link to={`/video/${id}`}>
          <table className="recItemTable">
            <tbody>
              <tr>
                <td className="recItemThumbnail">
                  <div
                    style={{
                      backgroundImage: `url("${BASE_URL}/api/Video/thumbnail/${thumbnailId}")`,
                    }}
                    className="recItemThumbnailDiv"
                  >
                    <div className="video-duration">{duration}</div>
                  </div>
                </td>
                <td className="recItemDetails">
                  <div className="recItemTitle">
                    {title.length > 30 ? title.substring(0, 30) + "..." : title}
                  </div>
                  <div className="recItemUploader">{user.userName}</div>
                  <div className="recItemViews">
                    <FaEye className="recEye" /> {getViewText(video.views)} ● Created:{" "}
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

export default RecVideoItem;
