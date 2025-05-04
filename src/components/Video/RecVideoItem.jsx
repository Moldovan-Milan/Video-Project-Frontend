import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../../styles/Video/RecVideoItem.scss";
import getViewText from "../../functions/getViewText";
import formatDuration from "../../functions/formatDuration";

const RecVideoItem = forwardRef(({ video }, ref) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

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
                      backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,
                    }}
                    className="recItemThumbnailDiv"
                  >
                    <div className="video-duration">
                      {formatDuration(duration)}
                    </div>
                  </div>
                </td>
                <td className="recItemDetails">
                  <div className="recItemTitle">
                    {title.length > 30 ? title.substring(0, 30) + "..." : title}
                  </div>
                  <div className="recItemUploader" title={user.userName}>
                    <Link to={`/profile/${user.id}`}>{user.userName}</Link>
                  </div>
                  <div className="recItemViews">
                    <FaEye className="recEye" /> {getViewText(video.views)} ●
                    Created: {timeAgo(new Date(created))}
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
