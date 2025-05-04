import React, { useState } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../../functions/timeAgo";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import "../../styles/UserProfile/UserAccVideoItem.scss";
import getViewText from "../../functions/getViewText";
import formatDuration from "../../functions/formatDuration";

const UserAccVideoItem = ({ video, color }) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  const [safeId] = useState(id);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this video? This action is irreversible, and the video cannot be recovered."
      )
    ) {
      const response = await axios.delete(`api/Video/delete/${safeId}`, {
        withCredentials: true,
      });
      if (response.status === 204) {
        navigate(`/profile`);
      }
    }
  };

  return (
    <div className="UserAccVideoItemContainer" title={title}>
      <div
        className={`UserAccVideoItem ${color ? "hover-shadow" : ""}`}
        style={{ "--hover-color": color || "none" }}
      >
        <Link to={`/video/${safeId}`}>
          <table className="UserAccItemTable">
            <tbody>
              <tr>
                <td className="UserAccItemThumbnail">
                  <div
                    style={{
                      backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,
                    }}
                    className="UserAccItemThumbnailDiv"
                  >
                    <div className="video-duration">
                      {formatDuration(duration)}
                    </div>
                  </div>
                </td>
                <td className="UserAccItemDetails">
                  <div
                    className="UserAccItemTitle"
                    style={
                      color
                        ? {
                            color: color,
                          }
                        : null
                    }
                  >
                    {title.length > 30 ? title.substring(0, 30) + "..." : title}
                  </div>
                  <div className="UserAccItemUploader">{user.userName}</div>
                  <div className="UserAccItemViews">
                    <FaEye className="UserAccEye" /> {getViewText(video.views)}{" "}
                    ● Created: {timeAgo(new Date(created))}
                  </div>
                </td>
                <td>
                  <div className="DivManageUserVid">
                    <Link to={`/video/${id}/edit`}>
                      <button className="BtnUserAccVidEdit">
                        <FaPen className="m-1" />
                      </button>
                    </Link>
                    <button onClick={handleDelete} className="BtnUserAccVidDel">
                      <FaTrash className="m-1" />
                    </button>
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

export default UserAccVideoItem;
