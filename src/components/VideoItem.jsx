import React, { forwardRef } from "react";
import "../styles/VideoItem.scss";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import formatDuration from "../functions/formatDuration";
import getViewText from "../functions/getViewText";
import { FaEye } from "react-icons/fa";

const VideoItem = forwardRef(({ video }, ref) => {
  const { id, title, duration, created, thumbnailId, user, views } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div ref={ref} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 item-outer" title={title}>
      <div className="shadow-md rounded-lg overflow-hidden border-animacio">
        <div className="video-item">
          <Link to={`/video/${id}`}>
            <div
              style={{
                backgroundImage: `url("${BASE_URL}/Video/thumbnail/${thumbnailId}")`,
              }}
              className="thumbnail-div"
            >
              <div className="video-duration">{formatDuration(duration)}</div>
            </div>
            <div className="p-4 video-details">
              <table className="vid-info-table">
                <tbody>
                  <tr>
                    <td rowSpan={2} className="uploader-avt">
                      <img
                        src={`${BASE_URL}/User/avatar/${user.avatarId}`}
                        className="w-10 h-10 rounded-full mr-2"
                        alt="Uploader Avatar"
                      />
                    </td>
                    <td>
                      <div className="video-title font-bold">
                        {title.length > 11 ? title.substring(0, 11) + "..." : title}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="text-sm">
                        <div className="video-info text-2xl uploader-name">{user.userName}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-xs views">
                <FaEye className="eye-icon" />
                {getViewText(views)} ● Created: {timeAgo(new Date(created))}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default VideoItem;
