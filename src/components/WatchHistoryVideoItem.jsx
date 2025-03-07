import React from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import getViewText from "../functions/getViewText";
import "../styles/WatchHistoryVideoItem.scss";

const WatchHistoryVideoItem = ({ videoView }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { video } = videoView;

  return (
    <div className="watch-history-item">
      {/* Make the entire div clickable */}
      <Link to={`/video/${video.id}`} className="watch-history-link">
        {/* Thumbnail */}
        <div className="thumbnail">
          <img
            src={`${BASE_URL}/Video/thumbnail/${video.thumbnailId}`}
            alt={video.title}
          />
          <div className="video-duration">{video.duration}</div>
        </div>

        {/* Video Details */}
        <div className="video-details">
          <div className="title">{video.title.length > 50 ? video.title.substring(0, 50) + "..." : video.title}</div>
          <Link to={`/profile/${video.user.id}`} className="user-link" onClick={(e) => e.stopPropagation()}>
                {video.user.userName}
            </Link>
          <div className="meta-info">
            
            <FaEye className="eye-icon" /> {getViewText(video.views)} ● {timeAgo(new Date(video.created))}
          </div>
          <div className="description">
            {video.description.length > 50 ? video.description.substring(0, 50) + "..." : video.description}
          </div>
          <div className="last-watch">
            {`Last time you watched this video ${timeAgo(new Date(videoView.viewedAt))}`}
          </div>
        </div>
      </Link>

      {/* Uploader's name (this remains separate) */}

    </div>
  );
};

export default WatchHistoryVideoItem;
