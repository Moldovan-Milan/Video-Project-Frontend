import React from "react";
import "../components/VideoItem.scss";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";

const VideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  console.log(user);
  return (
    <div className="col-md-4 border-animacio">
      <div className="video-item">
        <Link to={`/video/${id}`}>
          <img
            src={`https://localhost:7124/api/Video/thumbnail/${thumbnailId}`}
            alt={thumbnailId}
            className="thumbnail"
          ></img>
          <div className="video-length">{duration}</div>
          <div className="video-info">
            <div className="video-avatar">
              <img
                src={`https://localhost:7124/api/User/avatar/${user.avatarId}`}
              ></img>
            </div>
            <div className="video-details">
              <div className="video-title">{title}</div>
              <div className="video-channel">Csóka Csaba</div>
              <div className="video-views">
                10 views ● Created: {timeAgo(new Date(created))}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VideoItem;
