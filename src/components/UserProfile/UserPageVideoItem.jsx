import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../../styles/UserProfile/UserPageVideoItem.scss";
import getViewText from "../../functions/getViewText";
import formatDuration from "../../functions/formatDuration";

const UserPageVideoItem = forwardRef(({ video, color }, ref) => {
  const { id, title, duration, created, thumbnailId, user, views } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;
  return (
    <div
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
      title={title}
      ref={ref}
    >
      <div
        className={`user-video-item ${color ? "hover-shadow" : ""}`}
        style={{ "--hover-color": color || "none" }}
      >
        <Link to={`/video/${id}`}>
          <div
            style={{
              backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,
            }}
            className="thumbnail-div"
          >
            <div className="video-duration">{formatDuration(duration)}</div>
          </div>
          <div className="p-4 UVidItemDetails">
<<<<<<< Updated upstream:src/components/UserPageVideoItem.jsx
            <div className="VidItemTitle font-bold" style={
                    color
                      ? {
                          color: color,
                        }
                      : null
                  }>
=======
            <div
              className="VidItemTitle font-bold"
              style={
                color
                  ? {
                      color: color,
                    }
                  : null
              }
            >
>>>>>>> Stashed changes:src/components/UserProfile/UserPageVideoItem.jsx
              {title.length > 11 ? title.substring(0, 11) + "..." : title}
            </div>
            <div className="text-xs VidItemViews">
              <FaEye className="eye-icon m-1" />
              {getViewText(views)} ● Created: {timeAgo(new Date(created))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
});

export default UserPageVideoItem;
