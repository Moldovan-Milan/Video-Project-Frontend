import React from "react";
import { FaClock } from "react-icons/fa";
import "../styles/WatchTogetherVideoItem.scss";

const WatchTogetherVideoItem = ({ video, onSelect }) => {
  return (
    <div className="wtvideo-item" onClick={() => onSelect(video)}>
      <div className="thumbnail-container">
        <img
          src={`https://localhost:7124/api/video/thumbnail/${video.thumbnailId}`}
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
            src={`https://localhost:7124/api/user/avatar/${video.user.avatarId}`}
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
