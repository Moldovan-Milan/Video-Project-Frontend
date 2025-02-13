import React from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "./UserPageVideoItem.scss";

const UserPageVideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId, user } = video;

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">

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
            {/* <img
            src={"https://localhost:7124/api/Video/thumbnail/${thumbnailId}"}
            //src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            alt={id}
            className="w-full h-48 object-cover"
          ></img> */}
            {/* <div className="video-length">10</div> */}

            <div className="p-4 video-details">
              <div className="video-title font-bold">{title}</div>
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
