import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/UserPageVideoItem.scss";
import getViewText from "../functions/getViewText";
import formatDuration from "../functions/formatDuration";

const UserPageVideoItem = forwardRef(({ video,color }, ref) => {
  const { id, title, duration, created, thumbnailId, user, views } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" title={title} ref={ref}>
      <div className={`user-video-item ${color ? "hover-shadow" : ""}`} style={{"--hover-color": color || "none",}} >
        <Link to={`/video/${id}`}>
          <div
            style={{
              backgroundImage: `url("${BASE_URL}/api/Video/thumbnail/${thumbnailId}")`,
            }}
            className="thumbnail-div"
          >
            <div className="video-duration">{formatDuration(duration)}</div>
          </div>
          <div className="p-4 video-details">
            <div className="video-title font-bold" style={
                    color
                      ? {
                          color: color,
                        }
                      : null
                  }>
              {title.length > 11 ? title.substring(0, 11) + "..." : title}
            </div>
            <div className="text-xs views">
              <FaEye className="eye-icon" />
              {getViewText(views)} ● Created: {timeAgo(new Date(created))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
});

export default UserPageVideoItem;
