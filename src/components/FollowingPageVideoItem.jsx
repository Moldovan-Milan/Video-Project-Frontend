import React from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/FollowingPageVideoItem.scss";
import getViewText from "../functions/getViewText";
import formatDuration from "../functions/formatDuration";

const FollowingPageVideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div className="followedVideoItemContainer" title={title}>
      <div className="followedVideoItem">
        <Link to={`/video/${id}`}>
          <table className="followedVideoItemTable">
            <tbody>
              <tr>
                <td className="followedVideoItemThumbnail">
                  <div
                    style={{
                      backgroundImage: `url("${BASE_URL}/api/Video/thumbnail/${thumbnailId}")`,
                    }}
                    className="followedVideoItemThumbnailDiv"
                  >
                    <div className="video-duration">{formatDuration(duration)}</div>
                  </div>
                </td>
                <td className="followedVideoItemDetails">
                  <div className="followedVideoItemTitle">
                    {title.length > 30 ? title.substring(0, 30) + "..." : title}
                  </div>
                  <div className="followedVideoItemUploader">{user.userName}</div>
                  <div className="followedVideoItemViews">
                    <FaEye className="followedVideoEye" /> {getViewText(video.views)} ● {timeAgo(new Date(created))}
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

export default FollowingPageVideoItem;
