import React from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "./UserPageVideoItem.scss";

const UserPageVideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId, user } = video;

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" title={title}>
      <div className="user-video-item">
        <Link to={`/video/${id}`}>
          <div
            style={{
              backgroundImage: `url("https://localhost:7124/api/Video/thumbnail/${thumbnailId}")`,
            }}
            className="thumbnail-div"
          >
            <div className="video-duration">{duration}</div>
          </div>
          <div className="p-4 video-details">
            <div className="video-title font-bold">{title.length > 11 ? title.substring(0, 11) + "..." : title}</div>
            <div className="text-xs views">
              <FaEye className="eye-icon" />
              10 views ● Created: {timeAgo(new Date(created))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserPageVideoItem;
