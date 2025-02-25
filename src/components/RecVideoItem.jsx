import React from "react";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";
import "../styles/RecVideoItem.scss";

const RecVideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId, user } = video;

  return (
    <div className="recVideoItemContainer" title={title}>
      <div className="recVideoItem">
        <Link to={`/video/${id}`}>
          <table className="recItemTable">
            <tbody>
              <tr>
                <td className="recItemThumbnail">
                  <div
                    style={{
                      backgroundImage: `url("https://localhost:7124/api/Video/thumbnail/${thumbnailId}")`,
                    }}
                    className="recItemThumbnailDiv"
                  >
                    <div className="video-duration">{duration}</div>
                  </div>
                </td>
                <td className="recItemDetails">
                  <div className="recItemTitle">
                    {title.length > 30 ? title.substring(0, 30) + "..." : title}
                  </div>
                  <div className="recItemUploader">{user.userName}</div>
                  <div className="recItemViews">
                    <FaEye className="recEye" /> 10 views ● Created:{" "}
                    {timeAgo(new Date(created))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Link>
      </div>
    </div>
  );
};

export default RecVideoItem;
