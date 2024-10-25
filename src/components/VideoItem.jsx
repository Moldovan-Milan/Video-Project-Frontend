import React from "react";
import "../components/VideoItem.scss";
import { Link } from "react-router-dom";

const VideoItem = ({ video }) => {
  const { id, title, duration, thumbnailPath } = video;
  return (
    <div className="col-md-4 video-item">
      <Link to={`/video/${id}`}>
        <h4>{title}</h4>
        <img
          src={`https://localhost:7124/api/Video/thumbnail/${thumbnailPath}`}
          alt={thumbnailPath}
        ></img>
        <p>Duration {duration}</p>
      </Link>
    </div>
  );
};

export default VideoItem;
