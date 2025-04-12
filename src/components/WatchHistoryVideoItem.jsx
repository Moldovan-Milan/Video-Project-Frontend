import React from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import getViewText from "../functions/getViewText";
import "../styles/WatchHistoryVideoItem.scss";

const WatchHistoryVideoItem = ({ videoView }) => {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;
  const { video } = videoView;

  return (
    <div className="watch-history-item">
      <Link to={`/video/${video.id}`} className="watch-history-link">
        <div className="thumbnail">
          <img
            src={`${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}`}
            alt={video.title}
          />
          <div className="video-duration">{video.duration}</div>
        </div>

        <div className="video-details">
          <div className="title">{video.title.length > 50 ? video.title.substring(0, 50) + "..." : video.title}</div>
            <object className="user-link">
                <Link to={`/profile/${video.user.id}`} onClick={(e) => e.stopPropagation()}>
                    {video.user.userName}
                </Link>
            </object>
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

    </div>
  );
};

export default WatchHistoryVideoItem;
