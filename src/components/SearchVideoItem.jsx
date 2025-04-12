import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/SearchVideoItem.scss";
import getViewText from "../functions/getViewText";
import formatDuration from "../functions/formatDuration";

const SearchVideoItem = forwardRef(({ video }, ref) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

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
                      backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,
                    }}
                    className="searchItemThumbnailDiv"
                  >
                    <div className="video-duration">{formatDuration(duration)}</div>
                  </div>
                </td>
                <td className="searchItemDetails">
                  <div className="searchItemTitle">
                    {title.length > 30 ? title.substring(0, 30) + "..." : title}
                  </div>
                  <div className="searchItemUploader">{user.userName}</div>
                  <div className="searchItemViews">
                    <FaEye className="searchEye" /> {getViewText(video.views)} ● {timeAgo(new Date(video.created))}
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
