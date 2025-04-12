import React from "react";
import { FaClock } from "react-icons/fa";
import "../styles/WatchTogetherVideoItem.scss";
import formatDuration from "../functions/formatDuration";

const WatchTogetherVideoItem = ({ video, onSelect }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  return (
    <div className="wtvideo-item" onClick={() => onSelect(video)}>
      <div
        style={{backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,}}
        className="W2GVidItemThumbnailDiv">
          <div className="video-duration flex"><FaClock className="m-1"/>{formatDuration(video.duration)}</div>
      </div>
      {/* <div className="W2Gthumbnail">
          <img
            src={`${BASE_URL}/api/Video/thumbnail/${video.thumbnailId}`}
            alt={video.title}
          />
          <span className="duration">
          <FaClock /> {video.duration}
        </span>
        </div> */}
      <div className="wtvideo-info">
        <div className="VidItemTitleWrapper">
        <h3 className="W2GVidItemTitle">{video.title}</h3>
        </div>
        <p className="description">{video.description}</p>
        <div className="user-info">
          <img
            src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${video.user.avatar.path}.${video.user.avatar.extension}`}
            alt={video.user.userName}
            className="avatar"
          />
          <span className="username">{video.user.userName}</span>
        </div>
      </div>
    </div>
  );
};

export default WatchTogetherVideoItem;
