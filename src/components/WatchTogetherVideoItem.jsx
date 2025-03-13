import React from "react";
import { FaClock } from "react-icons/fa";
import "../styles/WatchTogetherVideoItem.scss";

const WatchTogetherVideoItem = ({ video, onSelect }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="wtvideo-item" onClick={() => onSelect(video)}>
      <div className="thumbnail-container">
        <img
          src={`${BASE_URL}/api/video/thumbnail/${video.thumbnailId}`}
          alt={video.title}
          className="thumbnail"
        />
        <span className="duration">
          <FaClock /> {video.duration}
        </span>
      </div>
      <div className="wtvideo-info">
        <h3 className="title">{video.title}</h3>
        <p className="description">{video.description}</p>
        <div className="user-info">
          <img
            src={`${BASE_URL}/api/user/avatar/${video.user.avatarId}`}
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
