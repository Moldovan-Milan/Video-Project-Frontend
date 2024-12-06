import React from "react";
import "../components/VideoItem.scss";
import { Link } from "react-router-dom";

const VideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId } = video;

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
          <h4>{title}</h4>
          <div>
            <p>Created: {created.split("T")[0]}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VideoItem;
