import React from "react";
import "../components/VideoItem.scss";
import avatarkep from "../assets/defa_pfp.png";
import { Link } from "react-router-dom";


const VideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId, user} = video;
  console.log(user);
  //console.log(user.userName);

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = {
        year: 60 * 60 * 24 * 365,
        month: 60 * 60 * 24 * 30,
        week: 60 * 60 * 24 * 7,
        day: 60 * 60 * 24,
        hour: 60 * 60,
        minute: 60,
        second: 1
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count > 0) {
            return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
        }
    }

    return "just now";
  }

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
              <img src={avatarkep}></img>
            </div>
            <div className="video-details"> 
            <div className="video-title">{title}</div>
            <div className="video-channel">Csóka Csaba</div>
            <div className="video-views">10 views ● Created: {timeAgo(new Date(created))}</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );

  
};

export default VideoItem;
